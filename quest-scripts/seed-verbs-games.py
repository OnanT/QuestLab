import json
import psycopg2
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
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
            "port": 5433 
        }
    ]
    for params in connection_attempts:
        try:
            conn = psycopg2.connect(**params)
            return conn
        except Exception:
            continue
    raise Exception("Could not connect to the database.")

def seed_verbs_games():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        games_data = [
            # 11: Simple Present Tense
            (11, 1, {
                "title": "Everyday Verbs",
                "problems": [
                    {"question": "He ____ (eat) an apple.", "answer": "eats"},
                    {"question": "They ____ (swim) in the pool.", "answer": "swim"},
                    {"question": "She ____ (study) hard.", "answer": "studies"},
                    {"question": "We ____ (watch) TV.", "answer": "watch"}
                ]
            }),
            # 12: Simple Past Tense
            (12, 1, {
                "title": "Past Tense Power",
                "problems": [
                    {"question": "I ____ (play) tennis yesterday.", "answer": "played"},
                    {"question": "She ____ (bake) a cake.", "answer": "baked"},
                    {"question": "They ____ (climb) the hill.", "answer": "climbed"},
                    {"question": "It ____ (stop) raining.", "answer": "stopped"}
                ]
            }),
            # 13: Irregular Past Tense
            (13, 2, {
                "title": "Irregular Verb Battle",
                "questions": [
                    {"question": "What is the past tense of 'Go'?", "options": ["went", "goed", "gone"], "answer": "went"},
                    {"question": "What is the past tense of 'See'?", "options": ["saw", "seen", "seed"], "answer": "saw"},
                    {"question": "What is the past tense of 'Buy'?", "options": ["bought", "buyed", "boughten"], "answer": "bought"}
                ]
            }),
            # 14: Past Continuous Tense
            (14, 1, {
                "title": "Ongoing Actions",
                "problems": [
                    {"question": "I ____ (was/were) dancing.", "answer": "was"},
                    {"question": "They ____ (was/were) singing.", "answer": "were"},
                    {"question": "He ____ (was/were) sleeping.", "answer": "was"},
                    {"question": "We ____ (was/were) learning.", "answer": "were"}
                ]
            }),
            # 15: Subject-Verb Agreement
            (15, 2, {
                "title": "Agreement Challenge",
                "questions": [
                    {"question": "The bird ____ (sing/sings).", "options": ["sing", "sings"], "answer": "sings"},
                    {"question": "The birds ____ (sing/sings).", "options": ["sing", "sings"], "answer": "sing"},
                    {"question": "He ____ (has/have) a dog.", "options": ["has", "have"], "answer": "has"},
                    {"question": "They ____ (has/have) a cat.", "options": ["has", "have"], "answer": "have"}
                ]
            })
        ]

        for lesson_id, engine_id, config in games_data:
            cur.execute(
                "INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)",
                (lesson_id, engine_id, json.dumps(config), datetime.now())
            )

        conn.commit()
        print("Successfully seeded verb games!")

    except Exception as e:
        print(f"Error: {e}")
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    seed_verbs_games()
