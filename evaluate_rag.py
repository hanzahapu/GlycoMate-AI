import os
import pandas as pd
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    context_precision,
    context_recall
)

# Import project modules
from backend.app.rag.vector_store import load_vector_store
from backend.app.services.planner import GlycoMateAIPlanner
from backend.app.schemas.request import MealPlanRequest
from dotenv import load_dotenv

# Load API Keys
load_dotenv()

def run_evaluation():

    # Start RAGAS evaluation process
    print("Starting RAGAS Evaluation for GlycoMate AI...")
    
    # 1. Initialize Planner and Vector Store
    vector_store_path = os.path.join("data", "vectorstore")
    planner = GlycoMateAIPlanner(vector_store_path)
    
    # 2. Define Test Cases (Ground Truths)
    test_questions = [
        "What is the carbohydrate content of 1 exchange of Red Rice?",
        "How many calories should be in the breakfast for a 2000 kcal plan?"
    ]
    # Define correct expected answers
    ground_truths = [
        "1 exchange of Red Rice is typically 1/3 cup and contains about 15g of carbohydrates.",
        "For a 2000 kcal plan, breakfast should be strictly 500 kcal."
    ]
    
    # Store generated answers and retrieved contexts
    answers = []
    contexts = []

    print(f" Generating answers and retrieving contexts for {len(test_questions)} test questions...")
    
    # 3. Collect Answers and Contexts from our RAG pipeline
    for q in test_questions:
        # Get context from FAISS
        docs = planner.vector_store.similarity_search(q, k=3)
        context_list = [doc.page_content for doc in docs]
        contexts.append(context_list)
        
        # Get AI Answer
        # We simulate a chat request to get the answer
        class MockRequest:
            message = q
            history = []
            age = 30
            sex = "male"
            diabetes_type = "type2"
            activity_level = "medium"
            dietary_pref = "any"
            allergies = ["none"]
            budget = "medium"
            cooking_access = "full"
            dislikes = ["none"]
            wants_sri_lankan_only = True
            
        result = planner.chat(MockRequest())
        answers.append(result["response"])

    # 4. Prepare data for RAGAS (Needs HuggingFace Dataset format)
    data = {
        "question": test_questions,
        "answer": answers,
        "contexts": contexts,
        "ground_truth": ground_truths
    }
    
    dataset = Dataset.from_dict(data)
    
    print(" Running RAGAS Metrics Calculation (This may take a minute)...")
    
    # 5. Evaluate using RAGAS
    result = evaluate(
        dataset = dataset, 
        metrics=[
            faithfulness,
            context_precision,
            context_recall
        ],
    )
    
    # 6. Print Results
    print("\n" + "="*50)
    print(" RAGAS EVALUATION RESULTS")
    print("="*50)
    
    # RAGAS returns a dict like object
    df = result.to_pandas()
    
    print(f"Faithfulness      : {result['faithfulness']:.4f} (Ideal: > 0.8)")
    print(f"Context Precision : {result['context_precision']:.4f} (Ideal: > 0.8)")
    print(f"Context Recall    : {result['context_recall']:.4f} (Ideal: > 0.8)")
    print("="*50)
    
    print("\nDetailed DataFrame:")
    print(df[['question', 'faithfulness', 'context_precision', 'context_recall']])
    
    # Save to CSV for the presentation
    df.to_csv("ragas_evaluation_results.csv", index=False)
    print("\n Results saved to 'ragas_evaluation_results.csv'!")

if __name__ == "__main__":
    run_evaluation()