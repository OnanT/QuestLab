-- SQL script for Grade 3 Term III revision content: English Verbs

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 2 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

-- Find Topic ID for "English Grammar: Verb Tenses" (Topic 6)
SELECT id AS topic_id FROM topics WHERE title = 'English Grammar: Verb Tenses' LIMIT 1 \gset

/********************************************************************
 * CONCEPT: Simple Present Tense
 ********************************************************************/
INSERT INTO concepts (topic_id, title) VALUES (:topic_id, 'Simple Present Tense') RETURNING id AS concept_id_sp \gset

INSERT INTO lessons (
    concept_id, title, content_html, creator_id, organization_id,
    category, difficulty, estimated_time, points, grade_levels, 
    description, objectives, prerequisites, tags
) VALUES (
    :concept_id_sp,
    'Simple Present Tense: Everyday Actions',
    '<h2>Simple Present Tense: What we do every day!</h2><p>We use the simple present tense to talk about habits, routines, and facts.</p><h3>Rules:</h3><ul><li>For <strong>I, You, We, They</strong>: Use the base form of the verb. (I play)</li><li>For <strong>He, She, It</strong>: Add "-s" or "-es" to the base form. (She plays)</li></ul>',
    :teacher_id, :org_id, 'English Language', 'beginner', 30, 50, '3',
    'Learn how to talk about things that happen regularly.',
    'Identify and use simple present tense verbs correctly with different subjects.',
    'Basic knowledge of verbs.',
    'grammar,verbs,present-tense,english'
) RETURNING id AS lesson_id_sp \gset

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_sp, 'She ____ (walk) to school every day.', 'walk,walks,walking,walked', 'walks', 'We add -s for singular subjects like "She".'),
(:lesson_id_sp, 'They ____ (play) football on Saturdays.', 'play,plays,playing,played', 'play', 'Use the base form for plural subjects like "They".'),
(:lesson_id_sp, 'The sun ____ (rise) in the east.', 'rise,rises,rising,rose', 'rises', 'Facts use the simple present tense.'),
(:lesson_id_sp, 'I ____ (brush) my teeth twice a day.', 'brush,brushes,brushing,brushed', 'brush', 'Use the base form for the subject "I".'),
(:lesson_id_sp, 'He ____ (go) to the library.', 'go,goes,going,went', 'goes', 'Add -es for verbs ending in -o when the subject is He/She/It.');

/********************************************************************
 * CONCEPT: Simple Past Tense
 ********************************************************************/
INSERT INTO concepts (topic_id, title) VALUES (:topic_id, 'Simple Past Tense (Regular)') RETURNING id AS concept_id_past \gset

INSERT INTO lessons (
    concept_id, title, content_html, creator_id, organization_id,
    category, difficulty, estimated_time, points, grade_levels, 
    description, objectives, prerequisites, tags
) VALUES (
    :concept_id_past,
    'Simple Past Tense: What Happened Before!',
    '<h2>Simple Past Tense: Looking back!</h2><p>We use the simple past tense to talk about actions that are finished.</p><h3>Rules for Regular Verbs:</h3><ul><li>Most verbs: Add "-ed". (Walk -> Walked)</li><li>Verbs ending in -e: Just add "-d". (Like -> Liked)</li><li>Verbs ending in -y (preceded by a consonant): Change -y to -i and add -ed. (Cry -> Cried)</li></ul>',
    :teacher_id, :org_id, 'English Language', 'beginner', 30, 50, '3',
    'Learn how to talk about actions that happened in the past.',
    'Form the past tense of regular verbs correctly.',
    'Simple present tense.',
    'grammar,verbs,past-tense,english'
) RETURNING id AS lesson_id_past \gset

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_past, 'Yesterday, I ____ (walk) to the park.', 'walk,walks,walked,walking', 'walked', 'Regular verbs add -ed for the past tense.'),
(:lesson_id_past, 'He ____ (finish) his homework an hour ago.', 'finish,finishes,finished,finishing', 'finished', 'Add -ed to show the action is finished.'),
(:lesson_id_past, 'We ____ (live) in Nevis three years ago.', 'live,lived,lives,living', 'lived', 'For verbs ending in -e, just add -d.'),
(:lesson_id_past, 'She ____ (carry) the heavy bag.', 'carry,carrys,carried,carrying', 'carried', 'Change -y to -ied for verbs like "carry".'),
(:lesson_id_past, 'They ____ (jump) into the pool.', 'jump,jumps,jumped,jumping', 'jumped', 'Add -ed to the regular verb "jump".');

/********************************************************************
 * CONCEPT: Irregular Past Tense
 ********************************************************************/
INSERT INTO concepts (topic_id, title) VALUES (:topic_id, 'Irregular Past Tense') RETURNING id AS concept_id_irr \gset

INSERT INTO lessons (
    concept_id, title, content_html, creator_id, organization_id,
    category, difficulty, estimated_time, points, grade_levels, 
    description, objectives, prerequisites, tags
) VALUES (
    :concept_id_irr,
    'Irregular Past Tense: The Rule Breakers!',
    '<h2>Irregular Verbs: They don’t follow the rules!</h2><p>Some verbs do not add "-ed" in the past tense. You have to memorize them!</p><h3>Examples:</h3><ul><li>Go -> Went</li><li>See -> Saw</li><li>Eat -> Ate</li><li>Drink -> Drank</li><li>Run -> Ran</li></ul>',
    :teacher_id, :org_id, 'English Language', 'beginner', 30, 60, '3',
    'Learn common irregular verbs and their past tense forms.',
    'Identify and use irregular past tense verbs correctly.',
    'Simple past tense (regular).',
    'grammar,verbs,past-tense,irregular,english'
) RETURNING id AS lesson_id_irr \gset

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_irr, 'What is the past tense of "Go"?', 'goed,goes,went,gone', 'went', '"Go" is irregular. Its past tense is "went".'),
(:lesson_id_irr, 'Last night, we ____ (eat) delicious fish.', 'eated,eat,ate,eats', 'ate', '"Eat" becomes "ate" in the past tense.'),
(:lesson_id_irr, 'I ____ (see) a colorful bird this morning.', 'see,seed,saw,seen', 'saw', '"See" becomes "saw" in the past tense.'),
(:lesson_id_irr, 'He ____ (run) very fast in the race.', 'runed,ran,runs,running', 'ran', '"Run" becomes "ran" in the past tense.'),
(:lesson_id_irr, 'They ____ (buy) a new car last month.', 'buyed,bought,buys,buying', 'bought', '"Buy" becomes "bought" in the past tense.');

/********************************************************************
 * CONCEPT: Past Continuous Tense
 ********************************************************************/
INSERT INTO concepts (topic_id, title) VALUES (:topic_id, 'Past Continuous Tense') RETURNING id AS concept_id_pc \gset

INSERT INTO lessons (
    concept_id, title, content_html, creator_id, organization_id,
    category, difficulty, estimated_time, points, grade_levels, 
    description, objectives, prerequisites, tags
) VALUES (
    :concept_id_pc,
    'Past Continuous Tense: Actions in Progress in the Past',
    '<h2>Past Continuous: What was happening?</h2><p>We use the past continuous to talk about actions that were happening at a specific time in the past.</p><h3>The Formula:</h3><div style="background: #fdf2f8; padding: 15px; border-radius: 10px; border: 1px solid #fbcfe8; margin-bottom: 20px;"><strong>Subject + was/were + verb + -ing</strong></div><ul><li><strong>I, He, She, It:</strong> was + verb-ing</li><li><strong>You, We, They:</strong> were + verb-ing</li></ul>',
    :teacher_id, :org_id, 'English Language', 'beginner', 30, 60, '3',
    'Learn how to describe ongoing actions in the past.',
    'Form past continuous sentences correctly using was/were.',
    'Simple past and present continuous.',
    'grammar,verbs,past-continuous,english'
) RETURNING id AS lesson_id_pc \gset

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_pc, 'At 8 PM last night, I ____ (read) a book.', 'was reading,were reading,is reading,read', 'was reading', 'For "I", we use "was reading".'),
(:lesson_id_pc, 'They ____ (dance) when the music stopped.', 'was dancing,were dancing,is dancing,danced', 'were dancing', 'For "They", we use "were dancing".'),
(:lesson_id_pc, 'She ____ (sleep) when the phone rang.', 'was sleeping,were sleeping,is sleeping,sleeps', 'was sleeping', 'For "She", we use "was sleeping".'),
(:lesson_id_pc, 'What ____ you ____ (do) yesterday morning?', 'was...doing,were...doing,is...doing,did...do', 'were...doing', 'For "You", we use "were".'),
(:lesson_id_pc, 'The dog ____ (bark) loudly at the postman.', 'was barking,were barking,is barking,barked', 'was barking', 'For singular "The dog", we use "was barking".');

/********************************************************************
 * CONCEPT: Subject-Verb Agreement
 ********************************************************************/
INSERT INTO concepts (topic_id, title) VALUES (:topic_id, 'Subject-Verb Agreement') RETURNING id AS concept_id_sva \gset

INSERT INTO lessons (
    concept_id, title, content_html, creator_id, organization_id,
    category, difficulty, estimated_time, points, grade_levels, 
    description, objectives, prerequisites, tags
) VALUES (
    :concept_id_sva,
    'Subject-Verb Agreement: Perfect Pairs!',
    '<h2>Subject-Verb Agreement: Matching your subjects and verbs!</h2><p>The subject and verb in a sentence must "agree" or match in number.</p><h3>Key Rules:</h3><ul><li><strong>Singular subjects</strong> need singular verbs (often ending in -s).<br><em>The bird sings.</em></li><li><strong>Plural subjects</strong> need plural verbs (no -s).<br><em>The birds sing.</em></li></ul>',
    :teacher_id, :org_id, 'English Language', 'beginner', 30, 60, '3',
    'Learn the fundamental rules of matching subjects with their correct verb forms.',
    'Identify and apply subject-verb agreement rules in sentences.',
    'Simple present tense.',
    'grammar,verbs,agreement,english'
) RETURNING id AS lesson_id_sva \gset

INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_sva, 'The apple ____ (fall) from the tree.', 'fall,falls,falling,fell', 'falls', '"Apple" is singular, so we use "falls".'),
(:lesson_id_sva, 'The children ____ (play) in the garden.', 'play,plays,playing,played', 'play', '"Children" is plural, so we use "play".'),
(:lesson_id_sva, 'My cat ____ (meow) for food.', 'meow,meows,meowing,meowed', 'meows', 'Singular subject "cat" needs "meows".'),
(:lesson_id_sva, 'We ____ (love) ice cream.', 'love,loves,loving,loved', 'love', '"We" is plural, so we use "love".'),
(:lesson_id_sva, 'She ____ (know) the answer.', 'know,knows,knowing,knew', 'knows', '"She" is singular, so we use "knows".');

-- Finalize
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
