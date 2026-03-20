#!/bin/bash

# QuestLab Quick Start Script
# This script automates the entire deployment process

set -e

echo "🚀 QuestLab Quick Start Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${NC}ℹ️  $1${NC}"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Please create a .env file first"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

print_success ".env file loaded"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    print_info "Please install Docker first: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
    exit 1
fi

print_success "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed!"
    print_info "Please install Docker Compose first"
    exit 1
fi

print_success "Docker Compose is installed"

# Check if directories exist
print_info "Checking directory structure..."

directories=("backend" "frontend" "nginx" "certbot/www" "certbot/conf")

for dir in "${directories[@]}"; do
    if [ ! -d "$dir" ]; then
        print_warning "Creating directory: $dir"
        mkdir -p "$dir"
    fi
done

print_success "Directory structure is ready"

# Check if nginx.conf exists
if [ ! -f "nginx/nginx.conf" ]; then
    print_error "nginx/nginx.conf not found!"
    print_info "Please create nginx/nginx.conf file"
    exit 1
fi

print_success "nginx.conf found"

# Check if SSL certificates exist
if [ ! -d "certbot/conf/live/${DOMAIN}" ]; then
    print_warning "SSL certificates not found for ${DOMAIN}"
    print_info "You need to run ./init-ssl.sh first to obtain SSL certificates"
    
    read -p "Do you want to run init-ssl.sh now? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f "./init-ssl.sh" ]; then
            chmod +x ./init-ssl.sh
            ./init-ssl.sh
        else
            print_error "init-ssl.sh not found!"
            exit 1
        fi
    else
        print_error "SSL certificates are required for HTTPS"
        print_info "Please run ./init-ssl.sh when you're ready"
        exit 1
    fi
fi

print_success "SSL certificates found"

# Check if main.py has uuid import
if grep -q "import uuid" backend/main.py; then
    print_success "main.py has uuid import"
else
    print_warning "Adding uuid import to main.py"
    # Backup original file
    cp backend/main.py backend/main.py.backup
    
    # Add uuid import after 'from pathlib import Path'
    sed -i '/from pathlib import Path/a import uuid' backend/main.py
    
    print_success "uuid import added to main.py"
fi

# Display configuration
echo ""
echo "📋 Configuration Summary:"
echo "=========================="
print_info "Domain: ${DOMAIN}"
print_info "Database: ${POSTGRES_DB}"
print_info "Backend API: ${VITE_API_URL}"
echo ""

# Ask for confirmation
read -p "Ready to deploy QuestLab? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled"
    exit 0
fi

# Stop any running containers
print_info "Stopping any running containers..."
docker-compose down 2>/dev/null || true
print_success "Stopped old containers"

# Build and start services
print_info "Building Docker images (this may take a few minutes)..."
docker-compose build --no-cache

print_success "Docker images built successfully"

print_info "Starting services..."
docker-compose up -d

# Wait for services to start
print_info "Waiting for services to initialize..."
sleep 15

# Check service health
print_info "Checking service health..."

services=("questlab_postgres" "questlab_backend" "questlab_frontend" "questlab_nginx")
all_healthy=true

for service in "${services[@]}"; do
    if docker ps --filter "name=$service" --filter "status=running" | grep -q "$service"; then
        print_success "$service is running"
    else
        print_error "$service is not running"
        all_healthy=false
    fi
done

# Check backend health endpoint
if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    print_success "Backend health check passed"
else
    print_warning "Backend health check failed (may still be starting up)"
fi

# Display final status
echo ""
echo "================================"

if [ "$all_healthy" = true ]; then
    print_success "QuestLab deployment completed successfully!"
    echo ""
    print_info "Your application is now running at:"
    echo "  🌐 https://${DOMAIN}"
    echo ""
    print_info "Useful commands:"
    echo "  View logs:        docker-compose logs -f"
    echo "  Restart services: docker-compose restart"
    echo "  Stop services:    docker-compose down"
    echo "  Service status:   docker-compose ps"
else
    print_error "Some services failed to start"
    print_info "Check logs with: docker-compose logs -f"
fi

echo ""
echo "📊 Current service status:"
docker-compose ps

echo ""
print_info "To view live logs, run: docker-compose logs -f"