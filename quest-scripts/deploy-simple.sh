#!/bin/bash
set -e

echo "🚀 Starting QuestLab deployment..."

echo "📦 Starting services..."
docker-compose up -d --build

echo "⏳ Waiting for services to start..."
sleep 10

echo "📊 Checking services..."
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo "   Nginx: http://localhost"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop: docker-compose down"
echo "   Rebuild: docker-compose up -d --build"