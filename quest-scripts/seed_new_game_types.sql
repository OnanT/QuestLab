-- Seed MemoryMatch Game for Lesson 4 (Fractions)
INSERT INTO games (lesson_id, game_engine_id, config_json)
SELECT 4, 15, '{
  "grid_size": 12,
  "time_limit": 120,
  "pairs": [
    { "id": 1, "a": "1/2", "b": "0.5" },
    { "id": 2, "a": "1/4", "b": "0.25" },
    { "id": 3, "a": "3/4", "b": "0.75" },
    { "id": 4, "a": "1/5", "b": "0.2" },
    { "id": 5, "a": "2/5", "b": "0.4" },
    { "id": 6, "a": "1/10", "b": "0.1" }
  ]
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM games WHERE lesson_id = 4 AND game_engine_id = 15);

-- Seed SentenceBuilder Game for Lesson 11 (Simple Present Tense)
INSERT INTO games (lesson_id, game_engine_id, config_json)
SELECT 11, 16, '{
  "time_limit": 120,
  "prompts": [
    { "target": "The sun rises in the east", "shuffled": ["east", "rises", "the", "sun", "in", "The"], "hint": "Where does the sun come from?" },
    { "target": "She eats an apple every day", "shuffled": ["apple", "day", "every", "eats", "She", "an"], "hint": "Healthy habit" },
    { "target": "Birds fly in the sky", "shuffled": ["fly", "Birds", "sky", "the", "in"], "hint": "Action in the air" }
  ]
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM games WHERE lesson_id = 11 AND game_engine_id = 16);

-- Seed BucketSort Game for Lesson 3 (Writing)
INSERT INTO games (lesson_id, game_engine_id, config_json)
SELECT 3, 17, '{
  "time_limit": 120,
  "buckets": [
    { "id": "strong", "label": "Strong Hooks" },
    { "id": "weak", "label": "Weak Hooks" }
  ],
  "items": [
    { "text": "Once upon a time, there was a dog.", "bucketId": "weak", "hint": "A bit cliché, isn''t it?" },
    { "text": "Imagine a world where gravity worked in reverse.", "bucketId": "strong", "hint": "Makes you wonder!" },
    { "text": "I am going to tell you about my summer vacation.", "bucketId": "weak", "hint": "Too direct and boring." },
    { "text": "The clock struck thirteen, but the sun was still high.", "bucketId": "strong", "hint": "Something is wrong here..." },
    { "text": "My favorite food is pizza because it tastes good.", "bucketId": "weak", "hint": "Not very engaging." },
    { "text": "It was a dark and stormy night.", "bucketId": "weak", "hint": "The most overused hook ever." }
  ]
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM games WHERE lesson_id = 3 AND game_engine_id = 17);
