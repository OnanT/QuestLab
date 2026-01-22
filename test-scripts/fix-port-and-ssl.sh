#!/bin/bash

# Fix Port 80 Conflict and SSL Issues

echo "🔧 Fixing Port 80 Conflict"
echo "=========================="
echo ""

# 1. Find what's using port 80
echo "1️⃣  Finding what's using port 80..."
echo ""

PORT_80_USERS=$(sudo lsof -i :80 2>/dev/null || sudo netstat -tulpn | grep :80)

if [ -n "$PORT_80_USERS" ]; then
    echo "⚠️  Port 80 is currently in use by:"
    echo "$PORT_80_USERS"
    echo ""
else
    echo "✅ Port 80 appears to be free"
    echo ""
fi

# 2. Stop common services that might use port 80
echo "2️⃣  Stopping services that might be using port 80..."

# Stop Apache if running
if systemctl is-active --quiet apache2 2>/dev/null; then
    echo "Stopping Apache2..."
    sudo systemctl stop apache2
    sudo systemctl disable apache2
    echo "✅ Apache2 stopped"
fi

# Stop nginx if running (system nginx, not Docker)
if systemctl is-active --quiet nginx 2>/dev/null; then
    echo "Stopping system nginx..."
    sudo systemctl stop nginx
    sudo systemctl disable nginx
    echo "✅ System nginx stopped"
fi

# Check for other Docker containers using port 80
echo ""
echo "Checking for other Docker containers on port 80..."
DOCKER_PORT_80=$(docker ps --format '{{.Names}}\t{{.Ports}}' | grep ':80->' | grep -v questlab_nginx)

if [ -n "$DOCKER_PORT_80" ]; then
    echo "⚠️  Found Docker containers using port 80:"
    echo "$DOCKER_PORT_80"
    echo ""
    read -p "Stop these containers? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker ps --format '{{.Names}}' | grep -v questlab_nginx | while read container; do
            PORTS=$(docker port "$container" 2>/dev/null | grep ':80->')
            if [ -n "$PORTS" ]; then
                echo "Stopping $container..."
                docker stop "$container"
            fi
        done
    fi
fi

# 3. Stop ALL questlab containers
echo ""
echo "3️⃣  Stopping all QuestLab containers..."
docker-compose -f docker-compose-http.yml down 2>/dev/null || true
docker-compose down 2>/dev/null || true

# Stop any stray questlab containers
docker ps -a --format '{{.Names}}' | grep questlab | while read container; do
    echo "Stopping $container..."
    docker stop "$container" 2>/dev/null || true
    docker rm "$container" 2>/dev/null || true
done

echo "✅ All containers stopped"

# 4. Wait a moment for port to be released
echo ""
echo "⏳ Waiting for port 80 to be released (5 seconds)..."
sleep 5

# 5. Verify port 80 is free
echo ""
echo "4️⃣  Verifying port 80 is now free..."
if sudo lsof -i :80 > /dev/null 2>&1; then
    echo "❌ Port 80 is still in use!"
    echo "Process using it:"
    sudo lsof -i :80
    echo ""
    echo "You may need to manually kill the process:"
    echo "  sudo kill -9 <PID>"
    exit 1
else
    echo "✅ Port 80 is now free!"
fi

echo ""
echo "================================================"
echo "🔒 SSL Certificate Status"
echo "================================================"
echo ""

# Check if SSL certificates exist
if [ -d "certbot/conf/live/questlab.onan.shop" ]; then
    echo "✅ SSL certificates found!"
    echo ""
    echo "Certificate details:"
    sudo ls -lh certbot/conf/live/questlab.onan.shop/
    echo ""
    
    # Check expiry
    if [ -f "certbot/conf/live/questlab.onan.shop/cert.pem" ]; then
        EXPIRY=$(sudo openssl x509 -in certbot/conf/live/questlab.onan.shop/cert.pem -noout -enddate 2>/dev/null)
        echo "Certificate expiry: $EXPIRY"
    fi
    
    echo ""
    echo "📝 You can use existing certificates!"
    echo "   No need to request new ones (you hit rate limit anyway)"
else
    echo "⚠️  No SSL certificates found"
    echo ""
    echo "❌ You've hit Let's Encrypt rate limit (5 certs/week)"
    echo "   You can either:"
    echo "   1. Wait until 2026-01-21 23:14:15 UTC"
    echo "   2. Use HTTP only for now"
    echo "   3. Use Let's Encrypt staging for testing"
fi

echo ""
echo "================================================"
echo "🚀 Starting Application"
echo "================================================"
echo ""

# Decide which compose file to use
if [ -d "certbot/conf/live/questlab.onan.shop" ]; then
    echo "Starting with HTTPS (using existing certificates)..."
    COMPOSE_FILE="docker-compose.yml"
else
    echo "Starting with HTTP only (no SSL)..."
    COMPOSE_FILE="docker-compose-http.yml"
fi

# Start services
docker-compose -f "$COMPOSE_FILE" up -d

echo ""
echo "⏳ Waiting for services to start (25 seconds)..."
sleep 25

# Check status
echo ""
echo "📊 Service Status:"
docker-compose -f "$COMPOSE_FILE" ps

echo ""
echo "================================================"
echo "✅ Done!"
echo "================================================"
echo ""

PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null)

if [ -d "certbot/conf/live/questlab.onan.shop" ]; then
    echo "🌐 Your app is available at:"
    echo "  https://questlab.onan.shop"
    echo "  https://${PUBLIC_IP}"
    echo ""
    echo "✅ HTTPS is enabled!"
else
    echo "🌐 Your app is available at:"
    echo "  http://questlab.onan.shop"
    echo "  http://${PUBLIC_IP}"
    echo ""
    echo "⚠️  Running on HTTP only (no SSL)"
    echo ""
    echo "To enable HTTPS later:"
    echo "  Wait until: 2026-01-21 23:14:15 UTC"
    echo "  Then run: ./init-ssl.sh"
fi

echo ""