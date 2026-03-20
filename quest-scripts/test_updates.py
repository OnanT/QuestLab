# test_updates.py
import requests

BASE_URL = "http://localhost:8000"

def test_new_endpoints():
    # Test login first
    login_data = {
        "username": "teach",
        "password": "1234567"
    }
    
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    token = response.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test enhanced lesson creation
    lesson_data = {
        "title": "Test Enhanced Lesson",
        "content_html": "<p>Test content</p>",
        "category": "Science",
        "difficulty": "intermediate",
        "estimated_time": 45,
        "points": 150,
        "grade_levels": ["Grade 6", "Grade 7"],
        "description": "Test description",
        "objectives": "Test objectives",
        "prerequisites": "Basic knowledge",
        "tags": ["test", "science"]
    }
    
    response = requests.post(f"{BASE_URL}/lessons", json=lesson_data, headers=headers)
    print("Lesson creation:", response.status_code)
    
    if response.status_code == 201:
        lesson_id = response.json()["id"]
        print(f"Created lesson ID: {lesson_id}")
        
        # Test enhanced quiz creation
        quiz_data = {
            "lesson_id": lesson_id,
            "question": "What is 2+2?",
            "question_type": "mc_single",
            "options": ["3", "4", "5", "6"],
            "correct_answer": "B",
            "explanation": "Basic addition",
            "points": 15,
            "difficulty": "beginner",
            "tags": ["math", "addition"]
        }
        
        response = requests.post(f"{BASE_URL}/quizzes", json=quiz_data, headers=headers)
        print("Quiz creation:", response.status_code)
    
    print("✅ Tests completed!")

if __name__ == "__main__":
    test_new_endpoints()