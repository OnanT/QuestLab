#!/bin/bash

# QuestLab Deployment Verification Script

echo "🔍 QuestLab Deployment Verification"
echo "===================================="
echo ""

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "unknown")

# 1. Check Docker containers
echo "1️⃣  Container Status:"
echo "-------------------"
docker compose -f docker compose.yml ps
echo ""

# 2. Check backend health through nginx
echo "2️⃣  Backend Health Check (via Nginx):"
echo "-------------------------------------"
HEALTH_RESPONSE=$(curl -s http://localhost/api/health)
if [ -n "$HEALTH_RESPONSE" ]; then
    echo "✅ Backend is responding!"
    echo "Response: $HEALTH_RESPONSE"
else
    echo "❌ Backend health check failed"
    echo "Checking backend logs..."
    docker compose -f docker-compose.yml logs backend | tail -20
fi
echo ""

# 3. Check frontend
echo "3️⃣  Frontend Check:"
echo "------------------"
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✅ Frontend is serving (HTTP $FRONTEND_RESPONSE)"
else
    echo "⚠️  Frontend returned HTTP $FRONTEND_RESPONSE"
fi
echo ""

# 4. Check database connectivity
echo "4️⃣  Database Check:"
echo "------------------"
DB_CHECK=$(docker compose -f docker-compose.yml exec -T postgres psql -U turtle_guide -d questlab_db -c "SELECT COUNT(*) FROM users;" 2>&1)
if echo "$DB_CHECK" | grep -q "0\|[1-9]"; then
    echo "✅ Database is accessible and has users table"
else
    echo "⚠️  Database check: $DB_CHECK"
fi
echo ""

# 5. Test API endpoint
echo "5️⃣  Testing API Root Endpoint:"
echo "------------------------------"
API_ROOT=$(curl -s http://localhost/api/)
echo "Response: $API_ROOT"
echo ""

# 6. Check nginx logs for errors
echo "6️⃣  Recent Nginx Logs:"
echo "---------------------"
docker compose -f docker-compose.yml logs nginx --tail=10
echo ""

# 7. Summary
echo "================================================"
echo "📊 Deployment Summary"
echo "================================================"
echo ""
echo "🌐 Access URLs:"
echo "  Local:        http://localhost"
echo "  Public IP:    http://$PUBLIC_IP"
echo "  Domain:       http://questlab.onan.shop (when DNS propagates)"
echo ""
echo "🔗 API Health:  http://localhost/api/health"
echo "   API Root:    http://localhost/api/"
echo ""
echo "📋 Useful Commands:"
echo "  View all logs:        docker compose -f docker-compose.yml logs -f"
echo "  View backend logs:    docker compose -f docker-compose.yml logs -f backend"
echo "  Restart services:     docker compose -f docker-compose.yml restart"
echo "  Stop services:        docker compose -f docker-compose.yml down"
echo ""
echo "🎯 Next Steps:"
echo "  1. Open http://$PUBLIC_IP in your browser"
echo "  2. Register a new admin account"
echo "  3. Start creating lessons!"
echo ""
echo "🔒 To add SSL/HTTPS later:"
echo "  1. Ensure firewall allows ports 80 and 443:"
echo "     sudo ./fix-firewall.sh"
echo "  2. Obtain SSL certificate:"
echo "     ./init-ssl.sh"
echo "  3. Deploy with SSL:"
echo "     docker compose down"
echo "     docker compose up -d"
echo ""
echo "================================================"
echo ""

# Test if publicly accessible
echo "🌍 Testing Public Accessibility..."
echo ""
if [ "$PUBLIC_IP" != "unknown" ]; then
    echo "Your public IP is: $PUBLIC_IP"
    echo ""
    echo "Testing from external perspective..."
    
    # Try to access from public IP
    PUBLIC_TEST=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "http://$PUBLIC_IP/" 2>/dev/null)
    
    if [ "$PUBLIC_TEST" = "200" ]; then
        echo "✅ Your app is publicly accessible!"
        echo "   Anyone can visit: http://$PUBLIC_IP"
    else
        echo "⚠️  Public access test returned: HTTP $PUBLIC_TEST"
        echo "   This might mean:"
        echo "   - Firewall is blocking port 80"
        echo "   - You're behind NAT/router (if on home network)"
        echo "   - Cloud provider security group not configured"
    fi
else
    echo "⚠️  Could not determine public IP"
fi

echo ""
echo "🎉 Verification Complete!"
echo ""