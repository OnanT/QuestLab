-- SQL script for Grade 3 Term III revision content: Social Studies History & Civics

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 4 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

/********************************************************************
 * TOPIC: History - Places of Memory
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'History: Places of Memory')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_hist FROM topics WHERE title = 'History: Places of Memory' LIMIT 1 \gset

-- 1. Alexander Hamilton & Nathaniel Wells
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_hist, 'Historical Figures of SKN') RETURNING id AS concept_id_hist \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_hist, 'Heroes of our Islands: Hamilton and Wells', '<h2>Places of Memory: Alexander Hamilton and Nathaniel Wells</h2><p>Our islands have a rich history with people who did great things.</p><h3>Alexander Hamilton:</h3><ul><li>Born in <strong>Nevis</strong>.</li><li>He was one of the Founding Fathers of the United States.</li><li>The <strong>Alexander Hamilton Museum</strong> in Charlestown is his birthplace.</li></ul><h3>Nathaniel Wells:</h3><ul><li>The son of a plantation owner and an enslaved woman in St. Kitts.</li><li>He became Britain''s first Black sheriff.</li><li>He is remembered for his success and for helping others.</li></ul>', :teacher_id, :org_id, 'Social Studies', 'beginner', 50, '3', 'Learn about Alexander Hamilton and Nathaniel Wells and the places that honor them.', 'Identify the contributions of Hamilton and Wells to history.', 'history,skn,hamilton,wells')
RETURNING id AS lesson_id_hist \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_hist, 'Where was Alexander Hamilton born?', 'St. Kitts,Nevis,Antigua,Jamaica', 'Nevis', 'Alexander Hamilton was born in Charlestown, Nevis.'),
(:lesson_id_hist, 'What is the name of the museum in Charlestown?', 'Nelson Museum,Hamilton Museum,Wells Museum,History Museum', 'Hamilton Museum', 'The museum is located at his birthplace.'),
(:lesson_id_hist, 'Nathaniel Wells was Britain''s first Black ____.', 'King,Sheriff,Teacher,Doctor', 'Sheriff', 'Nathaniel Wells became the first Black sheriff in Britain.'),
(:lesson_id_hist, 'Alexander Hamilton helped start which country?', 'Canada,France,United States,Brazil', 'United States', 'He was a Founding Father of the USA.'),
(:lesson_id_hist, 'Places of memory help us ____ the past.', 'forget,remember,change,hide', 'remember', 'Places like museums help us keep history alive.');

/********************************************************************
 * TOPIC: Civics - My Community
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Civics: My Community')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_civ FROM topics WHERE title = 'Civics: My Community' LIMIT 1 \gset

-- 1. Community Basics (Town vs Village, Features)
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_civ, 'Types of Communities') RETURNING id AS concept_id_comm \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_comm, 'Towns, Villages, and Neighborhoods', '<h2>What is a Community?</h2><p>A community is a place where people live, work, and play together.</p><h3>Large vs Small:</h3><ul><li><strong>Town:</strong> A large community with many houses, shops, and people. (Example: Basseterre, Charlestown)</li><li><strong>Village:</strong> A smaller community with fewer people.</li></ul><h3>Features:</h3><ul><li><strong>Natural Features:</strong> Made by nature. (Mountains, rivers, beaches, ghauts)</li><li><strong>Man-made Features:</strong> Made by people. (Bridges, roads, buildings, parks)</li></ul>', :teacher_id, :org_id, 'Social Studies', 'beginner', 50, '3', 'Identify different types of communities and their features.', 'Differentiate between towns and villages, and natural vs man-made features.', 'civics,community,town,village')
RETURNING id AS lesson_id_comm \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_comm, 'A large community is called a ____.', 'Village,Town,Farm,Park', 'Town', 'Towns are larger than villages.'),
(:lesson_id_comm, 'Which of these is a NATURAL feature?', 'Bridge,Road,Mountain,Building', 'Mountain', 'Mountains are made by nature.'),
(:lesson_id_comm, 'Which is an example of a man-made feature?', 'River,Beach,Sidewalk,Ocean', 'Sidewalk', 'People build sidewalks.'),
(:lesson_id_comm, 'A small community is called a ____.', 'Town,City,Village,Country', 'Village', 'Villages are smaller communities.'),
(:lesson_id_comm, 'What is a "Ghaut"?', 'A bridge,A natural water path,A large building,A type of car', 'A natural water path', 'Ghauts are natural features in St. Kitts and Nevis.');

-- 2. Needs vs Wants & Community Workers
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_civ, 'Community Life') RETURNING id AS concept_id_life \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_life, 'Community Workers, Needs, and Wants', '<h2>Living in a Community</h2><h3>Needs vs Wants:</h3><ul><li><strong>Needs:</strong> Things we MUST have to survive. (Food, water, shelter, clothing)</li><li><strong>Wants:</strong> Things we would LIKE to have but don''t need to survive. (Toys, candy, video games)</li></ul><h3>Community Workers:</h3><p>People who have jobs that help everyone in the community.</p><ul><li><strong>Police Officer:</strong> Keeps us safe. (Tools: Handcuffs, radio)</li><li><strong>Firefighter:</strong> Puts out fires. (Tools: Hose, ladder)</li><li><strong>Doctor/Nurse:</strong> Heals the sick. (Tools: Stethoscope)</li><li><strong>Teacher:</strong> Helps us learn. (Tools: Books, whiteboard)</li></ul>', :teacher_id, :org_id, 'Social Studies', 'beginner', 50, '3', 'Learn about needs, wants, and community workers.', 'Identify needs vs wants and describe the roles of community workers.', 'civics,workers,needs,wants')
RETURNING id AS lesson_id_life \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_life, 'Which of these is a NEED?', 'Video game,Water,Candy,Toy car', 'Water', 'We need water to live.'),
(:lesson_id_life, 'Which worker uses a stethoscope?', 'Police Officer,Doctor,Teacher,Baker', 'Doctor', 'Doctors use it to listen to your heart.'),
(:lesson_id_life, 'A "Want" is something that is ____.', 'Necessary for life,Nice to have,Always free,Found in nature', 'Nice to have', 'We want things like toys, but we don''t need them to survive.'),
(:lesson_id_life, 'Which tool does a firefighter use?', 'Whiteboard,Hose,Handcuffs,Oven', 'Hose', 'They use hoses to spray water on fires.'),
(:lesson_id_life, 'Why do we have community workers?', 'To make noise,To help people,To stay at home,To play games', 'To help people', 'Community workers provide services that we all need.');

-- Finalize
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
