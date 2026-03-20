# QuestLab Content Creation Guide

This guide provides detailed instructions on how to add Lessons, Quizzes, and Games to the QuestLab platform.

---

## 1. Adding Lessons
Lessons are the foundation of the platform. They can be added via the **Admin Dashboard**.

### Via the UI
1. **Login** as an Admin or Teacher.
2. Navigate to the **Admin Dashboard** (usually `/admin`).
3. Click on the **Lessons** tab in the sidebar.
4. Click the **Add Lesson** button.
5. **Fill in the Tabs:**
   - **Info:** Title, Subject, Difficulty, Grade Levels, and Points.
   - **Content:** The lesson body. Use HTML tags (e.g., `<h2>`, `<p>`, `<ul>`) for formatting.
   - **Questions:** You can add Quizzes directly here that link to this lesson.

### Data Requirements
- **Category:** The subject area (e.g., Mathematics, Science).
- **Points:** The reward points a student gets for completion.
- **Difficulty:** Beginner, Intermediate, or Advanced.

---

## 2. Adding Quizzes
Quizzes test mastery of a lesson.

### Via the UI (Recommended)
1. In the **Admin Dashboard**, go to the **Quizzes** tab.
2. Click **Add Quiz**.
3. **Fields:**
   - **Question text:** The actual question.
   - **Options:** Provide 4 options.
   - **Correct Answer:** Must match one of the options exactly.
   - **Explanation:** Shown to the student after they answer.
4. **Linking:** Always select a **Lesson** to link the quiz to so it appears on the lesson's page.

### Bulk Creation (Technical)
You can use the `/api/quizzes/bulk` endpoint to upload a JSON array of questions if you have many to add at once.

---

## 3. Adding Games
Games are powered by specific "Engines". Currently, adding games requires creating a configuration JSON and inserting it into the database (as seen in `seed_demo_games.py`).

### Supported Game Types
1. **Skill Builder (`skill_builder`):** Rapid-fire text entry (e.g., Math problems).
2. **Quiz Battle (`quiz_battle`):** Competitive multiple choice with a timer.
3. **Story Quest (`story_quest`):** Branching "Choose your own adventure" narratives.
4. **Map Challenge (`map_challenge`):** Locating coordinates/islands on a map.

### How to Create a Game
You must define a `config_json` for the game. Use the templates below:

#### Skill Builder Template
```json
{
  "title": "Multiplication Fun",
  "problems": [
    {"question": "5 x 5", "answer": "25", "hint": "Five fives"},
    {"question": "2 x 10", "answer": "20", "hint": "Two tens"}
  ]
}
```

#### Quiz Battle Template
```json
{
  "title": "History Sprint",
  "time_limit": 60,
  "questions": [
    {
      "question": "Who was the first PM?",
      "options": ["Person A", "Person B", "Person C", "Person D"],
      "answer": "Person A"
    }
  ]
}
```

#### Story Quest Template
```json
{
  "title": "Island Explorer",
  "scenes": [
    {
      "id": "start",
      "text": "You see a cave. Do you enter?",
      "choices": [
        {"text": "Enter cave", "next": "cave_inside", "bonus_points": 5},
        {"text": "Walk away", "next": "beach", "bonus_points": 0}
      ]
    },
    {
      "id": "beach",
      "text": "It is sunny!",
      "ending": true,
      "final_points": 50
    }
  ]
}
```

### Steps to Deploy a Game
1. Prepare your JSON configuration.
2. Use a script (like `seed_demo_games.py`) or a database tool (pgAdmin) to insert a row into the `games` table.
3. **Fields needed:** `lesson_id`, `game_engine_id` (1-4), and your `config_json`.

---

## Summary of Tools
| Feature | UI Access | Scripting Required? |
| :--- | :--- | :--- |
| **Lessons** | Yes (Full Support) | No |
| **Quizzes** | Yes (Full Support) | No |
| **Games** | Management only | Yes (for JSON config) |
