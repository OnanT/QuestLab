-- SQL script for Grade 3 Term III revision content: Social Studies Economics & Infrastructure

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 4 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

/********************************************************************
 * TOPIC: Communication
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Infrastructure: Communication')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_comm FROM topics WHERE title = 'Infrastructure: Communication' LIMIT 1 \gset

-- 1. Communication Methods (Traditional vs Modern)
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_comm, 'Communication Methods') RETURNING id AS concept_id_meth \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_meth, 'Connecting People: Communication', '<h2>What is Communication?</h2><p>Communication is the way we share information, ideas, and feelings with others.</p><h3>Traditional (Old) Ways:</h3><ul><li>Letters (Snail mail)</li><li>Smoke signals</li><li>Drums</li><li>Face-to-face talking</li></ul><h3>Modern (New) Ways:</h3><ul><li>Mobile phones (Texting, calling)</li><li>Email</li><li>Social Media</li><li>Video calls (Zoom, WhatsApp)</li></ul><h3>Communication Centers in SKN:</h3><ul><li>Post Offices</li><li>ZIZ Broadcasting Corporation</li><li>Telecommunication offices (Flow, Digicel)</li></ul>', :teacher_id, :org_id, 'Social Studies', 'beginner', 50, '3', 'Learn about traditional and modern communication methods and centers in SKN.', 'Identify various communication tools and distinguish between traditional and modern methods.', 'civics,communication,skn')
RETURNING id AS lesson_id_meth \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_meth, 'Which of these is a MODERN way to communicate?', 'Smoke signals,Drums,Email,Letter in a bottle', 'Email', 'Email is a fast, modern way to send messages using the internet.'),
(:lesson_id_meth, 'Which center in St. Kitts and Nevis broadcasts news and shows?', 'The Bank,ZIZ,The Police Station,The Hospital', 'ZIZ', 'ZIZ is the national broadcasting corporation of SKN.'),
(:lesson_id_meth, 'Writing a letter and sending it by post is a ____ method.', 'Traditional,Modern,Future,Magic', 'Traditional', 'Sending paper letters is an older, traditional way to communicate.'),
(:lesson_id_meth, 'Who is a communication worker?', 'A farmer,A postman,A fisherman,A carpenter', 'A postman', 'A postman delivers letters and packages.'),
(:lesson_id_meth, 'What tool do we use for a video call?', 'A hammer,A smartphone or computer,A book,A bicycle', 'A smartphone or computer', 'These devices have cameras and internet for video calls.');

/********************************************************************
 * TOPIC: Transportation
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Infrastructure: Transportation')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_trans FROM topics WHERE title = 'Infrastructure: Transportation' LIMIT 1 \gset

-- 1. Modes of Transport & History
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_trans, 'Modes of Transportation') RETURNING id AS concept_id_mode \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_mode, 'On the Move: Transportation', '<h2>What is Transportation?</h2><p>Transportation is the movement of people and goods from one place to another.</p><h3>Means of Transportation:</h3><ul><li><strong>Land:</strong> Cars, buses, bicycles, donkeys (traditional).</li><li><strong>Sea:</strong> Boats, ferries (like the Sea Bridge), ships.</li><li><strong>Air:</strong> Airplanes, helicopters.</li></ul><h3>History:</h3><p>Long ago, people used animals like horses and donkeys. Today, we use fast engines in cars and planes.</p>', :teacher_id, :org_id, 'Social Studies', 'beginner', 50, '3', 'Identify different modes of transportation and their history.', 'Classify transportation by land, air, and sea.', 'civics,transportation,land,air,sea')
RETURNING id AS lesson_id_mode \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_mode, 'Which of these is transportation by SEA?', 'Airplane,Bicycle,Ferry,Bus', 'Ferry', 'A ferry travels on water.'),
(:lesson_id_mode, 'Which animal was traditionally used for transport in Nevis?', 'Lion,Elephant,Donkey,Tiger', 'Donkey', 'Donkeys were commonly used to carry people and goods.'),
(:lesson_id_mode, 'What is the fastest way to travel to another country?', 'Walking,Boat,Airplane,Bicycle', 'Airplane', 'Airplanes are the fastest mode of transport for long distances.'),
(:lesson_id_mode, 'The "Sea Bridge" connects St. Kitts and ____.', 'Nevis,Antigua,Montserrat,London', 'Nevis', 'The Sea Bridge ferry connects the two islands of our federation.'),
(:lesson_id_mode, 'Cars and buses are examples of ____ transport.', 'Air,Land,Sea,Space', 'Land', 'They travel on roads on the land.');

-- 2. Road Safety & Traffic Signs
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_trans, 'Road Safety') RETURNING id AS concept_id_safe \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_safe, 'Safety First: Road Rules', '<h2>Staying Safe on the Road</h2><p>Rules keep us safe when we are walking or driving.</p><h3>Important Rules:</h3><ul><li>Look both ways before crossing.</li><li>Use the <strong>pedestrian crossing</strong> (Zebra crossing).</li><li>Walk on the sidewalk.</li><li>Wear your seatbelt in the car.</li><li>Never drink and drive.</li></ul><h3>Traffic Signs:</h3><ul><li><strong>Red Light:</strong> STOP.</li><li><strong>Yellow Light:</strong> SLOW DOWN / PREPARE TO STOP.</li><li><strong>Green Light:</strong> GO.</li><li><strong>Stop Sign:</strong> Octagon shape, means stop completely.</li></ul>', :teacher_id, :org_id, 'Social Studies', 'beginner', 50, '3', 'Learn road safety rules and traffic signs.', 'Identify traffic signs and apply road safety rules.', 'civics,safety,road,traffic')
RETURNING id AS lesson_id_safe \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_safe, 'What does a RED traffic light mean?', 'Go,Stop,Slow down,Dance', 'Stop', 'Red means you must stop.'),
(:lesson_id_safe, 'Where is the safest place to cross the road?', 'Anywhere,Between parked cars,At a pedestrian crossing,On a corner', 'At a pedestrian crossing', 'Pedestrian crossings are marked for safety.'),
(:lesson_id_safe, 'When in a car, you should always wear your ____.', 'Hat,Sunglasses,Seatbelt,Backpack', 'Seatbelt', 'Seatbelts keep you safe if there is an accident.'),
(:lesson_id_safe, 'What should you do before crossing the street?', 'Run fast,Look both ways,Close your eyes,Call a friend', 'Look both ways', 'Always look right, then left, then right again.'),
(:lesson_id_safe, 'A STOP sign has ____ sides.', '4,6,8,3', '8', 'A stop sign is an octagon, which has 8 sides.');

-- Finalize
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
