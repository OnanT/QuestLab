-- SQL script for Grade 3 Term III revision content: English Writing & Spelling

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 2 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

/********************************************************************
 * TOPIC: Composition & Writing
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'English Composition & Writing')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_writing FROM topics WHERE title = 'English Composition & Writing' LIMIT 1 \gset

-- 1. Descriptive Writing
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_writing, 'Descriptive Writing') RETURNING id AS concept_id_desc \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_desc, 'Painting with Words: Descriptive Writing', '<h2>Descriptive Writing: Use your senses!</h2><p>Descriptive writing helps the reader "see", "hear", "smell", "taste", and "feel" what you are writing about.</p><h3>The 5 Senses:</h3><ul><li><strong>Sight:</strong> What does it look like? (Colors, size, shape)</li><li><strong>Sound:</strong> What does it sound like? (Quiet, loud, buzzing)</li><li><strong>Smell:</strong> What does it smell like? (Sweet, fresh, stinky)</li><li><strong>Taste:</strong> What does it taste like? (Sour, sugary, salty)</li><li><strong>Touch:</strong> What does it feel like? (Rough, smooth, soft)</li></ul><h3>Adjectives:</h3><p>Use "wow" words! Instead of "big", use "enormous". Instead of "nice", use "wonderful".</p>', :teacher_id, :org_id, 'English Language', 'beginner', 60, '3', 'Learn how to use sensory details and adjectives to write descriptively.', 'Identify sensory details and use adjectives to describe objects or scenes.', 'composition,writing,descriptive,english')
RETURNING id AS lesson_id_desc \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_desc, 'Descriptive writing uses the 5 ____.', 'fingers,senses,toes,rules', 'senses', 'Sight, sound, smell, taste, and touch are the 5 senses.'),
(:lesson_id_desc, 'Which word is a descriptive adjective?', 'run,blue,and,is', 'blue', '"Blue" describes how something looks.'),
(:lesson_id_desc, 'Which sense is used in this sentence: "The bell rang loudly"?', 'Sight,Sound,Smell,Taste', 'Sound', 'It describes what was heard.'),
(:lesson_id_desc, 'Which word makes this sentence more descriptive: "The ____ kitten purred."', 'a,fluffy,one,the', 'fluffy', '"Fluffy" describes how the kitten feels and looks.'),
(:lesson_id_desc, 'To describe a lemon, you would use the sense of ____.', 'Hearing,Taste,Smell,Both Taste and Smell', 'Both Taste and Smell', 'Lemons have a strong taste (sour) and smell (citrus).');

/********************************************************************
 * TOPIC: Spelling Rules
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'English Spelling Mastery')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_spelling FROM topics WHERE title = 'English Spelling Mastery' LIMIT 1 \gset

-- 1. Common Spelling Rules
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_spelling, 'Essential Spelling Rules') RETURNING id AS concept_id_spell \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_spell, 'Spelling Secrets: Rules to Remember', '<h2>Spelling Rules: Level Up your Writing!</h2><p>Rules help us spell words correctly even when they are tricky.</p><h3>Rule 1: Magic E</h3><p>When "e" is at the end, it makes the vowel say its name.<br><em>Example: Hop -> Hope, Kit -> Kite</em></p><h3>Rule 2: Doubling Consonants</h3><p>If a word is 1 syllable and ends in CVC (Consonant-Vowel-Consonant), double the last letter before adding -ing.<br><em>Example: Run -> Running, Sit -> Sitting</em></p><h3>Rule 3: Dropping the E</h3><p>If a word ends in "e", drop it before adding -ing.<br><em>Example: Bake -> Baking, Smile -> Smiling</em></p>', :teacher_id, :org_id, 'English Language', 'beginner', 60, '3', 'Learn foundational spelling rules for Grade 3.', 'Apply spelling rules for magic e, doubling consonants, and dropping e.', 'spelling,rules,english')
RETURNING id AS lesson_id_spell \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_spell, 'What is the correct spelling: "We are ____ (bake) a cake."', 'bakeing,baking,bakking,bakes', 'baking', 'Drop the "e" before adding -ing.'),
(:lesson_id_spell, 'Double the last letter for this word: "swimming" comes from...', 'swim,swime,swimm,swimes', 'swim', 'Swim (CVC) becomes Swimming.'),
(:lesson_id_spell, 'The "magic e" in "kite" makes the "i" sound...', 'short,long,silent,loud', 'long', 'Magic E makes the vowel say its name (long sound).'),
(:lesson_id_spell, 'Which word is spelled correctly?', 'running,runing,runingg,runen', 'running', 'Double the "n" in run before adding -ing.'),
(:lesson_id_spell, 'Correct spelling of: "hope" + "ing"?', 'hopeing,hoping,hoppping,hopes', 'hoping', 'Drop the "e" in hope before adding -ing.');

-- Finalize
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
