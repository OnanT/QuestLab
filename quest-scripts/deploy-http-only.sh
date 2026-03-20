#!/bin/bash

# QuestLab HTTP-Only Deployment (for testing or SSL troubleshooting)
# This deploys the app without SSL first, then you can add SSL later

set -e

echo "🚀 QuestLab HTTP-Only Deployment"
echo "================================="
echo ""
echo "⚠️  This will deploy QuestLab with HTTP only (no SSL)"
echo "   Use this for testing or if SSL setup fails"
echo "   You can add SSL later once firewall issues are resolved"
echo ""

read -p "Continue with HTTP-only deployment? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Create temporary nginx config for HTTP only
echo "📝 Creating HTTP-only nginx configuration..."

mkdir -p nginx

cat > nginx/nginx-http.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Upstream backend
    upstream backend {
        server backend:8000;
    }

    # HTTP server
    server {
        listen 80;
        server_name questlab.onan.shop localhost;

        # Client max body size for uploads
        client_max_body_size 50M;

        # Frontend - React app
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
            
            # Cache static assets
            location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend/;
            proxy_http_version 1.1;
            
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Port $server_port;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Uploads - served by backend
        location /uploads/ {
            proxy_pass http://backend/uploads/;
            proxy_http_version 1.1;
            
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Cache uploaded files
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check endpoint
        location /health {
            proxy_pass http://backend/health;
            access_log off;
        }
    }
}
EOF

echo "✅ HTTP-only nginx config created"

# Create temporary docker-compose for HTTP only
echo "📝 Creating HTTP-only docker-compose configuration..."

cat > docker-compose-http.yml << 'EOFCOMPOSE'
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
    networks:
      - questlab_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
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
      CORS_ORIGINS: "*"
    volumes:
      - uploads_volume:/app/uploads
    networks:
      - questlab_network
    expose:
      - "8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    container_name: questlab_frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      VITE_API_URL: ${VITE_API_URL}
    networks:
      - questlab_network
    volumes:
      - frontend_static:/usr/share/nginx/html

  nginx:
    image: nginx:alpine
    container_name: questlab_nginx
    restart: unless-stopped
    depends_on:
      backend:
        condition: service_healthy
      frontend:
        condition: service_started
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx-http.conf:/etc/nginx/nginx.conf:ro
      - frontend_static:/usr/share/nginx/html:ro
    networks:
      - questlab_network

networks:
  questlab_network:
    driver: bridge

volumes:
  postgres_data:
  uploads_volume:
  frontend_static:
EOFCOMPOSE

echo "✅ HTTP-only docker-compose config created"

# Stop any running containers
echo "🛑 Stopping any running containers..."
docker-compose down 2>/dev/null || true
docker stop questlab_nginx_temp 2>/dev/null || true
docker rm questlab_nginx_temp 2>/dev/null || true

# Build and start services
echo "🔨 Building Docker images..."
docker-compose -f docker-compose-http.yml build --no-cache

echo "🚀 Starting services..."
docker-compose -f docker-compose-http.yml up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 15

# Check status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose-http.yml ps

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "Your app is now running at:"
echo "  🌐 http://$(curl -s ifconfig.me || curl -s icanhazip.com)"
echo "  🌐 http://questlab.onan.shop (if DNS is configured)"
echo "  🌐 http://localhost (from this server)"
echo ""
echo "⚠️  Note: This is HTTP only (no SSL/HTTPS)"
echo ""
echo "📋 Useful commands:"
echo "  View logs:     docker-compose -f docker-compose-http.yml logs -f"
echo "  Restart:       docker-compose -f docker-compose-http.yml restart"
echo "  Stop:          docker-compose -f docker-compose-http.yml down"
echo ""
echo "🔒 To add SSL later:"
echo "  1. Fix firewall issues (see troubleshoot-ssl.sh)"
echo "  2. Run: ./init-ssl.sh"
echo "  3. Run: docker-compose up -d  # Use original compose file"
echo ""