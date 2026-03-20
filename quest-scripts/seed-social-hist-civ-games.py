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
            # 35: Hamilton & Wells (Quiz Battle)
            (35, 2, {
                "title": "History Heroes",
                "questions": [
                    {"question": "Who was born in Nevis?", "options": ["Nathaniel Wells", "Alexander Hamilton"], "answer": "Alexander Hamilton"},
                    {"question": "Nathaniel Wells was Britain's first Black ____.", "options": ["Sheriff", "King"], "answer": "Sheriff"},
                    {"question": "Alexander Hamilton Museum is in ____.", "options": ["Basseterre", "Charlestown"], "answer": "Charlestown"}
                ]
            }),
            # 36: Towns & Villages (Quiz Battle)
            (36, 2, {
                "title": "Community Scavenger",
                "questions": [
                    {"question": "Is a mountain natural or man-made?", "options": ["Natural", "Man-made"], "answer": "Natural"},
                    {"question": "Is a road natural or man-made?", "options": ["Natural", "Man-made"], "answer": "Man-made"},
                    {"question": "Which is larger?", "options": ["Town", "Village"], "answer": "Town"}
                ]
            }),
            # 37: Needs/Wants & Workers (Quiz Battle)
            (37, 2, {
                "title": "Helper Match",
                "questions": [
                    {"question": "Is food a need or a want?", "options": ["Need", "Want"], "answer": "Need"},
                    {"question": "Who uses a stethoscope?", "options": ["Teacher", "Doctor"], "answer": "Doctor"},
                    {"question": "Is candy a need or a want?", "options": ["Need", "Want"], "answer": "Want"}
                ]
            })
        ]
        for lesson_id, engine_id, config in games_data:
            cur.execute("INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)", (lesson_id, engine_id, json.dumps(config), datetime.now()))
        conn.commit()
        print("Successfully seeded Social Studies History and Civics games!")
    except Exception as e:
        print(f"Error: {e}")
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    seed_games()
