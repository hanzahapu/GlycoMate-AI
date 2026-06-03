import requests
import json

# Base URL of the FastAPI backend
BASE_URL = "http://localhost:8001/api"

# Function to test meal plan generation API
def test_meal_plan(description, payload):
    print(f"\n--- Testing: {description} ---")

    try:
        # Send POST request to meal plan endpoint
        response = requests.post(f"{BASE_URL}/mealplan/day", json=payload)

        # Check if request was successful
        if response.status_code == 200:
            print("Success!")

            # Convert API response into JSON
            result = response.json()
            print("\nHuman Plan Preview:")

            # Print first part of generated meal plan
            print(result["human_plan"][:200] + "...")
            print("\nStructured Data Totals:")

            # Print nutrition total values from structured response
            print(json.dumps(result["structured_data"].get("totals", {}), indent=2))

        else:

            # Print API error response
            print(f"Error {response.status_code}: {response.text}")

    except Exception as e:
        # Handles connection errors if backend is not running
        print(f"Connection failed: {e}")

# Run tests only when this file is executed directly
if __name__ == "__main__":
    # Test 1: Type 2, medium activity, fish
    test_meal_plan("Type 2, Fish preference", {
        "diabetes_type": "type2",
        "activity_level": "medium",
        "dietary_pref": "fish",
        "budget": "medium",
        "cooking_access": "full"
    })

    # Test 2: Vegetarian, low budget
    test_meal_plan("Vegetarian, low budget", {
        "diabetes_type": "type2",
        "activity_level": "low",
        "dietary_pref": "vegetarian",
        "budget": "low",
        "cooking_access": "full"
    })

    # Test 3: Limited cooking access
    test_meal_plan("Limited cooking access", {
        "diabetes_type": "type2",
        "activity_level": "low",
        "dietary_pref": "any",
        "budget": "medium",
        "cooking_access": "limited"
    })
