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
            # 32: 3D Shapes (Quiz Battle)
            (32, 2, {
                "title": "Shape Detective",
                "questions": [
                    {"question": "How many faces on a cube?", "options": ["4", "6", "8"], "answer": "6"},
                    {"question": "What shape is a ball?", "options": ["Cube", "Sphere", "Cone"], "answer": "Sphere"},
                    {"question": "A soda can is a...", "options": ["Cylinder", "Pyramid", "Sphere"], "answer": "Cylinder"}
                ]
            }),
            # 33: Symmetry (Quiz Battle)
            (33, 2, {
                "title": "Mirror Master",
                "questions": [
                    {"question": "Is a butterfly symmetrical?", "options": ["Yes", "No"], "answer": "Yes"},
                    {"question": "Lines of symmetry in a square?", "options": ["2", "4", "infinite"], "answer": "4"},
                    {"question": "Does 'A' have symmetry?", "options": ["Yes", "No"], "answer": "Yes"}
                ]
            }),
            # 34: Congruent (Quiz Battle)
            (34, 2, {
                "title": "Twin Finder",
                "questions": [
                    {"question": "Congruent means same size and shape.", "options": ["True", "False"], "answer": "True"},
                    {"question": "Are a big and small circle congruent?", "options": ["Yes", "No"], "answer": "No"},
                    {"question": "Can congruent shapes be flipped?", "options": ["Yes", "No"], "answer": "Yes"}
                ]
            })
        ]
        for lesson_id, engine_id, config in games_data:
            cur.execute("INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)", (lesson_id, engine_id, json.dumps(config), datetime.now()))
        conn.commit()
        print("Successfully seeded Math Geometry games!")
    except Exception as e:
        print(f"Error: {e}")
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    seed_games()
