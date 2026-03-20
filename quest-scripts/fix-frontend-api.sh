#!/bin/bash

# Fix Frontend API URL Configuration

echo "🔧 Fixing Frontend API URL"
echo "=========================="
echo ""

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null)

# 1. Fix App.tsx to use VITE_API_URL instead of VITE_BACKEND_URL
echo "1️⃣  Fixing App.tsx..."

if [ -f "frontend/src/App.tsx" ]; then
    # Backup
    cp frontend/src/App.tsx frontend/src/App.tsx.backup
    
    # Replace VITE_BACKEND_URL with VITE_API_URL
    sed -i 's/import.meta.env.VITE_BACKEND_URL/import.meta.env.VITE_API_URL/g' frontend/src/App.tsx
    
    # Also update the fallback URL to use /api
    sed -i 's|"http://localhost:8000"|"/api"|g' frontend/src/App.tsx
    
    echo "✅ Updated App.tsx to use VITE_API_URL"
else
    echo "❌ frontend/src/App.tsx not found!"
    exit 1
fi

# 2. Update .env to have correct VITE_API_URL
echo ""
echo "2️⃣  Updating .env..."

# Backup .env
cp .env .env.backup3

# Remove old VITE_BACKEND_URL if present
sed -i '/VITE_BACKEND_URL/d' .env

# Update or add VITE_API_URL - use relative path for same-origin requests
if grep -q "VITE_API_URL=" .env; then
    sed -i "s|VITE_API_URL=.*|VITE_API_URL=/api|" .env
    echo "✅ Updated VITE_API_URL to /api"
else
    echo "VITE_API_URL=/api" >> .env
    echo "✅ Added VITE_API_URL to .env"
fi

# 3. Show the changes
echo ""
echo "📋 Changes made:"
echo "  ✅ App.tsx now uses VITE_API_URL"
echo "  ✅ API URL set to /api (relative path - works with any domain)"
echo ""
echo "This means the frontend will make requests to:"
echo "  http://questlab.onan.shop/api/* (when accessed via domain)"
echo "  http://${PUBLIC_IP}/api/* (when accessed via IP)"
echo "  http://localhost/api/* (when accessed locally)"
echo ""

# 4. Rebuild frontend with new environment variable
echo "3️⃣  Rebuilding frontend..."

docker-compose -f docker-compose-http.yml build --no-cache frontend

echo "✅ Frontend rebuilt"

# 5. Restart services
echo ""
echo "4️⃣  Restarting services..."

docker-compose -f docker-compose-http.yml down
docker-compose -f docker-compose-http.yml up -d

echo ""
echo "⏳ Waiting for services to start (25 seconds)..."
sleep 25

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
echo "🎉 Frontend API Configuration Fixed!"
echo "================================================"
echo ""
echo "🌐 Your app is now available at:"
echo "  http://${PUBLIC_IP}"
echo "  http://questlab.onan.shop"
echo ""
echo "🔧 Next steps:"
echo "  1. Open your browser and go to http://${PUBLIC_IP}"
echo "  2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)"
echo "  3. Try registering a new account"
echo ""
echo "The API calls will now go through nginx at /api"
echo "instead of trying to reach localhost:8000 directly"
echo ""