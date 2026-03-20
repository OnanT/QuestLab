import requests
import json

BASE_URL = "http://localhost/api"

def test_student_workflow():
    print("\n--- Starting Student Workflow Validation ---")
    
    # 1. Login Flow
    print("Step 1: Testing Login...")
    login_data = {
        "username": "emma_smith",
        "password": "password123"
    }
    # FastAPI OAuth2 expects form-data
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    
    if response.status_code != 200:
        print(f"FAILED: Login failed with status {response.status_code}")
        print(f"Response: {response.text}")
        return False
    
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("SUCCESS: Login successful")

    # 2. User Info
    print("\nStep 2: Testing User Info (Dashboard)...")
    response = requests.get(f"{BASE_URL}/users/me", headers=headers)
    if response.status_code == 200:
        user_data = response.json()
        print(f"SUCCESS: Logged in as {user_data.get('display_name')} ({user_data.get('role')})")
    else:
        print(f"FAILED: Could not fetch user info. Status: {response.status_code}")
        return False

    # 3. Lessons Page
    print("\nStep 3: Testing Lessons Fetching...")
    response = requests.get(f"{BASE_URL}/lessons", headers=headers)
    if response.status_code == 200:
        lessons = response.json()
        print(f"SUCCESS: Found {len(lessons)} lessons")
        for lesson in lessons:
            print(f" - [{lesson.get('id')}] {lesson.get('title')}")
    else:
        print(f"FAILED: Could not fetch lessons. Status: {response.status_code}")
        print(f"Response: {response.text}")
        return False

    # 4. Quizzes Page
    print("\nStep 4: Testing Quizzes Fetching...")
    response = requests.get(f"{BASE_URL}/quizzes", headers=headers)
    if response.status_code == 200:
        quizzes = response.json()
        print(f"SUCCESS: Found {len(quizzes)} quizzes")
        for quiz in quizzes:
            print(f" - [{quiz.get('id')}] {quiz.get('question')[:50]}...")
    else:
        print(f"FAILED: Could not fetch quizzes. Status: {response.status_code}")
        return False

    # 5. Games List (Dashboard/Games Page)
    print("\nStep 5: Testing Games List...")
    # The frontend uses /games/list?limit=4 in StudentDashboard
    response = requests.get(f"{BASE_URL}/games/list?limit=4", headers=headers)
    if response.status_code == 200:
        games = response.json()
        print(f"SUCCESS: Found {len(games)} recent games")
    else:
        # Try fallback if /list doesn't exist
        response = requests.get(f"{BASE_URL}/games", headers=headers)
        if response.status_code == 200:
            games = response.json()
            print(f"SUCCESS: Found {len(games)} games via fallback")
        else:
            print(f"FAILED: Could not fetch games. Status: {response.status_code}")

    print("\n--- Validation Completed ---")
    return True

if __name__ == "__main__":
    test_student_workflow()
