# QuestLab Content Creation Plan - Term III Revision

## 1. Project Overview
This plan outlines the systematic creation of lessons, quizzes, and games for the Grade 3 Term III revision topics as specified in `Revision.txt`. The goal is to provide a comprehensive, interactive learning experience for students preparing for their end-of-term tests.

## 2. Topic Breakdown & Mapping

### Module A: English Language (Subject ID: 2)
| Category | Topics | Concepts |
| :--- | :--- | :--- |
| **Grammar** | Verbs | Simple Present, Simple Past, Irregular Past, Present/Past Continuous, Subject-Verb Agreement |
| **Mechanics** | Punctuation | Capital Letters, Punctuation Marks (.,!?) |
| **Phonics** | Sound Patterns | Diphthongs (or,oy,ow,ou,aw), Y as Vowel/Consonant, S-Blends, L-Blends, Syllabication |
| **Vocabulary**| Word usage | Compound Words, Homographs, Similes, Indefinite Articles (a, an) |
| **Writing** | Composition | Descriptive Writing |
| **Spelling** | Rules | Term III Spelling Rules |

### Module B: Mathematics (Subject ID: 1)
| Category | Topics | Concepts |
| :--- | :--- | :--- |
| **Arithmetic** | Operations | Addition (Regrouping), Subtraction (Regrouping), Multiplication (1 & 2 digits), Word Problems |
| **Geometry** | Shapes & Space | 3D Shapes, Symmetry, Congruence |

### Module C: Social Studies (Subject ID: 4)
| Category | Topics | Concepts |
| :--- | :--- | :--- |
| **History** | Places of Memory | Alexander Hamilton Museum, Nathaniel Wells |
| **Civics** | My Community | Town vs Village, Neighborhoods, Natural/Manmade features, Needs vs Wants |
| **Economics** | Work & Trade | Community Workers (Tools/Uniforms), Goods vs Services |
| **Infrastructure**| Communication | Traditional vs Modern, SKN Communication Centers |
| **Infrastructure**| Transportation | Land/Air/Sea, History of Transport, Road Safety, Traffic Signs |
| **Culture** | Celebrations | New Year's, Christmas, Valentine's Day |

### Module D: Science (Subject ID: 3)
| Category | Topics | Concepts |
| :--- | :--- | :--- |
| **Human Body** | Hearing | Ear anatomy, Functions, Hearing damage/impairment, Occupations |
| **Physics** | Sound | Definition, Sound movement, Pitch (High/Low) |
| **Physics** | Heat | Production, Detection, Conductors/Non-conductors |
| **Biology** | Plants & Animals | Food Chains/Webs, Classification (Herbivores, Predators, etc.) |

---

## 3. Implementation Strategy (The "Phases")

### Phase 1: Content Generation (Automation)
We will use a semi-automated approach to generate high-quality educational content.
- **Tooling**: Python script leveraging LLM (e.g., Gemini) to generate SQL and JSON configurations based on the topic list.
- **Templates**: Standardized HTML templates for lessons and JSON schemas for games (Skill Builder, Quiz Battle).

### Phase 2: Database Seeding
Content will be ingested into the database using a two-step process:
1.  **SQL Execution**: Insert Subjects (if missing), CurriculumSubjects, Topics, Concepts, Lessons, and Quizzes.
2.  **Python Execution**: Insert interactive Games linked to the new Lesson IDs.

### Phase 3: Asset Integration
-   Identify required images/audio for Phonics and Science topics (e.g., ear anatomy diagram).
-   Place assets in `frontend/public/assets/` or upload via the `media` table.

### Phase 4: Verification & QA
-   **Database Integrity**: Check foreign key relationships and sequence resets.
-   **Functional Testing**: Use Playwright to ensure lessons render correctly and quizzes are interactive.
-   **Content Review**: Verify accuracy of the generated content against the Grade 3 curriculum.

---

## 4. Execution Scripts (Blueprints)

### A. SQL Template (Example for "3D Shapes")
```sql
BEGIN;
-- Find IDs
SELECT id AS teacher_id FROM users WHERE username = 'ms_johnson' LIMIT 1 \gset
SELECT id AS curr_sub_id FROM curriculum_subjects WHERE subject_id = 1 AND grade_level = 3 LIMIT 1 \gset
SELECT id AS term_id FROM terms WHERE term_number = 3 LIMIT 1 \gset
SELECT id AS org_id FROM organizations LIMIT 1 \gset

-- Insert Topic
INSERT INTO topics (curriculum_subject_id, term_id, title) 
VALUES (:curr_sub_id, :term_id, 'Geometry and Space') 
ON CONFLICT DO NOTHING RETURNING id AS topic_id \gset

-- Insert Concept
INSERT INTO concepts (topic_id, title) 
VALUES (:topic_id, '3D Shapes and Their Properties') 
RETURNING id AS concept_id \gset

-- Insert Lesson (HTML content omitted for brevity)
INSERT INTO lessons (concept_id, title, content_html, creator_id, organization_id, category, difficulty)
VALUES (:concept_id, 'Exploring 3D Shapes', '...', :teacher_id, :org_id, 'Mathematics', 'beginner')
RETURNING id AS lesson_id \gset

-- Insert Quizzes
INSERT INTO quizzes (lesson_id, question, options, correct_answer)
VALUES (:lesson_id, 'How many faces does a cube have?', '4,6,8,12', '6');

COMMIT;
```

### B. Python Script Blueprint (Game Seeding)
```python
# quest-scripts/seed-geometry-games.py
import json
import psycopg2
# ... (database connection logic) ...
def seed_geometry_games(lesson_id):
    config = {
        "title": "3D Shape Hunt",
        "problems": [
            {"question": "I have 6 square faces. What am I?", "answer": "cube"},
            {"question": "I look like a ball. What am I?", "answer": "sphere"}
        ]
    }
    # Execute INSERT INTO games (lesson_id, game_engine_id, config_json) ...
```

---

## 5. Timeline & Milestones

1.  **Day 1**: Finalize all Lesson/Quiz content for Module A (Language Arts) and Module B (Math).
2.  **Day 2**: Generate Social Studies and Science content.
3.  **Day 3**: Bulk ingestion and verification using the `load-seed-data.sh` pattern.
4.  **Day 4**: UI/UX review and manual testing of games.

---
*Report Generated: 2026-03-19*
