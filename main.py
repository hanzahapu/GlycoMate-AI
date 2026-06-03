import os

# FastAPI is used to create backend API endpoints
from fastapi import FastAPI, HTTPException

# Loads environment variables such as API keys
from dotenv import load_dotenv

# Allows frontend and backend to communicate during development
from fastapi.middleware.cors import CORSMiddleware

# Request and response data models
from backend.app.schemas.request import MealPlanRequest, MealPlanResponse, ChatRequest, ChatResponse

# Main planner service that handles chat and meal plan generation
from backend.app.services.planner import GlycoMateAIPlanner

load_dotenv()

# Create FastAPI application
app = FastAPI(title="GlycoMate AI: Sri Lanka Diabetes Meal Planner")

# Path to the saved FAISS vector store
vector_store_path = os.path.join("data", "vectorstore")

# Initialize the GlycoMate AI planner with the vector store
planner = GlycoMateAIPlanner(vector_store_path)


# Enable CORS so the React frontend can call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create API Router
from fastapi import APIRouter
api_router = APIRouter(prefix="/api")

# Basic API health check endpoint
@api_router.get("/")
async def api_root():
    return {"status": "GlycoMate AI API is running"}

# Chat endpoint for normal user conversation
@api_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):

    try:
        # Send chat request to the planner service
        result = planner.chat(request)

        # Return result using the defined response model
        return ChatResponse(**result)
    
    except Exception as e:
         # Return server error if chat processing fails
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint for generating a full daily meal plan
@api_router.post("/mealplan/day", response_model=MealPlanResponse)
async def create_meal_plan(request: MealPlanRequest):

    try:
        # Generate meal plan using the planner service
        result = planner.generate_plan(request)

        # Return result using the defined response model
        return MealPlanResponse(**result)
    
    except Exception as e:
        # Return server error if meal plan generation fails
        raise HTTPException(status_code=500, detail=str(e))

# Add all /api routes to the FastAPI app
app.include_router(api_router)

# Root endpoint to check whether backend is running
@app.get("/")
async def root():
    return {"status": "GlycoMate AI API is running"}

# Run the backend server directly using Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
