import os

# Loads environment variables such as OpenAI API key
from dotenv import load_dotenv

# Import main GlycoMate AI planner service
from backend.app.services.planner import GlycoMateAIPlanner

# Import request schema for meal plan generation
from backend.app.schemas.request import MealPlanRequest

load_dotenv()

def test_planner():
    # Path to saved FAISS vector store
    vector_store_path = os.path.join("data", "vectorstore")
    planner = GlycoMateAIPlanner(vector_store_path)
    
    # Create a sample meal plan request
    request = MealPlanRequest(
        diabetes_type="type2",
        activity_level="medium",
        dietary_pref="fish",
        budget="medium",
        cooking_access="full"
    )
    
    print("Generating plan...")

    # Generate meal plan directly using planner service
    human_plan, structured_data = planner.generate_plan(request)
    
    # Print readable meal plan
    print("\n--- Human Plan ---")
    print(human_plan)
    
    # Print structured JSON data
    print("\n--- Structured Data ---")
    import json
    print(json.dumps(structured_data, indent=2))

# Run test only when this file is executed directly
if __name__ == "__main__":
    test_planner()
