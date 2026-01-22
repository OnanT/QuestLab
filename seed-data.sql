-- QuestLab Seed Data
-- This script populates the database with demo users, lessons, quizzes, and games

-- ==================== DEMO USERS ====================
-- Note: All passwords are hashed for 'password123'
-- In production, these would be properly hashed by your backend

INSERT INTO users (username, email, hashed_password, role, avatar, points, level, streak) VALUES
-- Admin
('admin', 'admin@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'admin', 'admin_avatar.png', 1000, 'Master', 30),

-- Teachers
('ms_johnson', 'teacher1@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'teacher', 'teacher1_avatar.png', 500, 'Expert', 20),
('mr_williams', 'teacher2@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'teacher', 'teacher2_avatar.png', 450, 'Expert', 18),

-- Parents
('parent_smith', 'parent1@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'parent', 'parent1_avatar.png', 0, 'Explorer', 0),
('parent_jones', 'parent2@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'parent', 'parent2_avatar.png', 0, 'Explorer', 0),

-- Students (linked to parents)
('alex_smith', 'alex@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'student', 'student1_avatar.png', 350, 'Adventurer', 7, 4),
('emma_smith', 'emma@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'student', 'student2_avatar.png', 420, 'Scholar', 12, 4),
('marcus_jones', 'marcus@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'student', 'student3_avatar.png', 280, 'Adventurer', 5, 5),
('sophia_jones', 'sophia@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'student', 'student4_avatar.png', 510, 'Scholar', 15, 5),

-- More students without parents
('james_brown', 'james@questlab.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5dWg7S4qBOK8a', 'student', 'student5_avatar.png', 195, 'Explorer', 3, NULL);

-- ==================== CURRICULUM DATA ====================

-- School Years for Barbados
INSERT INTO school_years (country_id, year_label) VALUES
(1, 'Year 1'),
(1, 'Year 2'),
(1, 'Year 3'),
(1, 'Year 4'),
(1, 'Year 5'),
(1, 'Year 6');

-- Terms for School Years
INSERT INTO terms (school_year_id, term_number, title) VALUES
-- Year 1 terms
(1, 1, 'Michaelmas Term'),
(1, 2, 'Hilary Term'),
(1, 3, 'Trinity Term'),
-- Year 2 terms
(2, 1, 'Michaelmas Term'),
(2, 2, 'Hilary Term'),
(2, 3, 'Trinity Term');

-- Curriculum Subjects (Grade-specific)
INSERT INTO curriculum_subjects (country_id, subject_id, grade_level) VALUES
-- Barbados - Grade 1-6 subjects
(1, 1, 1), -- Mathematics Year 1
(1, 2, 1), -- English Year 1
(1, 3, 1), -- Science Year 1
(1, 4, 1), -- Social Studies Year 1
(1, 5, 1), -- Creative Arts Year 1
(1, 1, 2), -- Mathematics Year 2
(1, 2, 2), -- English Year 2
(1, 3, 2); -- Science Year 2

-- Topics
INSERT INTO topics (curriculum_subject_id, term_id, title) VALUES
(1, 1, 'Numbers and Counting'),
(1, 1, 'Basic Addition'),
(2, 1, 'Reading Basics'),
(2, 1, 'Letter Recognition'),
(3, 1, 'Living Things'),
(3, 1, 'Plants and Animals');

-- Concepts
INSERT INTO concepts (topic_id, title) VALUES
(1, 'Counting to 10'),
(1, 'Counting to 20'),
(2, 'Adding Single Digits'),
(2, 'Adding with Objects'),
(3, 'The Alphabet'),
(3, 'Vowels and Consonants'),
(5, 'What are Living Things?'),
(5, 'Needs of Living Things');

-- ==================== LESSONS ====================

INSERT INTO lessons (concept_id, title, content_html, creator_id, category, difficulty, estimated_time, points, grade_levels, description, objectives, prerequisites, tags) VALUES
-- Math Lessons
(1, 'Introduction to Counting', 
'<h1>Let''s Learn to Count!</h1>
<p>Counting is one of the first math skills we learn. Today we''ll practice counting from 1 to 10.</p>
<h2>What is Counting?</h2>
<p>Counting means saying numbers in order: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10!</p>
<h2>Let''s Practice!</h2>
<p>Count these items:</p>
<ul>
  <li>🍎 How many apples? (3 apples)</li>
  <li>⭐ How many stars? (5 stars)</li>
  <li>🐟 How many fish? (7 fish)</li>
</ul>
<h2>Fun Activity</h2>
<p>Find 5 objects in your room and count them aloud!</p>',
2, 'Mathematics', 'beginner', 15, 50, '1', 
'Learn to count from 1 to 10 using fun objects and examples',
'Students will be able to count objects from 1 to 10 accurately',
'None - perfect for beginners',
'counting,numbers,math,basics'),

(2, 'Counting to 20',
'<h1>Counting Higher Numbers</h1>
<p>Now that you can count to 10, let''s count even higher - all the way to 20!</p>
<h2>Numbers 11-20</h2>
<p>After 10 comes: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20</p>
<h2>Practice Time!</h2>
<p>Let''s count by pointing at each number:</p>
<p>1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20!</p>
<h2>Caribbean Fun Fact</h2>
<p>Did you know Barbados has 11 parishes? Can you count them all?</p>',
2, 'Mathematics', 'beginner', 20, 60, '1,2',
'Extend counting skills from 10 to 20',
'Count from 1 to 20 and recognize numbers',
'Ability to count to 10',
'counting,numbers,teen numbers'),

(3, 'Simple Addition',
'<h1>Adding Numbers Together</h1>
<p>Addition means putting numbers together to find out how many you have in total!</p>
<h2>What is Addition?</h2>
<p>When we add, we use the + sign. Example: 2 + 3 = 5</p>
<h2>Let''s Try Some!</h2>
<ul>
  <li>1 + 1 = 2</li>
  <li>2 + 2 = 4</li>
  <li>3 + 2 = 5</li>
  <li>4 + 1 = 5</li>
</ul>
<h2>Story Problem</h2>
<p>Marcus has 2 mangoes 🥭. His friend gives him 3 more mangoes 🥭🥭🥭. How many mangoes does Marcus have now?</p>
<p>Answer: 2 + 3 = 5 mangoes!</p>',
2, 'Mathematics', 'beginner', 25, 75, '1,2',
'Learn basic addition with numbers 1-10',
'Add single-digit numbers using objects and pictures',
'Counting to 10',
'addition,math,single digit,operations'),

-- English Lessons
(5, 'The Alphabet Song',
'<h1>Learning Our ABCs</h1>
<p>The alphabet has 26 letters. Let''s learn them all!</p>
<h2>The Alphabet</h2>
<p><strong>A B C D E F G<br>H I J K L M N O P<br>Q R S T U V<br>W X Y and Z</strong></p>
<h2>Capital and Lowercase</h2>
<p>Each letter has two forms:</p>
<ul>
  <li>Capital (big): A B C</li>
  <li>Lowercase (small): a b c</li>
</ul>
<h2>Fun Activity</h2>
<p>Sing the alphabet song and point to each letter!</p>',
2, 'English Language', 'beginner', 20, 50, '1',
'Learn all 26 letters of the alphabet',
'Recite the alphabet and recognize letter shapes',
'None',
'alphabet,letters,literacy,reading'),

(6, 'Vowels and Consonants',
'<h1>Special Letters: Vowels</h1>
<p>Some letters are extra special - they''re called vowels!</p>
<h2>The Five Vowels</h2>
<p>A, E, I, O, U - these are our vowels!</p>
<h2>The Rest are Consonants</h2>
<p>All the other letters (B, C, D, F, G, etc.) are consonants.</p>
<h2>Caribbean Words Practice</h2>
<p>Let''s find vowels in Caribbean words:</p>
<ul>
  <li><strong>B A R B A D O S</strong> - How many vowels? (4: A, A, O)</li>
  <li><strong>B E A C H</strong> - How many vowels? (2: E, A)</li>
  <li><strong>S U N</strong> - How many vowels? (1: U)</li>
</ul>',
3, 'English Language', 'beginner', 25, 60, '1,2',
'Identify vowels and consonants in words',
'Distinguish between vowels (A,E,I,O,U) and consonants',
'Know the alphabet',
'vowels,consonants,letters,phonics'),

-- Science Lessons
(7, 'What are Living Things?',
'<h1>Living vs Non-Living</h1>
<p>Everything around us is either living or non-living. Let''s learn the difference!</p>
<h2>Living Things</h2>
<p>Living things:</p>
<ul>
  <li>✅ Grow and change</li>
  <li>✅ Need food and water</li>
  <li>✅ Can have babies</li>
  <li>✅ Breathe</li>
</ul>
<h2>Examples of Living Things</h2>
<p>🌴 Palm trees, 🐠 Flying fish, 🦎 Lizards, 🌺 Hibiscus flowers, 🐒 Green monkeys</p>
<h2>Non-Living Things</h2>
<p>Non-living things don''t grow, eat, or breathe:</p>
<p>🪨 Rocks, 💧 Water, ☀️ Sunshine, 🏖️ Sand</p>
<h2>Caribbean Activity</h2>
<p>Look around! Name 5 living things you can see in Barbados!</p>',
2, 'Science', 'beginner', 30, 70, '1,2',
'Understand the characteristics of living things',
'Distinguish between living and non-living things',
'None',
'living things,science,nature,biology'),

(8, 'Needs of Living Things',
'<h1>What Do Living Things Need?</h1>
<p>All living things need certain things to survive!</p>
<h2>The Basic Needs</h2>
<ol>
  <li><strong>Air</strong> - to breathe</li>
  <li><strong>Water</strong> - to drink</li>
  <li><strong>Food</strong> - for energy</li>
  <li><strong>Shelter</strong> - a safe place to live</li>
  <li><strong>Space</strong> - room to grow</li>
</ol>
<h2>Caribbean Examples</h2>
<p><strong>Sea Turtles 🐢</strong></p>
<ul>
  <li>Air: Come to surface to breathe</li>
  <li>Water: Live in the ocean</li>
  <li>Food: Eat sea grass and jellyfish</li>
  <li>Shelter: Sandy beaches for nesting</li>
</ul>
<p><strong>Coconut Trees 🥥</strong></p>
<ul>
  <li>Air: Get from atmosphere</li>
  <li>Water: Roots drink from soil</li>
  <li>Food: Make their own from sunlight!</li>
  <li>Space: Need room for roots and branches</li>
</ul>',
2, 'Science', 'beginner', 25, 65, '1,2',
'Learn what all living things need to survive',
'Identify the five basic needs of living things',
'Understanding of living vs non-living',
'needs,survival,habitats,animals,plants');

-- ==================== QUIZZES ====================

INSERT INTO quizzes (lesson_id, question, question_type, options, correct_answer, explanation, points, difficulty, tags) VALUES
-- Counting to 10 Quiz
(1, 'Count the apples: 🍎🍎🍎🍎🍎', 'mc_single', '3,4,5,6', '5', 'There are 5 apples. Count each one: 1, 2, 3, 4, 5!', 10, 'beginner', 'counting'),
(1, 'What number comes after 7?', 'mc_single', '6,8,9,10', '8', 'When counting: 6, 7, 8, 9, 10. So 8 comes after 7!', 10, 'beginner', 'number order'),
(1, 'How many fingers do you have on both hands?', 'mc_single', '5,8,10,12', '10', 'You have 5 fingers on each hand. 5 + 5 = 10!', 10, 'beginner', 'counting,real world'),

-- Counting to 20 Quiz
(2, 'What number comes after 15?', 'mc_single', '14,16,17,18', '16', 'When counting: 14, 15, 16, 17. So 16 comes after 15!', 10, 'beginner', 'teen numbers'),
(2, 'Count by 10s: 10, ___, 30', 'mc_single', '15,20,25,30', '20', 'When counting by 10s: 10, 20, 30. The missing number is 20!', 10, 'beginner', 'skip counting'),
(2, 'How many is 1 ten and 7 ones?', 'mc_single', '8,17,70,71', '17', '1 ten = 10, plus 7 ones = 17!', 15, 'beginner', 'place value'),

-- Addition Quiz
(3, 'What is 2 + 3?', 'mc_single', '4,5,6,7', '5', '2 + 3 = 5. You can count: 2... then 3 more makes 3, 4, 5!', 10, 'beginner', 'addition'),
(3, 'Marcus has 4 pencils. Emma gives him 2 more. How many does he have?', 'mc_single', '2,4,6,8', '6', '4 + 2 = 6 pencils total!', 15, 'beginner', 'word problems'),
(3, 'What is 5 + 1?', 'mc_single', '4,5,6,7', '6', '5 + 1 = 6. Five and one more makes six!', 10, 'beginner', 'addition'),

-- Alphabet Quiz
(4, 'How many letters are in the alphabet?', 'mc_single', '20,24,26,28', '26', 'The alphabet has 26 letters from A to Z!', 10, 'beginner', 'alphabet'),
(4, 'What letter comes after B?', 'mc_single', 'A,C,D,E', 'C', 'The alphabet goes: A, B, C, D. So C comes after B!', 10, 'beginner', 'letter order'),
(4, 'Which letter comes first in the alphabet?', 'mc_single', 'A,B,C,Z', 'A', 'A is the first letter of the alphabet!', 10, 'beginner', 'alphabet'),

-- Vowels Quiz
(5, 'Which letter is a vowel?', 'mc_single', 'B,E,F,G', 'E', 'E is one of the five vowels: A, E, I, O, U!', 10, 'beginner', 'vowels'),
(5, 'How many vowels are in the word "CAT"?', 'mc_single', '0,1,2,3', '1', 'CAT has one vowel: A. C and T are consonants.', 10, 'beginner', 'vowels,words'),
(5, 'Which of these is NOT a vowel?', 'mc_single', 'A,I,O,M', 'M', 'M is a consonant. The vowels are A, E, I, O, U.', 10, 'beginner', 'vowels,consonants'),

-- Living Things Quiz
(6, 'Which of these is a living thing?', 'mc_single', 'Rock,Tree,Water,Sand', 'Tree', 'A tree is living - it grows, needs water, and makes seeds!', 10, 'beginner', 'living things'),
(6, 'What do all living things need?', 'mc_single', 'Toys,Food and water,Books,Games', 'Food and water', 'All living things need food and water to survive!', 10, 'beginner', 'needs'),
(6, 'Which animal is native to Barbados?', 'mc_single', 'Polar bear,Green monkey,Penguin,Elephant', 'Green monkey', 'Green monkeys live in Barbados! The others live in different climates.', 15, 'beginner', 'caribbean,animals'),

-- Needs of Living Things Quiz
(7, 'What do plants need to make food?', 'mc_single', 'Moon,Sunlight,Stars,Snow', 'Sunlight', 'Plants use sunlight to make their own food through photosynthesis!', 10, 'beginner', 'plants'),
(7, 'Why do sea turtles come to the beach?', 'mc_single', 'To play,To lay eggs,To sleep,To eat sand', 'To lay eggs', 'Sea turtles lay their eggs in the sand on Caribbean beaches!', 15, 'beginner', 'caribbean,animals'),
(7, 'Which of these do coconut trees need?', 'mc_single', 'Television,Space to grow,Video games,Ice', 'Space to grow', 'Coconut trees need space for their roots and branches to grow big and strong!', 10, 'beginner', 'plants,caribbean');

-- ==================== GAMES ====================

INSERT INTO games (lesson_id, game_engine_id, config_json) VALUES
-- Counting Game
(1, 1, '{
  "type": "counting",
  "difficulty": "easy",
  "timeLimit": 60,
  "questions": [
    {"type": "count", "objects": "apple", "count": 5},
    {"type": "count", "objects": "star", "count": 7},
    {"type": "count", "objects": "fish", "count": 4}
  ]
}'),

-- Addition Game
(3, 2, '{
  "type": "math_battle",
  "operation": "addition",
  "range": [1, 10],
  "rounds": 10,
  "timePerQuestion": 15
}'),

-- Alphabet Game
(4, 3, '{
  "type": "letter_quest",
  "challenge": "find_letters",
  "letters": ["A", "B", "C", "D", "E"],
  "story": "Help Alex find the missing letters in the Caribbean village!"
}'),

-- Living Things Game
(6, 4, '{
  "type": "category_sort",
  "categories": ["Living", "Non-Living"],
  "items": [
    {"name": "Palm Tree", "category": "Living"},
    {"name": "Rock", "category": "Non-Living"},
    {"name": "Fish", "category": "Living"},
    {"name": "Water", "category": "Non-Living"},
    {"name": "Bird", "category": "Living"}
  ]
}');

-- ==================== PROGRESS ====================

-- Student progress for demo
INSERT INTO progress (user_id, lesson_id, score, completed, completed_at) VALUES
-- Alex's progress
(6, 1, 85, true, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(6, 2, 90, true, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(6, 3, 75, true, CURRENT_TIMESTAMP),

-- Emma's progress  
(7, 1, 95, true, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(7, 2, 88, true, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(7, 3, 92, true, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(7, 4, 85, true, CURRENT_TIMESTAMP),

-- Marcus's progress
(8, 1, 78, true, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(8, 2, 82, true, CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Sophia's progress
(9, 1, 100, true, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(9, 2, 95, true, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(9, 3, 98, true, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(9, 4, 92, true, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(9, 6, 88, true, CURRENT_TIMESTAMP);

-- ==================== REWARDS ====================

INSERT INTO rewards (name, points_required, creator_id, for_user_id) VALUES
('Extra Screen Time', 100, 4, 6),
('Choose Dinner Menu', 150, 4, 6),
('Movie Night', 200, 4, 7),
('Ice Cream Trip', 100, 5, 8),
('Beach Day', 300, 5, 9),
('New Book', 150, 4, 7);

-- ==================== SUMMARY ====================

SELECT 'Seed data loaded successfully!' AS status;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS lesson_count FROM lessons;
SELECT COUNT(*) AS quiz_count FROM quizzes;
SELECT COUNT(*) AS game_count FROM games;
SELECT COUNT(*) AS progress_count FROM progress;