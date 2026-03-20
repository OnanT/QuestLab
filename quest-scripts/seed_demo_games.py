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
            "title": "Math Whiz: Multiplication",
            "difficulty": "beginner",
            "points": 50,
            "time_per_problem": 10,
            "total_problems": 5,
            "problems": [
                {"question": "5 x 5", "answer": "25", "hint": "Think of 5 groups of 5"},
                {"question": "8 x 2", "answer": "16", "hint": "Double 8"},
                {"question": "3 x 7", "answer": "21", "hint": "Three weeks have how many days?"},
                {"question": "9 x 4", "answer": "36", "hint": "One less than 40 minus 4"},
                {"question": "6 x 6", "answer": "36", "hint": "A dozen times three"}
            ]
        }

        # 2. Quiz Battle (Engine ID 2)
        quiz_battle_config = {
            "title": "Science Challenge: Ecosystems",
            "difficulty": "intermediate",
            "points": 60,
            "time_limit": 45,
            "points_per_question": 12,
            "questions": [
                {
                    "question": "What is the primary source of energy for most ecosystems?",
                    "options": ["The Moon", "The Sun", "Volcanoes", "Wind"],
                    "answer": "The Sun"
                },
                {
                    "question": "Which of these is a producer?",
                    "options": ["Lion", "Rabbit", "Green Plant", "Mushroom"],
                    "answer": "Green Plant"
                },
                {
                    "question": "An animal that only eats plants is called a...",
                    "options": ["Carnivore", "Herbivore", "Omnivore", "Decomposer"],
                    "answer": "Herbivore"
                },
                {
                    "question": "Where do decomposers get their energy?",
                    "options": ["From the Sun", "From living animals", "From dead matter", "From air"],
                    "answer": "From dead matter"
                },
                {
                    "question": "Which ecosystem is characterized by very low rainfall?",
                    "options": ["Rainforest", "Grassland", "Desert", "Tundra"],
                    "answer": "Desert"
                }
            ]
        }

        # 3. Story Quest (Engine ID 3)
        story_quest_config = {
            "title": "Adventure in Blue Mountains",
            "difficulty": "medium",
            "points": 100,
            "scenes": [
                {
                    "id": "start",
                    "text": "You stand at the base of the Blue Mountains in Jamaica. The mist is rising, and you have two paths ahead. One leads into the dense forest, and the other follows the river.",
                    "choices": [
                        {"text": "Enter the dense forest", "next": "forest", "bonus_points": 5},
                        {"text": "Follow the river", "next": "river", "bonus_points": 0}
                    ]
                },
                {
                    "id": "forest",
                    "text": "The forest is alive with the sounds of birds. You see a rare Doctor Bird (streamertail hummingbird). You remember your lesson about endemic species.",
                    "choices": [
                        {"text": "Take a photo and continue", "next": "peak", "bonus_points": 15},
                        {"text": "Try to catch it", "next": "lost", "bonus_points": -10}
                    ]
                },
                {
                    "id": "river",
                    "text": "The river is cool and refreshing. You find some old coffee beans washed downstream. You must be near a plantation.",
                    "choices": [
                        {"text": "Hike up towards the plantation", "next": "peak", "bonus_points": 10},
                        {"text": "Swim in the river", "next": "tired", "bonus_points": 5}
                    ]
                },
                {
                    "id": "peak",
                    "text": "You reached the Blue Mountain Peak! The view is breathtaking. You can see the coast of Cuba in the distance.",
                    "ending": True,
                    "final_points": 100
                },
                {
                    "id": "lost",
                    "text": "You wandered too deep trying to catch the bird and got lost. Luckily, a local farmer found you and guided you back.",
                    "ending": True,
                    "final_points": 40
                },
                {
                    "id": "tired",
                    "text": "The swim was nice, but you're too tired to climb the peak now. You decide to head home.",
                    "ending": True,
                    "final_points": 50
                }
            ]
        }

        # 4. Map Challenge (Engine ID 4)
        map_challenge_config = {
            "title": "Caribbean Island Finder",
            "difficulty": "hard",
            "points": 80,
            "time_limit": 100,
            "tolerance": 12,
            "locations": [
                {"name": "Barbados", "x": 85, "y": 65, "hint": "The most easterly island in the Caribbean"},
                {"name": "Cuba", "x": 30, "y": 25, "hint": "The largest island in the Greater Antilles"},
                {"name": "Trinidad", "x": 78, "y": 88, "hint": "The southernmost island, near South America"},
                {"name": "Puerto Rico", "x": 65, "y": 42, "hint": "East of Hispaniola"},
                {"name": "The Bahamas", "x": 35, "y": 10, "hint": "An archipelago north of Cuba"}
            ]
        }

        # Insert games
        games_to_seed = [
            (3, 1, json.dumps(skill_builder_config)),
            (4, 2, json.dumps(quiz_battle_config)),
            (3, 3, json.dumps(story_quest_config)),
            (4, 4, json.dumps(map_challenge_config))
        ]

        for lesson_id, engine_id, config in games_to_seed:
            # Check if game already exists
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
        print("Successfully seeded/updated 4 demo games!")

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
