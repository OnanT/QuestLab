#!/bin/bash

# Final Frontend Fix - Single Nginx Container

echo "🔧 Final Frontend Fix"
echo "====================="
echo ""

echo "The issue: Frontend container builds the app, but nginx can't access it"
echo "Solution: Remove separate frontend container, build directly in nginx"
echo ""

# 1. Update Frontend Dockerfile to be a single-stage build
echo "1️⃣  Creating optimized Dockerfile..."

cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production - nginx
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

echo "✅ Updated frontend/Dockerfile"

# 2. Create simplified docker-compose that doesn't need volume sharing
echo ""
echo "2️⃣  Creating simplified docker-compose.yml..."

cat > docker-compose.yml << 'EOFCOMPOSE'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: questlab_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - questlab_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: questlab_backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      SECRET_KEY: ${SECRET_KEY}
      ALGORITHM: ${ALGORITHM}
      ACCESS_TOKEN_EXPIRE_MINUTES: ${ACCESS_TOKEN_EXPIRE_MINUTES}
      UPLOAD_PATH: ${UPLOAD_PATH}
      CORS_ORIGINS: ${CORS_ORIGINS}
    volumes:
      - uploads_volume:/app/uploads
    networks:
      - questlab_network
    expose:
      - "8000"

  nginx:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: questlab_nginx
    restart: unless-stopped
    depends_on:
      backend:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    networks:
      - questlab_network
    command: "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'"

  certbot:
    image: certbot/certbot
    container_name: questlab_certbot
    restart: unless-stopped
    depends_on:
      - nginx
    volumes:
      - ./certbot/www:/var/www/certbot
      - ./certbot/conf:/etc/letsencrypt
    networks:
      - questlab_network
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  questlab_network:
    driver: bridge

volumes:
  postgres_data:
  uploads_volume:
EOFCOMPOSE

echo "✅ Created simplified docker-compose.yml"
echo ""
echo "Key change: nginx container now builds FROM frontend"
echo "This means the React app and nginx are in the same container"
echo ""

# 3. Rebuild and restart
echo "3️⃣  Stopping old containers..."
docker-compose down

echo ""
echo "4️⃣  Removing old images..."
docker rmi questlab_frontend 2>/dev/null || true
docker rmi questlab_nginx 2>/dev/null || true

echo ""
echo "5️⃣  Building new images (this will take a few minutes)..."
docker-compose build --no-cache

echo ""
echo "6️⃣  Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services (30 seconds)..."
sleep 30

# 7. Verify
echo ""
echo "7️⃣  Verifying setup..."

echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🔍 Checking nginx container content:"
docker exec questlab_nginx ls -lh /usr/share/nginx/html/ | head -10

echo ""
echo "🧪 Testing HTTPS:"
HTTPS_TEST=$(curl -k -s https://localhost | grep -o "<title>.*</title>" | head -1)
echo "Page title: $HTTPS_TEST"

if echo "$HTTPS_TEST" | grep -q "QuestLab\|Vite\|React"; then
    echo "✅ Frontend is being served!"
else
    echo "⚠️  Still seeing default nginx page"
    echo ""
    echo "Checking logs..."
    docker-compose logs nginx --tail=30
fi

echo ""
echo "================================================"
echo "🎉 Deployment Complete!"
echo "================================================"
echo ""

PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null)

echo "🌐 Your app is available at:"
echo "  🔒 https://questlab.onan.shop"
echo "  🔒 https://${PUBLIC_IP}"
echo ""
echo "📋 Useful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  View nginx:    docker-compose logs nginx"
echo "  Restart:       docker-compose restart"
echo "  Rebuild:       docker-compose build --no-cache && docker-compose up -d"
echo ""