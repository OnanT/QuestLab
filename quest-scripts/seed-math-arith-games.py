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
            # 28: Addition (Skill Builder)
            (28, 1, {
                "title": "Addition Master",
                "problems": [
                    {"question": "25 + 18 =", "answer": "43"},
                    {"question": "37 + 15 =", "answer": "52"},
                    {"question": "69 + 21 =", "answer": "90"},
                    {"question": "126 + 38 =", "answer": "164"}
                ]
            }),
            # 29: Subtraction (Skill Builder)
            (29, 1, {
                "title": "Subtraction Quest",
                "problems": [
                    {"question": "42 - 15 =", "answer": "27"},
                    {"question": "50 - 12 =", "answer": "38"},
                    {"question": "81 - 45 =", "answer": "36"},
                    {"question": "100 - 45 =", "answer": "55"}
                ]
            }),
            # 30: Multiplication (Skill Builder)
            (30, 1, {
                "title": "Multiplication Rush",
                "problems": [
                    {"question": "12 x 4 =", "answer": "48"},
                    {"question": "25 x 2 =", "answer": "50"},
                    {"question": "11 x 11 =", "answer": "121"},
                    {"question": "15 x 10 =", "answer": "150"}
                ]
            }),
            # 31: Word Problems (Skill Builder)
            (31, 1, {
                "title": "Story Solver",
                "problems": [
                    {"question": "Sam has 15 marbles, gets 12 more. Total?", "answer": "27"},
                    {"question": "40 birds, 15 fly away. Left?", "answer": "25"},
                    {"question": "Anna has $50, spends $18. Remains?", "answer": "32"},
                    {"question": "24 morning, 36 afternoon. Total?", "answer": "60"}
                ]
            })
        ]
        for lesson_id, engine_id, config in games_data:
            cur.execute("INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)", (lesson_id, engine_id, json.dumps(config), datetime.now()))
        conn.commit()
        print("Successfully seeded Math Arithmetic games!")
    except Exception as e:
        print(f"Error: {e}")
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    seed_games()
