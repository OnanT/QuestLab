/********************************************************************
 *  add_present_continuous_games.sql
 *
 *  Inserts 2 games for the “Present Continuous Tense” lesson (Lesson ID 10).
 ********************************************************************/

BEGIN;

-- Find the lesson ID for "Mastering the Present Continuous Tense"
SELECT id AS lesson_id FROM lessons WHERE title = 'Mastering the Present Continuous Tense' ORDER BY id DESC LIMIT 1 \gset

-- 1. Quiz Battle Game (Engine ID 2)
INSERT INTO public.games (lesson_id, game_engine_id, config_json)
VALUES (:lesson_id, 2, 
    $${
        "title": "Present Continuous Challenge",
        "difficulty": "beginner",
        "points": 30,
        "time_limit": 60,
        "points_per_question": 10,
        "questions": [
            {
                "question": "I ______ (study) for my exam right now.",
                "options": ["am studying", "is studying", "are studying", "study"],
                "answer": "am studying"
            },
            {
                "question": "Listen! The birds ______ (sing).",
                "options": ["is singing", "are singing", "singing", "sing"],
                "answer": "are singing"
            },
            {
                "question": "Look! The cat ______ (climb) that tree.",
                "options": ["is climbing", "are climbing", "am climbing", "climbing"],
                "answer": "is climbing"
            }
        ]
    }$$
);

-- 2. Skill Builder Game (Engine ID 1)
INSERT INTO public.games (lesson_id, game_engine_id, config_json)
VALUES (:lesson_id, 1, 
    $${
        "title": "Grammar Typer: Present Continuous",
        "difficulty": "beginner",
        "points": 40,
        "time_per_problem": 20,
        "total_problems": 4,
        "problems": [
            {
                "question": "She ______ (run) in the park.",
                "answer": "is running",
                "hint": "Double the 'n'!"
            },
            {
                "question": "We ______ (dance) to the music.",
                "answer": "are dancing",
                "hint": "Drop the 'e'!"
            },
            {
                "question": "They ______ (swim) in the sea.",
                "answer": "are swimming",
                "hint": "Double the 'm'!"
            },
            {
                "question": "It ______ (rain) today.",
                "answer": "is raining",
                "hint": "Just add -ing."
            }
        ]
    }$$
);

-- Reset the sequences
SELECT setval('public.games_id_seq', (SELECT MAX(id) FROM public.games));

COMMIT;
