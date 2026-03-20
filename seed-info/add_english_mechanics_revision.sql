-- SQL script for Grade 3 Term III revision content: English Mechanics

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 2 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

-- Insert/Find Topic ID for "English Mechanics"
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'English Mechanics: Punctuation & Capitalization')
ON CONFLICT DO NOTHING;

SELECT id AS topic_id FROM topics WHERE title = 'English Mechanics: Punctuation & Capitalization' LIMIT 1 \gset

/********************************************************************
 * CONCEPT: Capital Letters
 ********************************************************************/
INSERT INTO concepts (topic_id, title) VALUES (:topic_id, 'Capital Letters') RETURNING id AS concept_id_cap \gset

INSERT INTO lessons (
    concept_id, title, content_html, creator_id, organization_id,
    category, difficulty, estimated_time, points, grade_levels, 
    description, objectives, prerequisites, tags
) VALUES (
    :concept_id_cap,
    'The Power of Capital Letters',
    '<h2>Capital Letters: When to use them?</h2><p>Capital letters are like "VIP" markers for words. They tell us which words are important!</p><h3>Always capitalize:</h3><ul><li>The first word of a sentence. (<strong>T</strong>he sun is out.)</li><li>The word "I". (He and <strong>I</strong> are friends.)</li><li>Proper nouns: names of people, places, days, and months. (<strong>S</strong>t. <strong>K</strong>itts, <strong>N</strong>evis, <strong>A</strong>lexander <strong>H</strong>amilton, <strong>M</strong>onday, <strong>J</strong>anuary.)</li></ul>',
    :teacher_id, :org_id, 'English Language', 'beginner', 20, 40, '3',
    'Learn the rules for using capital letters in sentences.',
    'Identify words that need capitalization and apply the rules correctly.',
    'Basic reading and writing skills.',
    'mechanics,capitalization,english'
) RETURNING id AS lesson_id_cap \gset

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_cap, 'Which word should always be capitalized?', 'apple,i,run,fast', 'i', 'The word "I" is always a capital letter when referring to yourself.'),
(:lesson_id_cap, 'Which of these is a proper noun that needs a capital letter?', 'island,st. kitts,beach,ocean', 'st. kitts', 'Names of specific places (proper nouns) like "St. Kitts" must be capitalized.'),
(:lesson_id_cap, 'Where should the capital letter go: "my name is tom."', 'My,Tom,Both My and Tom,none', 'Both My and Tom', 'Capitalize the first word of a sentence (My) and names (Tom).'),
(:lesson_id_cap, 'Is the month "january" written correctly?', 'Yes,No', 'No', 'Months must start with a capital letter (January).'),
(:lesson_id_cap, 'Correct this sentence: "we live in nevis."', 'We live in Nevis.,we live in Nevis.,We live in nevis.,WE LIVE IN NEVIS.', 'We live in Nevis.', 'Capitalize "We" (start of sentence) and "Nevis" (proper noun).');

/********************************************************************
 * CONCEPT: Punctuation Marks
 ********************************************************************/
INSERT INTO concepts (topic_id, title) VALUES (:topic_id, 'Punctuation Marks (.,!?)') RETURNING id AS concept_id_punc \gset

INSERT INTO lessons (
    concept_id, title, content_html, creator_id, organization_id,
    category, difficulty, estimated_time, points, grade_levels, 
    description, objectives, prerequisites, tags
) VALUES (
    :concept_id_punc,
    'Punctuation: The Traffic Lights of Writing',
    '<h2>Punctuation Marks: Helping us read better!</h2><p>Punctuation marks tell us when to stop, slow down, or show excitement.</p><h3>The Big Four:</h3><ul><li><strong>Full Stop (.)</strong>: Used at the end of a statement. (I like fish<strong>.</strong>)</li><li><strong>Question Mark (?)</strong>: Used when asking something. (Where are you going<strong>?</strong>)</li><li><strong>Exclamation Mark (!)</strong>: Used for strong feelings or shouting. (Look out<strong>!</strong>)</li><li><strong>Comma (,)</strong>: Used to pause or separate items in a list. (I like apples<strong>,</strong> bananas<strong>,</strong> and grapes.)</li></ul>',
    :teacher_id, :org_id, 'English Language', 'beginner', 25, 40, '3',
    'Learn the common punctuation marks and their uses.',
    'Identify and use full stops, question marks, exclamation marks, and commas correctly.',
    'Basic sentence structure.',
    'mechanics,punctuation,english'
) RETURNING id AS lesson_id_punc \gset

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_punc, 'Which mark ends a question?', '.,?,!, ,', '?', 'We use a question mark (?) when we ask something.'),
(:lesson_id_punc, 'What do we use for a big surprise or excitement?', '.,?,!, ,', '!', 'An exclamation mark (!) shows strong emotion.'),
(:lesson_id_punc, 'Use a ____ to separate a list of things.', '.,?,!, ,', ',', 'Commas (,) separate items in a list.'),
(:lesson_id_punc, 'Which sentence is punctuated correctly?', 'What time is it.,What time is it!,What time is it?,What time is it', 'What time is it?', 'Questions must end with a question mark.'),
(:lesson_id_punc, 'Where does the full stop go?', 'At the beginning,In the middle,At the end,Nowhere', 'At the end', 'Full stops (.) mark the end of a statement.');

-- Finalize
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
