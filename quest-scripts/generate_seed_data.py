import textwrap
import json

def escape_sql_string(s):
    """Escapes single quotes in a string for SQL insertion."""
    if s is None:
        return 'NULL'
    return s.replace("'", "''")

def generate_sql_seed_data():
    sql_statements = []
    
    # Start transaction
    sql_statements.append("BEGIN;")
    sql_statements.append("\n-- ============================================================================")
    sql_statements.append("-- Generated Seed Data for Nevis and Dominica")
    sql_statements.append("-- ============================================================================")

    # Add Information Technology to Subjects if not exists
    sql_statements.append("\n-- 1. Add Information Technology Subject")
    sql_statements.append("INSERT INTO subjects (name) VALUES ('Information Technology') ON CONFLICT (name) DO NOTHING;")

    # Add countries - ensure they exist
    sql_statements.append("\n-- 2. Ensure Countries Exist")
    sql_statements.append("INSERT INTO countries (name) VALUES ('St. Kitts & Nevis'), ('Dominica') ON CONFLICT (name) DO NOTHING;")

    # Extend School Years for Nevis and Dominica (Grades 1-12)
    sql_statements.append("\n-- 3. Extend School Years (Grades 1-12) for St. Kitts & Nevis and Dominica")
    for country_name in ['St. Kitts & Nevis', 'Dominica']:
        for grade in range(1, 13): # Grades 1 to 12
            sql_statements.append(textwrap.dedent(f"""
            INSERT INTO school_years (country_id, year_label)
            SELECT c.id, '{escape_sql_string(f'Grade {grade}')}'
            FROM countries c
            WHERE c.name = '{escape_sql_string(country_name)}'
            ON CONFLICT (country_id, year_label) DO NOTHING;
            """))

    # Extend Terms for newly added school years
    sql_statements.append("\n-- 4. Extend Terms for all School Years")
    sql_statements.append(textwrap.dedent(f"""
    INSERT INTO terms (school_year_id, term_number, title)
    SELECT sy.id, term_num, term_title
    FROM school_years sy
    CROSS JOIN (VALUES
        (1, '{escape_sql_string('Term 1 - September to December')}'),
        (2, '{escape_sql_string('Term 2 - January to March')}'),
        (3, '{escape_sql_string('Term 3 - April to June')}')
    ) AS terms(term_num, term_title)
    ON CONFLICT (school_year_id, term_number) DO NOTHING;
    """))

    # Generate Curriculum Subjects for all grades and subjects for Nevis and Dominica
    sql_statements.append("\n-- 5. Generate Curriculum Subjects")
    subjects_to_cover = ['Mathematics', 'English Language', 'Science', 'Social Studies', 'History', 'Geography', 'Information Technology']
    for country_name in ['St. Kitts & Nevis', 'Dominica']:
        for subject_name in subjects_to_cover:
            for grade in range(1, 13):
                sql_statements.append(textwrap.dedent(f"""
                INSERT INTO curriculum_subjects (country_id, subject_id, grade_level)
                SELECT c.id, s.id, {grade}
                FROM countries c, subjects s
                WHERE c.name = '{escape_sql_string(country_name)}' AND s.name = '{escape_sql_string(subject_name)}'
                ON CONFLICT (country_id, subject_id, grade_level) DO NOTHING;
                """))
    
    sql_statements.append("\n-- 6. Ensure 'teach' user exists and get its ID")
    sql_statements.append(textwrap.dedent(f"""
    INSERT INTO users (username, email, hashed_password, role) VALUES 
    ('teach', 'teach@questlab.com', '$argon2id$v=19$m=65536,t=3,p=4$Rui9N0aIsRaiVCrF+B8DgA$XP7qF2xazgKD5susccx9VwaXqyLiu8E7hZJA1XfS/iU', 'teacher')
    ON CONFLICT (username) DO NOTHING;
    """))

    # Topics, Concepts, Lessons, Quizzes
    sql_statements.append("\n-- 7. Generate Topics, Concepts, Lessons, and Quizzes")

    # Define a structure for generating content
    content_data = {
        "St. Kitts & Nevis": {
            "Social Studies": {
                "Primary School (Grades 1-6)": [
                    {"topic": "National Symbols", "concepts": ["Flag", "Coat of Arms", "National Anthem"], "difficulty": "easy"},
                    {"topic": "Local Heroes", "concepts": ["Notable figures from history", "Their contributions"], "difficulty": "easy"},
                    {"topic": "Geography of SKN", "concepts": ["Islands, capital, parishes", "Landforms, climate"], "difficulty": "easy"},
                    {"topic": "Community Helpers", "concepts": ["Police, Firefighters, Doctors, Teachers", "Their roles in society"], "difficulty": "easy"},
                ],
                "High School (Grades 7-12)": [
                    {"topic": "History of Sugar Industry", "concepts": ["Plantation system", "Impact on society, economy", "End of sugar"], "difficulty": "medium"},
                    {"topic": "Federation & Independence", "concepts": ["Movement towards independence", "Challenges, achievements"], "difficulty": "medium"},
                    {"topic": "SKN Government Structure", "concepts": ["Parliament, Cabinet, Judiciary", "Electoral process"], "difficulty": "advanced"},
                    {"topic": "Tourism Sector", "concepts": ["Economic impact", "Challenges & opportunities"], "difficulty": "medium"},
                ]
            },
            "Science": {
                "Primary School (Grades 1-6)": [
                    {"topic": "Local Plants", "concepts": ["Identify common plants", "Parts of a plant, basic needs"], "difficulty": "easy"},
                    {"topic": "Animal Habitats", "concepts": ["Animals native to SKN", "Their natural environments"], "difficulty": "easy"},
                ],
                "High School (Grades 7-12)": [
                    {"topic": "Marine Ecosystems", "concepts": ["Coral reefs, mangroves", "Conservation efforts"], "difficulty": "medium"},
                    {"topic": "Volcanic Activity", "concepts": ["Formation of islands", "Geothermal energy"], "difficulty": "advanced"},
                ]
            },
            "Mathematics": {
                "Primary School (Grades 1-6)": [
                    {"topic": "Counting & Number Sense", "concepts": ["Numbers 1-100", "Addition, Subtraction (single digit)"], "difficulty": "easy"},
                    {"topic": "Basic Shapes", "concepts": ["Identify 2D and 3D shapes", "Simple patterns"], "difficulty": "easy"},
                ],
                "High School (Grades 7-12)": [
                    {"topic": "Algebraic Equations", "concepts": ["Linear equations", "Quadratic equations"], "difficulty": "medium"},
                    {"topic": "Statistics & Probability", "concepts": ["Data representation", "Basic probability"], "difficulty": "advanced"},
                ]
            },
            "Information Technology": {
                "High School (Grades 7-12)": [
                    {"topic": "Internet & Web Browsing", "concepts": ["How the internet works", "Safe browsing habits"], "difficulty": "medium"},
                    {"topic": "Computer Hardware Basics", "concepts": ["Components of a computer", "Input/output devices"], "difficulty": "easy"},
                    {"topic": "Programming Fundamentals (Python)", "concepts": ["Variables, data types", "Control structures (if, loops)"], "difficulty": "advanced"},
                ]
            }
        },
        "Dominica": {
            "Social Studies": {
                "Primary School (Grades 1-6)": [
                    {"topic": "Dominica's Kalinago Heritage", "concepts": ["Kalinago people, culture", "Traditional practices"], "difficulty": "easy"},
                    {"topic": "Roseau, the Capital", "concepts": ["Landmarks, services", "Importance of the capital"], "difficulty": "easy"},
                ],
                "High School (Grades 7-12)": [
                    {"topic": "Colonial History", "concepts": ["French and British influence", "Independence struggles"], "difficulty": "medium"},
                    {"topic": "Dominica's Political System", "concepts": ["Branches of government", "Elections"], "difficulty": "advanced"},
                ]
            },
            "Science": {
                "Primary School (Grades 1-6)": [
                    {"topic": "Water Cycle", "concepts": ["Evaporation, condensation, precipitation", "Importance of water"], "difficulty": "easy"},
                    {"topic": "Volcanoes & Geysers", "concepts": ["How they form", "Impact on landscape"], "difficulty": "easy"},
                ],
                "High School (Grades 7-12)": [
                    {"topic": "Geothermal Energy", "concepts": ["Harnessing natural heat", "Benefits and challenges"], "difficulty": "advanced"},
                    {"topic": "Tropical Rainforest Ecosystems", "concepts": ["Biodiversity", "Threats and conservation"], "difficulty": "medium"},
                ]
            },
            "Mathematics": {
                "Primary School (Grades 1-6)": [
                    {"topic": "Money & Currency", "concepts": ["Eastern Caribbean Dollar", "Making change, simple budgets"], "difficulty": "easy"},
                    {"topic": "Time Telling", "concepts": ["Analog and digital clocks", "Durations"], "difficulty": "easy"},
                ],
                "High School (Grades 7-12)": [
                    {"topic": "Financial Literacy", "concepts": ["Budgeting, savings, interest", "Investments"], "difficulty": "medium"},
                    {"topic": "Geometry & Trigonometry", "concepts": ["Angles, triangles, circles", "Pythagorean theorem"], "difficulty": "advanced"},
                ]
            },
            "Information Technology": {
                "High School (Grades 7-12)": [
                    {"topic": "Cybersecurity Awareness", "concepts": ["Phishing, malware", "Strong passwords, data privacy"], "difficulty": "medium"},
                    {"topic": "Digital Citizenship", "concepts": ["Online etiquette", "Responsible social media use"], "difficulty": "easy"},
                    {"topic": "Web Development Basics (HTML/CSS)", "concepts": ["Structure of a webpage", "Styling with CSS"], "difficulty": "advanced"},
                ]
            }
        }
    }

    lesson_counter = 0

    # Main loop for generating Topics, Concepts, Lessons, and Quizzes
    # Using CTEs for ID retrieval to avoid nested DO $$ blocks and DECLARE issues
    for country_name, subjects_data in content_data.items():
        for subject_name, grade_levels_data in subjects_data.items():
            for grade_level_category, topics_list in grade_levels_data.items():
                
                start_grade, end_grade = (1, 6) if "Primary" in grade_level_category else (7, 12)

                for topic_info in topics_list:
                    topic_title = topic_info["topic"]
                    difficulty_level = topic_info["difficulty"]
                    concepts_list = topic_info["concepts"]

                    for grade in range(start_grade, end_grade + 1):
                        grade_label = f"Grade {grade}"
                        
                        # Insert Topic
                        sql_statements.append(textwrap.dedent(f"""
                        WITH country_id_cte AS (SELECT id FROM countries WHERE name = '{escape_sql_string(country_name)}'),
                             subject_id_cte AS (SELECT id FROM subjects WHERE name = '{escape_sql_string(subject_name)}'),
                             curriculum_subject_id_cte AS (
                                 SELECT cs.id FROM curriculum_subjects cs
                                 JOIN country_id_cte c ON cs.country_id = c.id
                                 JOIN subject_id_cte s ON cs.subject_id = s.id
                                 WHERE cs.grade_level = {grade}
                             ),
                             school_year_id_cte AS (SELECT id FROM school_years WHERE country_id = (SELECT id FROM country_id_cte) AND year_label = '{escape_sql_string(grade_label)}'),
                             term_id_cte AS (SELECT id FROM terms WHERE school_year_id = (SELECT id FROM school_year_id_cte) AND term_number = 1 LIMIT 1)
                        INSERT INTO topics (curriculum_subject_id, term_id, title)
                        SELECT (SELECT id FROM curriculum_subject_id_cte), (SELECT id FROM term_id_cte), '{escape_sql_string(topic_title)}'
                        ON CONFLICT (curriculum_subject_id, term_id, title) DO NOTHING;
                        """))

                        for concept_title in concepts_list:
                            lesson_counter += 1
                            lesson_title = f"{country_name} {subject_name} - {topic_title} - {concept_title} ({grade_label})"
                            lesson_content_html = f"<h2>Introduction to {concept_title}</h2><p>This lesson explores {concept_title} in the context of {country_name} {subject_name}.</p><p>Key points include: {', '.join(concepts_list)}.</p>"
                            lesson_description = f"An in-depth lesson on {concept_title} focusing on {country_name} for {grade_label} students."
                            lesson_objectives = f"Understand {concept_title}, identify related concepts, and apply knowledge to {country_name}-specific scenarios."
                            lesson_prerequisites = f"Basic understanding of {subject_name.lower()}. "
                            lesson_tags = f"{escape_sql_string(country_name.replace(' ', '')).lower()},{escape_sql_string(subject_name.replace(' ', '')).lower()},{escape_sql_string(topic_title.replace(' ', '')).lower()},{escape_sql_string(concept_title.replace(' ', '')).lower()},{escape_sql_string(grade_label.replace(' ', '')).lower()},{escape_sql_string(difficulty_level)}"

                            quiz_question = f"What is a key aspect of {concept_title} in {country_name}?"
                            quiz_options_list = [
                                f"Option A for {concept_title}",
                                f"Option B for {concept_title} (correct)",
                                f"Option C for {concept_title}",
                                f"Option D for {concept_title}"
                            ]
                            quiz_options_json = json.dumps(quiz_options_list)
                            quiz_correct_answer = f"Option B for {concept_title} (correct)"
                            quiz_explanation = f"Option B is correct because it directly relates to the core idea of {concept_title} as discussed in the lesson."
                            quiz_difficulty = {
                                "easy": "easy",
                                "medium": "medium",
                                "advanced": "hard"
                            }[difficulty_level]
                            quiz_points = 10 + (lesson_counter % 2) * 5
                            quiz_time_limit = 60 + (lesson_counter % 3) * 30
                            quiz_tags = f"{escape_sql_string(country_name.replace(' ', '')).lower()},{escape_sql_string(subject_name.replace(' ', '')).lower()},quiz,{escape_sql_string(difficulty_level).lower()}"
                            
                            # Insert Concept, then Lesson, then Quiz
                            sql_statements.append(textwrap.dedent(f"""
                            WITH teach_user_id_cte AS (SELECT id FROM users WHERE username = 'teach'),
                                 country_id_cte AS (SELECT id FROM countries WHERE name = '{escape_sql_string(country_name)}'),
                                 subject_id_cte AS (SELECT id FROM subjects WHERE name = '{escape_sql_string(subject_name)}'),
                                 curriculum_subject_id_cte AS (
                                     SELECT cs.id FROM curriculum_subjects cs
                                     JOIN country_id_cte c ON cs.country_id = c.id
                                     JOIN subject_id_cte s ON cs.subject_id = s.id
                                     WHERE cs.grade_level = {grade}
                                 ),
                                 school_year_id_cte AS (SELECT id FROM school_years WHERE country_id = (SELECT id FROM country_id_cte) AND year_label = '{escape_sql_string(grade_label)}'),
                                 term_id_cte AS (SELECT id FROM terms WHERE school_year_id = (SELECT id FROM school_year_id_cte) AND term_number = 1 LIMIT 1),
                                 topic_id_cte AS (
                                     SELECT id FROM topics
                                     WHERE curriculum_subject_id = (SELECT id FROM curriculum_subject_id_cte)
                                       AND term_id = (SELECT id FROM term_id_cte)
                                       AND title = '{escape_sql_string(topic_title)}'
                                 )
                            INSERT INTO concepts (topic_id, title)
                            SELECT (SELECT id FROM topic_id_cte), '{escape_sql_string(concept_title)}'
                            ON CONFLICT (topic_id, title) DO NOTHING;
                            """))
                            
                            sql_statements.append(textwrap.dedent(f"""
                            WITH teach_user_id_cte AS (SELECT id FROM users WHERE username = 'teach'),
                                 country_id_cte AS (SELECT id FROM countries WHERE name = '{escape_sql_string(country_name)}'),
                                 subject_id_cte AS (SELECT id FROM subjects WHERE name = '{escape_sql_string(subject_name)}'),
                                 curriculum_subject_id_cte AS (
                                     SELECT cs.id FROM curriculum_subjects cs
                                     JOIN country_id_cte c ON cs.country_id = c.id
                                     JOIN subject_id_cte s ON cs.subject_id = s.id
                                     WHERE cs.grade_level = {grade}
                                 ),
                                 school_year_id_cte AS (SELECT id FROM school_years WHERE country_id = (SELECT id FROM country_id_cte) AND year_label = '{escape_sql_string(grade_label)}'),
                                 term_id_cte AS (SELECT id FROM terms WHERE school_year_id = (SELECT id FROM school_year_id_cte) AND term_number = 1 LIMIT 1),
                                 topic_id_cte AS (
                                     SELECT id FROM topics
                                     WHERE curriculum_subject_id = (SELECT id FROM curriculum_subject_id_cte)
                                       AND term_id = (SELECT id FROM term_id_cte)
                                       AND title = '{escape_sql_string(topic_title)}'
                                 ),
                                 concept_id_cte AS (
                                     SELECT id FROM concepts
                                     WHERE topic_id = (SELECT id FROM topic_id_cte) AND title = '{escape_sql_string(concept_title)}'
                                 )
                            INSERT INTO lessons (concept_id, title, content_html, creator_id, created_at, category, difficulty, estimated_time, points, grade_levels, description, objectives, prerequisites, tags)
                            SELECT (SELECT id FROM concept_id_cte),
                                   '{escape_sql_string(lesson_title)}',
                                   '{escape_sql_string(lesson_content_html)}',
                                   (SELECT id FROM teach_user_id_cte),
                                   NOW(),
                                   'Core Subject',
                                   '{escape_sql_string(difficulty_level)}',
                                   {30 + (lesson_counter % 3) * 15},
                                   {50 + (lesson_counter % 4) * 10},
                                   '{escape_sql_string(grade_label)}',
                                   '{escape_sql_string(lesson_description)}',
                                   '{escape_sql_string(lesson_objectives)}',
                                   '{escape_sql_string(lesson_prerequisites)}',
                                   '{escape_sql_string(lesson_tags)}'
                            ON CONFLICT (title) DO NOTHING;
                            """))

                            sql_statements.append(textwrap.dedent(f"""
                            WITH lesson_id_cte AS (SELECT id FROM lessons WHERE title = '{escape_sql_string(lesson_title)}')
                            INSERT INTO quizzes (lesson_id, question, question_type, options, correct_answer, explanation, points, difficulty, time_limit, image_url, tags)
                            SELECT (SELECT id FROM lesson_id_cte),
                                   '{escape_sql_string(quiz_question)}',
                                   'mc_single',
                                   '{escape_sql_string(quiz_options_json)}',
                                   '{escape_sql_string(quiz_correct_answer)}',
                                   '{escape_sql_string(quiz_explanation)}',
                                   {quiz_points},
                                   '{escape_sql_string(quiz_difficulty)}',
                                   {quiz_time_limit},
                                   '',
                                   '{escape_sql_string(quiz_tags)}'
                            ON CONFLICT DO NOTHING; 
                            """)) # No ON CONFLICT for quizzes yet, consider adding one if necessary (e.g., on lesson_id, question)

    # Commit transaction
    sql_statements.append("\nCOMMIT;")
    sql_statements.append("\n-- Verification Queries")
    # Removed \echo commands to avoid psql parsing issues.
    sql_statements.append(textwrap.dedent("""
SELECT 'Countries:' as metric, COUNT(*)::text FROM countries;
SELECT 'Subjects:' as metric, COUNT(*)::text FROM subjects;
SELECT 'School Years:' as metric, COUNT(*)::text FROM school_years;
SELECT 'Terms:' as metric, COUNT(*)::text FROM terms;
SELECT 'Curriculum Subjects:' as metric, COUNT(*)::text FROM curriculum_subjects;
SELECT 'Topics:' as metric, COUNT(*)::text FROM topics;
SELECT 'Concepts:' as metric, COUNT(*)::text FROM concepts;
SELECT 'Lessons:' as metric, COUNT(*)::text FROM lessons;
SELECT 'Quizzes:' as metric, COUNT(*)::text FROM quizzes;
    """))

    return "\n".join(sql_statements)

if __name__ == "__main__":
    sql_output = generate_sql_seed_data()
    with open("backend/seed_nev_dom_expanded.sql", "w") as f:
        f.write(sql_output)
    print("Generated backend/seed_nev_dom_expanded.sql")
    print("Please review the generated SQL file for correctness before running it against your database.")
    print("To run: psql -U your_user -d islandquestdb -f backend/seed_nev_dom_expanded.sql")
