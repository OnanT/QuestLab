#!/bin/bash
# Script to fix the 404 API errors by adding missing endpoints

set -e  # Exit on error

echo "=========================================="
echo "QuestLab Backend API Fix Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backup directory
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"

echo -e "${YELLOW}Step 1: Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
if [ -f "backend/main.py" ]; then
    cp backend/main.py "$BACKUP_DIR/main.py.backup"
    echo -e "${GREEN}✓ Backend backed up to $BACKUP_DIR${NC}"
fi

echo ""
echo -e "${YELLOW}Step 2: Checking if main.py needs updating...${NC}"

# Check if main.py already has the School model
if grep -q "class School(Base):" backend/main.py; then
    echo -e "${GREEN}✓ School model already exists in main.py${NC}"
else
    echo -e "${RED}✗ School model not found. Manual integration required.${NC}"
    echo ""
    echo "Please add the following to your backend/main.py:"
    echo "1. Add School model definition (see main_fixed.py)"
    echo "2. Add schools endpoints (/schools GET, POST, PUT, DELETE)"
    echo "3. Add islands endpoints (/islands GET, POST, DELETE)" 
    echo "4. Add subjects CRUD endpoints (/subjects POST, PUT, DELETE)"
fi

echo ""
echo -e "${YELLOW}Step 3: Database Migration...${NC}"

# Check if docker-compose is running
if docker-compose ps | grep -q "questlab_postgres.*Up"; then
    echo -e "${GREEN}✓ PostgreSQL container is running${NC}"
    
    # Run the migration
    echo "Applying database migration..."
    docker-compose exec -T postgres psql -U questlab -d questlab_db < add_schools_table.sql
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database migration completed successfully${NC}"
    else
        echo -e "${RED}✗ Database migration failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ PostgreSQL container is not running${NC}"
    echo "Please start your containers first: docker-compose up -d"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 4: Restarting backend service...${NC}"
docker-compose restart backend

echo ""
echo -e "${GREEN}=========================================="
echo "Fix Script Completed!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Review the changes in main_fixed.py"
echo "2. Manually integrate the missing endpoints into your backend/main.py"
echo "3. Test the endpoints:"
echo "   - curl http://localhost:8000/api/schools"
echo "   - curl http://localhost:8000/api/islands"
echo "   - curl http://localhost:8000/api/subjects"
echo ""
echo "Backup location: $BACKUP_DIR"
