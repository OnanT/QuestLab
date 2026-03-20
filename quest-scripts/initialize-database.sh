#!/bin/bash

# Initialize Database Tables

echo "🗄️  Initializing Database"
echo "========================="
echo ""

echo "The database exists but tables haven't been created."
echo "This will run the init.sql script to create all tables."
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

# Check if init.sql exists
if [ ! -f "init.sql" ]; then
    echo "❌ init.sql not found!"
    exit 1
fi

echo ""
echo "1️⃣  Running init.sql in database..."

# Run init.sql directly in the database
docker exec -i questlab_postgres psql -U turtle_guide -d questlab_db < init.sql

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully!"
else
    echo "❌ Database initialization failed"
    exit 1
fi

# Verify tables were created
echo ""
echo "2️⃣  Verifying tables..."

TABLES=$(docker exec questlab_postgres psql -U turtle_guide -d questlab_db -c "\dt" | grep "public" | wc -l)

echo "Found $TABLES tables"

if [ "$TABLES" -gt 5 ]; then
    echo "✅ Tables created successfully!"
    echo ""
    echo "📋 Database tables:"
    docker exec questlab_postgres psql -U turtle_guide -d questlab_db -c "\dt"
else
    echo "⚠️  Expected more tables"
fi

# Check specific tables
echo ""
echo "3️⃣  Checking key tables..."

for table in users lessons quizzes games progress; do
    EXISTS=$(docker exec questlab_postgres psql -U turtle_guide -d questlab_db -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table');" | xargs)
    
    if [ "$EXISTS" = "t" ]; then
        echo "✅ $table table exists"
    else
        echo "❌ $table table NOT found"
    fi
done

echo ""
echo "================================================"
echo "🎉 Database Ready!"
echo "================================================"
echo ""
echo "You can now:"
echo "  1. Register a new account at https://questlab.onan.shop/register"
echo "  2. Login and start using the app"
echo ""
echo "To view database content:"
echo "  docker exec -it questlab_postgres psql -U turtle_guide -d questlab_db"
echo ""