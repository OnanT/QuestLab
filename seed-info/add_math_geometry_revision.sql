-- SQL script for Grade 3 Term III revision content: Mathematics Geometry

BEGIN;

-- STEP 0: Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' OR role IN ('teacher', 'admin') ORDER BY (username = 'ms_johnson') DESC LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 1 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 1 ORDER BY id DESC LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

/********************************************************************
 * TOPIC: Geometry
 ********************************************************************/
INSERT INTO topics (curriculum_subject_id, term_id, title)
VALUES (:curr_sub_id, :term_id, 'Geometry: Shapes & Symmetry')
ON CONFLICT DO NOTHING;
SELECT id AS topic_id_geom FROM topics WHERE title = 'Geometry: Shapes & Symmetry' LIMIT 1 \gset

-- 1. 3D Shapes
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_geom, '3D Shapes') RETURNING id AS concept_id_3d \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_3d, 'Exploring 3D Shapes: Solid Figures', '<h2>3D Shapes: Shapes you can hold!</h2><p>3D shapes are solid objects. They have length, width, and height.</p><h3>Common 3D Shapes:</h3><ul><li><strong>Cube:</strong> Like a dice. It has 6 square faces.</li><li><strong>Sphere:</strong> Like a ball. It is perfectly round.</li><li><strong>Cylinder:</strong> Like a soda can. It has two circular bases.</li><li><strong>Cone:</strong> Like a party hat. It has a circular base and a point.</li><li><strong>Pyramid:</strong> Like the ones in Egypt. It has a flat base and triangular sides.</li></ul><h3>Parts of a 3D Shape:</h3><ul><li><strong>Face:</strong> The flat surface.</li><li><strong>Edge:</strong> Where two faces meet.</li><li><strong>Vertex:</strong> The corner where edges meet.</li></ul>', :teacher_id, :org_id, 'Mathematics', 'beginner', 50, '3', 'Identify and describe common 3D shapes and their properties.', 'Identify faces, edges, and vertices of 3D shapes.', 'math,geometry,3d-shapes')
RETURNING id AS lesson_id_3d \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_3d, 'How many faces does a cube have?', '4,6,8,12', '6', 'A cube has 6 square faces.'),
(:lesson_id_3d, 'Which 3D shape looks like a ball?', 'Cube,Cylinder,Sphere,Cone', 'Sphere', 'A sphere is round like a ball.'),
(:lesson_id_3d, 'How many circular bases does a cylinder have?', '1,2,3,0', '2', 'A cylinder has a top and bottom circular base.'),
(:lesson_id_3d, 'A corner of a 3D shape is called a ____.', 'Face,Edge,Vertex,Side', 'Vertex', 'Vertex is the mathematical word for corner.'),
(:lesson_id_3d, 'Which shape has a point at the top and a circular base?', 'Pyramid,Cone,Cylinder,Sphere', 'Cone', 'A cone, like an ice cream cone, has one point and one circular base.');

-- 2. Symmetry
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_geom, 'Symmetry') RETURNING id AS concept_id_sym \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_sym, 'Symmetry: Perfect Balance', '<h2>Symmetry: Mirror Images!</h2><p>Symmetry is when one shape becomes exactly like another if you flip, slide, or turn it.</p><h3>Line of Symmetry:</h3><p>An imaginary line where you could fold the image and have both halves match exactly.</p><ul><li>A butterfly is symmetrical.</li><li>A square has 4 lines of symmetry.</li><li>A circle has infinite lines of symmetry!</li></ul>', :teacher_id, :org_id, 'Mathematics', 'beginner', 50, '3', 'Understand and identify lines of symmetry in shapes and objects.', 'Draw and identify lines of symmetry.', 'math,geometry,symmetry')
RETURNING id AS lesson_id_sym \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_sym, 'How many lines of symmetry does a square have?', '1,2,4,8', '4', 'A square can be folded 4 ways (vertical, horizontal, and 2 diagonals).'),
(:lesson_id_sym, 'Is a butterfly symmetrical?', 'Yes,No', 'Yes', 'A butterfly has a vertical line of symmetry down its middle.'),
(:lesson_id_sym, 'Which letter has a vertical line of symmetry?', 'L,F,A,S', 'A', 'You can fold "A" down the middle and the sides match.'),
(:lesson_id_sym, 'Which shape has NO lines of symmetry?', 'Rectangle,Circle,Scalene Triangle,Heart', 'Scalene Triangle', 'A scalene triangle has no sides equal and no lines of symmetry.'),
(:lesson_id_sym, 'A "mirror image" is a good way to describe ____.', 'Addition,Symmetry,Multiplication,3D Shapes', 'Symmetry', 'Symmetry looks like a mirror reflection.');

-- 3. Congruent
INSERT INTO concepts (topic_id, title) VALUES (:topic_id_geom, 'Congruent Shapes') RETURNING id AS concept_id_cong \gset
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty, points, grade_levels, description, objectives, tags)
VALUES (:concept_id_cong, 'Congruent: Exactly the Same!', '<h2>Congruent Shapes: Identical Twins!</h2><p>Congruent means that two shapes are the <strong>same size</strong> and the <strong>same shape</strong>.</p><h3>Key Rule:</h3><p>If you can place one shape on top of another and they match perfectly, they are congruent.</p><ul><li>They can be turned or flipped, but they must be the same size!</li></ul>', :teacher_id, :org_id, 'Mathematics', 'beginner', 50, '3', 'Identify congruent shapes based on size and shape.', 'Differentiate between congruent and non-congruent figures.', 'math,geometry,congruent')
RETURNING id AS lesson_id_cong \gset
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation) VALUES
(:lesson_id_cong, 'What does "congruent" mean?', 'Different size,Same size and shape,Same color,Same name', 'Same size and shape', 'Congruent figures are identical in size and shape.'),
(:lesson_id_cong, 'If two circles are the same size, they are ____.', 'Symmetrical,Congruent,3D,Opposite', 'Congruent', 'Same shape (circle) and same size means they are congruent.'),
(:lesson_id_cong, 'Can congruent shapes be flipped over?', 'Yes,No', 'Yes', 'Flipping a shape does not change its size or shape, so it stays congruent.'),
(:lesson_id_cong, 'Are a large square and a small square congruent?', 'Yes,No', 'No', 'No, they must be the same size to be congruent.'),
(:lesson_id_cong, 'Which of these describes congruent triangles?', 'Different angles,Same size and same shape,Different lengths,Same color only', 'Same size and same shape', 'Identical in every way.');

-- Finalize
SELECT setval('public.topics_id_seq', (SELECT MAX(id) FROM public.topics));
SELECT setval('public.concepts_id_seq', (SELECT MAX(id) FROM public.concepts));
SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));
SELECT setval('public.quizzes_id_seq', (SELECT MAX(id) FROM public.quizzes));

COMMIT;
