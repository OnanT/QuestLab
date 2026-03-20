-- ============================================================================
-- QUESTLAB CLEAN SEED DATA
-- Educational Platform for Nevis and Dominica
-- Run this AFTER questlab_full.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. COUNTRIES
-- ============================================================================
INSERT INTO countries (name) VALUES 
('Nevis'),
('Dominica')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. SUBJECTS
-- ============================================================================
INSERT INTO subjects (name) VALUES 
('Mathematics'),
('English Language'),
('Science'),
('Social Studies'),
('History'),
('Geography'),
('Caribbean Studies')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. SCHOOL YEARS
-- ============================================================================
INSERT INTO school_years (country_id, year_label) 
SELECT c.id, grade
FROM countries c
CROSS JOIN (VALUES 
    ('Grade 3'), ('Grade 4'), ('Grade 5'), ('Grade 6')
) AS grades(grade)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. TERMS
-- ============================================================================
INSERT INTO terms (school_year_id, term_number, title)
SELECT sy.id, term_num, term_title
FROM school_years sy
CROSS JOIN (VALUES 
    (1, 'Term 1 - September to December'),
    (2, 'Term 2 - January to March'),
    (3, 'Term 3 - April to June')
) AS terms(term_num, term_title)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. CURRICULUM SUBJECTS (link subjects to countries and grades)
-- ============================================================================
INSERT INTO curriculum_subjects (country_id, subject_id, grade_level)
SELECT c.id, s.id, grade
FROM countries c
CROSS JOIN subjects s
CROSS JOIN generate_series(3, 6) AS grade
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. GAME ENGINES (Must come before games are created)
-- ============================================================================
INSERT INTO game_engines (name) VALUES
('SkillBuilder'),
('QuizBattle'),
('StoryQuest'),
('MapChallenge')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. USERS (Must come before lessons, progress, rewards)
-- ============================================================================
INSERT INTO users (username, email, hashed_password, role, points, level, display_name) VALUES
('admin', 'admin@questlab.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oCOZ8fxI73qG', 'admin', 1000, 'Administrator', 'System Admin'),
('teacher_nevis', 'teacher@nevis.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oCOZ8fxI73qG', 'teacher', 500, 'Master Educator', 'Ms. Williams'),
('teacher_dominica', 'teacher@dominica.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oCOZ8fxI73qG', 'teacher', 450, 'Senior Educator', 'Mr. Baptiste'),
('student_alex', 'alex@student.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oCOZ8fxI73qG', 'student', 250, 'Explorer', 'Alex Johnson'),
('student_maria', 'maria@student.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oCOZ8fxI73qG', 'student', 180, 'Navigator', 'Maria Rodriguez')
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- 8. TOPICS
-- ============================================================================

-- Topics for Grade 3 English Language (Nevis)
WITH nevis_english_grade3 AS (
    SELECT cs.id as curriculum_subject_id
    FROM curriculum_subjects cs
    JOIN countries c ON cs.country_id = c.id
    JOIN subjects s ON cs.subject_id = s.id
    WHERE c.name = 'Nevis'
    AND s.name = 'English Language'
    AND cs.grade_level = 3
),
terms_list AS (
    SELECT t.id as term_id, t.term_number
    FROM terms t
    JOIN school_years sy ON t.school_year_id = sy.id
    JOIN countries c ON sy.country_id = c.id
    WHERE c.name = 'Nevis'
    AND sy.year_label = 'Grade 3'
)
INSERT INTO topics (curriculum_subject_id, term_id, title)
SELECT 
    nevis_english_grade3.curriculum_subject_id,
    terms_list.term_id,
    topic_title
FROM nevis_english_grade3
CROSS JOIN terms_list
CROSS JOIN (VALUES
    (1, 'Reading Comprehension'),
    (1, 'Writing Skills'),
    (2, 'Grammar and Punctuation'),
    (2, 'Vocabulary Building'),
    (3, 'Creative Writing'),
    (3, 'Poetry and Literature')
) AS topics(for_term, topic_title)
WHERE terms_list.term_number = topics.for_term
ON CONFLICT DO NOTHING;

-- Topics for Grade 5 Mathematics (Nevis)
WITH nevis_math_grade5 AS (
    SELECT cs.id as curriculum_subject_id
    FROM curriculum_subjects cs
    JOIN countries c ON cs.country_id = c.id
    JOIN subjects s ON cs.subject_id = s.id
    WHERE c.name = 'Nevis'
    AND s.name = 'Mathematics'
    AND cs.grade_level = 5
),
terms_list AS (
    SELECT t.id as term_id, t.term_number
    FROM terms t
    JOIN school_years sy ON t.school_year_id = sy.id
    JOIN countries c ON sy.country_id = c.id
    WHERE c.name = 'Nevis'
    AND sy.year_label = 'Grade 5'
)
INSERT INTO topics (curriculum_subject_id, term_id, title)
SELECT 
    nevis_math_grade5.curriculum_subject_id,
    terms_list.term_id,
    topic_title
FROM nevis_math_grade5
CROSS JOIN terms_list
CROSS JOIN (VALUES
    (1, 'Fractions and Decimals'),
    (1, 'Operations with Fractions'),
    (2, 'Basic Algebra'),
    (2, 'Geometry - Shapes and Angles'),
    (3, 'Measurement and Data'),
    (3, 'Problem Solving')
) AS topics(for_term, topic_title)
WHERE terms_list.term_number = topics.for_term
ON CONFLICT DO NOTHING;

-- Topics for Caribbean Studies (Dominica)
WITH dominica_caribbean AS (
    SELECT cs.id as curriculum_subject_id
    FROM curriculum_subjects cs
    JOIN countries c ON cs.country_id = c.id
    JOIN subjects s ON cs.subject_id = s.id
    WHERE c.name = 'Dominica'
    AND s.name = 'Caribbean Studies'
    AND cs.grade_level = 5
),
terms_list AS (
    SELECT t.id as term_id, t.term_number
    FROM terms t
    JOIN school_years sy ON t.school_year_id = sy.id
    JOIN countries c ON sy.country_id = c.id
    WHERE c.name = 'Dominica'
    AND sy.year_label = 'Grade 5'
)
INSERT INTO topics (curriculum_subject_id, term_id, title)
SELECT 
    dominica_caribbean.curriculum_subject_id,
    terms_list.term_id,
    topic_title
FROM dominica_caribbean
CROSS JOIN terms_list
CROSS JOIN (VALUES
    (1, 'Caribbean History and Culture'),
    (2, 'Island Geography and Ecosystems'),
    (3, 'Cultural Heritage and Traditions')
) AS topics(for_term, topic_title)
WHERE terms_list.term_number = topics.for_term
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. CONCEPTS
-- ============================================================================

-- Concepts for Writing Skills (Grade 3 English)
WITH writing_topic AS (
    SELECT id FROM topics WHERE title = 'Writing Skills' LIMIT 1
)
INSERT INTO concepts (topic_id, title)
SELECT writing_topic.id, concept_title
FROM writing_topic
CROSS JOIN (VALUES
    ('Paragraph Writing with Hooks'),
    ('Sentence Structure'),
    ('Using Descriptive Words'),
    ('Writing Complete Sentences')
) AS concepts(concept_title)
ON CONFLICT DO NOTHING;

-- Concepts for Fractions and Decimals
WITH fractions_topic AS (
    SELECT id FROM topics WHERE title = 'Fractions and Decimals' LIMIT 1
)
INSERT INTO concepts (topic_id, title)
SELECT fractions_topic.id, concept_title
FROM fractions_topic
CROSS JOIN (VALUES
    ('Understanding Fractions'),
    ('Adding Fractions'),
    ('Subtracting Fractions'),
    ('Decimal Place Value'),
    ('Converting Fractions to Decimals')
) AS concepts(concept_title)
ON CONFLICT DO NOTHING;

-- Concepts for Caribbean History
WITH history_topic AS (
    SELECT id FROM topics WHERE title = 'Caribbean History and Culture' LIMIT 1
)
INSERT INTO concepts (topic_id, title)
SELECT history_topic.id, concept_title
FROM history_topic
CROSS JOIN (VALUES
    ('The Kalinago People of Dominica'),
    ('Colonial History'),
    ('Independence Movements'),
    ('Cultural Festivals and Traditions')
) AS concepts(concept_title)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. LESSONS
-- ============================================================================

-- Lesson 1: Paragraph Writing with Hooks
INSERT INTO lessons (
    concept_id, 
    title, 
    content_html, 
    creator_id,
    category,
    difficulty,
    estimated_time,
    points,
    points_possible,
    grade_levels,
    description,
    objectives,
    prerequisites,
    tags
)
SELECT 
    c.id,
    'How to Write a Paragraph – Using Hooks',
    '<h2>What Is a Hook?</h2>
<p>A hook is the first sentence in your writing. Its job is to grab the reader''s attention, just like a fishing hook grabs a fish 🐟.</p>

<h3>Types of Hooks</h3>
<ul>
  <li><strong>Question Hook</strong> – Ask a question that makes the reader think.</li>
  <li><strong>Description Hook</strong> – Paint a picture with words.</li>
  <li><strong>Surprising Fact Hook</strong> – Share something the reader probably doesn''t know.</li>
  <li><strong>Exclamation / Onomatopoeia Hook</strong> – Use exciting or sound words.</li>
</ul>

<h3>Step‑by‑Step Paragraph Plan</h3>
<ol>
  <li>Hook (sentence 1)</li>
  <li>Tell what the topic is about (sentence 2)</li>
  <li>Add a detail (sentence 3)</li>
  <li>Closing sentence (sentence 4)</li>
</ol>

<h3>Example Paragraph</h3>
<p><strong>Question Hook – "My Favorite Pet":</strong></p>
<p><em>Have you ever had a pet that makes you feel happy? My favorite pet is my dog. He likes to play with me and run around the yard. My dog makes me feel happy and loved.</em></p>

<div class="activity">
<h3>Practice Activity</h3>
<p>Choose one hook type and write a 4-sentence paragraph about your favorite food, game, or place!</p>
</div>',
    u.id,
    'Writing',
    'beginner',
    30,
    50,
    100,
    '3',
    'Teach students the four common hook types and how to build a 4-sentence paragraph.',
    E'1. Understand the four types of hooks\n2. Choose an appropriate hook for a topic\n3. Write a complete 4-sentence paragraph',
    'Basic sentence structure',
    'hooks,paragraph,writing,grade3,english'
FROM concepts c
JOIN users u ON u.username = 'teacher_nevis'
WHERE c.title = 'Paragraph Writing with Hooks'
ON CONFLICT DO NOTHING;

-- Lesson 2: Understanding Fractions
INSERT INTO lessons (
    concept_id,
    title,
    content_html,
    creator_id,
    category,
    difficulty,
    estimated_time,
    points,
    points_possible,
    grade_levels,
    description,
    objectives,
    tags
)
SELECT 
    c.id,
    'Introduction to Fractions',
    '<h2>What is a Fraction?</h2>
<p>A fraction represents a part of a whole. It has two numbers:</p>
<ul>
  <li><strong>Numerator</strong> (top number) – How many parts we have</li>
  <li><strong>Denominator</strong> (bottom number) – How many equal parts the whole is divided into</li>
</ul>

<h3>Example</h3>
<p>If you cut a pizza into 8 equal slices and eat 3 slices, you have eaten <strong>3/8</strong> of the pizza.</p>

<h3>Visual Representation</h3>
<p>Draw a circle and divide it into equal parts to show different fractions!</p>

<div class="activity">
<h3>Practice Activity</h3>
<p>Draw and shade fractions: 1/2, 1/4, 3/4, and 2/3</p>
</div>',
    u.id,
    'STEM',
    'beginner',
    45,
    75,
    100,
    '5',
    'Introduction to fractions - understanding numerators and denominators.',
    E'1. Define what a fraction is\n2. Identify numerators and denominators\n3. Represent fractions visually',
    'fractions,mathematics,grade5,introduction'
FROM concepts c
JOIN users u ON u.username = 'teacher_nevis'
WHERE c.title = 'Understanding Fractions'
ON CONFLICT DO NOTHING;

-- Lesson 3: The Kalinago People
INSERT INTO lessons (
    concept_id,
    title,
    content_html,
    creator_id,
    category,
    difficulty,
    estimated_time,
    points,
    points_possible,
    grade_levels,
    description,
    objectives,
    tags
)
SELECT 
    c.id,
    'The Kalinago People of Dominica',
    '<h2>Who Are the Kalinago People?</h2>
<p>The Kalinago (also known as Caribs) are the indigenous people of Dominica. They have lived on the island for over 600 years!</p>

<h3>The Kalinago Territory</h3>
<p>Today, the Kalinago have their own territory on the northeast coast of Dominica. It covers 3,700 acres and is the last remaining indigenous territory in the Caribbean.</p>

<h3>Cultural Heritage</h3>
<ul>
  <li><strong>Traditional Crafts</strong> – Basket weaving using natural materials</li>
  <li><strong>Canoe Building</strong> – Traditional boat-making skills</li>
  <li><strong>Language</strong> – Preserving their native language and stories</li>
  <li><strong>Food</strong> – Traditional cassava bread and cooking methods</li>
</ul>

<h3>Important Facts</h3>
<p>The Kalinago Barana Autê is a cultural village where visitors can learn about Kalinago traditions and way of life.</p>

<div class="activity">
<h3>Research Activity</h3>
<p>Research one aspect of Kalinago culture (crafts, food, or language) and create a short presentation.</p>
</div>',
    u.id,
    'Humanities',
    'intermediate',
    50,
    100,
    100,
    '5,6',
    'Learn about the indigenous Kalinago people of Dominica and their rich cultural heritage.',
    E'1. Identify the Kalinago people and their history\n2. Understand the Kalinago Territory\n3. Recognize important cultural practices',
    'kalinago,indigenous,dominica,caribbean studies,culture'
FROM concepts c
JOIN users u ON u.username = 'teacher_dominica'
WHERE c.title = 'The Kalinago People of Dominica'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 11. QUIZZES
-- ============================================================================

-- Quizzes for Paragraph Writing with Hooks
WITH hooks_lesson AS (
    SELECT id FROM lessons WHERE title = 'How to Write a Paragraph – Using Hooks' LIMIT 1
)
INSERT INTO quizzes (
    lesson_id, question, question_type, options,
    correct_answer, explanation, points, difficulty, tags
)
SELECT 
    hooks_lesson.id,
    question,
    'mc_single',
    options,
    correct_answer,
    explanation,
    10,
    'beginner',
    tags
FROM hooks_lesson
CROSS JOIN (VALUES
    ('Which hook type asks a question to make the reader think?',
     'Question Hook,Description Hook,Surprising Fact Hook,Exclamation Hook',
     'Question Hook',
     'A question hook invites the reader to answer in their head.',
     'hook,question'),
    
    ('Which hook type paints a picture with words?',
     'Description Hook,Surprising Fact Hook,Exclamation Hook,Question Hook',
     'Description Hook',
     'A description hook gives vivid details so the reader can imagine the scene.',
     'hook,description'),
    
    ('Which hook type shares something the reader probably doesn''t know?',
     'Surprising Fact Hook,Question Hook,Description Hook,Exclamation Hook',
     'Surprising Fact Hook',
     'A surprising-fact hook offers a neat piece of information that catches attention.',
     'hook,fact'),
    
    ('Which hook type uses exciting or sound words?',
     'Exclamation / Onomatopoeia Hook,Question Hook,Description Hook,Surprising Fact Hook',
     'Exclamation / Onomatopoeia Hook',
     'Onomatopoeic words like "Boo! Bang! Wow!" make the writing lively.',
     'hook,exclamation'),
     
    ('How many sentences should your paragraph have?',
     '4 sentences,2 sentences,6 sentences,10 sentences',
     '4 sentences',
     'A basic paragraph has 4 sentences: hook, topic, detail, and closing.',
     'paragraph,structure')
) AS quiz_data(question, options, correct_answer, explanation, tags)
ON CONFLICT DO NOTHING;

-- Quizzes for Fractions
WITH fractions_lesson AS (
    SELECT id FROM lessons WHERE title = 'Introduction to Fractions' LIMIT 1
)
INSERT INTO quizzes (
    lesson_id, question, question_type, options,
    correct_answer, explanation, points, difficulty, tags
)
SELECT 
    fractions_lesson.id,
    question,
    'mc_single',
    options,
    correct_answer,
    explanation,
    10,
    'beginner',
    tags
FROM fractions_lesson
CROSS JOIN (VALUES
    ('What does the numerator represent in a fraction?',
     'How many parts we have,How many parts the whole is divided into,The whole number,The decimal',
     'How many parts we have',
     'The numerator (top number) shows how many parts we have.',
     'fractions,numerator'),
    
    ('What does the denominator represent in a fraction?',
     'How many equal parts the whole is divided into,How many parts we have,The percentage,The whole',
     'How many equal parts the whole is divided into',
     'The denominator (bottom number) shows how many equal parts make up the whole.',
     'fractions,denominator'),
    
    ('If you eat 2 slices of a pizza cut into 8 slices, what fraction did you eat?',
     '2/8,8/2,2/6,6/8',
     '2/8',
     'You ate 2 parts out of 8 total parts, which is 2/8.',
     'fractions,application')
) AS quiz_data(question, options, correct_answer, explanation, tags)
ON CONFLICT DO NOTHING;

-- Quizzes for Kalinago People
WITH kalinago_lesson AS (
    SELECT id FROM lessons WHERE title = 'The Kalinago People of Dominica' LIMIT 1
)
INSERT INTO quizzes (
    lesson_id, question, question_type, options,
    correct_answer, explanation, points, difficulty, tags
)
SELECT 
    kalinago_lesson.id,
    question,
    'mc_single',
    options,
    correct_answer,
    explanation,
    10,
    'intermediate',
    tags
FROM kalinago_lesson
CROSS JOIN (VALUES
    ('Where is the Kalinago Territory located?',
     'Northeast coast of Dominica,Southern Nevis,Western Jamaica,Northern Trinidad',
     'Northeast coast of Dominica',
     'The Kalinago Territory is on the northeast coast of Dominica.',
     'kalinago,geography'),
    
    ('What is a traditional Kalinago craft?',
     'Basket weaving,Pottery making,Metal working,Glassblowing',
     'Basket weaving',
     'The Kalinago are known for their traditional basket weaving using natural materials.',
     'kalinago,culture'),
    
    ('How many acres does the Kalinago Territory cover?',
     '3,700 acres,1,000 acres,5,000 acres,500 acres',
     '3,700 acres',
     'The Kalinago Territory covers 3,700 acres on Dominica.',
     'kalinago,facts')
) AS quiz_data(question, options, correct_answer, explanation, tags)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 12. HISTORICAL FIGURES
-- ============================================================================
INSERT INTO historical_figures (name, birth_year, death_year, country_id, contribution, legacy) VALUES
('Dame Mary Eugenia Charles', 1919, 2005, 
 (SELECT id FROM countries WHERE name = 'Dominica'),
 'First female Prime Minister in the Caribbean, served 1980-1995',
 'Trailblazer for women in politics and democracy advocate'
),
('Alexander Hamilton', 1755, 1804,
 (SELECT id FROM countries WHERE name = 'Nevis'),
 'Founding Father of the United States, born in Charlestown, Nevis',
 'His childhood home in Nevis is now a historical museum'
),
('Robert Llewelyn Bradshaw', 1916, 1978,
 (SELECT id FROM countries WHERE name = 'Nevis'),
 'First Premier of Saint Kitts-Nevis-Anguilla and labor rights advocate',
 'Known as the Father of the Nation'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 13. GEOGRAPHICAL FEATURES
-- ============================================================================
INSERT INTO geographical_features (
    name, feature_type, country_id, latitude, longitude, 
    elevation_meters, description, scientific_significance
) VALUES
('Nevis Peak', 'Volcano', 
 (SELECT id FROM countries WHERE name = 'Nevis'),
 17.1500, -62.5833, 985,
 'Dormant stratovolcano forming the central peak of Nevis',
 'Youngest volcanic center in the region with potential for future activity'
),
('Boiling Lake', 'Volcanic Feature',
 (SELECT id FROM countries WHERE name = 'Dominica'),
 15.3200, -61.2933, 800,
 'World''s second-largest boiling lake located in Morne Trois Pitons National Park',
 'Unique hydrothermal feature with water temperatures reaching 82-92°C'
),
('Kalinago Territory', 'Cultural Region',
 (SELECT id FROM countries WHERE name = 'Dominica'),
 15.4722, -61.2778, 100,
 '3,700-acre territory on Dominica''s northeast coast, home to the Kalinago people',
 'Last remaining indigenous territory in the Caribbean'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 14. CULTURAL PRACTICES
-- ============================================================================
INSERT INTO cultural_practices (
    name, practice_type, country_id, description, 
    historical_context, contemporary_practice, tags
) VALUES
('Culturama Festival', 'Cultural Festival',
 (SELECT id FROM countries WHERE name = 'Nevis'),
 'Annual 10-day cultural festival in Nevis celebrating emancipation',
 'Began in 1974 to preserve and celebrate Nevisian cultural traditions',
 'Features calypso music, dance competitions, pageants, and food fairs; major tourist attraction',
 'festival,culture,tradition,nevis,emancipation'
),
('World Creole Music Festival', 'Music Festival',
 (SELECT id FROM countries WHERE name = 'Dominica'),
 'Annual three-day music festival celebrating Creole culture and music',
 'Started in 1997 to promote Creole culture and boost tourism',
 'Draws international artists and thousands of visitors each October',
 'music,festival,creole,dominica,tourism'
),
('Kwéyòl Language Use', 'Linguistic Practice',
 (SELECT id FROM countries WHERE name = 'Dominica'),
 'Use of Dominican Creole French (Kwéyòl) in daily communication',
 'Developed during the colonial period, blending French and African languages',
 'Actively taught in schools and used in media; recognized as cultural heritage',
 'language,creole,culture,dominica,education'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 15. SAMPLE PROGRESS
-- ============================================================================
INSERT INTO progress (user_id, lesson_id, score, completed, completed_at)
SELECT 
    u.id,
    l.id,
    score_val,
    is_completed,
    completed_time
FROM (
    SELECT id FROM users WHERE username IN ('student_alex', 'student_maria')
) u
CROSS JOIN (
    SELECT id FROM lessons ORDER BY id LIMIT 2
) l
CROSS JOIN (VALUES
    (85, true, NOW() - INTERVAL '3 days'),
    (92, true, NOW() - INTERVAL '1 day')
) AS progress_data(score_val, is_completed, completed_time)
LIMIT 4
ON CONFLICT DO NOTHING;

-- Update student points based on completed lessons
UPDATE users
SET points = (
    SELECT COALESCE(SUM(score), 0)
    FROM progress
    WHERE progress.user_id = users.id
    AND progress.completed = true
)
WHERE role = 'student';

-- ============================================================================
-- 16. REWARDS
-- ============================================================================
INSERT INTO rewards (name, points_required, creator_id, for_user_id)
SELECT name, points_required, 
    (SELECT id FROM users WHERE username = 'admin'),
    NULL
FROM (VALUES
    ('Bronze Star Badge', 50),
    ('Silver Star Badge', 150),
    ('Gold Star Badge', 300),
    ('Writing Champion Certificate', 200),
    ('Math Master Trophy', 250),
    ('Caribbean Culture Expert Award', 400)
) AS reward_data(name, points_required)
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Seed data loaded successfully!' AS status;

DO $$
DECLARE
    country_count INTEGER;
    subject_count INTEGER;
    topic_count INTEGER;
    concept_count INTEGER;
    lesson_count INTEGER;
    user_count INTEGER;
    quiz_count INTEGER;
    progress_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO country_count FROM countries;
    SELECT COUNT(*) INTO subject_count FROM subjects;
    SELECT COUNT(*) INTO topic_count FROM topics;
    SELECT COUNT(*) INTO concept_count FROM concepts;
    SELECT COUNT(*) INTO lesson_count FROM lessons;
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO quiz_count FROM quizzes;
    SELECT COUNT(*) INTO progress_count FROM progress;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DATABASE SEEDING COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Countries: %', country_count;
    RAISE NOTICE 'Subjects: %', subject_count;
    RAISE NOTICE 'Topics: %', topic_count;
    RAISE NOTICE 'Concepts: %', concept_count;
    RAISE NOTICE 'Lessons: %', lesson_count;
    RAISE NOTICE 'Users: %', user_count;
    RAISE NOTICE 'Quizzes: %', quiz_count;
    RAISE NOTICE 'Progress Records: %', progress_count;
    RAISE NOTICE '========================================';
END $$;
