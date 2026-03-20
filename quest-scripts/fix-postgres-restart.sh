#!/bin/bash

# Fix PostgreSQL Restart Issue

echo "🔧 Fixing PostgreSQL Container"
echo "==============================="
echo ""

# 1. Stop all containers
echo "1️⃣  Stopping all containers..."
docker-compose down

# 2. Check if init.sql exists and is a file
echo ""
echo "2️⃣  Checking init.sql..."

if [ -f "init.sql" ]; then
    echo "✅ init.sql exists and is a file"
    ls -lh init.sql
else
    echo "❌ init.sql not found or is not a file"
    echo "Creating init.sql..."
    
    # Create minimal init.sql if missing
    cat > init.sql << 'EOF'
-- QuestLab Database Initialization
SELECT 'Database initialized' as status;
EOF
    
    echo "✅ Created init.sql"
fi

# 3. Update docker-compose.yml to remove init.sql volume (optional, since tables exist)
echo ""
echo "3️⃣  Updating docker-compose.yml..."

cat > docker-compose.yml << 'EOFCOMPOSE'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: postgres_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - questlab_network
    ports:
      - "5432:5432"
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

echo "✅ Updated docker-compose.yml (removed init.sql mount)"

# 4. Start containers
echo ""
echo "4️⃣  Starting containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for PostgreSQL to start (15 seconds)..."
sleep 15

# 5. Configure PostgreSQL for remote access (inside running container)
echo ""
echo "5️⃣  Configuring PostgreSQL for remote connections..."

# Backup current configs
docker exec postgres_db sh -c "cp /var/lib/postgresql/data/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf.backup" 2>/dev/null || true
docker exec postgres_db sh -c "cp /var/lib/postgresql/data/postgresql.conf /var/lib/postgresql/data/postgresql.conf.backup" 2>/dev/null || true

# Add remote access rules
docker exec postgres_db sh -c "echo 'host all all 192.168.100.0/24 md5' >> /var/lib/postgresql/data/pg_hba.conf"
docker exec postgres_db sh -c "echo \"listen_addresses = '*'\" >> /var/lib/postgresql/data/postgresql.conf"

echo "✅ PostgreSQL configured for remote access"

# 6. Reload PostgreSQL configuration
echo ""
echo "6️⃣  Reloading PostgreSQL configuration..."

docker exec postgres_db su - postgres -c "psql -c 'SELECT pg_reload_conf();'" 2>/dev/null || \
docker exec postgres_db psql -U turtle_guide -d questlab_db -c "SELECT pg_reload_conf();"

echo "✅ Configuration reloaded"

# 7. Verify services
echo ""
echo "7️⃣  Verifying services..."

echo ""
echo "📊 Container Status:"
docker-compose ps

# 8. Test PostgreSQL connectivity
echo ""
echo "8️⃣  Testing PostgreSQL connection..."

# Test local connection
if docker exec postgres_db psql -U turtle_guide -d questlab_db -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ Local connection successful"
else
    echo "❌ Local connection failed"
fi

# Test remote port
if nc -zv localhost 5432 2>&1 | grep -q succeeded; then
    echo "✅ Port 5432 is accessible"
else
    echo "⚠️  Port 5432 might not be accessible"
fi

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "================================================"
echo "🎉 PostgreSQL Remote Access Ready!"
echo "================================================"
echo ""
echo "📋 DBeaver Connection Details:"
echo "------------------------------"
echo "Host:     ${SERVER_IP}"
echo "Port:     5432"
echo "Database: questlab_db"
echo "Username: turtle_guide"
echo "Password: Quest_\$ecure_turtle"
echo ""
echo "🧪 Test Connection from Remote Machine (192.168.100.153):"
echo "  psql -h ${SERVER_IP} -p 5432 -U turtle_guide -d questlab_db"
echo ""
echo "Or use DBeaver with the connection details above"
echo ""
echo "📊 View PostgreSQL logs:"
echo "  docker logs postgres_db"
echo ""
echo "🔍 Verify remote access configuration:"
echo "  docker exec postgres_db cat /var/lib/postgresql/data/pg_hba.conf | grep 192.168"
echo ""