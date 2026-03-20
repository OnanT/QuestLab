-- Migration to add schools table
-- Run this after your existing database is set up

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    island_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    address TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_schools_island ON schools(island_id);

-- Insert some sample schools for testing
INSERT INTO schools (name, island_id, address) 
SELECT 'St. Michael Primary School', c.id, 'Bridgetown, Barbados'
FROM countries c WHERE c.name = 'Barbados'
LIMIT 1;

INSERT INTO schools (name, island_id, address) 
SELECT 'Queen''s Royal College', c.id, 'Port of Spain, Trinidad'
FROM countries c WHERE c.name = 'Trinidad and Tobago'
LIMIT 1;

INSERT INTO schools (name, island_id, address) 
SELECT 'Wolmer''s High School', c.id, 'Kingston, Jamaica'
FROM countries c WHERE c.name = 'Jamaica'
LIMIT 1;
