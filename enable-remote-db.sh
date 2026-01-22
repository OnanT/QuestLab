#!/bin/bash

# Enable Remote PostgreSQL Access

echo "🔓 Enabling Remote PostgreSQL Access"
echo "====================================="
echo ""

echo "This will allow connections to PostgreSQL from 192.168.100.153"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

# 1. Update docker-compose to expose PostgreSQL port
echo "1️⃣  Updating docker-compose.yml to expose PostgreSQL port..."

# Backup current docker-compose
cp docker-compose.yml docker-compose.yml.backup-remote-db

# Update postgres service to expose port 5432
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
    ports:
      - "5432:5432"  # Expose PostgreSQL port
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

echo "✅ docker-compose.yml updated to expose port 5432"

# 2. Configure PostgreSQL to allow remote connections
echo ""
echo "2️⃣  Configuring PostgreSQL for remote access..."

# Update PostgreSQL configuration inside container
docker exec questlab_postgres sh -c "echo \"host all all 192.168.100.0/24 md5\" >> /var/lib/postgresql/data/pg_hba.conf"
docker exec questlab_postgres sh -c "echo \"listen_addresses = '*'\" >> /var/lib/postgresql/data/postgresql.conf"

echo "✅ PostgreSQL configured for remote access"

# 3. Open firewall port
echo ""
echo "3️⃣  Opening firewall port 5432..."

if command -v ufw &> /dev/null; then
    sudo ufw allow from 192.168.100.0/24 to any port 5432 proto tcp
    echo "✅ UFW rule added for 192.168.100.0/24"
else
    echo "⚠️  UFW not found, please manually open port 5432"
fi

# 4. Restart PostgreSQL to apply changes
echo ""
echo "4️⃣  Restarting PostgreSQL..."

docker-compose restart postgres

echo "⏳ Waiting for PostgreSQL to restart (10 seconds)..."
sleep 10

# 5. Test connection
echo ""
echo "5️⃣  Testing PostgreSQL accessibility..."

if nc -zv localhost 5432 2>&1 | grep -q succeeded; then
    echo "✅ PostgreSQL is accessible on port 5432"
else
    echo "⚠️  Port 5432 may not be accessible"
fi

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "================================================"
echo "🎉 Remote Access Enabled!"
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
echo "🔧 DBeaver Setup Steps:"
echo "1. Open DBeaver on 192.168.100.153"
echo "2. Click 'New Database Connection'"
echo "3. Select 'PostgreSQL'"
echo "4. Enter the details above"
echo "5. Click 'Test Connection'"
echo "6. Click 'Finish'"
echo ""
echo "🔒 Security Note:"
echo "  PostgreSQL is now accessible from 192.168.100.0/24 network"
echo "  Make sure this is a trusted network!"
echo ""
echo "📊 To restrict access to only 192.168.100.153:"
echo "  docker exec questlab_postgres sh -c \"sed -i 's|192.168.100.0/24|192.168.100.153/32|' /var/lib/postgresql/data/pg_hba.conf\""
echo "  docker-compose restart postgres"
echo ""