#!/bin/bash

# QuestLab Deployment Script
set -e

echo "=== Starting QuestLab deployment ==="

# Check for .env file
if [ -f .env ]; then
    echo "Loading environment variables🔐🔐🔐"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found!"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Check if domain is set
if [ -z "$DOMAIN" ]; then
    echo "Error: DOMAIN not set in .env file!"
    exit 1
fi

echo "Deploying for domain: $DOMAIN"

# Pull latest changes (if using git)
# echo "Pulling latest changes..."
# git pull origin main

# Build and start services
echo "Building and starting containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
for i in {1..30}; do
    if docker-compose ps | grep -q "Up"; then
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# Check service status
echo "=== Service status ==="
docker-compose ps

# Check nginx configuration
echo "=== Checking nginx configuration ==="
docker-compose exec nginx nginx -t

# Show logs for quick verification
echo "=== Recent logs (last 10 lines each) ==="
docker-compose logs --tail=10 nginx
docker-compose logs --tail=10 backend
docker-compose logs --tail=10 frontend

echo ""
echo "=== Deployment complete! ==="
echo "Your app should be available at: https://$DOMAIN"
echo ""
echo "=== Useful commands ==="
echo "View all logs:           docker-compose logs -f"
echo "Check SSL certificate:   openssl s_client -connect $DOMAIN:443 -servername $DOMAIN"
echo "Backend health check:    curl https://$DOMAIN/health"
echo "Stop services:           docker-compose down"
echo "Update certificates:     docker-compose run --rm certbot renew"