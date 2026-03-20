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
            # 38: Communication (Quiz Battle)
            (38, 2, {
                "title": "Comm Match",
                "questions": [
                    {"question": "Which is a modern communication tool?", "options": ["Smartphone", "Smoke signal"], "answer": "Smartphone"},
                    {"question": "Where do you go to post a letter?", "options": ["Post Office", "Police Station"], "answer": "Post Office"},
                    {"question": "Is ZIZ a radio/TV station in SKN?", "options": ["Yes", "No"], "answer": "Yes"}
                ]
            }),
            # 39: Transportation (Quiz Battle)
            (39, 2, {
                "title": "Traveler Challenge",
                "questions": [
                    {"question": "Does a ferry travel on land or sea?", "options": ["Land", "Sea"], "answer": "Sea"},
                    {"question": "Which animal was used in the past for transport in SKN?", "options": ["Donkey", "Elephant"], "answer": "Donkey"},
                    {"question": "Is an airplane the fastest way to travel far?", "options": ["Yes", "No"], "answer": "Yes"}
                ]
            }),
            # 40: Road Safety (Quiz Battle)
            (40, 2, {
                "title": "Safety Expert",
                "questions": [
                    {"question": "What does a GREEN light mean?", "options": ["Go", "Stop"], "answer": "Go"},
                    {"question": "Should you wear a seatbelt in a car?", "options": ["Yes", "No"], "answer": "Yes"},
                    {"question": "What shape is a STOP sign?", "options": ["Octagon", "Square"], "answer": "Octagon"}
                ]
            })
        ]
        for lesson_id, engine_id, config in games_data:
            cur.execute("INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)", (lesson_id, engine_id, json.dumps(config), datetime.now()))
        conn.commit()
        print("Successfully seeded Social Studies Economics and Infrastructure games!")
    except Exception as e:
        print(f"Error: {e}")
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    seed_games()
