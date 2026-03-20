/********************************************************************
 *  add_ant_grasshopper_lesson_dynamic.sql
 *
 *  Inserts a complete lesson (topic → concept → lesson → quizzes)
 *  for the “The Ant and the Grasshopper – Future Tense Verbs”.
 *
 *  Dynamic version: Finds appropriate IDs for teacher, curriculum, and term.
 ********************************************************************/

BEGIN;

-- STEP 0: Find appropriate IDs
-- Find a teacher (ms_johnson) or any admin/teacher
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset

-- Find curriculum_subject_id for St. Kitts & Nevis + English Language + Grade 3
-- If not found, just take the first one available to avoid failure
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
        'Future‑Tense Verbs (Ant & Grasshopper)')
ON CONFLICT (curriculum_subject_id, term_id, title) DO UPDATE SET title = EXCLUDED.title
RETURNING id AS topic_id \gset


/********************************************************************
 *  STEP 3 –  Insert the Concept that belongs to the Topic
 ********************************************************************/
INSERT INTO public.concepts (topic_id, title)
VALUES (:topic_id, 'The Ant and the Grasshopper – Future‑Tense Verbs')
RETURNING id AS concept_id \gset


/********************************************************************
 *  STEP 4 –  Insert the Lesson (HTML version of the DOCX)
 ********************************************************************/
INSERT INTO public.lessons (
    concept_id, title, content_html, creator_id, organization_id,
    category, difficulty, estimated_time, points,
    grade_levels, description, objectives, prerequisites, tags
) VALUES (
    :concept_id,
    'The Ant and the Grasshopper – Future‑Tense Verbs',
    $$<h2>The Ant and the Grasshopper: Using Future Tense Verbs</h2>
<p><strong>Grade Level:</strong> 3‑4&nbsp;&nbsp;|&nbsp;&nbsp;<strong>Duration:</strong> 40‑45 minutes</p>

<h3>Learning Objectives</h3>
<ul>
<li>Identify future‑tense verbs in a story</li>
<li>Form future tense using “will” + base verb</li>
<li>Use “going to” to express future plans</li>
<li>Create sentences about future events using correct verb forms</li>
</ul>

<h3>Materials</h3>
<ul>
<li>The worksheet (Ant and Grasshopper story)</li>
<li>Pencil / eraser</li>
<li>Whiteboard or chart paper</li>
<li>Markers in different colors</li>
<li>Optional: pictures of an ant and a grasshopper</li>
</ul>

<h3>Warm‑Up (5 min)</h3>
<p><em>Teacher says:</em> “Today we are going to talk about things that haven’t happened yet — things we will do in the future.”</p>
<p><strong>Ask students:</strong></p>
<ul>
<li>What will you do after school today?</li>
<li>What will you eat for dinner tonight?</li>
<li>What are you going to do this weekend?</li>
</ul>
<p>Write a couple of answers on the board and underline the future‑tense verb.</p>

<h4>Example</h4>
<blockquote>
<p>I <u>will play</u> football. 
I <u>am going to eat</u> pizza.</p>
</blockquote>

<h3>Mini Lesson 1 – Future Tense with “Will” (10 min)</h3>
<p><strong>Pattern:</strong> will + base verb</p>
<table>
<tr><th>Base verb</th><th>Future (will)</th></tr>
<tr><td>work</td><td>will work</td></tr>
<tr><td>dance</td><td>will dance</td></tr>
<tr><td>gather</td><td>will gather</td></tr>
<tr><td>sing</td><td>will sing</td></tr>
<tr><td>have</td><td>will have</td></tr>
</table>
<p>Note: the verb after “will” stays in its base form (no –ed, –ing, –s).</p>

<h3>Guided Practice – Story Paragraph (10 min)</h3>
<p>Read the story aloud and fill in the blanks with “will” + base verb.</p>
<pre>
The Ant and the Grasshopper

One summer day, Grasshopper ______ (dance) and ______ (sing) in the field. …
Ant replies, “I ______ (gather) food for winter. You ______ (need) food too when winter comes.”
Grasshopper laughs, “Winter is far away! I ______ (worry) about that later. Right now, I ______ (enjoy) the sunshine!”
When winter arrives, Grasshopper ______ (be) cold and hungry.
Ant ______ (have) plenty of food to eat.
</pre>

<h3>Mini Lesson 2 – “Going to” for Future Plans (5 min)</h3>
<p><strong>Pattern:</strong> am/is/are + going to + base verb</p>
<ul>
<li>I am going to study tonight.</li>
<li>She is going to visit her grandmother.</li>
<li>They are going to play football after school.</li>
</ul>

<h3>Independent Practice (10 min)</h3>
<p><strong>Exercise 1 – Change to Future Tense with “Will”</strong></p>
<ol>
<li>The ant works hard. → __________</li>
<li>The grasshopper sings a song. → __________</li>
<li>Winter comes soon. → __________</li>
<li>I gather food. → __________</li>
<li>They dance in the field. → __________</li>
</ol>

<p><strong>Exercise 2 – Complete with “Going to”</strong></p>
<ol>
<li>I ______ (study) for my test tomorrow.</li>
<li>The grasshopper ______ (be) hungry in winter.</li>
<li>We ______ (visit) the zoo next week.</li>
<li>She ______ (help) her mother today.</li>
<li>They ______ (play) outside after lunch.</li>
</ol>

<h3>Closing Activity – Future Plans Share (5 min)</h3>
<p>Students share sentences such as:</p>
<ul>
<li>“This weekend I will ___.”</li>
<li>“Next year I am going to ___.”</li>
<li>“When I grow up I will ___.”</li>
</ul>

<h3>Assessment & Differentiation</h3>
<p>Formative checks during guided practice, worksheet review, and oral sharing.</p>

<h3>Key Vocabulary</h3>
<table>
<tr><th>Word</th><th>Meaning</th></tr>
<tr><td>Future tense</td><td>Verb form that talks about actions that haven’t happened yet</td></tr>
<tr><td>Will</td><td>Helper word used to make future tense (will + base verb)</td></tr>
<tr><td>Going to</td><td>Phrase used to talk about future plans or intentions</td></tr>
<tr><td>Base verb</td><td>The simple form of a verb (no -ed, -ing, or -s)</td></tr>
</table>

<p><strong>Moral of the Story:</strong> “It is best to prepare for the future and work hard today. What we do today will affect what happens tomorrow!”</p>

<p><em>Homework (optional):</em> Write five sentences about what you will do to prepare for your future, using both “will” and “going to”.</p>
$$,
    :teacher_id,                     -- creator_id
    :organization_id,               -- organization_id
    'Language Arts',                 -- category
    'beginner',                      -- difficulty
    40,                              -- estimated_time
    50,                              -- points
    '3-4',                           -- grade_levels
    'Teach future‑tense verbs using the Ant & Grasshopper story.',
    'Identify future‑tense verbs, form “will” + base verb, use “going to” for plans, write future‑tense sentences.',
    'Students must know present‑tense verb forms.',
    'future‑tense,will,going to,grammar,ant,grasshopper'
)
RETURNING id AS lesson_id \gset


/********************************************************************
 *  STEP 5 –  Insert quizzes that align with the lesson objectives.
 ********************************************************************/
INSERT INTO public.quizzes (
    lesson_id, question, question_type, options,
    correct_answer, explanation, points, difficulty,
    time_limit, image_url, audio_url, tags
) VALUES
    (:lesson_id,
     'Which word signals a future‑tense verb in the sentence “I will play football”?',
     'mc_single',
     'will,am,does,has',
     'will',
     '“Will” + base verb is the standard future‑tense pattern.',
     10, 'beginner', 0, '', '', 'future,will'),

    (:lesson_id,
     'Select the correct future‑tense form of the base verb “dance”.',
     'mc_single',
     'will dances,will danced,will dance,will dancing',
     'will dance',
     'After “will” the verb stays in its base form (no -s, -ed, -ing).',
     10, 'beginner', 0, '', '', 'future,will,dance'),

    (:lesson_id,
     'Which phrase expresses a future plan that has already been decided?',
     'mc_single',
     'will go,am going to,goes,going will',
     'am going to',
     '“Going to” is used for plans/intensions that are already decided.',
     10, 'beginner', 0, '', '', 'future,going to,plan'),

    (:lesson_id,
     'Choose the correct “going to” sentence for the subject “She”.',
     'mc_single',
     'She going to study,She is going to study,She will going to study,She will study',
     'She is going to study',
     'The pattern is am/is/are + going to + base verb.',
     10, 'beginner', 0, '', '', 'future,going to,she');


/********************************************************************
 *  STEP 6 –  Reset the sequences
 ********************************************************************/
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
