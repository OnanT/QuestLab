import json
import psycopg2
from psycopg2.extras import Json
import os

def get_connection():
    # Use DATABASE_URL from environment
    db_url = os.getenv("DATABASE_URL")
    return psycopg2.connect(db_url)

def seed_games():
    conn = get_connection()
    cur = conn.cursor()

    # Engine IDs mapping
    engines = {
        "skill_builder": 1,
        "quiz_battle": 2,
        "story_quest": 3,
        "map_challenge": 4,
        "memorymatch": 15,
        "sentencebuilder": 16,
        "bucketsort": 17,
        "fill_in_the_blanks": 9,
        "drag_and_drop": 7,
        "interactive_simulation": 10
    }

    # Helper to create bulk games
    def create_games():
        data = []
        
        # --- 6 STORY QUESTS ---
        story_titles = ["Hamilton's Heritage", "Market Hero", "Ear Voyage", "Community Protector", "Food Web Balance", "Timeline Traveler"]
        story_lessons = [35, 37, 43, 39, 46, 47]
        for i, title in enumerate(story_titles):
            data.append({
                "lesson_id": story_lessons[i], "engine": "story_quest",
                "config": {
                    "scenes": [
                        {"id": "start", "text": f"Welcome to the {title}! Are you ready to begin?", "choices": [
                            {"text": "Yes, let's go!", "next": "step1"},
                            {"text": "I need a moment", "next": "start"}
                        ]},
                        {"id": "step1", "text": "You encounter a challenge. What do you do?", "choices": [
                            {"text": "Solve it wisely", "next": "win", "bonus_points": 20},
                            {"text": "Rush through", "next": "lose", "bonus_points": 5}
                        ]},
                        {"id": "win", "text": "Great job! You mastered the concept.", "ending": True, "final_points": 50},
                        {"id": "lose", "text": "You made it, but there's room for improvement.", "ending": True, "final_points": 30}
                    ]
                }
            })

        # --- 5 GAMES PER TYPE (Samples) ---
        # Skill Builder (ID 1)
        for l_id in [28, 29, 30, 16, 17]:
            data.append({
                "lesson_id": l_id, "engine": "skill_builder",
                "config": {"problems": [{"question": "Practice problem 1", "answer": "correct"}]}
            })
        
        # Quiz Battle (ID 2)
        for l_id in [46, 45, 41, 42, 36]:
            data.append({
                "lesson_id": l_id, "engine": "quiz_battle",
                "config": {"questions": [{"question": "Fact 1", "options": ["A", "B", "C"], "answer": "A"}]}
            })

        # Memory Match (ID 15)
        for l_id in [4, 22, 23, 24, 34]:
            data.append({
                "lesson_id": l_id, "engine": "memorymatch",
                "config": {"pairs": [{"a": "Match A", "b": "Match B"}]}
            })

        # Sentence Builder (ID 16)
        for l_id in [11, 10, 12, 13, 14]:
            data.append({
                "lesson_id": l_id, "engine": "sentencebuilder",
                "config": {"prompts": [{"target": "This is a sentence", "shuffled": ["sentence", "a", "is", "This"]}]}
            })

        # Bucket Sort (ID 17)
        for l_id in [3, 25, 32, 46, 37]:
            data.append({
                "lesson_id": l_id, "engine": "bucketsort",
                "config": {
                    "buckets": [{"id": "1", "label": "Cat A"}, {"id": "2", "label": "Cat B"}],
                    "items": [{"text": "Item 1", "bucketId": "1"}]
                }
            })

        # Fill in Blanks (ID 9)
        for l_id in [26, 27, 18, 19, 21]:
            data.append({
                "lesson_id": l_id, "engine": "fill_in_the_blanks",
                "config": {
                    "text": "This is a [blank1].",
                    "blanks": {"blank1": {"answer": "test"}}
                }
            })

        # Drag and Drop (ID 7)
        for l_id in [31, 38, 20, 44, 15]:
            data.append({
                "lesson_id": l_id, "engine": "drag_and_drop",
                "config": {"pairs": [{"source": "Left", "target": "Right"}]}
            })

        # Interactive Simulation (ID 10)
        for l_id in [45, 44, 33, 4, 28]:
            data.append({
                "lesson_id": l_id, "engine": "interactive_simulation",
                "config": {"title": "Lab", "description": "Interactive experiment"}
            })

        return data

    games_data = create_games()

    for game in games_data:
        engine_id = engines.get(game["engine"])
        if not engine_id: continue
        
        # Simple INSERT since constraint is dropped
        cur.execute("""
            INSERT INTO games (lesson_id, game_engine_id, config_json)
            VALUES (%s, %s, %s)
        """, (game["lesson_id"], engine_id, Json(game["config"])))

    conn.commit()
    cur.close()
    conn.close()
    print(f"Successfully seeded {len(games_data)} enhanced games!")

if __name__ == "__main__":
    seed_games()
