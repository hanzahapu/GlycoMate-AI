import requests
import json

# Base URL of the FastAPI backend API
BASE_URL = "http://localhost:8001/api"

# Function to test the chat endpoint
def test_chat():
    print("\n--- Testing: Generic Chat ---")

    # Sample chat request payload
    payload = {
        "message": "Hello, I am looking for a Sri Lankan breakfast plan for a diabetic person.",
        "history": []
    }

    try:
        # Send POST request to the chat API endpoint
        response = requests.post(f"{BASE_URL}/chat", json=payload)

        # Check if the API request was successful
        if response.status_code == 200:
            print("Success!")

            # Convert response into JSON format
            result = response.json() 
            print("\nResponse:")

            # Print chatbot response from backend
            print(result["response"])

        else:
            # Print error if API returns failed status
            print(f"Error {response.status_code}: {response.text}")
            
    except Exception as e:
        # Handles connection error if backend is not running
        print(f"Connection failed: {e}")

# Run the test when this file is executed directly
if __name__ == "__main__":
    test_chat()
