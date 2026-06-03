import os
import sys
from dotenv import load_dotenv

# Add current project path so backend imports work correctly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import main AI planner service
from backend.app.services.planner import GlycoMateAIPlanner

# Import chat request and response validation schemas
from backend.app.schemas.request import ChatRequest, ChatResponse

# Load environment variables such as OpenAI API key
load_dotenv()

# Initialize planner with saved FAISS vector store
planner = GlycoMateAIPlanner("data/vectorstore")

# Send request directly to planner chat function
request = ChatRequest(message="Hi I am Thusheera. Give me a full day meal plan", history=[])

# Print returned result dictionary
result = planner.chat(request)
print("Result dictionary:", result)

try:
    # Check whether result matches ChatResponse schema
    validated = ChatResponse(**result)
    print("Validation SUCCESS")
except Exception as e:
    # Print validation error if response format is incorrect
    print("Validation FAILED:", e)
