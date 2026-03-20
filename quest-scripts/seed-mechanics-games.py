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

def seed_mechanics_games():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        games_data = [
            (16, 2, {
                "title": "Capitalization Quest",
                "questions": [
                    {"question": "____ is my best friend.", "options": ["sarah", "Sarah"], "answer": "Sarah"},
                    {"question": "We visited ____ last summer.", "options": ["london", "London"], "answer": "London"},
                    {"question": "Today is ____.", "options": ["tuesday", "Tuesday"], "answer": "Tuesday"}
                ]
            }),
            (17, 2, {
                "title": "Punctuation Patrol",
                "questions": [
                    {"question": "Stop that ____", "options": [".", "!", "?"], "answer": "!"},
                    {"question": "How are you ____", "options": [".", "!", "?"], "answer": "?"},
                    {"question": "I have a pen ____ a book, and a ruler.", "options": [",", ".", "!"], "answer": ","}
                ]
            })
        ]
        for lesson_id, engine_id, config in games_data:
            cur.execute("INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)", (lesson_id, engine_id, json.dumps(config), datetime.now()))
        conn.commit()
        print("Successfully seeded mechanics games!")
    except Exception as e:
        print(f"Error: {e}")
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    seed_mechanics_games()
