-- SQL script for Grade 3 Term III revision content: Science

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 3 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

/********************************************************************
 * TOPIC: The Sense of Hearing & Sound
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Sense of Hearing and Sound')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_hearing FROM topics WHERE title = 'Sense of Hearing and Sound' LIMIT 1 \gset

-- 1. The Ear and Hearing
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_hearing, 'The Sense of Hearing') RETURNING id AS concept_id_ear \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_ear, 'How We Hear: The Ear', '<h2>The Sense of Hearing</h2><p>Our ears are the sensory organs we use for hearing.</p><h3>Components of the Ear:</h3><ul><li><strong>Outer Ear:</strong> Catches the sound.</li><li><strong>Ear Canal:</strong> The tunnel sound travels through.</li><li><strong>Eardrum:</strong> Vibrates when sound hits it.</li><li><strong>Inner Ear:</strong> Sends signals to the brain.</li></ul><h3>Protecting Your Ears:</h3><ul><li>Avoid very loud noises.</li><li>Never put sharp objects in your ears.</li><li>Use earplugs in noisy places.</li></ul><h3>Hearing Impairment:</h3><p>Some people have trouble hearing (hearing impairment) or cannot hear at all (deaf). They may use <strong>hearing aids</strong> or <strong>sign language</strong>.</p>', :teacher_id, :org_id, 'Science', 'beginner', 50, '3', 'Identify the parts of the ear and how to protect hearing.', 'Label ear components and describe hearing protection.', 'science,hearing,ear,safety')
RETURNING id AS lesson_id_ear \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_ear, 'Which organ do we use for hearing?', 'Eyes,Ears,Nose,Tongue', 'Ears', 'Ears are the sensory organs for hearing.'),
(:lesson_id_ear, 'What part of the ear vibrates when sound hits it?', 'Outer ear,Eardrum,Ear lobe,Inner ear', 'Eardrum', 'The eardrum is a thin membrane that vibrates.'),
(:lesson_id_ear, 'Which of these can damage your hearing?', 'Listening to soft music,Putting a pencil in your ear,Wearing a hat,Sleeping', 'Putting a pencil in your ear', 'Never put sharp objects in your ear as it can burst the eardrum.'),
(:lesson_id_ear, 'People who cannot hear at all may use ____ to communicate.', 'Megaphones,Sign Language,Sunglasses,Running', 'Sign Language', 'Sign language uses hand gestures to communicate.'),
(:lesson_id_ear, 'Which job requires very good hearing?', 'A pilot,A piano tuner,A gardener,A baker', 'A piano tuner', 'A piano tuner needs to hear very slight differences in sound.');

-- 2. What is Sound? (Movement & Pitch)
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_hearing, 'Properties of Sound') RETURNING id AS concept_id_sound \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_sound, 'Vibrations and Volume: Understanding Sound', '<h2>What is Sound?</h2><p>Sound is a form of energy made by <strong>vibrations</strong>.</p><h3>How Sound Moves:</h3><p>Sound travels in waves through solids, liquids, and gases (air). It moves fastest through solids!</p><h3>Pitch (High and Low):</h3><ul><li><strong>High Pitch:</strong> Sounds like a whistle or a bird chirping.</li><li><strong>Low Pitch:</strong> Sounds like a drum or a cow mooing.</li></ul><p>Pitch depends on how fast something vibrates. Fast vibrations = High pitch.</p>', :teacher_id, :org_id, 'Science', 'beginner', 50, '3', 'Understand how sound is produced and the concept of pitch.', 'Define sound and distinguish between high and low pitch.', 'science,sound,vibrations,pitch')
RETURNING id AS lesson_id_sound \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_sound, 'Sound is created by ____.', 'Light,Vibrations,Heat,Water', 'Vibrations', 'When something vibrates, it creates sound waves.'),
(:lesson_id_sound, 'Which of these has a HIGH pitch?', 'A big drum,A whistle,A thunder clap,A lions roar', 'A whistle', 'Whistles create fast vibrations which result in a high pitch.'),
(:lesson_id_sound, 'Sound travels FASTEST through ____.', 'Air,Water,Solids (like wood or metal),Space', 'Solids (like wood or metal)', 'Particles in solids are close together, helping sound move quickly.'),
(:lesson_id_sound, 'A slow vibration will produce a ____ pitch.', 'High,Low,Loud,Silent', 'Low', 'Slow vibrations create low-pitched sounds.'),
(:lesson_id_sound, 'Can sound travel through water?', 'Yes,No,Only on Tuesdays,Only if it is hot', 'Yes', 'Sound travels very well through water; this is how whales communicate!');

/********************************************************************
 * TOPIC: Heat Energy
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Heat Energy')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_heat FROM topics WHERE title = 'Heat Energy' LIMIT 1 \gset

-- 1. Heat Sources and Conductors
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_heat, 'Heat Production and Transfer') RETURNING id AS concept_id_heat_trans \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_heat_trans, 'Hot Stuff: Exploring Heat', '<h2>What is Heat?</h2><p>Heat is a form of energy that moves from a warmer object to a cooler one.</p><h3>Producing Heat:</h3><ul><li><strong>The Sun:</strong> Our main source of heat.</li><li><strong>Friction:</strong> Rubbing your hands together.</li><li><strong>Burning:</strong> Fire, stoves, candles.</li><li><strong>Electricity:</strong> Heaters, toasters.</li></ul><h3>Conductors and Insulators:</h3><ul><li><strong>Conductor:</strong> A material that lets heat pass through easily (e.g., Metal).</li><li><strong>Insulator (Non-conductor):</strong> A material that does NOT let heat pass through easily (e.g., Wood, Plastic, Rubber).</li></ul>', :teacher_id, :org_id, 'Science', 'beginner', 50, '3', 'Identify heat sources and distinguish between conductors and insulators.', 'Define heat and list examples of conductors and insulators.', 'science,heat,energy,conductors')
RETURNING id AS lesson_id_heat \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_heat, 'What is our primary source of heat on Earth?', 'The Moon,The Sun,The Ocean,A Flashlight', 'The Sun', 'The Sun provides heat and light to our planet.'),
(:lesson_id_heat, 'Rubbing your hands together produces heat through ____.', 'Melting,Friction,Freezing,Singing', 'Friction', 'Friction is the resistance created when two surfaces rub together.'),
(:lesson_id_heat, 'Which material is a good CONDUCTOR of heat?', 'A wooden spoon,A metal pot,A plastic cup,A rubber ball', 'A metal pot', 'Metals allow heat to pass through them quickly.'),
(:lesson_id_heat, 'An insulator is a material that ____.', 'Lets heat pass through,Blocks heat from passing easily,Makes things cold,Is always blue', 'Blocks heat from passing easily', 'Insulators like wood or plastic are used for handles on pots.'),
(:lesson_id_heat, 'Which of these is used to measure how hot something is?', 'A ruler,A thermometer,A scale,A clock', 'A thermometer', 'A thermometer detects the presence and amount of heat (temperature).');

/********************************************************************
 * TOPIC: Plants and Animals
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Plants and Animals')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_bio FROM topics WHERE title = 'Plants and Animals' LIMIT 1 \gset

-- 1. Food Chains and Classification
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_bio, 'Food Chains and Ecosystems') RETURNING id AS concept_id_food \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_food, 'Who Eats Whom: Food Chains', '<h2>Food for Life</h2><p>All living things need energy from food to survive.</p><h3>Classifying Animals:</h3><ul><li><strong>Herbivore:</strong> Eats only plants (e.g., Green Monkey, Cow).</li><li><strong>Carnivore:</strong> Eats only meat (e.g., Shark).</li><li><strong>Omnivore:</strong> Eats both plants and meat (e.g., Humans, Pigs).</li></ul><h3>Food Chains:</h3><p>A food chain shows how energy passes from one living thing to another.</p><p><strong>Example:</strong> Grass (Producer) &rarr; Grasshopper (Consumer) &rarr; Frog (Consumer) &rarr; Snake (Predator).</p><h3>Important Terms:</h3><ul><li><strong>Predator:</strong> An animal that hunts other animals.</li><li><strong>Prey:</strong> An animal that is hunted and eaten.</li><li><strong>Scavenger:</strong> Eats animals that are already dead (e.g., Vulture).</li></ul>', :teacher_id, :org_id, 'Science', 'beginner', 50, '3', 'Learn about animal diets and the flow of energy in food chains.', 'Classify animals by diet and construct a simple food chain.', 'science,biology,foodchain,animals')
RETURNING id AS lesson_id_food \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_food, 'A herbivore is an animal that eats ____.', 'Only meat,Only plants,Both plants and meat,Only rocks', 'Only plants', 'Herbivores get their energy from eating plants.'),
(:lesson_id_food, 'In a food chain, plants are called ____.', 'Consumers,Producers,Predators,Scavengers', 'Producers', 'Plants produce their own food using sunlight.'),
(:lesson_id_food, 'An animal that hunts and eats other animals is a ____.', 'Prey,Predator,Herbivore,Plant', 'Predator', 'Predators are hunters.'),
(:lesson_id_food, 'Which of these is an OMNIVORE?', 'A cow,A human,A lion,A shark', 'A human', 'Humans typically eat both plants and meat.'),
(:lesson_id_food, 'A scavenger helps the environment by ____.', 'Planting trees,Eating dead animals,Hunting lions,Sleeping all day', 'Eating dead animals', 'Scavengers like vultures clean up the remains of dead animals.');

-- Finalize
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
