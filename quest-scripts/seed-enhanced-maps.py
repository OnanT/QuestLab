import json
import psycopg2
import os
from datetime import datetime

# Database connection parameters
def get_db_connection():
    connection_attempts = [
        {"host": "postgres", "database": "questlab_db", "user": "turtle_guide", "password": "QuestSecureTurtle", "port": 5432},
        {"host": "localhost", "database": "questlab_db", "user": "turtle_guide", "password": "QuestSecureTurtle", "port": 5432},
        {"host": "localhost", "database": "questlab_db", "user": "turtle_guide", "password": "QuestSecureTurtle", "port": 5433}
    ]
    for params in connection_attempts:
        try:
            conn = psycopg2.connect(**params)
            return conn
        except:
            continue
    raise Exception("Could not connect to the database.")

def seed_map_games():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Map Challenge - Image Mode (Caribbean Map)
        # Using local image in public/maps/
        caribbean_image_url = "/maps/caribbean.png"
        
        caribbean_map_config = {
            "title": "Caribbean Island Explorer",
            "difficulty": "medium",
            "points": 100,
            "time_limit": 120,
            "map_type": "image",
            "image_url": caribbean_image_url,
            "tolerance": 8,
            "locations": [
                {"name": "Cuba", "x": 30, "y": 30, "hint": "The largest island in the Caribbean"},
                {"name": "Hispaniola", "x": 55, "y": 45, "hint": "Shared by Haiti and Dominican Republic"},
                {"name": "Jamaica", "x": 42, "y": 55, "hint": "Home of Reggae and the Blue Mountains"},
                {"name": "Puerto Rico", "x": 68, "y": 48, "hint": "A US territory east of Hispaniola"}
            ]
        }

        # 2. Map Challenge - Leaflet Mode (Jamaica Landmarks)
        jamaica_leaflet_config = {
            "title": "Jamaica Landmark Quest",
            "difficulty": "hard",
            "points": 150,
            "time_limit": 180,
            "map_type": "leaflet",
            "center_lat": 18.15,
            "center_lng": -77.3,
            "zoom": 9,
            "tolerance": 5, # 5km tolerance
            "locations": [
                {"name": "Blue Mountain Peak", "lat": 18.0465, "lng": -76.5872, "hint": "The highest point in Jamaica"},
                {"name": "Dunn's River Falls", "lat": 18.4147, "lng": -77.1378, "hint": "Famous tiered waterfalls in Ocho Rios"},
                {"name": "Devon House", "lat": 18.0135, "lng": -76.7905, "hint": "Historic mansion in Kingston famous for ice cream"},
                {"name": "Negril Lighthouse", "lat": 18.2533, "lng": -78.3615, "hint": "Iconic lighthouse on the western tip of the island"}
            ]
        }

        # Get Lesson IDs (Assuming 3 and 4 exist from previous seeds, or fallback to first available)
        cur.execute("SELECT id FROM lessons LIMIT 2")
        lesson_ids = [r[0] for r in cur.fetchall()]
        if not lesson_ids:
            lesson_ids = [1, 1]
        elif len(lesson_ids) == 1:
            lesson_ids = [lesson_ids[0], lesson_ids[0]]

        # Get Game Engine ID for MapChallenge (ID 4)
        cur.execute("SELECT id FROM game_engines WHERE name = 'MapChallenge'")
        res = cur.fetchone()
        engine_id = res[0] if res else 4

        # Insert games
        games_to_seed = [
            (lesson_ids[0], engine_id, json.dumps(caribbean_map_config)),
            (lesson_ids[1], engine_id, json.dumps(jamaica_leaflet_config))
        ]

        for lesson_id, engine_id, config in games_to_seed:
            cur.execute(
                "INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)",
                (lesson_id, engine_id, config, datetime.now())
            )

        conn.commit()
        print("Successfully seeded enhanced Map Challenge games!")

    except Exception as e:
        print(f"Error seeding games: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed_map_games()
