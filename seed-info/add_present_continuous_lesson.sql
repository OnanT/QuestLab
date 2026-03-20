/********************************************************************
 *  add_present_continuous_lesson.sql
 *
 *  Inserts a complete lesson (topic → concept → lesson → quizzes)
 *  for the “Present Continuous Tense”.
 ********************************************************************/

BEGIN;

-- STEP 0: Find appropriate IDs
-- Find a teacher (ms_johnson) or any admin/teacher
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset

-- Find curriculum_subject_id for St. Kitts & Nevis + English Language + Grade 3
SELECT id AS curriculum_subject_id FROM curriculum_subjects 
WHERE (subject_id = 2 AND country_id = 1 AND grade_level = 3)
OR TRUE
LIMIT 1 \gset

-- Find latest term_id for term_number 1
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset

-- Find organization
SELECT id AS organization_id FROM organizations LIMIT 1 \gset

/********************************************************************
 *  STEP 2 –  Insert the Topic
 ********************************************************************/
INSERT INTO public.topics (curriculum_subject_id, term_id, title)
VALUES (:curriculum_subject_id, :term_id,
        'English Grammar: Verb Tenses')
ON CONFLICT (curriculum_subject_id, term_id, title) DO UPDATE SET title = EXCLUDED.title
RETURNING id AS topic_id \gset


/********************************************************************
 *  STEP 3 –  Insert the Concept that belongs to the Topic
 ********************************************************************/
INSERT INTO public.concepts (topic_id, title)
VALUES (:topic_id, 'Present Continuous Tense (Action Now)')
RETURNING id AS concept_id \gset


/********************************************************************
 *  STEP 4 –  Insert the Lesson
 ********************************************************************/
INSERT INTO public.lessons (
    concept_id, title, content_html, creator_id, organization_id,
    category, difficulty, estimated_time, points,
    grade_levels, description, objectives, prerequisites, tags
) VALUES (
    :concept_id,
    'Mastering the Present Continuous Tense',
    $$<h2>The Present Continuous Tense: What is happening right now?</h2>
<p><strong>Grade Level:</strong> 3‑5&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Duration:</strong> 45 minutes</p>

<h3>Learning Objectives</h3>
<ul>
<li>Understand when to use the present continuous tense.</li>
<li>Form the tense correctly using <em>am/is/are</em> + <em>verb-ing</em>.</li>
<li>Identify spelling changes when adding "-ing".</li>
<li>Differentiate between the simple present and present continuous.</li>
</ul>

<h3>1. What is the Present Continuous?</h3>
<p>We use the present continuous tense to talk about actions that are <strong>happening right now</strong>, at the very moment we are speaking.</p>
<p><em>Example:</em> "I <strong>am reading</strong> a lesson on the computer."</p>

<h3>2. How to Form it</h3>
<p>The formula is simple:</p>
<div style="background: #f0fdf4; padding: 15px; border-radius: 10px; border: 1px solid #bbf7d0; margin-bottom: 20px;">
    <strong>Subject + am/is/are + verb + -ing</strong>
</div>

<table>
<tr><th>Subject</th><th>Helping Verb (To Be)</th><th>Verb + -ing</th></tr>
<tr><td>I</td><td>am</td><td>eating</td></tr>
<tr><td>He / She / It</td><td>is</td><td>playing</td></tr>
<tr><td>You / We / They</td><td>are</td><td>running</td></tr>
</table>

<h3>3. Spelling Rules for "-ing"</h3>
<p>Most verbs just add "-ing", but watch out for these special cases:</p>
<ul>
<li><strong>Verbs ending in -e:</strong> Drop the 'e' and add -ing. (e.g., Make -> Making)</li>
<li><strong>Verbs ending in CVC (Consonant-Vowel-Consonant):</strong> Double the last consonant. (e.g., Sit -> Sitting, Run -> Running)</li>
<li><strong>Most other verbs:</strong> Just add -ing. (e.g., Walk -> Walking, Read -> Reading)</li>
</ul>

<h3>4. Signal Words</h3>
<p>When you see these words in a sentence, it's a big hint that you should use the present continuous:</p>
<ul>
<li>Now</li>
<li>At the moment</li>
<li>Right now</li>
<li>Look! / Listen!</li>
</ul>

<h3>Guided Practice</h3>
<p>Look around the room. What are people doing? Write three sentences using the present continuous.</p>
<ol>
<li>My friend __________ (draw) a picture.</li>
<li>The teacher __________ (talk) to the class.</li>
<li>We __________ (learn) about grammar.</li>
</ol>

<p><strong>Remember:</strong> Don't forget the helping verb (am, is, or are)! Without it, your sentence is incomplete.</p>
$$,
    :teacher_id,                     -- creator_id
    :organization_id,               -- organization_id
    'English Language',              -- category
    'beginner',                      -- difficulty
    45,                              -- estimated_time
    60,                              -- points
    '3-5',                           -- grade_levels
    'Learn how to talk about actions happening right now using am/is/are + verb-ing.',
    'Form present continuous sentences, follow spelling rules for -ing, identify signal words.',
    'Knowledge of the verb "to be" in simple present.',
    'grammar,verbs,present-continuous,english'
)
RETURNING id AS lesson_id \gset


/********************************************************************
 *  STEP 5 –  Insert 5 Quizzes
 ********************************************************************/
INSERT INTO public.quizzes (
    lesson_id, question, question_type, options,
    correct_answer, explanation, points, difficulty,
    time_limit, tags
) VALUES
    (:lesson_id,
     'Which helping verb goes with the subject "They" in the present continuous tense?',
     'mc_single',
     'am,is,are,be',
     'are',
     'We use "are" for plural subjects like "They", "We", and "You".',
     10, 'beginner', 0, 'helping-verbs'),

    (:lesson_id,
     'What is the correct "-ing" spelling for the verb "make"?',
     'mc_single',
     'makeing,making,makesing,makking',
     'making',
     'For verbs ending in "e", we drop the "e" before adding "-ing".',
     10, 'beginner', 0, 'spelling'),

    (:lesson_id,
     'Which sentence is in the present continuous tense?',
     'mc_single',
     'I eat an apple.,I ate an apple.,I am eating an apple.,I will eat an apple.',
     'I am eating an apple.',
     'The present continuous follows the pattern: Subject + am/is/are + verb-ing.',
     10, 'beginner', 0, 'identification'),

    (:lesson_id,
     'Choose the correct form of the verb "run" for this sentence: "Look! The dog _______ away."',
     'mc_single',
     'is runing,is running,are running,runs',
     'is running',
     'The dog is a singular subject (it), so we use "is". "Run" doubles the "n" (running).',
     10, 'beginner', 0, 'spelling,verbs'),

    (:lesson_id,
     'Which of these is a signal word for the present continuous tense?',
     'mc_single',
     'yesterday,always,at the moment,last week',
     'at the moment',
     '"At the moment" indicates that the action is happening right now.',
     10, 'beginner', 0, 'signal-words');


/********************************************************************
 *  STEP 6 –  Reset the sequences
 ********************************************************************/
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
