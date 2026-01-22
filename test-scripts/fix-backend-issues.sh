#!/bin/bash

# Fix Backend and Frontend Issues

echo "🔧 Fixing Backend and Frontend Issues"
echo "======================================"
echo ""

# 1. Fix backend main.py - SQLAlchemy timestamp issue
echo "1️⃣  Fixing backend/main.py timestamp syntax..."

if [ -f "backend/main.py" ]; then
    # Backup
    cp backend/main.py backend/main.py.backup2
    
    # Add 'text' to SQLAlchemy imports if not present
    if ! grep -q "from sqlalchemy import.*text" backend/main.py; then
        echo "Adding 'text' to SQLAlchemy imports..."
        sed -i 's/from sqlalchemy import \(.*\)/from sqlalchemy import \1, text/' backend/main.py
    fi
    
    # Replace all server_default='CURRENT_TIMESTAMP' with server_default=text('CURRENT_TIMESTAMP')
    sed -i "s/server_default='CURRENT_TIMESTAMP'/server_default=text('CURRENT_TIMESTAMP')/g" backend/main.py
    
    echo "✅ Fixed backend/main.py"
else
    echo "❌ backend/main.py not found!"
    exit 1
fi

# 2. Fix .env file - update VITE_API_URL
echo ""
echo "2️⃣  Fixing .env VITE_API_URL..."

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null)

# Backup .env
cp .env .env.backup2

# Update VITE_API_URL to use public IP with /api suffix
if grep -q "VITE_API_URL=" .env; then
    sed -i "s|VITE_API_URL=.*|VITE_API_URL=http://${PUBLIC_IP}/api|" .env
    echo "✅ Updated VITE_API_URL to http://${PUBLIC_IP}/api"
else
    echo "VITE_API_URL=http://${PUBLIC_IP}/api" >> .env
    echo "✅ Added VITE_API_URL to .env"
fi

# 3. Fix database health check in main.py
echo ""
echo "3️⃣  Fixing database health check..."

# Fix the health check endpoint
sed -i 's/db.execute("SELECT 1")/db.execute(text("SELECT 1"))/g' backend/main.py

echo "✅ Fixed health check"

# Show changes
echo ""
echo "📋 Summary of changes:"
echo "  ✅ Fixed SQLAlchemy timestamp syntax"
echo "  ✅ Updated VITE_API_URL to: http://${PUBLIC_IP}/api"
echo "  ✅ Fixed database health check"
echo ""

# 4. Rebuild and restart
echo "4️⃣  Rebuilding and restarting services..."

# Rebuild backend only (frontend needs rebuild for new env var)
docker-compose -f docker-compose-http.yml build --no-cache backend frontend

# Restart all services
docker-compose -f docker-compose-http.yml down
docker-compose -f docker-compose-http.yml up -d

echo ""
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

# Check status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose-http.yml ps

# Test health
echo ""
echo "🏥 Testing backend health..."
curl -s http://localhost/api/health | jq . 2>/dev/null || curl -s http://localhost/api/health

echo ""
echo "================================================"
echo "🎉 Fixes Applied!"
echo "================================================"
echo ""
echo "🌐 Your app is now available at:"
echo "  http://${PUBLIC_IP}"
echo "  http://questlab.onan.shop (when DNS propagates)"
echo ""
echo "🔧 Try registering again in your browser!"
echo ""
echo "If you still see errors:"
echo "  1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)"
echo "  2. Clear browser cache"
echo "  3. Check logs: docker-compose -f docker-compose-http.yml logs -f backend"
echo ""