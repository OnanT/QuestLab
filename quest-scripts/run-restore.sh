#!/bin/bash

# Script to run the lesson HTML restoration
# This version runs INSIDE the docker container to avoid local dependency issues

echo "🔄 Starting Lesson HTML Restoration (Container Mode)..."
echo "========================================================="

# Run the script inside the backend container
# We assume the container is named 'questlab_backend'
docker exec -i questlab_backend python3 restore_lesson_html.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Restoration complete!"
else
    echo ""
    echo "❌ Error: Restoration failed. Ensure the docker containers are running."
fi
