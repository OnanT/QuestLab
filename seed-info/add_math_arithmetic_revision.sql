-- SQL script for Grade 3 Term III revision content: Mathematics Arithmetic

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 1 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

/********************************************************************
 * TOPIC: Addition & Subtraction
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Arithmetic: Addition & Subtraction')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_arith FROM topics WHERE title = 'Arithmetic: Addition & Subtraction' LIMIT 1 \gset

-- 1. Addition with Regrouping
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_arith, 'Addition with Regrouping') RETURNING id AS concept_id_add \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_add, 'Addition with Regrouping: Carrying Over', '<h2>Addition with Regrouping: When 10 is too many!</h2><p>When we add numbers in a column and the sum is 10 or more, we "regroup" or "carry over" to the next column.</p><h3>Example: 25 + 18</h3><ul><li><strong>Step 1:</strong> Add the ones: 5 + 8 = 13.</li><li><strong>Step 2:</strong> Write down the 3 and "carry" the 1 to the tens column.</li><li><strong>Step 3:</strong> Add the tens: 2 + 1 + 1 (carried) = 4.</li><li><strong>Final Answer:</strong> 43</li></ul>', :teacher_id, :org_id, 'Mathematics', 'beginner', 60, '3', 'Learn how to add multi-digit numbers using regrouping.', 'Apply regrouping techniques to solve addition problems.', 'math,addition,regrouping')
RETURNING id AS lesson_id_add \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_add, 'What is 37 + 15?', '42,52,53,43', '52', '7+5=12 (carry 1). 3+1+1=5. Result: 52.'),
(:lesson_id_add, 'In 48 + 24, how many do you carry to the tens column?', '1,2,8,4', '1', '8+4=12. You carry the 1 to the tens.'),
(:lesson_id_add, 'Calculate: 69 + 21', '80,90,100,89', '90', '9+1=10 (carry 1). 6+2+1=9. Result: 90.'),
(:lesson_id_add, 'What is the sum of 126 and 38?', '154,164,162,156', '164', '6+8=14 (carry 1). 2+3+1=6. 1+0=1. Result: 164.'),
(:lesson_id_add, 'True or False: Regrouping is the same as carrying over.', 'True,False', 'True', 'Yes, they mean the same thing in addition.');

-- 2. Subtraction with Regrouping
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_arith, 'Subtraction with Regrouping') RETURNING id AS concept_id_sub \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_sub, 'Subtraction with Regrouping: Borrowing Power', '<h2>Subtraction with Regrouping: Borrowing from friends!</h2><p>When the top number in a column is smaller than the bottom number, we "borrow" or "regroup" from the next column.</p><h3>Example: 42 - 15</h3><ul><li><strong>Step 1:</strong> Look at the ones: 2 - 5? We can''t do that!</li><li><strong>Step 2:</strong> Borrow 1 ten from the 4. Now the 4 becomes 3.</li><li><strong>Step 3:</strong> Give the ten to the 2. Now the 2 becomes 12.</li><li><strong>Step 4:</strong> Subtract the ones: 12 - 5 = 7.</li><li><strong>Step 5:</strong> Subtract the tens: 3 - 1 = 2.</li><li><strong>Final Answer:</strong> 27</li></ul>', :teacher_id, :org_id, 'Mathematics', 'beginner', 60, '3', 'Learn how to subtract multi-digit numbers using regrouping (borrowing).', 'Apply borrowing techniques to solve subtraction problems.', 'math,subtraction,regrouping,borrowing')
RETURNING id AS lesson_id_sub \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_sub, 'What is 50 - 12?', '38,42,48,32', '38', 'Borrow from 5 to make 10. 10-2=8. 4-1=3. Result: 38.'),
(:lesson_id_sub, 'In 63 - 27, what does the 6 become after borrowing?', '5,7,6,0', '5', 'When you borrow 1 ten, the 6 tens become 5 tens.'),
(:lesson_id_sub, 'Calculate: 81 - 45', '36,44,46,34', '36', 'Borrow to make 11. 11-5=6. 7-4=3. Result: 36.'),
(:lesson_id_sub, 'What is 100 - 45?', '65,55,45,50', '55', 'Borrow across zeros. Result: 55.'),
(:lesson_id_sub, 'If you have 32 candies and give away 19, how many are left?', '13,23,11,15', '13', '32 - 19 = 13 (requires regrouping).');

/********************************************************************
 * TOPIC: Multiplication
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Arithmetic: Multiplication')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_mult FROM topics WHERE title = 'Arithmetic: Multiplication' LIMIT 1 \gset

-- 1. Multiplication by 1 and 2 digits
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_mult, 'Multiplication Basics') RETURNING id AS concept_id_mult \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_mult, 'Mastering Multiplication', '<h2>Multiplication: Fast Addition!</h2><p>Multiplication is adding the same number many times.</p><h3>Multiplying by 1 Digit:</h3><p>23 x 3 = ?<br>Multiply 3 x 3 = 9. Then 3 x 20 = 60. Result: 69.</p><h3>Multiplying by 2 Digits (The Big Leap):</h3><p>When multiplying by a 2-digit number (like 12), remember to use a placeholder zero!</p><ul><li>Multiply by the ones place.</li><li>Add a 0 placeholder.</li><li>Multiply by the tens place.</li><li>Add the results together.</li></ul>', :teacher_id, :org_id, 'Mathematics', 'intermediate', 70, '3', 'Learn the process for multi-digit multiplication.', 'Solve multiplication problems involving 1 and 2 digit multipliers.', 'math,multiplication')
RETURNING id AS lesson_id_mult \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_mult, 'What is 12 x 4?', '44,48,52,46', '48', '12 + 12 + 12 + 12 = 48.'),
(:lesson_id_mult, 'Calculate: 25 x 2', '40,50,60,70', '50', 'Two groups of 25 is 50.'),
(:lesson_id_mult, 'What is 11 x 11?', '110,121,111,131', '121', '11 x 11 = 121.'),
(:lesson_id_mult, 'In 15 x 10, the answer is...', '15,100,150,1500', '150', 'Multiplying by 10 is easy, just add a 0!'),
(:lesson_id_mult, 'What is 5 x 0?', '5,0,1,10', '0', 'Any number multiplied by 0 is always 0.');

/********************************************************************
 * TOPIC: Word Problems
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Math Word Problems')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_word FROM topics WHERE title = 'Math Word Problems' LIMIT 1 \gset

-- 1. Addition and Subtraction Word Problems
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_word, 'Solving Word Problems') RETURNING id AS concept_id_word \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_word, 'Math in the Real World: Word Problems', '<h2>Word Problems: Solving Mysteries!</h2><p>Word problems use stories to ask math questions. You need to look for "Clue Words"!</p><h3>Addition Clue Words:</h3><ul><li>Total</li><li>Sum</li><li>Altogether</li><li>Plus</li><li>In all</li></ul><h3>Subtraction Clue Words:</h3><ul><li>Difference</li><li>Left</li><li>Remain</li><li>How many more</li><li>Fewer</li></ul>', :teacher_id, :org_id, 'Mathematics', 'intermediate', 70, '3', 'Learn how to identify and solve addition and subtraction word problems.', 'Translate word stories into math equations and solve them.', 'math,word-problems,addition,subtraction')
RETURNING id AS lesson_id_word \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_word, 'Sam has 15 marbles and buys 12 more. How many does he have altogether?', '23,27,25,30', '27', '"Altogether" means add: 15 + 12 = 27.'),
(:lesson_id_word, 'There are 40 birds on a tree. 15 fly away. How many are left?', '35,25,30,20', '25', '"Fly away" means subtract: 40 - 15 = 25.'),
(:lesson_id_word, 'Which word usually means you should subtract?', 'Total,Plus,Difference,Sum', 'Difference', 'Difference is the result of subtraction.'),
(:lesson_id_word, 'Anna has $50. She spends $18. How much money remains?', '32,42,22,38', '32', '"Remains" means subtract: 50 - 18 = 32.'),
(:lesson_id_word, 'A baker makes 24 cupcakes in the morning and 36 in the afternoon. What is the total?', '50,60,70,80', '60', '"Total" means add: 24 + 36 = 60.');

-- Finalize
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
