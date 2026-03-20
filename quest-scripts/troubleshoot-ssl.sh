#!/bin/bash

# SSL Troubleshooting Script for QuestLab

echo "🔍 SSL Certificate Troubleshooting"
echo "===================================="
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script should be run with sudo for full diagnostics"
    echo "   Run: sudo ./troubleshoot-ssl.sh"
    echo ""
fi

# 1. Check if port 80 is accessible
echo "1️⃣  Checking if port 80 is open..."
if netstat -tuln | grep -q ":80 "; then
    echo "✅ Port 80 is listening"
    netstat -tuln | grep ":80 "
else
    echo "❌ Port 80 is NOT listening"
fi
echo ""

# 2. Check firewall status
echo "2️⃣  Checking firewall (UFW)..."
if command -v ufw &> /dev/null; then
    sudo ufw status
else
    echo "ℹ️  UFW not installed"
fi
echo ""

# 3. Check iptables
echo "3️⃣  Checking iptables rules..."
if command -v iptables &> /dev/null; then
    echo "Current iptables rules for port 80:"
    sudo iptables -L INPUT -n -v | grep -E "80|443" || echo "No specific rules for ports 80/443"
else
    echo "ℹ️  iptables not available"
fi
echo ""

# 4. Check if nginx container is running
echo "4️⃣  Checking nginx container..."
if docker ps | grep -q questlab_nginx_temp; then
    echo "✅ Nginx temporary container is running"
    docker ps | grep questlab_nginx_temp
else
    echo "❌ Nginx temporary container is NOT running"
fi
echo ""

# 5. Test local access to nginx
echo "5️⃣  Testing local HTTP access..."
if curl -s http://localhost/.well-known/acme-challenge/test > /dev/null 2>&1; then
    echo "✅ Nginx is responding locally"
else
    echo "⚠️  Nginx may not be configured correctly"
    echo "Response:"
    curl -v http://localhost/ 2>&1 | head -20
fi
echo ""

# 6. Check DNS resolution
echo "6️⃣  Checking DNS resolution..."
echo "Your domain should resolve to this server's IP"
echo "Server's public IP:"
curl -s ifconfig.me || curl -s icanhazip.com
echo ""
echo "Domain resolution:"
nslookup questlab.onan.shop || dig questlab.onan.shop
echo ""

# 7. Test external access
echo "7️⃣  Testing external HTTP access..."
PUBLIC_IP=$(curl -s ifconfig.me || curl -s icanhazip.com)
echo "Testing http://$PUBLIC_IP"
curl -v "http://$PUBLIC_IP/" 2>&1 | head -20
echo ""

# 8. Check for other services on port 80
echo "8️⃣  Checking what's using port 80..."
sudo lsof -i :80 2>/dev/null || sudo netstat -tulpn | grep :80
echo ""

# Summary and recommendations
echo ""
echo "📋 Summary and Recommendations:"
echo "================================"
echo ""
echo "Common issues and solutions:"
echo ""
echo "1. FIREWALL BLOCKING PORT 80:"
echo "   Solution: sudo ufw allow 80/tcp"
echo "   Solution: sudo ufw allow 443/tcp"
echo ""
echo "2. CLOUD PROVIDER FIREWALL (Security Groups):"
echo "   - Check your cloud provider's firewall/security groups"
echo "   - Ensure ports 80 and 443 are open to 0.0.0.0/0"
echo ""
echo "3. DNS NOT POINTING TO SERVER:"
echo "   - Verify questlab.onan.shop points to: $PUBLIC_IP"
echo "   - Wait 5-10 minutes for DNS propagation"
echo ""
echo "4. ANOTHER SERVICE USING PORT 80:"
echo "   - Stop Apache: sudo systemctl stop apache2"
echo "   - Stop other nginx: sudo systemctl stop nginx"
echo ""

# Provide next steps
echo ""
echo "🔧 Quick Fixes:"
echo "==============="
echo ""
echo "# Open firewall ports:"
echo "sudo ufw allow 80/tcp"
echo "sudo ufw allow 443/tcp"
echo "sudo ufw allow 22/tcp  # SSH - don't lock yourself out!"
echo "sudo ufw enable"
echo ""
echo "# If you're on a cloud provider (AWS, DigitalOcean, etc):"
echo "# Go to your provider's dashboard and add inbound rules:"
echo "#   - Port 80 (HTTP) from 0.0.0.0/0"
echo "#   - Port 443 (HTTPS) from 0.0.0.0/0"
echo ""