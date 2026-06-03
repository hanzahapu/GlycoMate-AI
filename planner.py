import os
import json
import re

# OpenAI client for calling GPT model
from openai import OpenAI

# Loads saved FAISS vector store
from backend.app.rag.vector_store import load_vector_store

# Request schema for meal plan generation
from backend.app.schemas.request import MealPlanRequest

class GlycoMateAIPlanner:
    def __init__(self, vector_store_path: str):
        # Initialize OpenAI client using API key from .env
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        # Load FAISS vector store for RAG retrieval
        self.vector_store = load_vector_store(vector_store_path)
        
        # Load prompt files
        base_path = os.path.dirname(os.path.dirname(__file__))

        # System prompt controls assistant behavior and safety rules
        with open(os.path.join(base_path, "prompts", "system.txt"), "r", encoding="utf-8") as f:
            self.system_prompt = f.read()

        # Meal plan prompt template for structured plan generation
        with open(os.path.join(base_path, "prompts", "mealplan.txt"), "r", encoding="utf-8") as f:
            self.user_prompt_template = f.read()

    def _get_context(self, query: str):
        # If vector store is missing, use fallback message
        if not self.vector_store:
            return "No PDF context available. Using general knowledge (must label all as estimated)."
        
        # Retrieve top 5 relevant chunks from FAISS
        docs = self.vector_store.similarity_search(query, k=5)

        # Combine retrieved chunks into one context string
        context = "\n---\n".join([f"Page {d.metadata.get('page', 'unknown')}: {d.page_content}" for d in docs])
        return context

    def _get_missing_fields(self, request):
        # Check required user profile details
        required = ["age", "sex", "diabetes_type", "dietary_pref", "allergies"]
        missing = []

        # Validate age and Gender
        if not request.age: missing.append("age")
        if not request.sex or str(request.sex).lower() in ["none", "null"]: missing.append("gender")
        
        # Validate diabetes information
        diab = str(request.diabetes_type or "").lower()
        if not diab or diab in ["none", "null", "unknown"]: missing.append("diabetes info")
        
        # Validate dietary preference
        pref = str(request.dietary_pref or "").lower()
        if not pref or pref in ["none", "null", "any"]: missing.append("dietary preference")
        
        # Validate allergy information
        if request.allergies is None:
            missing.append("allergies")

        elif isinstance(request.allergies, list):
            if len(request.allergies) == 0:
                missing.append("allergies")
            elif len(request.allergies) == 1 and str(request.allergies[0]).lower() == "none":
                pass # "None" allergy is accepted

        elif str(request.allergies).lower() == "none":
            pass # "None" allergy is accepted
            
        return missing

    def chat(self, request):
         # Retrieve relevant PDF context for the user message
        context = self._get_context(request.message)
        
        # Check if required profile details are missing
        missing = self._get_missing_fields(request)

        # Detect whether user is asking for food or meal planning
        is_asking_for_plan = any(kw in request.message.lower() for kw in ["plan", "diet", "meal", "food", "breakfast", "lunch", "dinner", "eat"])
        
        
        # Create user profile summary for the LLM
        profile_summary = f"""
CURRENT USER PROFILE:
- Age: {request.age or 'None'}
- Sex: {request.sex or 'None'}
- Diabetes Type: {request.diabetes_type or 'None'}
- Activity Level: {request.activity_level or 'None'}
- Dietary Preference: {request.dietary_pref or 'None'}
- Allergies: {request.allergies or 'None'}
- Budget: {request.budget or 'None'}
- Cooking Access: {request.cooking_access or 'None'}
- Dislikes: {request.dislikes or 'None'}
- Wants Sri Lankan Only: {request.wants_sri_lankan_only}
"""
        
        # Add retrieved context into the system prompt
        system_content = self.system_prompt.format(context=context)

        # Add user profile details to guide personalization
        system_content += f"\n\n{profile_summary}"
        
        # Force the assistant to ask questions if profile is incomplete
        if is_asking_for_plan:
            if missing:
                system_content += f"\n\nACTUAL STATE: need_info. Missing: {', '.join(missing)}. DO NOT generate a plan. ASK questions."
            else:
                system_content += "\n\nACTUAL STATE: ready. Profile is COMPLETE. Generate a 1-day meal plan. Include the meta-data JSON block."
        
        # Start message list with system instructions
        messages = [{"role": "system", "content": system_content}]

        # Add previous chat history for conversation memory
        for msg in request.history:
            messages.append({"role": msg.role, "content": msg.content})
        
        # Ask LLM to return both human text and structured JSON
        user_message = request.message + "\n\nREQUIRED RESPONSE: [Response Text] followed by a JSON block with 'state', 'missing_fields', 'questions', 'quick_replies', and 'meta' if state is ready."
        messages.append({"role": "user", "content": user_message})
        
        # Call GPT model
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.2
        )
        
        # Get generated response text
        content = response.choices[0].message.content
        
        # Extract JSON and Human parts
        try:
            # Try to find JSON inside markdown code block
            json_match = re.search(r"```json\s*(\{.*?\})\s*```", content, re.DOTALL)

            # If no code block, try to find plain JSON
            if not json_match:
                json_match = re.search(r"(\{.*?\})", content, re.DOTALL)
                
            if json_match:
                structured_data = json.loads(json_match.group(1))
                human_part = content.replace(json_match.group(0), "").strip()

            else:
                structured_data = {"state": "need_info" if is_asking_for_plan and missing else "chat"}
                human_part = content

        except Exception:
            # Fallback if JSON parsing fails
            structured_data = {"state": "need_info" if is_asking_for_plan and missing else "chat"}
            human_part = content

        # Apply code level state control for safety
        if is_asking_for_plan:
            if missing:
                structured_data["state"] = "need_info"

                # Create questions if LLM did not provide them
                if not structured_data.get("questions"):
                    structured_data["questions"] = [f"Please provide your {field}." for field in missing]
            else:
                # If profile is complete, mark response as ready
                if structured_data.get("state") != "ready":
                    structured_data["state"] = "ready"

        # Return structured response to API endpoint
        return {
            "state": structured_data.get("state", "chat"),
            "response": human_part,
            "missing_fields": structured_data.get("missing_fields", missing if structured_data.get("state") == "need_info" else []),
            "questions": structured_data.get("questions", []),
            "quick_replies": structured_data.get("quick_replies", {}),
            "meta": structured_data.get("meta", structured_data if structured_data.get("state") == "ready" else {})
        }

    def generate_plan(self, request: MealPlanRequest):
        # Retrieve nutrition context based on dietary preference
        context = self._get_context(f"Sri Lankan diabetes diet carb counting for {request.dietary_pref}")

        # Check whether required user details are complete
        missing = self._get_missing_fields(request)
        
        # Ask for missing details before generating a plan
        if missing:
            return {
                "state": "need_info",
                "display_text": "I need some more information before I can create your personalized Sri Lankan diabetes meal plan.",
                "missing_fields": missing,
                "questions": [f"What is your {f}?" for f in missing],
                "quick_replies": {},
                "meta": {}
            }

        # Fill the meal plan prompt template with user data
        user_prompt = self.user_prompt_template.format(
            age=request.age or "not specified",
            sex=request.sex or "not specified",
            diabetes_type=request.diabetes_type,
            activity_level=request.activity_level,
            dietary_pref=request.dietary_pref,
            allergies=", ".join(request.allergies) if request.allergies else "none",
            budget=request.budget,
            cooking_access=request.cooking_access,
            dislikes=", ".join(request.dislikes) if request.dislikes else "none",
            wants_sri_lankan_only=request.wants_sri_lankan_only
        )
        
        # Add retrieved PDF context to system prompt
        system_prompt = self.system_prompt.format(context=context)
        
        # Generate meal plan using GPT
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2
        )
        
        # Get generated content
        content = response.choices[0].message.content
        
        # Extract structured JSON from response
        try:
            json_match = re.search(r"```json\s*(\{.*?\})\s*```", content, re.DOTALL)
            if not json_match:
                json_match = re.search(r"(\{.*?\})", content, re.DOTALL)
                
            if json_match:
                structured_data = json.loads(json_match.group(1))
                human_part = content.replace(json_match.group(0), "").strip()
            else:
                raise ValueError("No JSON block found")
            
        except Exception:
            # Fallback if JSON output is missing or invalid
            structured_data = {"state": "ready"}
            human_part = content
        
        # Return final meal plan response
        state = structured_data.get("state", "ready")
        return {
            "state": state,
            "display_text": human_part,
            "missing_fields": structured_data.get("missing_fields", []),
            "questions": structured_data.get("questions", []),
            "quick_replies": structured_data.get("quick_replies", {}),
            "meta": structured_data.get("meta", structured_data if state == "ready" else {})
        }
