-- ============================================================================
-- QUESTLAB FINAL HARMONIZED SEED DATA
-- Target: St. Kitts & Nevis and Dominica (Grades 1-12)
-- Includes: Users, Curriculum, Lessons, Quizzes, Games, and Cultural Data
-- ============================================================================

BEGIN;

-- 1. Ensure Default Organization exists (id=1)
INSERT INTO organizations (id, name, slug, organization_type, is_active)
VALUES (1, 'Quest Lab', 'quest-lab', 'platform', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Standardize Countries
INSERT INTO countries (id, name) VALUES 
(1, 'St. Kitts & Nevis'),
(2, 'Dominica')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Standardize Subjects
INSERT INTO subjects (name) VALUES 
('Mathematics'),
('English Language'),
('Science'),
('Social Studies'),
('History'),
('Geography'),
('Caribbean Studies'),
('Information Technology')
ON CONFLICT (name) DO NOTHING;

-- 4. Structure: School Years (Grades 1-12) for SKN and Dominica
INSERT INTO school_years (country_id, year_label)
SELECT c.id, g.grade
FROM countries c
CROSS JOIN (VALUES 
    ('Grade 1'), ('Grade 2'), ('Grade 3'), ('Grade 4'), ('Grade 5'), ('Grade 6'),
    ('Grade 7'), ('Grade 8'), ('Grade 9'), ('Grade 10'), ('Grade 11'), ('Grade 12')
) AS g(grade)
ON CONFLICT DO NOTHING;

-- 5. Structure: Terms
INSERT INTO terms (school_year_id, term_number, title)
SELECT sy.id, t.num, t.title
FROM school_years sy
CROSS JOIN (VALUES 
    (1, 'Term 1 - September to December'),
    (2, 'Term 2 - January to March'),
    (3, 'Term 3 - April to June')
) AS t(num, title)
ON CONFLICT DO NOTHING;

-- 6. Structure: Curriculum Subjects (Link subjects to grades)
INSERT INTO curriculum_subjects (country_id, subject_id, grade_level)
SELECT c.id, s.id, g.level
FROM countries c
CROSS JOIN subjects s
CROSS JOIN generate_series(1, 12) AS g(level)
ON CONFLICT DO NOTHING;

-- 7. Game Engines
INSERT INTO game_engines (id, name) VALUES
(1, 'SkillBuilder'),
(2, 'QuizBattle'),
(3, 'StoryQuest'),
(4, 'MapChallenge'),
(5, 'Quiz Engine'),
(6, 'Memory Match'),
(7, 'Drag and Drop'),
(8, 'Multiple Choice'),
(9, 'Fill in the Blanks'),
(10, 'Interactive Simulation')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 8. Standardized Users (Password: password123)
-- Organization ID is 1 for all platform users
INSERT INTO users (username, email, hashed_password, role, organization_id, points, level, display_name) VALUES
('admin', 'admin@questlab.com', '$argon2id$v=19$m=65536,t=3,p=4$GINwDkHofc/ZWyslpPReCw$rv890L2VCTVXk9U2wCoWnJ7XV+CzouIcAWD9A3HLsp8', 'admin', 1, 1000, 50, 'System Admin'),
('ms_johnson', 'teacher1@questlab.com', '$argon2id$v=19$m=65536,t=3,p=4$GINwDkHofc/ZWyslpPReCw$rv890L2VCTVXk9U2wCoWnJ7XV+CzouIcAWD9A3HLsp8', 'teacher', 1, 500, 20, 'Ms. Johnson'),
('mr_williams', 'teacher2@questlab.com', '$argon2id$v=19$m=65536,t=3,p=4$GINwDkHofc/ZWyslpPReCw$rv890L2VCTVXk9U2wCoWnJ7XV+CzouIcAWD9A3HLsp8', 'teacher', 1, 450, 15, 'Mr. Williams'),
('parent_smith', 'parent1@questlab.com', '$argon2id$v=19$m=65536,t=3,p=4$GINwDkHofc/ZWyslpPReCw$rv890L2VCTVXk9U2wCoWnJ7XV+CzouIcAWD9A3HLsp8', 'parent', 1, 0, 1, 'Robert Smith'),
('emma_smith', 'emma@questlab.com', '$argon2id$v=19$m=65536,t=3,p=4$GINwDkHofc/ZWyslpPReCw$rv890L2VCTVXk9U2wCoWnJ7XV+CzouIcAWD9A3HLsp8', 'student', 1, 250, 5, 'Emma Smith')
ON CONFLICT (username) DO NOTHING;

-- Link Emma to her parent
UPDATE users SET parent_id = (SELECT id FROM users WHERE username = 'parent_smith') WHERE username = 'emma_smith';

-- 9. Content: Topics
-- Grade 3 English for SKN
WITH skn_english_grade3 AS (
    SELECT cs.id FROM curriculum_subjects cs 
    JOIN countries c ON cs.country_id = c.id 
    JOIN subjects s ON cs.subject_id = s.id 
    WHERE c.name = 'St. Kitts & Nevis' AND s.name = 'English Language' AND cs.grade_level = 3
),
term1_skn_g3 AS (
    SELECT t.id FROM terms t 
    JOIN school_years sy ON t.school_year_id = sy.id 
    JOIN countries c ON sy.country_id = c.id 
    WHERE c.name = 'St. Kitts & Nevis' AND sy.year_label = 'Grade 3' AND t.term_number = 1
)
INSERT INTO topics (curriculum_subject_id, term_id, title)
SELECT (SELECT id FROM skn_english_grade3), (SELECT id FROM term1_skn_g3), 'Writing Skills'
ON CONFLICT DO NOTHING;

-- Grade 5 Math for SKN
WITH skn_math_grade5 AS (
    SELECT cs.id FROM curriculum_subjects cs 
    JOIN countries c ON cs.country_id = c.id 
    JOIN subjects s ON cs.subject_id = s.id 
    WHERE c.name = 'St. Kitts & Nevis' AND s.name = 'Mathematics' AND cs.grade_level = 5
),
term1_skn_g5 AS (
    SELECT t.id FROM terms t 
    JOIN school_years sy ON t.school_year_id = sy.id 
    JOIN countries c ON sy.country_id = c.id 
    WHERE c.name = 'St. Kitts & Nevis' AND sy.year_label = 'Grade 5' AND t.term_number = 1
)
INSERT INTO topics (curriculum_subject_id, term_id, title)
SELECT (SELECT id FROM skn_math_grade5), (SELECT id FROM term1_skn_g5), 'Fractions and Decimals'
ON CONFLICT DO NOTHING;

-- 10. Content: Concepts
INSERT INTO concepts (topic_id, title)
SELECT id, 'Paragraph Writing with Hooks' FROM topics WHERE title = 'Writing Skills'
UNION ALL
SELECT id, 'Understanding Fractions' FROM topics WHERE title = 'Fractions and Decimals'
ON CONFLICT DO NOTHING;

-- 11. Content: Lessons
-- Lesson 1: Writing Hooks
INSERT INTO lessons (concept_id, organization_id, title, content_html, creator_id, category, difficulty, estimated_time, points, grade_levels, description, objectives, tags)
SELECT 
    c.id, 1, 'How to Write a Paragraph – Using Hooks', 
    '<h2>What Is a Hook?</h2><p>A hook is the first sentence in your writing. Its job is to grab the reader attention.</p>',
    (SELECT id FROM users WHERE username = 'ms_johnson'),
    'Writing', 'beginner', 30, 50, '3', 'Teach hook types.', 'Understand hooks.', 'hooks,writing'
FROM concepts c WHERE c.title = 'Paragraph Writing with Hooks'
ON CONFLICT DO NOTHING;

-- Lesson 2: Fractions
INSERT INTO lessons (concept_id, organization_id, title, content_html, creator_id, category, difficulty, estimated_time, points, grade_levels, description, objectives, tags)
SELECT 
    c.id, 1, 'Introduction to Fractions', 
    '<h2>What is a Fraction?</h2><p>A fraction represents a part of a whole.</p>',
    (SELECT id FROM users WHERE username = 'ms_johnson'),
    'STEM', 'beginner', 45, 75, '5', 'Intro to fractions.', 'Define fractions.', 'fractions,math'
FROM concepts c WHERE c.title = 'Understanding Fractions'
ON CONFLICT DO NOTHING;

-- 12. Content: Quizzes
INSERT INTO quizzes (lesson_id, question, question_type, options, correct_answer, explanation, points, difficulty)
SELECT 
    l.id, 'Which hook type asks a question?', 'mc_single', 'Question Hook,Fact Hook,Action Hook', 'Question Hook', 'Questions invite readers.', 10, 'beginner'
FROM lessons l WHERE l.title = 'How to Write a Paragraph – Using Hooks'
UNION ALL
SELECT 
    l.id, 'What is the top number of a fraction?', 'mc_single', 'Numerator,Denominator,Whole', 'Numerator', 'Numerator is on top.', 10, 'beginner'
FROM lessons l WHERE l.title = 'Introduction to Fractions'
ON CONFLICT DO NOTHING;

-- 13. Content: Games
INSERT INTO games (lesson_id, game_engine_id, config_json)
SELECT 
    l.id, 6, '{"type": "memory_match", "pairs": 4}'::jsonb
FROM lessons l WHERE l.title = 'Introduction to Fractions'
ON CONFLICT DO NOTHING;

-- 14. Cultural Data
INSERT INTO historical_figures (name, birth_year, death_year, country_id, contribution) VALUES
('Dame Mary Eugenia Charles', 1919, 2005, 2, 'First female PM in Caribbean'),
('Alexander Hamilton', 1755, 1804, 1, 'Founding Father of the USA, born in Nevis')
ON CONFLICT DO NOTHING;

-- 15. Schools
INSERT INTO schools (organization_id, name, island_id, address) VALUES
(1, 'Charlestown Primary', 1, 'Nevis'),
(1, 'Roseau Primary', 2, 'Dominica')
ON CONFLICT DO NOTHING;

-- 16. Sample Progress
INSERT INTO progress (user_id, lesson_id, score, completed, completed_at)
SELECT 
    (SELECT id FROM users WHERE username = 'emma_smith'),
    (SELECT id FROM lessons WHERE title = 'How to Write a Paragraph – Using Hooks'),
    90, TRUE, NOW()
ON CONFLICT DO NOTHING;

-- 17. Rewards
INSERT INTO rewards (name, points_required, creator_id)
VALUES ('Writing Star', 100, (SELECT id FROM users WHERE username = 'admin'))
ON CONFLICT DO NOTHING;

COMMIT;

-- Verification
SELECT 'SEEDING COMPLETE' as status;
SELECT table_name, count FROM (
    SELECT 'users' as table_name, count(*) FROM users
    UNION ALL SELECT 'lessons', count(*) FROM lessons
    UNION ALL SELECT 'quizzes', count(*) FROM quizzes
    UNION ALL SELECT 'topics', count(*) FROM topics
) s;
