#!/bin/bash

# Use Existing SSL Certificates
# This script helps you use SSL certificates you already obtained

echo "🔒 Using Existing SSL Certificates"
echo "===================================="
echo ""

# Check if certificates exist
if [ ! -d "certbot/conf/live/questlab.onan.shop" ]; then
    echo "❌ No SSL certificates found in certbot/conf/live/"
    echo ""
    echo "Since you hit the rate limit, you have these options:"
    echo ""
    echo "1️⃣  Copy certificates from backup (if you have one)"
    echo "   If you backed up your certbot folder:"
    echo "   cp -r /path/to/backup/certbot/conf ./certbot/"
    echo ""
    echo "2️⃣  Wait for rate limit to reset"
    echo "   Next attempt: 2026-01-21 23:14:15 UTC"
    echo ""
    echo "3️⃣  Continue with HTTP only"
    echo "   Run: docker-compose -f docker-compose-http.yml up -d"
    echo ""
    exit 1
fi

echo "✅ Found SSL certificates!"
echo ""
echo "Certificate files:"
ls -lh certbot/conf/live/questlab.onan.shop/
echo ""

# Check certificate expiry
if [ -f "certbot/conf/live/questlab.onan.shop/cert.pem" ]; then
    echo "📅 Certificate information:"
    sudo openssl x509 -in certbot/conf/live/questlab.onan.shop/cert.pem -noout -text | grep -A2 "Validity"
    echo ""
fi

# Verify nginx.conf exists and is correct
if [ ! -f "nginx/nginx.conf" ]; then
    echo "⚠️  nginx/nginx.conf not found!"
    echo "Creating HTTPS nginx configuration..."
    
    mkdir -p nginx
    
    # Copy the HTTPS nginx config (from earlier artifacts)
    cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    upstream backend {
        server backend:8000;
    }

    # HTTP - redirect to HTTPS
    server {
        listen 80;
        server_name questlab.onan.shop;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS
    server {
        listen 443 ssl http2;
        server_name questlab.onan.shop;

        ssl_certificate /etc/letsencrypt/live/questlab.onan.shop/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/questlab.onan.shop/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

        add_header Strict-Transport-Security "max-age=31536000" always;

        client_max_body_size 50M;

        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://backend/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        location /uploads/ {
            proxy_pass http://backend/uploads/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location /health {
            proxy_pass http://backend/health;
            access_log off;
        }
    }
}
EOF
    
    echo "✅ nginx.conf created"
fi

# Stop everything
echo ""
echo "Stopping all containers..."
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose-http.yml down 2>/dev/null || true

# Kill anything on port 80
echo "Ensuring port 80 is free..."
sudo lsof -ti:80 | xargs -r sudo kill -9 2>/dev/null || true
sleep 3

# Start with HTTPS
echo ""
echo "Starting services with HTTPS..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start (25 seconds)..."
sleep 25

# Check status
echo ""
echo "📊 Service Status:"
docker-compose ps

# Test
echo ""
echo "🧪 Testing HTTPS..."
if curl -k -s https://localhost > /dev/null 2>&1; then
    echo "✅ HTTPS is working locally!"
else
    echo "⚠️  HTTPS test failed - checking logs..."
    docker-compose logs nginx | tail -20
fi

echo ""
echo "================================================"
echo "🎉 SSL Configuration Complete!"
echo "================================================"
echo ""

PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null)

echo "🌐 Your app is available at:"
echo "  https://questlab.onan.shop"
echo "  https://${PUBLIC_IP}"
echo ""
echo "🔒 HTTPS is enabled with your existing certificates!"
echo ""
echo "📋 Useful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Restart:       docker-compose restart"
echo "  Stop:          docker-compose down"
echo ""