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
            # 18: Diphthongs (Skill Builder)
            (18, 1, {
                "title": "Diphthong Match",
                "problems": [
                    {"question": "b_ _ (joyful noise)", "answer": "boy"},
                    {"question": "f_ _ k (eating tool)", "answer": "fork"},
                    {"question": "h_ _ se (place to live)", "answer": "house"},
                    {"question": "s_ _ (past of see)", "answer": "saw"}
                ]
            }),
            # 19: Letter Y (Quiz Battle)
            (19, 2, {
                "title": "The Y Challenge",
                "questions": [
                    {"question": "In 'yellow', Y is a...", "options": ["consonant", "vowel"], "answer": "consonant"},
                    {"question": "In 'sky', Y sounds like...", "options": ["long i", "long e"], "answer": "long i"},
                    {"question": "In 'candy', Y sounds like...", "options": ["long i", "long e"], "answer": "long e"}
                ]
            }),
            # 20: Blends (Skill Builder)
            (20, 1, {
                "title": "Blend Builder",
                "problems": [
                    {"question": "_ _ oon (eats soup)", "answer": "sp"},
                    {"question": "_ _ ower (grows in garden)", "answer": "fl"},
                    {"question": "_ _ ake (hisses)", "answer": "sn"},
                    {"question": "_ _ ass (to drink from)", "answer": "gl"}
                ]
            }),
            # 21: Syllabication (Quiz Battle)
            (21, 2, {
                "title": "Syllable Counter",
                "questions": [
                    {"question": "Syllables in 'elephant'?", "options": ["1", "2", "3", "4"], "answer": "3"},
                    {"question": "Syllables in 'dog'?", "options": ["1", "2", "3"], "answer": "1"},
                    {"question": "Syllables in 'banana'?", "options": ["2", "3", "4"], "answer": "3"}
                ]
            }),
            # 22: Compound Words (Skill Builder)
            (22, 1, {
                "title": "Word Fusion",
                "problems": [
                    {"question": "Sun + Flower =", "answer": "sunflower"},
                    {"question": "Rain + Bow =", "answer": "rainbow"},
                    {"question": "Foot + Ball =", "answer": "football"},
                    {"question": "Star + Fish =", "answer": "starfish"}
                ]
            }),
            # 23: Homographs (Quiz Battle)
            (23, 2, {
                "title": "Meaning Match",
                "questions": [
                    {"question": "'Bark' can mean tree skin or a dog's sound.", "options": ["True", "False"], "answer": "True"},
                    {"question": "A flying animal is a...", "options": ["Bat", "Cat", "Rat"], "answer": "Bat"},
                    {"question": "Where you save money is a...", "options": ["Bank", "Tank", "Park"], "answer": "Bank"}
                ]
            }),
            # 24: Similes (Skill Builder)
            (24, 1, {
                "title": "Simile Completer",
                "problems": [
                    {"question": "As brave as a ____", "answer": "lion"},
                    {"question": "As busy as a ____", "answer": "bee"},
                    {"question": "As cold as ____", "answer": "ice"},
                    {"question": "Runs like the ____", "answer": "wind"}
                ]
            }),
            # 25: A/An (Quiz Battle)
            (25, 2, {
                "title": "A or An?",
                "questions": [
                    {"question": "____ umbrella", "options": ["a", "an"], "answer": "an"},
                    {"question": "____ house", "options": ["a", "an"], "answer": "a"},
                    {"question": "____ ice cream", "options": ["a", "an"], "answer": "an"},
                    {"question": "____ cat", "options": ["a", "an"], "answer": "a"}
                ]
            })
        ]
        for lesson_id, engine_id, config in games_data:
            cur.execute("INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)", (lesson_id, engine_id, json.dumps(config), datetime.now()))
        conn.commit()
        print("Successfully seeded Phonics and Vocabulary games!")
    except Exception as e:
        print(f"Error: {e}")
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    seed_games()
