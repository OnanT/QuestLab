#!/bin/bash

# Script to add "The Ant and the Grasshopper" lesson to QuestLab
# Uses the dynamic SQL script to find appropriate IDs automatically.

SQL_FILE="seed-info/add_ant_grasshopper_lesson_dynamic.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "❌ SQL file not found: $SQL_FILE"
    exit 1
fi

echo "🌱 Adding 'The Ant and the Grasshopper' lesson..."

docker exec -i questlab_postgres psql -U turtle_guide -d questlab_db < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Lesson added successfully!"
    
    # Verification
    echo "📊 Verifying data..."
    docker exec questlab_postgres psql -U turtle_guide -d questlab_db -c "
    SELECT l.id, l.title, u.username as creator
    FROM lessons l
    JOIN users u ON l.creator_id = u.id
    WHERE l.title LIKE '%Ant and the Grasshopper%'
    ORDER BY l.id DESC LIMIT 1;
    "
else
    echo "❌ Failed to add lesson"
    exit 1
fi
