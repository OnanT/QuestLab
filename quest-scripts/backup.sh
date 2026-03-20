#!/bin/bash
# Backup script

BACKUP_DIR="/opt/questlab-backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Creating backup $DATE..."

# Backup database
docker exec islandquest_db pg_dump -U islandquest islandquest > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz uploads/

# Backup config
tar -czf $BACKUP_DIR/config_$DATE.tar.gz docker-compose.yml .env nginx/

echo "Backup complete:"
ls -lh $BACKUP_DIR/*_$DATE.*
