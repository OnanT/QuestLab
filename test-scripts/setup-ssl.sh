#!/bin/bash

# Setup SSL certificates for questlab.onan.shop
set -e

DOMAIN="questlab.onan.shop"
EMAIL="onan.thomas.08@gmail.com"

echo "=== Setting up SSL for $DOMAIN ==="

# Create necessary directories
echo "Creating certbot directories..."
mkdir -p certbot/www certbot/conf
mkdir -p nginx/ssl

# Stop any running containers
echo "Stopping existing containers..."
docker-compose down

# Start nginx without SSL for certificate verification
echo "Starting nginx for certificate verification..."
docker-compose up -d nginx

# Wait for nginx to be ready
echo "Waiting for nginx to be ready..."
sleep 5

# Request SSL certificate from Let's Encrypt
echo "Requesting SSL certificate from Let's Encrypt..."
docker-compose run --rm --entrypoint "" certbot sh -c " \
    certbot certonly --webroot --webroot-path /var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --non-interactive \
    -d $DOMAIN \
    --force-renewal"

echo "=== SSL certificate obtained! ==="

# Create symbolic links for nginx
echo "Setting up certificate paths..."
docker-compose exec nginx sh -c " \
    ln -sf /etc/letsencrypt/live/$DOMAIN/fullchain.pem /etc/letsencrypt/live/fullchain.pem && \
    ln -sf /etc/letsencrypt/live/$DOMAIN/privkey.pem /etc/letsencrypt/live/privkey.pem"

# Stop nginx and start all services
echo "Restarting all services with SSL..."
docker-compose down
docker-compose up -d

echo "=== SSL setup complete! ==="
echo "Your app is now available at: https://$DOMAIN"
echo ""
echo "To check SSL certificate:"
echo "  docker-compose exec nginx nginx -t"
echo "To view logs:"
echo "  docker-compose logs -f"
echo "To renew certificates manually:"
echo "  docker-compose run --rm certbot renew"