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

def seed_nevis_games():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 0. Setup Prerequisites (Subject, Topic, Concept, Lesson)
        # Find Teacher and Org
        cur.execute("SELECT id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1")
        teacher_id = cur.fetchone()[0]
        cur.execute("SELECT id FROM organizations LIMIT 1")
        org_id = cur.fetchone()[0]
        cur.execute("SELECT id FROM curriculum_subjects WHERE subject_id = 4 AND grade_level = 3 LIMIT 1")
        curr_sub_id = cur.fetchone()[0]
        cur.execute("SELECT id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1")
        term_id = cur.fetchone()[0]

        # Insert Topic
        cur.execute("INSERT INTO topics (curriculum_subject_id, term_id, title) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING RETURNING id", (curr_sub_id, term_id, "Exploring Nevis"))
        res = cur.fetchone()
        topic_id = res[0] if res else None
        if not topic_id:
            cur.execute("SELECT id FROM topics WHERE title = 'Exploring Nevis' LIMIT 1")
            topic_id = cur.fetchone()[0]

        # Insert Concept
        cur.execute("INSERT INTO concepts (topic_id, title) VALUES (%s, %s) RETURNING id", (topic_id, "Nevis Geography and Heritage"))
        concept_id = cur.fetchone()[0]

        # Insert Lesson
        lesson_content = "<h2>Exploring Nevis</h2><p>Nevis is a beautiful island known as the 'Queen of the Caribees'. It is home to historic sites, natural wonders, and vibrant communities.</p>"
        cur.execute("""
            INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
        """, (concept_id, "Discovering Nevis: Our Beautiful Island", lesson_content, teacher_id, org_id, "Social Studies", "beginner", 50, "3"))
        lesson_id = cur.fetchone()[0]

        # 1. Game Configs
        games_data = [
            # Game 1: Nevis Heritage Trail
            {
                "title": "Nevis Heritage Trail",
                "difficulty": "medium",
                "points": 100,
                "time_limit": 150,
                "map_type": "leaflet",
                "center_lat": 17.133,
                "center_lng": -62.610,
                "zoom": 13,
                "tolerance": 5,
                "locations": [
                    {"name": "Alexander Hamilton House", "lat": 17.135, "lng": -62.622, "hint": "The birthplace of Alexander Hamilton."},
                    {"name": "Jewish Cemetery", "lat": 17.133, "lng": -62.621, "hint": "An ancient cemetery on Government Road."},
                    {"name": "Bath Hotel", "lat": 17.128, "lng": -62.617, "hint": "The first hotel built in the Caribbean."},
                    {"name": "St. Paul's Church", "lat": 17.132, "lng": -62.621, "hint": "Historic church in Charlestown."},
                    {"name": "Fort Charles", "lat": 17.126, "lng": -62.624, "hint": "Old fortification south of the capital."},
                    {"name": "Cottle Church", "lat": 17.177, "lng": -62.597, "hint": "Church where everyone could worship together."},
                    {"name": "Nelson's Spring", "lat": 17.163, "lng": -62.620, "hint": "Fresh water source for the British fleet."}
                ]
            },
            # Game 2: Nevis Nature Hunt
            {
                "title": "Nevis Nature Hunt",
                "difficulty": "medium",
                "points": 100,
                "time_limit": 120,
                "map_type": "leaflet",
                "center_lat": 17.150,
                "center_lng": -62.590,
                "zoom": 12,
                "tolerance": 5,
                "locations": [
                    {"name": "Nevis Peak", "lat": 17.148, "lng": -62.583, "hint": "The dormant volcano at the center."},
                    {"name": "Botanical Gardens", "lat": 17.126, "lng": -62.596, "hint": "5-acre tropical garden paradise."},
                    {"name": "Pinney's Beach", "lat": 17.151, "lng": -62.625, "hint": "The most famous golden sand beach."},
                    {"name": "Oualie Beach", "lat": 17.195, "lng": -62.616, "hint": "Calm waters on the northern tip."},
                    {"name": "Booby High Shoal", "lat": 17.205, "lng": -62.605, "hint": "A popular diving site north of Nevis."},
                    {"name": "Peak Heaven", "lat": 17.131, "lng": -62.569, "hint": "Scenic mountain farm and lookout."}
                ]
            },
            # Game 3: Nevis Village Explorer
            {
                "title": "Nevis Village Explorer",
                "difficulty": "medium",
                "points": 100,
                "time_limit": 120,
                "map_type": "leaflet",
                "center_lat": 17.160,
                "center_lng": -62.580,
                "zoom": 12,
                "tolerance": 5,
                "locations": [
                    {"name": "Charlestown", "lat": 17.133, "lng": -62.620, "hint": "The capital city and main port."},
                    {"name": "Gingerland", "lat": 17.125, "lng": -62.578, "hint": "Village named after a famous spice."},
                    {"name": "Newcastle", "lat": 17.198, "lng": -62.587, "hint": "Where the airport is located."},
                    {"name": "Cotton Ground", "lat": 17.168, "lng": -62.615, "hint": "Village near the west coast beaches."},
                    {"name": "Brick Kiln", "lat": 17.185, "lng": -62.565, "hint": "Known for traditional pottery making."},
                    {"name": "Butlers", "lat": 17.172, "lng": -62.558, "hint": "Community on the windward coast."}
                ]
            }
        ]

        # Get Game Engine ID for MapChallenge (ID 4)
        cur.execute("SELECT id FROM game_engines WHERE name = 'MapChallenge'")
        res = cur.fetchone()
        engine_id = res[0] if res else 4

        # Insert games
        for config in games_data:
            cur.execute(
                "INSERT INTO games (lesson_id, game_engine_id, config_json, created_at) VALUES (%s, %s, %s, %s)",
                (lesson_id, engine_id, json.dumps(config), datetime.now())
            )

        conn.commit()
        print(f"Successfully seeded Nevis map games to Lesson ID {lesson_id}!")

    except Exception as e:
        print(f"Error seeding Nevis games: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed_nevis_games()
