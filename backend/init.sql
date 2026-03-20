-- Initialize QuestLab database - COMPLETE VERSION
-- Includes all tables from models.py, schemas.py, and questlab_full.sql

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================================================================
-- ORGANIZATIONS (Multi-tenancy)
-- ======================================================================
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    organization_type VARCHAR(50) DEFAULT 'school',
    contact_email VARCHAR(150),
    contact_phone VARCHAR(50),
    address TEXT,
    max_users INTEGER DEFAULT 1000,
    max_storage_mb INTEGER DEFAULT 5000,
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organization_usage_stats (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    total_users INTEGER DEFAULT 0,
    active_users_30d INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    total_storage_mb NUMERIC(10, 2) DEFAULT 0,
    total_api_calls INTEGER DEFAULT 0,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================
-- USERS (Enhanced with multi-tenancy)
-- ======================================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,  -- FIXED: 255 chars for Argon2/bcrypt
    display_name VARCHAR(150),  -- NEW: Added from schemas
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'admin', 'guest')),
    avatar VARCHAR(150) DEFAULT 'default_avatar.png',
    points INTEGER DEFAULT 0,
    badges TEXT DEFAULT '',
    level INTEGER DEFAULT 1,  -- FIXED: Integer not VARCHAR
    streak INTEGER DEFAULT 0,
    parent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- ======================================================================
-- COUNTRIES / ISLANDS
-- ======================================================================
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ======================================================================
-- SCHOOL YEARS & TERMS
-- ======================================================================
CREATE TABLE IF NOT EXISTS school_years (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    year_label VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS terms (
    id SERIAL PRIMARY KEY,
    school_year_id INTEGER REFERENCES school_years(id) ON DELETE CASCADE,
    term_number INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    UNIQUE(school_year_id, term_number)
);

-- ======================================================================
-- SCHOOLS
-- ======================================================================
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    island_id INTEGER REFERENCES countries(id),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================
-- SUBJECTS & CURRICULUM
-- ======================================================================
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS curriculum_subjects (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    grade_level INTEGER NOT NULL
);

-- ======================================================================
-- TOPICS & CONCEPTS
-- ======================================================================
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    curriculum_subject_id INTEGER REFERENCES curriculum_subjects(id) ON DELETE CASCADE,
    term_id INTEGER REFERENCES terms(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    UNIQUE(curriculum_subject_id, term_id, title)
);

CREATE TABLE IF NOT EXISTS concepts (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL
);

-- ======================================================================
-- LESSONS (Enhanced with versioning & analytics)
-- ======================================================================
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    content_html TEXT NOT NULL,
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    version_number INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    published_at TIMESTAMP,
    -- Metadata
    category VARCHAR(50) DEFAULT 'General',
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_time INTEGER DEFAULT 30,
    points INTEGER DEFAULT 50,
    points_possible INTEGER DEFAULT 100,
    grade_levels TEXT DEFAULT '',
    description TEXT DEFAULT '',
    objectives TEXT DEFAULT '',
    prerequisites TEXT DEFAULT '',
    tags TEXT DEFAULT '',
    -- Analytics
    view_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lesson_analytics (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0,
    completions INTEGER DEFAULT 0,
    avg_score NUMERIC(5, 2),
    avg_time_spent_seconds INTEGER DEFAULT 0
);

-- ======================================================================
-- GAME ENGINES & GAMES
-- ======================================================================
CREATE TABLE IF NOT EXISTS game_engines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL CHECK (name IN (
        'SkillBuilder', 'QuizBattle', 'StoryQuest', 'MapChallenge',
        'Quiz Engine', 'Memory Match', 'Drag and Drop', 
        'Multiple Choice', 'Fill in the Blanks', 'Interactive Simulation'
    ))
);

CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    game_engine_id INTEGER REFERENCES game_engines(id) ON DELETE CASCADE,
    config_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================
-- MEDIA
-- ======================================================================
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filetype VARCHAR(50) NOT NULL,
    file_category VARCHAR(20) DEFAULT 'other',
    file_size_bytes INTEGER DEFAULT 0,
    url VARCHAR(255) NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================
-- QUIZZES
-- ======================================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'mc_single',
    options TEXT NOT NULL,
    correct_answer VARCHAR(100) NOT NULL,
    explanation TEXT DEFAULT '',
    points INTEGER DEFAULT 10,
    difficulty VARCHAR(20) DEFAULT 'beginner',
    time_limit INTEGER DEFAULT 0,
    image_url TEXT DEFAULT '',
    audio_url TEXT DEFAULT '',
    tags TEXT DEFAULT ''
);

-- ======================================================================
-- PROGRESS (Enhanced with time tracking)
-- ======================================================================
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    score INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    total_time_spent_seconds INTEGER DEFAULT 0
);

-- ======================================================================
-- REWARDS
-- ======================================================================
CREATE TABLE IF NOT EXISTS rewards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    points_required INTEGER NOT NULL,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    for_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- ======================================================================
-- ASSIGNMENTS (NEW)
-- ======================================================================
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================
-- FEEDBACK (NEW)
-- ======================================================================
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================================
-- CARIBBEAN CULTURAL CONTENT (NEW)
-- ======================================================================
CREATE TABLE IF NOT EXISTS cultural_practices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    practice_type VARCHAR(100),
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    description TEXT,
    historical_context TEXT,
    contemporary_practice TEXT,
    tags TEXT
);

CREATE TABLE IF NOT EXISTS geographical_features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    feature_type VARCHAR(100),
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    elevation_meters INTEGER,
    description TEXT,
    scientific_significance TEXT
);

CREATE TABLE IF NOT EXISTS historical_figures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_year INTEGER,
    death_year INTEGER,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    contribution TEXT,
    legacy TEXT
);

-- ======================================================================
-- INDEXES FOR PERFORMANCE
-- ======================================================================
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_lessons_organization ON lessons(organization_id);
CREATE INDEX IF NOT EXISTS idx_lessons_creator ON lessons(creator_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_media_lesson ON media(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assignments_student ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_feedback_lesson ON feedback(lesson_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);

-- ======================================================================
-- INITIAL DATA
-- ======================================================================

-- Create default organization
INSERT INTO organizations (name, slug, organization_type) 
VALUES ('Quest Lab', 'quest-lab', 'platform')
ON CONFLICT DO NOTHING;

-- Countries
INSERT INTO countries (name) VALUES 
    ('Barbados'),
    ('Trinidad and Tobago'),
    ('Jamaica'),
    ('Guyana'),
    ('Saint Lucia'),
    ('Grenada'),
    ('Saint Vincent and the Grenadines'),
    ('Antigua and Barbuda'),
    ('Dominica'),
    ('Saint Kitts and Nevis')
ON CONFLICT DO NOTHING;

-- Subjects
INSERT INTO subjects (name) VALUES 
    ('Mathematics'),
    ('English Language'),
    ('Science'),
    ('Social Studies'),
    ('Creative Arts'),
    ('Physical Education'),
    ('Caribbean History'),
    ('Geography')
ON CONFLICT DO NOTHING;

-- Game Engines
INSERT INTO game_engines (name) VALUES 
    ('SkillBuilder'),
    ('QuizBattle'),
    ('StoryQuest'),
    ('MapChallenge'),
    ('Quiz Engine'),
    ('Memory Match'),
    ('Drag and Drop'),
    ('Multiple Choice'),
    ('Fill in the Blanks'),
    ('Interactive Simulation')
ON CONFLICT DO NOTHING;