#!/bin/bash
# Simple deploy script

echo "🚀 Starting QuestLab deployment..."

# Build images
echo "📦 Building Docker images..."
docker-compose build

# Start services
echo "🚀 Starting all services..."
docker-compose up -d

# Wait and check
echo "⏳ Waiting for services to start..."
sleep 10

echo "📊 Services status:"
docker-compose ps

echo ""
echo "🌐 Application should be available at:"
echo "   Frontend: http://$(hostname -I | awk '{print $1}'):5173"
echo "   Backend API: http://$(hostname -I | awk '{print $1}'):8000"
echo ""
echo "✅ Deployment complete!"