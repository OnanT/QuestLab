-- SQL script for Grade 3 Term III revision content: Social Studies Culture & Economics

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 4 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

/********************************************************************
 * TOPIC: Culture - Celebrations
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Culture: Celebrations')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_cult FROM topics WHERE title = 'Culture: Celebrations' LIMIT 1 \gset

-- 1. Special Days (Christmas, New Year, Valentine's)
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_cult, 'Special Days in SKN') RETURNING id AS concept_id_days \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_days, 'Celebrating Together: Special Days', '<h2>Celebrations in St. Kitts and Nevis</h2><p>We celebrate many special days throughout the year with our family and friends.</p><h3>Christmas (December 25th):</h3><ul><li>Celebrating the birth of Jesus.</li><li>Traditions: Decorating trees, giving gifts, eating "black cake" and "sorrel".</li><li>St. Kitts Carnival (Sugar Mas) also happens during this time.</li></ul><h3>New Year''s Day (January 1st):</h3><ul><li>The start of a new calendar year.</li><li>Traditions: Fireworks, church services, and family gatherings.</li></ul><h3>Valentine''s Day (February 14th):</h3><ul><li>A day to show love and kindness to others.</li><li>Traditions: Giving cards, flowers, and chocolates.</li></ul>', :teacher_id, :org_id, 'Social Studies', 'beginner', 50, '3', 'Learn about Christmas, New Year, and Valentine''s Day traditions.', 'Identify major celebrations and their traditional activities.', 'culture,celebrations,skn')
RETURNING id AS lesson_id_days \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_days, 'On which day do we celebrate Christmas?', 'January 1st,February 14th,December 25th,July 4th', 'December 25th', 'Christmas is celebrated every December 25th.'),
(:lesson_id_days, 'What is a traditional drink during Christmas in SKN?', 'Orange juice,Sorrel,Coffee,Milk', 'Sorrel', 'Sorrel is a popular local drink during the Christmas season.'),
(:lesson_id_days, 'New Year''s Day marks the start of a new ____.', 'Month,Week,Year,Season', 'Year', 'January 1st is the first day of the new year.'),
(:lesson_id_days, 'Valentine''s Day is a day to show ____.', 'Anger,Fear,Love and Kindness,Sadness', 'Love and Kindness', 'We give cards and treats to show we care.'),
(:lesson_id_days, 'What is the name of the carnival in St. Kitts?', 'Sugar Mas,Culturama,Mardi Gras,Vincy Mas', 'Sugar Mas', 'Sugar Mas is the national carnival of St. Kitts.');

/********************************************************************
 * TOPIC: Economics - Work and Trade
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Economics: Work and Trade')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_econ FROM topics WHERE title = 'Economics: Work and Trade' LIMIT 1 \gset

-- 1. Goods vs Services
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_econ, 'Goods and Services') RETURNING id AS concept_id_gs \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_gs, 'Buying and Selling: Goods and Services', '<h2>Economics in our Community</h2><p>People work to provide things that others need or want.</p><h3>Goods:</h3><p>Things that are made or grown that you can touch and keep.</p><ul><li>Examples: Books, bread, toys, clothes, fruits from the market.</li></ul><h3>Services:</h3><p>Work that someone does for someone else.</p><ul><li>Examples: A hair cut, fixing a car, teaching a lesson, a doctor''s checkup.</li></ul><h3>Producers and Consumers:</h3><ul><li><strong>Producer:</strong> Someone who makes goods or provides services.</li><li><strong>Consumer:</strong> Someone who buys or uses goods and services.</li></ul>', :teacher_id, :org_id, 'Social Studies', 'beginner', 50, '3', 'Understand the difference between goods and services.', 'Distinguish between goods and services and identify producers and consumers.', 'economics,trade,goods,services')
RETURNING id AS lesson_id_gs \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_gs, 'Which of these is a GOOD?', 'A haircut,A loaf of bread,Teaching,Fixing a pipe', 'A loaf of bread', 'A good is something you can touch and keep.'),
(:lesson_id_gs, 'A doctor providing a checkup is a ____.', 'Good,Service,Toy,Plant', 'Service', 'A service is work done for someone else.'),
(:lesson_id_gs, 'A person who makes or grows things is a ____.', 'Consumer,Producer,Customer,Buyer', 'Producer', 'Producers make goods or provide services.'),
(:lesson_id_gs, 'Which of these is a SERVICE?', 'A toy car,A bicycle,A bus ride,A book', 'A bus ride', 'The driver provides a service by taking you somewhere.'),
(:lesson_id_gs, 'A consumer is someone who ____ goods and services.', 'Makes,Sells,Buys or Uses,Hides', 'Buys or Uses', 'We are all consumers when we go to the shop.');

-- Finalize
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
