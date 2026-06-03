from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# Request model for generating a full daily meal plan   
class MealPlanRequest(BaseModel):
    age: Optional[int] = None
    sex: Optional[str] = None
    diabetes_type: str = Field(..., description="type1, type2, gestational, or unknown")
    activity_level: str = Field(..., description="low, medium, or high")
    dietary_pref: str = Field(..., description="vegetarian, fish, chicken, or any")
    allergies: List[str] = []
    budget: str = Field(..., description="low, medium, or high")
    cooking_access: str = Field(..., description="full, limited, or none")
    dislikes: List[str] = []
    wants_sri_lankan_only: bool = True

# Represents one food item in a meal
class MealItem(BaseModel):
    name: str
    portion: str
    estimated_kcal: float
    estimated_carbs_g: float

# Represents one full meal such as breakfast, lunch, or dinner
class Meal(BaseModel):
    name: str
    target_kcal: int
    items: List[MealItem]
    estimated_kcal: float
    estimated_carbs_g: float
    carb_exchanges: float
    substitutions: List[str]
    citations: List[str]

# Response model for daily meal plan generation
class MealPlanResponse(BaseModel):
    state: str = Field(..., description="'ready' or 'need_info'")
    display_text: str
    missing_fields: List[str] = []
    questions: List[str] = []
    quick_replies: Dict[str, List[str]] = {}
    meta: Dict = {}

# Represents one message in chat history
class ChatMessage(BaseModel):
    role: str
    content: str

# Request model for chatbot conversation
class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

    # Optional profile fields to enable validation in chat
    age: Optional[int] = None
    sex: Optional[str] = None
    diabetes_type: Optional[str] = None
    activity_level: Optional[str] = None
    dietary_pref: Optional[str] = None
    allergies: Optional[List[str]] = None
    budget: Optional[str] = None
    cooking_access: Optional[str] = None
    dislikes: Optional[List[str]] = None
    wants_sri_lankan_only: Optional[bool] = None

# Response model for chatbot output
class ChatResponse(BaseModel):
    state: str = Field(..., description="'ready' or 'need_info' or 'chat'")
    response: str
    missing_fields: List[str] = []
    questions: List[str] = []
    quick_replies: Dict[str, List[str]] = {}
