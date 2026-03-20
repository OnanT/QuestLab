#!/bin/bash

# Script to add "Present Continuous Tense" lesson to QuestLab
# Uses the dynamic SQL script to find appropriate IDs automatically.

SQL_FILE="seed-info/add_present_continuous_lesson.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "❌ SQL file not found: $SQL_FILE"
    exit 1
fi

echo "🌱 Adding 'Present Continuous Tense' lesson..."

docker exec -i questlab_postgres psql -U turtle_guide -d questlab_db < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Lesson added successfully!"
    
    # Verification
    echo "📊 Verifying data..."
    docker exec questlab_postgres psql -U turtle_guide -d questlab_db -c "
    SELECT l.id, l.title, u.username as creator
    FROM lessons l
    JOIN users u ON l.creator_id = u.id
    WHERE l.title LIKE '%Present Continuous%'
    ORDER BY l.id DESC LIMIT 1;
    "
    
    echo "❓ Verifying quizzes..."
    docker exec questlab_postgres psql -U turtle_guide -d questlab_db -c "
    SELECT COUNT(*) as quiz_count FROM quizzes WHERE lesson_id = (SELECT id FROM lessons WHERE title LIKE '%Present Continuous%' ORDER BY id DESC LIMIT 1);
    "
else
    echo "❌ Failed to add lesson"
    exit 1
fi
