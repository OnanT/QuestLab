#!/bin/bash

# Fix Database Connection Issue

echo "🗄️  Fixing Database Configuration"
echo "=================================="
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found!"
    exit 1
fi

echo "Current database configuration:"
echo "  POSTGRES_USER: ${POSTGRES_USER}"
echo "  POSTGRES_DB: ${POSTGRES_DB}"
echo ""

# Stop all containers
echo "1️⃣  Stopping all containers..."
docker-compose -f docker-compose-http.yml down
echo "✅ Containers stopped"

# Remove the postgres volume to start fresh
echo ""
echo "2️⃣  Removing old database volume..."
echo "⚠️  This will delete all existing data!"
read -p "Continue? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled"
    exit 0
fi

docker volume rm questlab_postgres_data 2>/dev/null || true
echo "✅ Old volume removed"

# Create init.sql if it doesn't exist
echo ""
echo "3️⃣  Creating database initialization script..."

cat > init.sql << 'EOF'
-- QuestLab Database Initialization
-- This ensures the database and user exist

-- Create database if it doesn't exist (this runs as postgres superuser)
SELECT 'CREATE DATABASE questlab_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'questlab_db')\gexec

-- Connect to the database
\c questlab_db

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE questlab_db TO turtle_guide;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO turtle_guide;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO turtle_guide;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO turtle_guide;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO turtle_guide;
EOF

echo "✅ Database initialization script created"

# Update docker-compose to ensure correct database is used
echo ""
echo "4️⃣  Verifying docker-compose configuration..."

# Check if the DATABASE_URL in .env matches
if grep -q "turtle_guide" .env; then
    echo "✅ .env configuration looks correct"
else
    echo "⚠️  Checking .env configuration..."
fi

# Start postgres first
echo ""
echo "5️⃣  Starting PostgreSQL..."
docker-compose -f docker-compose-http.yml up -d postgres

echo "⏳ Waiting for PostgreSQL to initialize (30 seconds)..."
sleep 30

# Check postgres logs
echo ""
echo "📋 PostgreSQL logs:"
docker-compose -f docker-compose-http.yml logs postgres | tail -20

# Verify database was created
echo ""
echo "6️⃣  Verifying database..."
docker-compose -f docker-compose-http.yml exec -T postgres psql -U turtle_guide -d questlab_db -c "SELECT version();" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
else
    echo "⚠️  Database might still be initializing..."
fi

# Start remaining services
echo ""
echo "7️⃣  Starting all services..."
docker-compose -f docker-compose-http.yml up -d

echo "⏳ Waiting for services to start..."
sleep 15

# Check status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose-http.yml ps

echo ""
echo "🏥 Checking backend health..."
sleep 5
curl -s http://localhost:8000/health | jq . 2>/dev/null || curl -s http://localhost:8000/health

echo ""
echo "================================================"
echo "🎉 Database Fix Complete!"
echo "================================================"
echo ""
echo "🔧 If services are still unhealthy, check logs:"
echo "  docker-compose -f docker-compose-http.yml logs backend"
echo "  docker-compose -f docker-compose-http.yml logs postgres"
echo ""