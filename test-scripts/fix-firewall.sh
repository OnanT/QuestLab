#!/bin/bash

# Firewall Fix Script for QuestLab
# This script configures the firewall to allow HTTP and HTTPS traffic

echo "🔥 QuestLab Firewall Configuration"
echo "===================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ This script must be run as root or with sudo"
    echo "   Run: sudo ./fix-firewall.sh"
    exit 1
fi

echo "⚠️  This script will configure your firewall to allow:"
echo "   - Port 22 (SSH)"
echo "   - Port 80 (HTTP)"
echo "   - Port 443 (HTTPS)"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Configuration cancelled"
    exit 0
fi

# Function to configure UFW
configure_ufw() {
    echo ""
    echo "📋 Configuring UFW (Uncomplicated Firewall)..."
    
    # Install UFW if not present
    if ! command -v ufw &> /dev/null; then
        echo "Installing UFW..."
        apt-get update
        apt-get install -y ufw
    fi
    
    # Reset UFW to default
    echo "Resetting UFW to defaults..."
    ufw --force reset
    
    # Set default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (important - don't lock yourself out!)
    echo "Allowing SSH (port 22)..."
    ufw allow 22/tcp
    ufw allow ssh
    
    # Allow HTTP
    echo "Allowing HTTP (port 80)..."
    ufw allow 80/tcp
    ufw allow http
    
    # Allow HTTPS
    echo "Allowing HTTPS (port 443)..."
    ufw allow 443/tcp
    ufw allow https
    
    # Enable UFW
    echo "Enabling UFW..."
    ufw --force enable
    
    # Show status
    echo ""
    echo "✅ UFW Status:"
    ufw status verbose
}

# Function to configure iptables
configure_iptables() {
    echo ""
    echo "📋 Configuring iptables..."
    
    # Allow established connections
    iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
    
    # Allow loopback
    iptables -A INPUT -i lo -j ACCEPT
    
    # Allow SSH
    iptables -A INPUT -p tcp --dport 22 -j ACCEPT
    
    # Allow HTTP
    iptables -A INPUT -p tcp --dport 80 -j ACCEPT
    
    # Allow HTTPS
    iptables -A INPUT -p tcp --dport 443 -j ACCEPT
    
    # Save iptables rules
    if command -v iptables-save &> /dev/null; then
        echo "Saving iptables rules..."
        
        # Debian/Ubuntu
        if [ -d /etc/iptables ]; then
            iptables-save > /etc/iptables/rules.v4
        fi
        
        # Install iptables-persistent for persistence
        if ! dpkg -l | grep -q iptables-persistent; then
            echo "Installing iptables-persistent..."
            DEBIAN_FRONTEND=noninteractive apt-get install -y iptables-persistent
        else
            netfilter-persistent save
        fi
    fi
    
    echo "✅ iptables configured"
    iptables -L INPUT -n -v | grep -E "22|80|443"
}

# Detect which firewall to use
echo "🔍 Detecting firewall system..."

if command -v ufw &> /dev/null || [ -f /usr/sbin/ufw ]; then
    echo "Found: UFW"
    configure_ufw
elif command -v iptables &> /dev/null; then
    echo "Found: iptables"
    configure_iptables
else
    echo "❌ No firewall system found"
    echo "Installing UFW..."
    apt-get update
    apt-get install -y ufw
    configure_ufw
fi

# Stop any conflicting services
echo ""
echo "🛑 Checking for conflicting services..."

# Stop Apache if running
if systemctl is-active --quiet apache2; then
    echo "Stopping Apache2..."
    systemctl stop apache2
    systemctl disable apache2
    echo "✅ Apache2 stopped and disabled"
fi

# Stop system nginx if running (not our Docker container)
if systemctl is-active --quiet nginx; then
    echo "Stopping system nginx..."
    systemctl stop nginx
    systemctl disable nginx
    echo "✅ System nginx stopped and disabled"
fi

# Test connectivity
echo ""
echo "🧪 Testing connectivity..."

PUBLIC_IP=$(curl -s ifconfig.me || curl -s icanhazip.com)
echo "Your public IP: $PUBLIC_IP"

# Test if port 80 is reachable from outside
echo ""
echo "Testing if port 80 is accessible..."
echo "This test starts a temporary web server on port 80"

# Start a simple python HTTP server temporarily
(python3 -m http.server 80 &) 2>/dev/null
HTTP_SERVER_PID=$!
sleep 2

# Try to access it
if curl -s --connect-timeout 5 http://localhost > /dev/null; then
    echo "✅ Port 80 is accessible locally"
else
    echo "❌ Port 80 is NOT accessible locally"
fi

# Kill the test server
kill $HTTP_SERVER_PID 2>/dev/null

echo ""
echo "================================"
echo "🎉 Firewall configuration complete!"
echo ""
echo "📋 Summary:"
echo "  ✅ SSH (22): Open"
echo "  ✅ HTTP (80): Open"
echo "  ✅ HTTPS (443): Open"
echo ""
echo "⚠️  IMPORTANT: If you're on a cloud provider (AWS, DigitalOcean, Google Cloud, etc.):"
echo "   You MUST also configure the cloud firewall/security groups:"
echo ""
echo "   AWS: Edit Security Group inbound rules"
echo "   DigitalOcean: Edit Firewall rules"
echo "   Google Cloud: Edit VPC Firewall rules"
echo "   Azure: Edit Network Security Group"
echo ""
echo "   Add these inbound rules:"
echo "   - Type: HTTP, Protocol: TCP, Port: 80, Source: 0.0.0.0/0"
echo "   - Type: HTTPS, Protocol: TCP, Port: 443, Source: 0.0.0.0/0"
echo ""
echo "🔧 Next steps:"
echo "  1. If on cloud provider: Configure cloud firewall"
echo "  2. Test: curl http://$PUBLIC_IP"
echo "  3. Run: ./init-ssl.sh"
echo "  4. Run: ./deploy.sh or ./quick-start.sh"
echo ""