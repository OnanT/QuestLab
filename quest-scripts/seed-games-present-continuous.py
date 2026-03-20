import json
import psycopg2
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

def get_db_connection():
    # Try connecting to 'postgres' host first (internal docker network)
    # Then fallback to 'localhost' with port 5433 (standard for this project's host-to-docker mapping)
    
    connection_attempts = [
        {
            "host": os.getenv("POSTGRES_HOST", "postgres"),
            "database": os.getenv("POSTGRES_DB", "questlab_db"),
            "user": os.getenv("POSTGRES_USER", "turtle_guide"),
            "password": os.getenv("POSTGRES_PASSWORD", "QuestSecureTurtle"),
            "port": int(os.getenv("POSTGRES_PORT", 5432))
        },
        {
            "host": "localhost",
            "database": os.getenv("POSTGRES_DB", "questlab_db"),
            "user": os.getenv("POSTGRES_USER", "turtle_guide"),
            "password": os.getenv("POSTGRES_PASSWORD", "QuestSecureTurtle"),
            "port": 5433 # Exposed port in docker-compose.yml
        }
    ]
    
    for params in connection_attempts:
        try:
            conn = psycopg2.connect(**params)
            return conn
        except Exception:
            continue
            
    raise Exception("Could not connect to the database on 'postgres:5432' or 'localhost:5433'.")

def seed_games():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Skill Builder (Engine ID 1)
        skill_builder_config = {
            "title": "Present Continuous",
            "difficulty": "beginner",
            "points": 40,
            "time_per_problem": 20,
            "total_problems": 4,
            "problems": [
                {
                    "question": "She ______ (run) in the park.",
                    "answer": "is running",
                    "hint": "Double the 'n'!"
                },
                {
                    "question": "We ______ (dance) to the music.",
                    "answer": "are dancing",
                    "hint": "Drop the 'e'!"
                },
                {
                    "question": "They ______ (swim) in the sea.",
                    "answer": "are swimming",
                    "hint": "Double the 'm'!"
                },
                {
                    "question": "It ______ (rain) today.",
                    "answer": "is raining",
                    "hint": "Just add -ing."
                }
            ]
        }

        # 2. Quiz Battle (Engine ID 2)
        quiz_battle_config = {
            "title": "Present Continuous Challenge",
            "difficulty": "beginner",
            "points": 30,
            "time_limit": 60,
            "points_per_question": 10,
            "questions": [
                {
                    "question": "I ______ (study) for my exam right now.",
                    "options": ["am studying", "is studying", "are studying", "study"],
                    "answer": "am studying"
                },
                {
                    "question": "Listen! The birds ______ (sing).",
                    "options": ["is singing", "are singing", "singing", "sing"],
                    "answer": "are singing"
                },
                {
                    "question": "Look! The cat ______ (climb) that tree.",
                    "options": ["is climbing", "are climbing", "am climbing", "climbing"],
                    "answer": "is climbing"
                }
            ]
        }

        # Insert games
        games_to_seed = [
            (10, 1, json.dumps(skill_builder_config)),
            (10, 2, json.dumps(quiz_battle_config)),
        ]

        for lesson_id, engine_id, config in games_to_seed:
            # Check if game already exists to avoid duplicates
            cur.execute(
                "SELECT id FROM games WHERE lesson_id = %s AND game_engine_id = %s",
                (lesson_id, engine_id)
            )
            if cur.fetchone():
                print(f"Game for lesson {lesson_id} and engine {engine_id} already exists. Updating...")
                cur.execute(
                    "UPDATE games SET config_json = %s, created_at = %s WHERE lesson_id = %s AND game_engine_id = %s",
                    (config, datetime.now(), lesson_id, engine_id)
                )
            else:
                cur.execute(
                    "INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)",
                    (lesson_id, engine_id, config, datetime.now())
                )

        conn.commit()
        print("Successfully seeded/updated 2 games for Present Continuous!")

    except Exception as e:
        print(f"Error seeding games: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cur.close()
            conn.close()


if __name__ == "__main__":
    seed_games()

