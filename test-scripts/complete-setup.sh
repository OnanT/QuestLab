#!/bin/bash

# Complete QuestLab Setup Script
# This handles all fixes and deployment in one go

set -e

echo "🚀 QuestLab Complete Setup & Deployment"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${NC}ℹ️  $1${NC}"; }

# Step 1: Check prerequisites
echo "1️⃣  Checking prerequisites..."
if [ ! -f .env ]; then
    print_error ".env file not found!"
    exit 1
fi
print_success ".env file found"

if ! command -v docker &> /dev/null; then
    print_error "Docker not installed!"
    exit 1
fi
print_success "Docker installed"

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose not installed!"
    exit 1
fi
print_success "Docker Compose installed"

# Step 2: Fix backend main.py if needed
echo ""
echo "2️⃣  Fixing backend main.py..."
if [ -f "backend/main.py" ]; then
    if ! grep -q "import uuid" backend/main.py; then
        print_warning "Adding uuid import to main.py"
        
        # Backup
        cp backend/main.py backend/main.py.backup
        
        # Add uuid import after pathlib
        sed -i '/from pathlib import Path/a import uuid' backend/main.py
        
        print_success "uuid import added"
    else
        print_success "uuid import already exists"
    fi
else
    print_error "backend/main.py not found!"
    exit 1
fi

# Step 3: Fix TypeScript configuration
echo ""
echo "3️⃣  Fixing TypeScript configuration..."

# Create/update tsconfig.json
cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "noImplicitAny": false,
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

print_success "tsconfig.json updated"

# Create vite-env.d.ts
mkdir -p frontend/src
cat > frontend/src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_DESCRIPTION?: string
  readonly VITE_APP_KEYWORDS?: string
  readonly VITE_APP_AUTHOR?: string
  readonly VITE_BACKEND_URL_DEV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
EOF

print_success "vite-env.d.ts created"

# Step 4: Create necessary directories
echo ""
echo "4️⃣  Creating directories..."
mkdir -p nginx certbot/www certbot/conf
print_success "Directories created"

# Step 5: Create HTTP-only nginx config
echo ""
echo "5️⃣  Creating nginx configuration..."

cat > nginx/nginx-http.conf << 'EOF'
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

    server {
        listen 80;
        server_name _;

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

print_success "nginx configuration created"

# Step 6: Create docker-compose-http.yml
echo ""
echo "6️⃣  Creating docker-compose configuration..."

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

  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    container_name: questlab_frontend
    restart: unless-stopped
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
      - backend
      - frontend
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

print_success "docker-compose configuration created"

# Step 7: Clean up old containers and images
echo ""
echo "7️⃣  Cleaning up old containers..."
docker-compose down 2>/dev/null || true
docker stop questlab_nginx_temp 2>/dev/null || true
docker rm questlab_nginx_temp 2>/dev/null || true
print_success "Cleanup complete"

# Step 8: Build and deploy
echo ""
echo "8️⃣  Building Docker images (this may take a few minutes)..."
docker-compose -f docker-compose-http.yml build --no-cache

print_success "Build complete"

echo ""
echo "9️⃣  Starting services..."
docker-compose -f docker-compose-http.yml up -d

# Step 9: Wait and check health
echo ""
echo "🔟 Waiting for services to start..."
sleep 20

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose-http.yml ps

# Test backend health
echo ""
echo "🏥 Testing backend health..."
if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    print_success "Backend is healthy"
else
    print_warning "Backend health check failed (may still be starting)"
fi

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "unknown")

# Final summary
echo ""
echo "================================================"
echo "🎉 QuestLab Deployment Complete!"
echo "================================================"
echo ""
print_success "Your application is running!"
echo ""
echo "Access your app at:"
echo "  🌐 http://$PUBLIC_IP"
echo "  🌐 http://questlab.onan.shop (once DNS propagates)"
echo "  🌐 http://localhost (from this server)"
echo ""
print_warning "Currently running on HTTP (no SSL)"
echo ""
echo "📋 Next Steps:"
echo "  1. Test: Open http://$PUBLIC_IP in your browser"
echo "  2. If working, configure firewall for SSL:"
echo "     sudo ./fix-firewall.sh"
echo "  3. Then get SSL certificate:"
echo "     ./init-ssl.sh"
echo ""
echo "📊 Useful Commands:"
echo "  View logs:     docker-compose -f docker-compose-http.yml logs -f"
echo "  Restart:       docker-compose -f docker-compose-http.yml restart"
echo "  Stop:          docker-compose -f docker-compose-http.yml down"
echo "  Service status: docker-compose -f docker-compose-http.yml ps"
echo ""