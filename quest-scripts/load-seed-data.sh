#!/bin/bash

# Load Seed Data into QuestLab

echo "🌱 Loading Seed Data"
echo "===================="
echo ""

echo "This will populate your database with:"
echo "  👥 10 demo users (admin, teachers, parents, students)"
echo "  📚 8 lessons (Math, English, Science)"
echo "  ❓ 24 quiz questions"
echo "  🎮 4 games"
echo "  📊 Student progress data"
echo "  🏆 Rewards"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

# Check if questlab_clean_seed.sql exists
if [ ! -f "questlab_clean_seed.sql" ]; then
    echo "❌ questlab_clean_seed.sql not found!"
    echo "Please save the questlab_clean_seed.sql file first"
    exit 1
fi

echo ""
echo "1️⃣  Loading seed data into database..."

# Load seed data
docker exec -i questlab_postgres psql -U turtle_guide -d questlab_db < questlab_clean_seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Seed data loaded successfully!"
else
    echo "❌ Failed to load seed data"
    exit 1
fi

echo ""
echo "2️⃣  Verifying data..."

# Count records
echo ""
echo "📊 Database Summary:"

docker exec questlab_postgres psql -U turtle_guide -d questlab_db -t -c "
SELECT 
    'Users: ' || COUNT(*) FROM users
    UNION ALL
    SELECT 'Lessons: ' || COUNT(*) FROM lessons
    UNION ALL
    SELECT 'Quizzes: ' || COUNT(*) FROM quizzes
    UNION ALL
    SELECT 'Games: ' || COUNT(*) FROM games
    UNION ALL
    SELECT 'Progress Records: ' || COUNT(*) FROM progress
    UNION ALL
    SELECT 'Rewards: ' || COUNT(*) FROM rewards;
"

echo ""
echo "================================================"
echo "🎉 Seed Data Loaded!"
echo "================================================"
echo ""
echo "📝 Demo Accounts (all passwords: password123):"
echo ""
echo "🔑 Admin:"
echo "  Username: admin"
echo "  Email: admin@questlab.com"
echo ""
echo "👨‍🏫 Teachers:"
echo "  Username: ms_johnson"
echo "  Email: teacher1@questlab.com"
echo ""
echo "  Username: mr_williams"
echo "  Email: teacher2@questlab.com"
echo ""
echo "👪 Parents:"
echo "  Username: parent_smith"
echo "  Email: parent1@questlab.com"
echo ""
echo "  Username: parent_jones"
echo "  Email: parent2@questlab.com"
echo ""
echo "🎓 Students:"
echo "  Username: alex_smith (Parent: parent_smith)"
echo "  Email: alex@questlab.com"
echo ""
echo "  Username: emma_smith (Parent: parent_smith)"
echo "  Email: emma@questlab.com"
echo ""
echo "  Username: marcus_jones (Parent: parent_jones)"
echo "  Email: marcus@questlab.com"
echo ""
echo "  Username: sophia_jones (Parent: parent_jones)"
echo "  Email: sophia@questlab.com"
echo ""
echo "  Username: james_brown (No parent)"
echo "  Email: james@questlab.com"
echo ""
echo "🌐 Login at: https://questlab.onan.shop/login"
echo ""
echo "💡 Tips:"
echo "  - Login as 'admin' to see the admin dashboard"
echo "  - Login as 'emma_smith' to see student progress"
echo "  - Login as 'parent_smith' to track your children"
echo "  - Login as 'ms_johnson' to create lessons"
echo ""