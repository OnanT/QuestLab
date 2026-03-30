-- Seed file for Caribbean Countries and Schools
-- Project: QuestLab Registration Enhancement
-- Requirement: At least 7 schools per main island

-- 1. Insert Caribbean Countries
INSERT INTO countries (name) VALUES 
('Antigua and Barbuda'), 
('Bahamas'), 
('Barbados'), 
('Belize'), 
('Dominica'), 
('Grenada'), 
('Guyana'), 
('Haiti'), 
('Jamaica'), 
('St. Kitts & Nevis'), 
('Saint Kitts and Nevis'), 
('Saint Lucia'), 
('Saint Vincent and the Grenadines'), 
('Suriname'), 
('Trinidad and Tobago')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Schools for St. Kitts & Nevis (Using both names to ensure mapping works)
-- We'll use a subquery to get IDs for both naming variations
WITH skn_ids AS (
    SELECT id FROM countries WHERE name IN ('St. Kitts & Nevis', 'Saint Kitts and Nevis')
)
INSERT INTO schools (name, island_id, organization_id, address) 
SELECT s.name, c.id, 1, s.address
FROM (VALUES 
    ('Basseterre High School', 'Basseterre, St. Kitts'),
    ('Charlestown Secondary School', 'Charlestown, Nevis'),
    ('Washington Archibald High School', 'Basseterre, St. Kitts'),
    ('Gingerland Secondary School', 'Gingerland, Nevis'),
    ('Verchilds High School', 'Old Road, St. Kitts'),
    ('Cayon High School', 'Cayon, St. Kitts'),
    ('Saddlers Secondary School', 'Saddlers, St. Kitts'),
    ('Charlestown Primary', 'Charlestown, Nevis')
) AS s(name, address)
CROSS JOIN skn_ids c
ON CONFLICT DO NOTHING;

-- 3. Insert Schools for Barbados
INSERT INTO schools (name, island_id, organization_id, address) 
SELECT s.name, c.id, 1, s.address
FROM (VALUES 
    ('Harrison College', 'Crumpton St, Bridgetown'),
    ('Queen''s College', 'Husbands, St. James'),
    ('Combermere School', 'Waterford, St. Michael'),
    ('The Lodge School', 'Massiah St, St. John'),
    ('Christ Church Foundation School', 'Church Church'),
    ('St. Michael School', 'Martindales Rd, St. Michael'),
    ('Alexandra School', 'Speightstown, St. Peter')
) AS s(name, address)
JOIN countries c ON c.name = 'Barbados'
ON CONFLICT DO NOTHING;

-- 4. Insert Schools for Trinidad and Tobago
INSERT INTO schools (name, island_id, organization_id, address) 
SELECT s.name, c.id, 1, s.address
FROM (VALUES 
    ('Queen''s Royal College', 'Port of Spain, Trinidad'),
    ('Bishop Anstey High School', 'Port of Spain, Trinidad'),
    ('St. Mary''s College', 'Port of Spain, Trinidad'),
    ('Presentation College', 'San Fernando, Trinidad'),
    ('St. Joseph''s Convent', 'Port of Spain, Trinidad'),
    ('Naparima College', 'San Fernando, Trinidad'),
    ('Fatima College', 'Port of Spain, Trinidad')
) AS s(name, address)
JOIN countries c ON c.name = 'Trinidad and Tobago'
ON CONFLICT DO NOTHING;

-- 5. Insert Schools for Jamaica
INSERT INTO schools (name, island_id, organization_id, address) 
SELECT s.name, c.id, 1, s.address
FROM (VALUES 
    ('Wolmer''s High School for Boys', 'Kingston, Jamaica'),
    ('Campion College', 'Kingston, Jamaica'),
    ('Kingston College', 'Kingston, Jamaica'),
    ('Immaculate Conception High School', 'Kingston, Jamaica'),
    ('Munro College', 'St. Elizabeth, Jamaica'),
    ('St. George''s College', 'Kingston, Jamaica'),
    ('Jamaica College', 'Kingston, Jamaica')
) AS s(name, address)
JOIN countries c ON c.name = 'Jamaica'
ON CONFLICT DO NOTHING;
