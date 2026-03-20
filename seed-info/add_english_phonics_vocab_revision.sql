-- SQL script for Grade 3 Term III revision content: English Phonics & Vocabulary

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 2 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

/********************************************************************
 * TOPIC: Phonics
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Phonics & Sound Patterns')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_phonics FROM topics WHERE title = 'Phonics & Sound Patterns' LIMIT 1 \gset

-- 1. Diphthongs (or,oy,ow,ou,aw)
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_phonics, 'Diphthongs (or, oy, ow, ou, aw)') RETURNING id AS concept_id_dip \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_dip, 'Dancing Vowels: Diphthongs', '<h2>Diphthongs: Two sounds in one!</h2><p>A diphthong is a sound formed by the combination of two vowels in a single syllable.</p><h3>Common Diphthongs:</h3><ul><li><strong>or:</strong> fork, horn, storm</li><li><strong>oy:</strong> toy, boy, joy</li><li><strong>ow:</strong> cow, town, clown</li><li><strong>ou:</strong> house, cloud, sound</li><li><strong>aw:</strong> claw, saw, draw</li></ul>', :teacher_id, :org_id, 'English Language', 'beginner', 50, '3', 'Learn how to identify and pronounce common diphthongs.', 'Identify diphthongs in words and use them correctly.', 'phonics,diphthongs,english')
RETURNING id AS lesson_id_dip \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_dip, 'Which word has the "ou" diphthong?', 'book,house,play,sing', 'house', '"House" contains the "ou" sound.'),
(:lesson_id_dip, 'Choose the correct diphthong for: "I can see the ____ (c_w)."', 'aw,ow,oy,ou', 'ow', 'The word is "cow", using the "ow" diphthong.'),
(:lesson_id_dip, 'Which word contains the "oy" sound?', 'boy,boat,bowl,bought', 'boy', '"Boy" contains the "oy" diphthong.'),
(:lesson_id_dip, 'Finish the word: "st_ _m" (a strong wind with rain).', 'ow,ou,or,aw', 'or', 'The word is "storm".'),
(:lesson_id_dip, 'Which word does NOT have a diphthong?', 'toy,saw,cat,cloud', 'cat', '"Cat" has a short "a" sound, not a diphthong.');

-- 2. Y as a consonant and a vowel
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_phonics, 'The Letter Y: Consonant and Vowel') RETURNING id AS concept_id_y \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_y, 'The Secret Life of the Letter Y', '<h2>The Letter Y: A master of disguise!</h2><p>Did you know the letter Y can be a consonant OR a vowel?</p><h3>Y as a Consonant:</h3><p>When Y is at the <strong>beginning</strong> of a word or syllable, it acts as a consonant.</p><ul><li><strong>Y</strong>ellow, <strong>Y</strong>es, <strong>Y</strong>ard</li></ul><h3>Y as a Vowel:</h3><p>When Y is in the <strong>middle</strong> or at the <strong>end</strong> of a word, it acts as a vowel (making the "i" or "e" sound).</p><ul><li>Sk<strong>y</strong>, Fl<strong>y</strong> (sounds like long i)</li><li>Happ<strong>y</strong>, Cand<strong>y</strong> (sounds like long e)</li><li>Gym (sounds like short i)</li></ul>', :teacher_id, :org_id, 'English Language', 'beginner', 50, '3', 'Understand how the letter Y functions as both a consonant and a vowel.', 'Identify the sound of Y in different positions in words.', 'phonics,letter-y,english')
RETURNING id AS lesson_id_y \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_y, 'In which word is "y" acting as a consonant?', 'sky,yellow,candy,fly', 'yellow', '"Y" is at the beginning of "yellow", making it a consonant.'),
(:lesson_id_y, 'What vowel sound does "y" make in the word "happy"?', 'long i,long e,short a,short o', 'long e', 'The "y" in "happy" sounds like a long "e".'),
(:lesson_id_y, 'In the word "sky", the "y" sounds like which vowel?', 'long a,long i,short i,long o', 'long i', 'The "y" in "sky" sounds like a long "i".'),
(:lesson_id_y, 'Which word uses "y" as a consonant?', 'fly,my,yard,cry', 'yard', '"Y" at the beginning of "yard" is a consonant.'),
(:lesson_id_y, 'Is "y" a vowel or consonant in "gym"?', 'vowel,consonant', 'vowel', 'In "gym", "y" acts as a short "i" vowel.');

-- 3. S Blends and L Blends
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_phonics, 'S Blends and L Blends') RETURNING id AS concept_id_blends \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_blends, 'S Blends and L Blends: Joining Sounds', '<h2>Blends: Sounds that stick together!</h2><p>A blend is when two or more consonants are joined together, but you can still hear each sound.</p><h3>S Blends:</h3><ul><li><strong>sn</strong>ake, <strong>sm</strong>all, <strong>sk</strong>ate, <strong>sc</strong>hool, <strong>sp</strong>oon, <strong>st</strong>ar</li></ul><h3>L Blends:</h3><ul><li><strong>fl</strong>ower, <strong>pl</strong>ant, <strong>sl</strong>ide, <strong>gl</strong>ass, <strong>bl</strong>ack</li></ul>', :teacher_id, :org_id, 'English Language', 'beginner', 50, '3', 'Learn to identify and pronounce S and L blends.', 'Identify S blends and L blends in common words.', 'phonics,blends,english')
RETURNING id AS lesson_id_blends \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_blends, 'Which word has an "S" blend?', 'bell,star,cake,dog', 'star', '"St" in "star" is an S blend.'),
(:lesson_id_blends, 'Identify the "L" blend in "flower".', 'fl,ow,er,lo', 'fl', '"Fl" is the L blend in "flower".'),
(:lesson_id_blends, 'Complete the word: "_ _ oon" (something we use to eat soup).', 'sk,sp,sm,st', 'sp', 'The word is "spoon", using the "sp" blend.'),
(:lesson_id_blends, 'Which word starts with an "L" blend?', 'snake,glass,spoon,trip', 'glass', '"Gl" in "glass" is an L blend.'),
(:lesson_id_blends, 'Find the blend in "small".', 'sm,ma,ll,al', 'sm', '"Sm" is the S blend.');

-- 4. Syllabication
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_phonics, 'Syllabication: Breaking Words Apart') RETURNING id AS concept_id_syl \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_syl, 'Syllabication: The Beats of Words', '<h2>Syllables: Word beats!</h2><p>A syllable is a part of a word that contains a single vowel sound. We can "clap" the syllables in a word.</p><h3>How to break words:</h3><ul><li><strong>Dog:</strong> 1 syllable (dog)</li><li><strong>Ti-ger:</strong> 2 syllables (ti-ger)</li><li><strong>Ba-na-na:</strong> 3 syllables (ba-na-na)</li></ul><h3>Rules:</h3><p>Every syllable must have at least one vowel sound!</p>', :teacher_id, :org_id, 'English Language', 'beginner', 50, '3', 'Learn how to divide words into syllables.', 'Identify the number of syllables in words and divide them correctly.', 'phonics,syllables,english')
RETURNING id AS lesson_id_syl \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_syl, 'How many syllables are in the word "apple"?', '1,2,3,4', '2', 'ap-ple (2 syllables).'),
(:lesson_id_syl, 'Which word has only 1 syllable?', 'tiger,elephant,cat,rainbow', 'cat', 'Cat has only 1 vowel sound.'),
(:lesson_id_syl, 'Divide "computer" into syllables.', 'com-pu-ter,comp-uter,comput-er,c-o-m-p-u-t-e-r', 'com-pu-ter', 'com-pu-ter has 3 syllables.'),
(:lesson_id_syl, 'How many syllables in "yesterday"?', '2,3,4,5', '3', 'yes-ter-day (3 syllables).'),
(:lesson_id_syl, 'Clap the word "school". How many claps?', '1,2,3,4', '1', 'School has 1 syllable.');

/********************************************************************
 * TOPIC: Vocabulary
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'English Vocabulary Builders')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_vocab FROM topics WHERE title = 'English Vocabulary Builders' LIMIT 1 \gset

-- 1. Compound Words
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_vocab, 'Compound Words') RETURNING id AS concept_id_comp \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_comp, 'Compound Words: Two in One!', '<h2>Compound Words: Putting words together!</h2><p>A compound word is made when two smaller words are joined together to form a new word with a new meaning.</p><h3>Examples:</h3><ul><li><strong>Sun + Flower = Sunflower</strong></li><li><strong>Rain + Bow = Rainbow</strong></li><li><strong>Foot + Ball = Football</strong></li><li><strong>Star + Fish = Starfish</strong></li></ul>', :teacher_id, :org_id, 'English Language', 'beginner', 50, '3', 'Learn how compound words are formed.', 'Identify and create compound words.', 'vocabulary,compound-words,english')
RETURNING id AS lesson_id_comp \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_comp, 'Which of these is a compound word?', 'happy,bedroom,apple,running', 'bedroom', 'Bed + Room = Bedroom.'),
(:lesson_id_comp, 'What word is formed by "cup" and "cake"?', 'cuppy,cakes,cupcake,cupping', 'cupcake', 'Cup + Cake = Cupcake.'),
(:lesson_id_comp, 'Find the two words in "fireman".', 'fire and man,fir and eman,f and ireman,firem and an', 'fire and man', 'Fire + Man = Fireman.'),
(:lesson_id_comp, 'Which word is NOT a compound word?', 'starlight,backpack,butterfly,teacher', 'teacher', '"Teacher" is one word, not two joined together.'),
(:lesson_id_comp, 'Rain + Coat = ?', 'Rainfall,Raincoat,Raining,Coatrain', 'Raincoat', 'Rain + Coat = Raincoat.');

-- 2. Homographs
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_vocab, 'Homographs') RETURNING id AS concept_id_homo \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_homo, 'Homographs: Same Spelling, Different Meaning', '<h2>Homographs: Twins that act differently!</h2><p>Homographs are words that are spelled the same but have different meanings.</p><h3>Examples:</h3><ul><li><strong>Bat:</strong> A piece of sports equipment OR a flying animal.</li><li><strong>Bark:</strong> The outer layer of a tree OR the sound a dog makes.</li><li><strong>Bank:</strong> A place to keep money OR the side of a river.</li><li><strong>Watch:</strong> To look at something OR a small clock you wear on your wrist.</li></ul>', :teacher_id, :org_id, 'English Language', 'beginner', 50, '3', 'Understand what homographs are and how context helps define them.', 'Identify homographs and explain their different meanings.', 'vocabulary,homographs,english')
RETURNING id AS lesson_id_homo \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_homo, 'Which word is a homograph?', 'apple,bat,house,jump', 'bat', '"Bat" can mean a flying animal or a sports tool.'),
(:lesson_id_homo, 'In the sentence "The dog has a loud bark", what does "bark" mean?', 'Tree skin,A dog sound,A type of food,To sleep', 'A dog sound', 'In this context, it is the sound a dog makes.'),
(:lesson_id_homo, 'A place where you keep money is a...', 'Beach,Bank,Forest,Library', 'Bank', '"Bank" is a homograph.'),
(:lesson_id_homo, 'Which meaning of "watch" is used here: "I like to watch movies."', 'A clock,To look at,To listen,To run', 'To look at', 'In this sentence, "watch" means to look at.'),
(:lesson_id_homo, 'The side of a river is called a...', 'Riverbed,Riverbank,Riverpark,Riverside', 'Riverbank', '"Bank" means the side of a river.');

-- 3. Similes
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_vocab, 'Similes') RETURNING id AS concept_id_sim \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_sim, 'Similes: Comparisons using Like or As', '<h2>Similes: Making writing colorful!</h2><p>A simile compares two things using the words <strong>"like"</strong> or <strong>"as"</strong>.</p><h3>Examples:</h3><ul><li>As brave <strong>as</strong> a lion.</li><li>Eat <strong>like</strong> a pig.</li><li>As cool <strong>as</strong> a cucumber.</li><li>Fast <strong>like</strong> the wind.</li></ul><p>Similes help us paint a picture in the reader''s mind!</p>', :teacher_id, :org_id, 'English Language', 'beginner', 50, '3', 'Learn how to use similes to enhance descriptive writing.', 'Identify and create similes using "like" and "as".', 'vocabulary,similes,english')
RETURNING id AS lesson_id_sim \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_sim, 'Which of these is a simile?', 'He is tall.,He is as tall as a giant.,He is a giant.,He is very tall.', 'He is as tall as a giant.', 'It compares him to a giant using "as".'),
(:lesson_id_sim, 'Complete the simile: "As busy as a ____."', 'dog,bee,cat,fish', 'bee', 'The common simile is "as busy as a bee".'),
(:lesson_id_sim, 'A simile uses the words "like" or ____.', 'but,as,and,so', 'as', 'Similes use "like" or "as".'),
(:lesson_id_sim, 'Which sentence uses "like" to make a simile?', 'I like apples.,She runs like the wind.,He looks like his dad.,Do you like to play?', 'She runs like the wind.', 'It compares her running to the wind.'),
(:lesson_id_sim, 'Complete the simile: "As white as ____."', 'coal,snow,grass,the sun', 'snow', 'The common simile is "as white as snow".');

-- 4. Indefinite Articles (a, an)
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_vocab, 'Indefinite Articles: A and An') RETURNING id AS concept_id_art \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_art, 'Indefinite Articles: A or An?', '<h2>A and An: Choosing the right one!</h2><p>We use "a" and "an" before singular nouns. But how do we know which one to pick?</p><h3>The Rule:</h3><ul><li>Use <strong>"an"</strong> before words that start with a <strong>vowel sound</strong> (a, e, i, o, u).<br><em><strong>An</strong> apple, <strong>an</strong> egg, <strong>an</strong> igloo, <strong>an</strong> orange, <strong>an</strong> umbrella.</em></li><li>Use <strong>"a"</strong> before words that start with a <strong>consonant sound</strong>.<br><em><strong>A</strong> ball, <strong>a</strong> cat, <strong>a</strong> dog, <strong>a</strong> fish.</em></li></ul>', :teacher_id, :org_id, 'English Language', 'beginner', 50, '3', 'Learn the rules for using "a" and "an" correctly.', 'Apply the rules for indefinite articles in sentences.', 'vocabulary,articles,english')
RETURNING id AS lesson_id_art \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_art, 'I ate ____ apple.', 'a,an', 'an', '"Apple" starts with a vowel sound, so we use "an".'),
(:lesson_id_art, 'She has ____ new bike.', 'a,an', 'a', '"New" starts with a consonant sound, so we use "a".'),
(:lesson_id_art, 'I saw ____ elephant at the zoo.', 'a,an', 'an', '"Elephant" starts with a vowel sound.'),
(:lesson_id_art, 'There is ____ bug on the wall.', 'a,an', 'a', '"Bug" starts with a consonant sound.'),
(:lesson_id_art, 'He is eating ____ orange.', 'a,an', 'an', '"Orange" starts with a vowel sound.');

-- Finalize
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
