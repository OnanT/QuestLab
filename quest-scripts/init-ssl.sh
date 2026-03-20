#!/bin/bash

# QuestLab SSL Certificate Initialization Script
# This script obtains SSL certificates using Certbot

set -e

echo "🔒 Initializing SSL certificates for QuestLab..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

DOMAIN=${DOMAIN:-questlab.onan.shop}
EMAIL=${LETSENCRYPT_EMAIL:-onan.thomas.08@gmail.com}

echo "Domain: $DOMAIN"
echo "Email: $EMAIL"

# Create directories for certbot
mkdir -p ./certbot/www
mkdir -p ./certbot/conf

# Check if certificates already exist
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    echo "⚠️  Certificates already exist for $DOMAIN"
    read -p "Do you want to renew them? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping certificate generation."
        exit 0
    fi
fi

# Create temporary nginx config for ACME challenge
cat > ./nginx/nginx-temp.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name questlab.onan.shop;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 "Certbot verification in progress...\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

echo "📦 Starting temporary nginx container for certificate generation..."

# Stop any running containers
docker-compose down 2>/dev/null || true

# Start only nginx with temporary config
docker run -d \
    --name questlab_nginx_temp \
    -p 80:80 \
    -v $(pwd)/nginx/nginx-temp.conf:/etc/nginx/nginx.conf:ro \
    -v $(pwd)/certbot/www:/var/www/certbot \
    nginx:alpine

echo "⏳ Waiting for nginx to start..."
sleep 5

# Test if nginx is responding
if ! curl -s http://localhost > /dev/null; then
    echo "❌ Nginx is not responding on port 80"
    docker stop questlab_nginx_temp 2>/dev/null || true
    docker rm questlab_nginx_temp 2>/dev/null || true
    exit 1
fi

echo "✅ Nginx is running"

# Obtain certificate using certbot
echo "🔐 Requesting SSL certificate from Let's Encrypt..."

docker run --rm \
    -v $(pwd)/certbot/www:/var/www/certbot \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN

# Check if certificate was created
if [ ! -d "./certbot/conf/live/$DOMAIN" ]; then
    echo "❌ Failed to obtain SSL certificate"
    docker stop questlab_nginx_temp 2>/dev/null || true
    docker rm questlab_nginx_temp 2>/dev/null || true
    exit 1
fi

echo "✅ SSL certificate obtained successfully!"

# Stop temporary nginx
docker stop questlab_nginx_temp 2>/dev/null || true
docker rm questlab_nginx_temp 2>/dev/null || true

# Remove temporary config
rm -f ./nginx/nginx-temp.conf

echo ""
echo "🎉 SSL initialization complete!"
echo "Next steps:"
echo "  1. Run './deploy.sh' to start all services with SSL"
echo "  2. Your app will be available at https://$DOMAIN"
echo ""