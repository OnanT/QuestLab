-- Database Seeding Script for islandquestdb
-- Run this in psql: psql -U your_user -d islandquestdb -f seed.sql

BEGIN;

-- ============================================================================
-- 1. COUNTRIES
-- ============================================================================
INSERT INTO countries (name) VALUES 
('St. Kitts & Nevis'),
('Dominica'),
('Jamaica'),
('Trinidad and Tobago')
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
('Geography')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. SCHOOL YEARS
-- ============================================================================
INSERT INTO school_years (country_id, year_label) 
SELECT c.id, grade
FROM countries c
CROSS JOIN (VALUES 
    ('Grade 1'), ('Grade 2'), ('Grade 3'), ('Grade 4'), ('Grade 5'), ('Grade 6')
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
CROSS JOIN generate_series(1, 6) AS grade
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. TOPICS (Grade 5 Mathematics for St. Kitts & Nevis)
-- ============================================================================
WITH skn_math_grade5 AS (
    SELECT cs.id as curriculum_subject_id
    FROM curriculum_subjects cs
    JOIN countries c ON cs.country_id = c.id
    JOIN subjects s ON cs.subject_id = s.id
    WHERE c.name = 'St. Kitts & Nevis'
    AND s.name = 'Mathematics'
    AND cs.grade_level = 5
),
terms_list AS (
    SELECT t.id as term_id, t.term_number
    FROM terms t
    JOIN school_years sy ON t.school_year_id = sy.id
    JOIN countries c ON sy.country_id = c.id
    WHERE c.name = 'St. Kitts & Nevis'
    AND sy.year_label = 'Grade 5'
)
INSERT INTO topics (curriculum_subject_id, term_id, title)
SELECT 
    skn_math_grade5.curriculum_subject_id,
    terms_list.term_id,
    topic_title
FROM skn_math_grade5
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

-- Topics for English Language
WITH skn_english_grade5 AS (
    SELECT cs.id as curriculum_subject_id
    FROM curriculum_subjects cs
    JOIN countries c ON cs.country_id = c.id
    JOIN subjects s ON cs.subject_id = s.id
    WHERE c.name = 'St. Kitts & Nevis'
    AND s.name = 'English Language'
    AND cs.grade_level = 5
),
terms_list AS (
    SELECT t.id as term_id, t.term_number
    FROM terms t
    JOIN school_years sy ON t.school_year_id = sy.id
    JOIN countries c ON sy.country_id = c.id
    WHERE c.name = 'St. Kitts & Nevis'
    AND sy.year_label = 'Grade 5'
)
INSERT INTO topics (curriculum_subject_id, term_id, title)
SELECT 
    skn_english_grade5.curriculum_subject_id,
    terms_list.term_id,
    topic_title
FROM skn_english_grade5
CROSS JOIN terms_list
CROSS JOIN (VALUES
    (1, 'Reading Comprehension'),
    (1, 'Vocabulary Building'),
    (2, 'Grammar and Punctuation'),
    (2, 'Creative Writing'),
    (3, 'Research and Presentation'),
    (3, 'Poetry and Literature')
) AS topics(for_term, topic_title)
WHERE terms_list.term_number = topics.for_term
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. CONCEPTS
-- ============================================================================
-- Concepts for "Fractions and Decimals"
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
    ('Converting Fractions to Decimals'),
    ('Comparing Fractions and Decimals')
) AS concepts(concept_title)
ON CONFLICT DO NOTHING;

-- Concepts for "Reading Comprehension"
WITH reading_topic AS (
    SELECT id FROM topics WHERE title = 'Reading Comprehension' LIMIT 1
)
INSERT INTO concepts (topic_id, title)
SELECT reading_topic.id, concept_title
FROM reading_topic
CROSS JOIN (VALUES
    ('Main Idea and Supporting Details'),
    ('Making Inferences'),
    ('Identifying Story Elements'),
    ('Summarizing Passages')
) AS concepts(concept_title)
ON CONFLICT DO NOTHING;

-- Concepts for "Basic Algebra"
WITH algebra_topic AS (
    SELECT id FROM topics WHERE title = 'Basic Algebra' LIMIT 1
)
INSERT INTO concepts (topic_id, title)
SELECT algebra_topic.id, concept_title
FROM algebra_topic
CROSS JOIN (VALUES
    ('Introduction to Variables'),
    ('Solving Simple Equations'),
    ('Understanding Expressions'),
    ('Order of Operations')
) AS concepts(concept_title)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. USERS (Update existing users and add more)
-- ============================================================================
-- Update existing users
UPDATE users SET role = 'student', points = 0, level = 'Explorer', streak = 0 
WHERE username = 'testi';

UPDATE users SET role = 'teacher', points = 0, level = 'Master', streak = 0 
WHERE username = 'teach';

-- Add additional users (using your existing hash format - Argon2)
INSERT INTO users (username, email, hashed_password, role, points, level, streak) VALUES 
('admin', 'admin@questlab.com', '$argon2id$v=19$m=65536,t=3,p=4$GINwDkHofc/ZWyslpPReCw$rv890L2VCTVXk9U2wCoWnJ7XV+CzouIcAWD9A3HLsp8', 'admin', 1000, 'Legend', 50),
('parent1', 'parent1@example.com', '$argon2id$v=19$m=65536,t=3,p=4$Rui9N0aIsRaiVCrF+B8DgA$XP7qF2xazgKD5susccx9VwaXqyLiu8E7hZJA1XfS/iU', 'parent', 0, 'Explorer', 0),
('student2', 'student2@example.com', '$argon2id$v=19$m=65536,t=3,p=4$GINwDkHofc/ZWyslpPReCw$rv890L2VCTVXk9U2wCoWnJ7XV+CzouIcAWD9A3HLsp8', 'student', 150, 'Explorer', 5),
('student3', 'student3@example.com', '$argon2id$v=19$m=65536,t=3,p=4$GINwDkHofc/ZWyslpPReCw$rv890L2VCTVXk9U2wCoWnJ7XV+CzouIcAWD9A3HLsp8', 'student', 300, 'Adventurer', 10)
ON CONFLICT (username) DO NOTHING;

-- Link students to parent
UPDATE users 
SET parent_id = (SELECT id FROM users WHERE username = 'parent1' LIMIT 1)
WHERE username IN ('testi', 'student2', 'student3');

-- ============================================================================
-- 9. GAME ENGINES
-- ============================================================================
INSERT INTO game_engines (name) VALUES 
('Quiz Engine'),
('Memory Match'),
('Drag and Drop'),
('Multiple Choice'),
('Fill in the Blanks'),
('Interactive Simulation')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. LESSONS
-- ============================================================================
WITH teacher_id AS (
    SELECT id FROM users WHERE username = 'teach' LIMIT 1
),
adding_fractions_concept AS (
    SELECT id FROM concepts WHERE title = 'Adding Fractions' LIMIT 1
),
main_idea_concept AS (
    SELECT id FROM concepts WHERE title = 'Main Idea and Supporting Details' LIMIT 1
),
equations_concept AS (
    SELECT id FROM concepts WHERE title = 'Solving Simple Equations' LIMIT 1
)
INSERT INTO lessons (concept_id, title, content_html, creator_id, created_at)
SELECT concept_id, title, content_html, teacher_id.id, NOW()
FROM teacher_id
CROSS JOIN (VALUES
    ((SELECT id FROM adding_fractions_concept), 
     'Introduction to Adding Fractions',
     '<h2>Adding Fractions with Same Denominators</h2><p>When fractions have the same denominator, we simply add the numerators and keep the denominator the same.</p><p><strong>Example:</strong> 1/4 + 2/4 = 3/4</p><div class="activity">Try it yourself: What is 2/5 + 1/5?</div>'),
    
    ((SELECT id FROM adding_fractions_concept), 
     'Adding Fractions with Different Denominators',
     '<h2>Finding Common Denominators</h2><p>To add fractions with different denominators, we first need to find a common denominator.</p><p><strong>Example:</strong> 1/2 + 1/4 = 2/4 + 1/4 = 3/4</p>'),
    
    ((SELECT id FROM main_idea_concept), 
     'Finding the Main Idea in Stories',
     '<h2>What is the Main Idea?</h2><p>The main idea is what the passage is mostly about. It''s the central point the author wants you to understand.</p><p><strong>Steps to find the main idea:</strong></p><ol><li>Read the entire passage</li><li>Ask yourself: What is this mostly about?</li><li>Look for repeated words or ideas</li></ol>'),
    
    ((SELECT id FROM equations_concept), 
     'Solving One-Step Equations',
     '<h2>Introduction to Equations</h2><p>An equation is like a balanced scale. What you do to one side, you must do to the other.</p><p><strong>Example:</strong> x + 3 = 7</p><p>To solve: Subtract 3 from both sides</p><p>x = 4</p>')
) AS lesson_data(concept_id, title, content_html)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 11. QUIZZES
-- ============================================================================
WITH lesson_fractions AS (
    SELECT id FROM lessons WHERE title = 'Introduction to Adding Fractions' LIMIT 1
),
lesson_main_idea AS (
    SELECT id FROM lessons WHERE title = 'Finding the Main Idea in Stories' LIMIT 1
),
lesson_equations AS (
    SELECT id FROM lessons WHERE title = 'Solving One-Step Equations' LIMIT 1
)
INSERT INTO quizzes (lesson_id, question, options, correct_answer)
SELECT lesson_id, question, options, correct_answer
FROM (VALUES
    ((SELECT id FROM lesson_fractions), 
     'What is 1/2 + 1/4?', 
     '["1/4", "3/4", "1/6", "2/4"]', 
     '3/4'),
    
    ((SELECT id FROM lesson_fractions), 
     'What is 2/5 + 1/5?', 
     '["3/10", "3/5", "1/5", "2/5"]', 
     '3/5'),
    
    ((SELECT id FROM lesson_main_idea), 
     'What is the main idea of a passage?', 
     '["Details", "Title", "Central theme", "Conclusion"]', 
     'Central theme'),
    
    ((SELECT id FROM lesson_main_idea), 
     'Where can you often find the main idea?', 
     '["In the middle", "At the end", "At the beginning or end", "Never stated"]', 
     'At the beginning or end'),
    
    ((SELECT id FROM lesson_equations), 
     'If x + 5 = 12, what is x?', 
     '["5", "7", "12", "17"]', 
     '7'),
    
    ((SELECT id FROM lesson_equations), 
     'Solve: y - 3 = 8', 
     '["5", "8", "11", "24"]', 
     '11')
) AS quiz_data(lesson_id, question, options, correct_answer)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 12. GAMES
-- ============================================================================
WITH quiz_engine AS (
    SELECT id FROM game_engines WHERE name = 'Quiz Engine' LIMIT 1
),
memory_match AS (
    SELECT id FROM game_engines WHERE name = 'Memory Match' LIMIT 1
),
lesson_fractions AS (
    SELECT id FROM lessons WHERE title = 'Introduction to Adding Fractions' LIMIT 1
),
lesson_main_idea AS (
    SELECT id FROM lessons WHERE title = 'Finding the Main Idea in Stories' LIMIT 1
)
INSERT INTO games (lesson_id, game_engine_id, config_json, created_at)
SELECT lesson_id, game_engine_id, config_json::jsonb, NOW()
FROM (VALUES
    ((SELECT id FROM lesson_fractions), 
     (SELECT id FROM quiz_engine),
     '{"type": "quiz", "time_limit": 300, "questions_count": 5, "difficulty": "beginner"}'),
    
    ((SELECT id FROM lesson_main_idea), 
     (SELECT id FROM memory_match),
     '{"type": "memory_match", "pairs": 6, "time_limit": 180, "difficulty": "intermediate"}')
) AS game_data(lesson_id, game_engine_id, config_json)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 13. PROGRESS (for existing student 'testi')
-- ============================================================================
WITH student_id AS (
    SELECT id FROM users WHERE username = 'testi' LIMIT 1
),
lessons_list AS (
    SELECT id, title FROM lessons LIMIT 3
)
INSERT INTO progress (user_id, lesson_id, score, completed, completed_at)
SELECT student_id.id, lessons_list.id, score, completed, completed_at
FROM student_id
CROSS JOIN lessons_list
CROSS JOIN (VALUES
    (85, true, NOW() - INTERVAL '2 days'),
    (92, true, NOW() - INTERVAL '1 day'),
    (65, false, NULL)
) AS progress_data(score, completed, completed_at)
LIMIT 3
ON CONFLICT DO NOTHING;

-- Update student points based on progress
UPDATE users
SET points = (
    SELECT COALESCE(SUM(score), 0)
    FROM progress
    WHERE progress.user_id = users.id
    AND progress.completed = true
)
WHERE username = 'testi';

-- ============================================================================
-- 14. REWARDS
-- ============================================================================
WITH admin_id AS (
    SELECT id FROM users WHERE username = 'admin' LIMIT 1
)
INSERT INTO rewards (name, points_required, creator_id, for_user_id)
SELECT name, points_required, admin_id.id, NULL
FROM admin_id
CROSS JOIN (VALUES
    ('Bronze Badge', 50),
    ('Silver Badge', 150),
    ('Gold Badge', 300),
    ('Platinum Badge', 500),
    ('Math Master Certificate', 200),
    ('Reading Champion Trophy', 250),
    ('Problem Solver Award', 400)
) AS reward_data(name, points_required)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMIT AND VERIFICATION
-- ============================================================================
COMMIT;

-- Verification Queries
\echo '========================================='
\echo 'DATABASE SEEDING COMPLETE'
\echo '========================================='
\echo ''

SELECT 'Countries:' as metric, COUNT(*)::text as count FROM countries
UNION ALL
SELECT 'Subjects:', COUNT(*)::text FROM subjects
UNION ALL
SELECT 'School Years:', COUNT(*)::text FROM school_years
UNION ALL
SELECT 'Terms:', COUNT(*)::text FROM terms
UNION ALL
SELECT 'Curriculum Subjects:', COUNT(*)::text FROM curriculum_subjects
UNION ALL
SELECT 'Topics:', COUNT(*)::text FROM topics
UNION ALL
SELECT 'Concepts:', COUNT(*)::text FROM concepts
UNION ALL
SELECT 'Users:', COUNT(*)::text FROM users
UNION ALL
SELECT 'Lessons:', COUNT(*)::text FROM lessons
UNION ALL
SELECT 'Quizzes:', COUNT(*)::text FROM quizzes
UNION ALL
SELECT 'Games:', COUNT(*)::text FROM games
UNION ALL
SELECT 'Game Engines:', COUNT(*)::text FROM game_engines
UNION ALL
SELECT 'Progress Records:', COUNT(*)::text FROM progress
UNION ALL
SELECT 'Rewards:', COUNT(*)::text FROM rewards;

\echo ''
\echo 'User Details:'
SELECT id, username, email, role, points, level, streak, parent_id 
FROM users 
ORDER BY id;

\echo ''
\echo 'Sample Lesson with Concept:'
SELECT l.id, l.title as lesson, c.title as concept, u.username as creator
FROM lessons l
JOIN concepts c ON l.concept_id = c.id
JOIN users u ON l.creator_id = u.id
LIMIT 5;