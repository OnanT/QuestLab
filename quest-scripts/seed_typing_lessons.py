import json
import psycopg2
from psycopg2.extras import RealDictCursor
import sys
import os

# Database connection parameters
DB_CONFIG = {
    "dbname": "questlab_db",
    "user": "turtle_guide",
    "password": "QuestSecureTurtle",
    "host": "localhost", # When running via docker exec, use localhost if postgres is same container or use service name
    "port": "5432"
}

# Override with environment variables if available
if os.environ.get("POSTGRES_DB"):
    DB_CONFIG["dbname"] = os.environ.get("POSTGRES_DB")
if os.environ.get("POSTGRES_USER"):
    DB_CONFIG["user"] = os.environ.get("POSTGRES_USER")
if os.environ.get("POSTGRES_PASSWORD"):
    DB_CONFIG["password"] = os.environ.get("POSTGRES_PASSWORD")

ISLANDS = {
    "nevis": {"name": "Nevis", "subject_id": 4},
    "st_kitts": {"name": "St. Kitts", "subject_id": 4},
    "st_lucia": {"name": "St. Lucia", "subject_id": 4},
    "jamaica": {"name": "Jamaica", "subject_id": 4}
}

TYPING_LESSONS = [
    # NEVIS
    {
        "island": "nevis",
        "location": "Pinneys Beach",
        "title": "Pinneys Beach — Home Row",
        "target": "aaa sss ddd fff jjj kkk lll aaa sss ddd fff jjj",
        "difficulty": "beginner",
        "keys": ["a", "s", "d", "f", "j", "k", "l"],
        "ambient": "ocean_gentle.ogg",
        "narration": "nevis_01.ogg",
        "flavor": "The calm waters of Pinneys Beach mirror the calm of the home row. Plant your fingers on asdf and jkl. This is your foundation."
    },
    {
        "island": "nevis",
        "location": "The Bath Hotel",
        "title": "The Bath Hotel — G and H",
        "target": "add glass jug dash glad half flag shah gash shag",
        "difficulty": "beginner",
        "keys": ["g", "h"],
        "ambient": "spring_water.ogg",
        "narration": "nevis_02.ogg",
        "flavor": "The Bath Hotel was built in 1778 — the oldest in the Caribbean. Now let your fingers reach for G and H."
    },
    {
        "island": "nevis",
        "location": "Nevis Peak",
        "title": "Nevis Peak — Climbing to E and I",
        "target": "the slide is wide life in the hills high tide aside",
        "difficulty": "beginner",
        "keys": ["e", "i"],
        "ambient": "rainforest_birds.ogg",
        "narration": "nevis_03.ogg",
        "flavor": "Nevis Peak rises 985 metres through cloud and rainforest. Reaching the top requires patience — just like reaching up for E and I."
    },
    {
        "island": "nevis",
        "location": "Hamilton House",
        "title": "Hamilton House — Full Vowel Set",
        "target": "row out the door word flow ruin our world sure four",
        "difficulty": "easy",
        "keys": ["w", "o", "r", "u"],
        "ambient": "town_square.ogg",
        "narration": "nevis_04.ogg",
        "flavor": "Alexander Hamilton was born on Nevis in 1755. He wrote thousands of documents. Every word began with these keys — W, O, R, U."
    },
    {
        "island": "nevis",
        "location": "The Narrows",
        "title": "The Narrows — Full Alphabet Run",
        "target": "the morning ferry glides across the narrows between nevis and saint kitts",
        "difficulty": "medium",
        "keys": ["all"],
        "ambient": "ocean_crossing.ogg",
        "narration": "nevis_05.ogg",
        "flavor": "The Narrows is the 3-kilometre channel between Nevis and St. Kitts. Now every key is yours."
    },
    {
        "island": "nevis",
        "location": "Botanical Garden",
        "title": "Botanical Garden — Punctuation and Capitals",
        "target": "Heliconias, palms, and orchids thrive here. Every plant has a name; every name tells a story.",
        "difficulty": "medium",
        "keys": [",", ".", ";", "Shift"],
        "ambient": "garden_ambient.ogg",
        "narration": "nevis_06.ogg",
        "flavor": "The Nevis Botanical Gardens hold over 500 species. Punctuation is the breath between ideas — master it here."
    },
    {
        "island": "nevis",
        "location": "Four Seasons Bluff",
        "title": "Four Seasons Bluff — Speed Trial",
        "target": "Nevis is a small island with a grand history. From the sugar era to the spa retreats, every generation has left its mark on this quiet gem of the Caribbean.",
        "difficulty": "hard",
        "keys": ["all"],
        "ambient": "resort_evening.ogg",
        "narration": "nevis_07.ogg",
        "flavor": "The bluff overlooks the sea and St. Kitts. You have learned everything — now type it freely."
    },
    
    # ST KITTS
    {
        "island": "st_kitts",
        "location": "South Friars Beach",
        "title": "South Friars Beach — The Home Row",
        "target": "fff jjj fff jjj ddd kkk sss lll aaa aaa fff ddd sss",
        "difficulty": "beginner",
        "keys": ["a", "s", "d", "f", "j", "k", "l"],
        "ambient": "beach_waves.ogg",
        "narration": "stkitts_01.ogg",
        "flavor": "South Friars is one of the finest beaches in the Eastern Caribbean. Home row only."
    },
    {
        "island": "st_kitts",
        "location": "Brimstone Hill Fortress",
        "title": "Brimstone Hill — G and H",
        "target": "hold the high ground flag shall flash glad hall dash half",
        "difficulty": "beginner",
        "keys": ["g", "h"],
        "ambient": "fortress_wind.ogg",
        "narration": "stkitts_02.ogg",
        "flavor": "Brimstone Hill was called the Gibraltar of the West Indies. G and H — the center bridge between your hands."
    },
    {
        "island": "st_kitts",
        "location": "The Salt Pond",
        "title": "The Salt Pond — E and I",
        "target": "the tide fills the still salt field life is defined in the silence",
        "difficulty": "beginner",
        "keys": ["e", "i"],
        "ambient": "flamingos.ogg",
        "narration": "stkitts_03.ogg",
        "flavor": "Pink flamingos wade in the Great Salt Pond at dusk. E and I are your most used keys — like salt, they go into everything."
    },
    {
        "island": "st_kitts",
        "location": "The Sugar Train",
        "title": "The Sugar Train — W, O, R, U",
        "target": "the old sugar route winds around the whole island on iron rails",
        "difficulty": "easy",
        "keys": ["w", "o", "r", "u"],
        "ambient": "train_rhythm.ogg",
        "narration": "stkitts_04.ogg",
        "flavor": "The St. Kitts Scenic Railway was built to carry sugar cane. Your fingers ride the rails — W, O, R, U."
    },
    {
        "island": "st_kitts",
        "location": "Basseterre Circus",
        "title": "Basseterre Circus — Full Alphabet",
        "target": "basseterre was founded in 1627 and its circus square still anchors the city",
        "difficulty": "medium",
        "keys": ["all"],
        "ambient": "town_music.ogg",
        "narration": "stkitts_05.ogg",
        "flavor": "The Circus in Basseterre is the heartbeat of the capital. All keys are live now."
    },
    {
        "island": "st_kitts",
        "location": "Independence Square",
        "title": "Independence Square — Punctuation",
        "target": "St. Kitts gained independence on September 19, 1983. It was the smallest nation in the Western Hemisphere; yet it stood tall.",
        "difficulty": "medium",
        "keys": [",", ".", ";", "Shift", "numbers"],
        "ambient": "celebration.ogg",
        "narration": "stkitts_06.ogg",
        "flavor": "Independence Square saw the birth of a nation. Punctuation matters in your fingers too."
    },
    {
        "island": "st_kitts",
        "location": "Black Rocks",
        "title": "Black Rocks — Speed Trial",
        "target": "Lava once poured from Mount Liamuiga and hardened into black rock at the sea's edge. The island was forged by fire, shaped by water, and settled by people who refused to be broken.",
        "difficulty": "hard",
        "keys": ["all"],
        "ambient": "crashing_waves.ogg",
        "narration": "stkitts_07.ogg",
        "flavor": "The Black Rocks are ancient lava flows. This is the final test of everything you have built."
    },

    # ST LUCIA
    {
        "island": "st_lucia",
        "location": "Rodney Bay Beach",
        "title": "Rodney Bay — The Home Row",
        "target": "jjj fff jjj fff kkk ddd lll sss aaa jjj fff kkk ddd",
        "difficulty": "beginner",
        "keys": ["a", "s", "d", "f", "j", "k", "l"],
        "ambient": "bay_calm.ogg",
        "narration": "stlucia_01.ogg",
        "flavor": "Rodney Bay is sheltered and serene. Begin here. Eight fingers, eight keys, one foundation."
    },
    {
        "island": "st_lucia",
        "location": "Pigeon Island",
        "title": "Pigeon Island — G and H",
        "target": "high flag flash glad hash gash shag held hand glass half",
        "difficulty": "beginner",
        "keys": ["g", "h"],
        "ambient": "hilltop_wind.ogg",
        "narration": "stlucia_02.ogg",
        "flavor": "Admiral Rodney launched his fleet from Pigeon Island in 1782. Now your flags fly — G and H."
    },
    {
        "island": "st_lucia",
        "location": "The Pitons",
        "title": "The Pitons — E and I",
        "target": "rise high like the pitons their peak is the prize within the isle",
        "difficulty": "beginner",
        "keys": ["e", "i"],
        "ambient": "volcanic_birds.ogg",
        "narration": "stlucia_03.ogg",
        "flavor": "Gros Piton and Petit Piton are the symbol of St. Lucia. Reach up — E and I await."
    },
    {
        "island": "st_lucia",
        "location": "Sulphur Springs",
        "title": "Sulphur Springs — W, O, R, U",
        "target": "warm sulfur water flows from the mouth of the old volcano into the world",
        "difficulty": "easy",
        "keys": ["w", "o", "r", "u"],
        "ambient": "volcano_rumble.ogg",
        "narration": "stlucia_04.ogg",
        "flavor": "La Soufrière is the world's only drive-in volcano. W, O, R, U — keys as elemental as earth and water."
    },
    {
        "island": "st_lucia",
        "location": "Marigot Bay",
        "title": "Marigot Bay — Full Alphabet",
        "target": "marigot bay was once used by british admiral samuel barrington to hide his fleet from the french",
        "difficulty": "medium",
        "keys": ["all"],
        "ambient": "marina.ogg",
        "narration": "stlucia_05.ogg",
        "flavor": "Marigot Bay has one of the most beautiful natural harbours in the Caribbean. All your keys are ready."
    },
    {
        "island": "st_lucia",
        "location": "Castries Market",
        "title": "Castries Market — Punctuation",
        "target": "Breadfruit, plantain, and dasheen fill every stall. The vendors call: \"Come, taste!\" This is Castries; this is St. Lucia.",
        "difficulty": "medium",
        "keys": [",", ".", ":", "\"", "!", ";", "Shift"],
        "ambient": "market_bustle.ogg",
        "narration": "stlucia_06.ogg",
        "flavor": "The Castries Market has operated since 1894. Punctuation — calls, pauses, exclamations — is the heartbeat of the keyboard."
    },
    {
        "island": "st_lucia",
        "location": "Anse Chastanet",
        "title": "Anse Chastanet — Speed Trial",
        "target": "St. Lucia is an island of contrasts: volcanic peaks and white sand beaches, dense rainforest and busy harbours, French Creole culture and British institutions. It is one of the most complex and beautiful places on earth.",
        "difficulty": "hard",
        "keys": ["all"],
        "ambient": "coral_reef.ogg",
        "narration": "stlucia_07.ogg",
        "flavor": "Anse Chastanet sits between the Pitons and the sea. This is the final lesson — let your hands move like water."
    },

    # JAMAICA
    {
        "island": "jamaica",
        "location": "Seven Mile Beach",
        "title": "Seven Mile Beach — The Home Row",
        "target": "lll sss kkk ddd jjj fff aaa lll kkk jjj sss ddd fff aaa",
        "difficulty": "beginner",
        "keys": ["a", "s", "d", "f", "j", "k", "l"],
        "ambient": "reggae_beach.ogg",
        "narration": "jamaica_01.ogg",
        "flavor": "Seven Mile Beach is the longest white sand beach in Jamaica. Begin at the home row, feet in the sand."
    },
    {
        "island": "jamaica",
        "location": "Dunn's River Falls",
        "title": "Dunn's River Falls — G and H",
        "target": "hold hands as the falls rush high a glad flash of white against the dark",
        "difficulty": "beginner",
        "keys": ["g", "h"],
        "ambient": "waterfall.ogg",
        "narration": "jamaica_02.ogg",
        "flavor": "Tourists form human chains to climb Dunn's River Falls together. G and H are your chain link."
    },
    {
        "island": "jamaica",
        "location": "Blue Mountains",
        "title": "Blue Mountains — E and I",
        "target": "the mist hides the high ridge life is lived in the wide silence between trees",
        "difficulty": "beginner",
        "keys": ["e", "i"],
        "ambient": "mountain_mist.ogg",
        "narration": "jamaica_03.ogg",
        "flavor": "Blue Mountain Peak is the highest point in Jamaica. E and I — as essential as altitude."
    },
    {
        "island": "jamaica",
        "location": "Port Antonio",
        "title": "Port Antonio — W, O, R, U",
        "target": "our boat rows through the blue river toward the wild forest of the north",
        "difficulty": "easy",
        "keys": ["w", "o", "r", "u"],
        "ambient": "river_raft.ogg",
        "narration": "jamaica_04.ogg",
        "flavor": "Port Antonio is home to the Rio Grande rafting experience. W, O, R, U — let the current carry your hands."
    },
    {
        "island": "jamaica",
        "location": "Trench Town",
        "title": "Trench Town — Full Alphabet",
        "target": "from trench town the music of bob marley crossed every border and changed the world",
        "difficulty": "medium",
        "keys": ["all"],
        "ambient": "roots_reggae.ogg",
        "narration": "jamaica_05.ogg",
        "flavor": "Trench Town gave the world reggae. Every key on the board is now yours."
    },
    {
        "island": "jamaica",
        "location": "Devon House",
        "title": "Devon House — Punctuation",
        "target": "Devon House was built in 1881 by George Stiebel, Jamaica's first Black millionaire. Today it serves the finest ice cream on the island; the queue never lies.",
        "difficulty": "medium",
        "keys": [",", ".", ";", "'", "Shift", "numbers"],
        "ambient": "heritage_garden.ogg",
        "narration": "jamaica_06.ogg",
        "flavor": "Devon House is one of the finest mansions in the Caribbean. Punctuation: the architecture of a sentence."
    },
    {
        "island": "jamaica",
        "location": "Hellshire Beach",
        "title": "Hellshire Beach — Speed Trial",
        "target": "Jamaica is not merely a place — it is a frequency. It vibrates in the music, the food, the language, and the laughter of its people. To visit is to be changed; to leave is to carry it with you forever.",
        "difficulty": "hard",
        "keys": ["all"],
        "ambient": "sunset_beach.ogg",
        "narration": "jamaica_07.ogg",
        "flavor": "Hellshire Beach at sunset. This is the final test for Jamaica. Type like the music — steady, deep, and free."
    }
]

def seed():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # 1. Get TypingGame Engine ID
        cur.execute("SELECT id FROM game_engines WHERE name = 'TypingGame'")
        engine = cur.fetchone()
        if not engine:
            print("Error: TypingGame engine not found in database.")
            return
        engine_id = engine['id']
        
        # 2. Get a Teacher/Admin ID for creator_id
        cur.execute("SELECT id FROM users WHERE role IN ('admin', 'teacher') LIMIT 1")
        creator = cur.fetchone()
        creator_id = creator['id'] if creator else None
        
        # 3. Get default organization
        cur.execute("SELECT id FROM organizations LIMIT 1")
        org = cur.fetchone()
        org_id = org['id'] if org else 1

        print(f"Seeding {len(TYPING_LESSONS)} typing lessons...")
        
        for data in TYPING_LESSONS:
            # Create or find Topic/Concept
            island_info = ISLANDS[data['island']]
            subject_id = island_info['subject_id']
            
            # Find curriculum_subject_id
            cur.execute("SELECT id FROM curriculum_subjects WHERE subject_id = %s AND grade_level = 3 LIMIT 1", (subject_id,))
            cs = cur.fetchone()
            cs_id = cs['id'] if cs else None
            
            # Topic: "Keyboarding - {Island Name}"
            topic_title = f"Keyboarding - {island_info['name']}"
            cur.execute("INSERT INTO topics (curriculum_subject_id, title) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING id", (cs_id, topic_title))
            topic = cur.fetchone()
            if not topic:
                cur.execute("SELECT id FROM topics WHERE title = %s", (topic_title,))
                topic = cur.fetchone()
            topic_id = topic['id']
            
            # Concept: Specific location
            concept_title = data['location']
            cur.execute("INSERT INTO concepts (topic_id, title) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING id", (topic_id, concept_title))
            concept = cur.fetchone()
            if not concept:
                cur.execute("SELECT id FROM concepts WHERE title = %s AND topic_id = %s", (concept_title, topic_id))
                concept = cur.fetchone()
            concept_id = concept['id']
            
            # Create Lesson
            cur.execute("""
                INSERT INTO lessons (organization_id, concept_id, title, content_html, creator_id, category, difficulty, points)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING RETURNING id
            """, (org_id, concept_id, data['title'], data['flavor'], creator_id, 'Typing', data['difficulty'], 50))
            lesson = cur.fetchone()
            if not lesson:
                cur.execute("SELECT id FROM lessons WHERE title = %s AND concept_id = %s", (data['title'], concept_id))
                lesson = cur.fetchone()
            lesson_id = lesson['id']
            
            # Create Game
            config = {
                "title": data['title'],
                "location": data['location'],
                "island": data['island'],
                "target": data['target'],
                "difficulty": data['difficulty'],
                "keysIntroduced": data['keys'],
                "ambient": data['ambient'],
                "narration": data['narration'],
                "points": 50
            }
            
            cur.execute("""
                INSERT INTO games (lesson_id, game_engine_id, config_json)
                VALUES (%s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (lesson_id, engine_id, json.dumps(config)))
            
        conn.commit()
        print("Seeding completed successfully!")
        
    except Exception as e:
        print(f"Error during seeding: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    seed()
