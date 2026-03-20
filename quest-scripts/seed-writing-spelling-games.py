import json
import psycopg2
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    connection_attempts = [
        {"host": os.getenv("POSTGRES_HOST", "postgres"), "database": os.getenv("POSTGRES_DB", "questlab_db"), "user": os.getenv("POSTGRES_USER", "turtle_guide"), "password": os.getenv("POSTGRES_PASSWORD", "QuestSecureTurtle"), "port": 5432},
        {"host": "localhost", "database": os.getenv("POSTGRES_DB", "questlab_db"), "user": os.getenv("POSTGRES_USER", "turtle_guide"), "password": os.getenv("POSTGRES_PASSWORD", "QuestSecureTurtle"), "port": 5433}
    ]
    for params in connection_attempts:
        try:
            conn = psycopg2.connect(**params)
            return conn
        except: continue
    raise Exception("Could not connect to the database.")

def seed_games():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        games_data = [
            # 26: Descriptive Writing (Quiz Battle)
            (26, 2, {
                "title": "Sensory Search",
                "questions": [
                    {"question": "The lemon is sour. (Sense?)", "options": ["Taste", "Sight", "Hearing"], "answer": "Taste"},
                    {"question": "The music is loud. (Sense?)", "options": ["Hearing", "Smell", "Touch"], "answer": "Hearing"},
                    {"question": "The sky is blue. (Sense?)", "options": ["Sight", "Taste", "Smell"], "answer": "Sight"}
                ]
            }),
            # 27: Spelling Rules (Quiz Battle)
            (27, 2, {
                "title": "Spelling Bee",
                "questions": [
                    {"question": "run + ing =", "options": ["runing", "running"], "answer": "running"},
                    {"question": "bake + ing =", "options": ["bakeing", "baking"], "answer": "baking"},
                    {"question": "hope + ing =", "options": ["hopeing", "hoping"], "answer": "hoping"}
                ]
            })
        ]
        for lesson_id, engine_id, config in games_data:
            cur.execute("INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)", (lesson_id, engine_id, json.dumps(config), datetime.now()))
        conn.commit()
        print("Successfully seeded Writing and Spelling games!")
    except Exception as e:
        print(f"Error: {e}")
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    seed_games()
