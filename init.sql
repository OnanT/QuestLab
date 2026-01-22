-- init.sql (Fixed)
-- Initialize QuestLab database

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (with roles and parent-child linking)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'admin', 'guest')),
    avatar VARCHAR(150) DEFAULT 'default_avatar.png',
    points INTEGER DEFAULT 0,
    badges TEXT DEFAULT '',
    level VARCHAR(50) DEFAULT 'Explorer',
    streak INTEGER DEFAULT 0,
    parent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Countries (for Caribbean focus)
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- School Years
CREATE TABLE IF NOT EXISTS school_years (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    year_label VARCHAR(50) NOT NULL
);

-- Terms
CREATE TABLE IF NOT EXISTS terms (
    id SERIAL PRIMARY KEY,
    school_year_id INTEGER REFERENCES school_years(id) ON DELETE CASCADE,
    term_number INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Curriculum Subjects (grade-specific)
CREATE TABLE IF NOT EXISTS curriculum_subjects (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    grade_level INTEGER NOT NULL
);

-- Topics
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    curriculum_subject_id INTEGER REFERENCES curriculum_subjects(id) ON DELETE CASCADE,
    term_id INTEGER REFERENCES terms(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL
);

-- Concepts
CREATE TABLE IF NOT EXISTS concepts (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    content_html TEXT NOT NULL,
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50) DEFAULT 'General',
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_time INTEGER DEFAULT 30,
    points INTEGER DEFAULT 50,
    grade_levels TEXT DEFAULT '',
    description TEXT DEFAULT '',
    objectives TEXT DEFAULT '',
    prerequisites TEXT DEFAULT '',
    tags TEXT DEFAULT ''
);

-- Game Engines (created BEFORE games table)
CREATE TABLE IF NOT EXISTS game_engines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL CHECK (name IN ('SkillBuilder', 'QuizBattle', 'StoryQuest', 'MapChallenge'))
);

-- Games (linked to lessons, with config for each type)
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    game_engine_id INTEGER REFERENCES game_engines(id) ON DELETE CASCADE,
    config_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media (NOW games table exists, so this reference works)
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filetype VARCHAR(50) NOT NULL,
    file_category VARCHAR(20) DEFAULT 'other',
    url VARCHAR(255) NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes
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

-- Progress (user-lesson tracking, including quiz/game scores)
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    score INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP
);

-- Rewards (custom by parents/teachers)
CREATE TABLE IF NOT EXISTS rewards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    points_required INTEGER NOT NULL,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    for_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_media_lesson ON media(lesson_id);

-- Insert some initial data
INSERT INTO countries (name) VALUES 
    ('Barbados'),
    ('Trinidad and Tobago'),
    ('Jamaica'),
    ('Guyana')
ON CONFLICT DO NOTHING;

INSERT INTO subjects (name) VALUES 
    ('Mathematics'),
    ('English Language'),
    ('Science'),
    ('Social Studies'),
    ('Creative Arts')
ON CONFLICT DO NOTHING;

INSERT INTO game_engines (name) VALUES 
    ('SkillBuilder'),
    ('QuizBattle'),
    ('StoryQuest'),
    ('MapChallenge')
ON CONFLICT DO NOTHING;