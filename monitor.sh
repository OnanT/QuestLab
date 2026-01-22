#!/bin/bash
# Monitoring script

echo "=== QuestLab Status ==="
echo "Containers:"
docker-compose ps

echo -e "\nLogs (last 10 lines):"
docker-compose logs --tail=10

echo -e "\nResources:"
docker stats --no-stream

echo -e "\nDatabase connections:"
docker exec islandquest_db psql -U islandquest -d islandquest -c "SELECT count(*) FROM pg_stat_activity;"

echo -e "\nDisk usage:"
df -h /opt/questlab
