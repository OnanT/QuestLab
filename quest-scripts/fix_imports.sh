#!/bin/bash
# Auto-fix script for QuestLab backend import errors
# This script converts relative imports to absolute imports

BACKEND_DIR="$HOME/opt/questlab/backend"
BACKUP_DIR="$BACKEND_DIR/backup_imports_$(date +%Y%m%d_%H%M%S)"

echo "=== QuestLab Import Fixer ==="
echo ""

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found at $BACKEND_DIR"
    exit 1
fi

# Create backup
echo "📦 Creating backup at: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r "$BACKEND_DIR"/*.py "$BACKUP_DIR/" 2>/dev/null
cp -r "$BACKEND_DIR"/routers "$BACKUP_DIR/" 2>/dev/null
echo "✅ Backup created"
echo ""

# Fix main.py
echo "🔧 Fixing main.py..."
if [ -f "$BACKEND_DIR/main.py" ]; then
    sed -i 's/from \. import models/import models/g' "$BACKEND_DIR/main.py"
    sed -i 's/from \. import database/import database/g' "$BACKEND_DIR/main.py"
    sed -i 's/from \.config import/from config import/g' "$BACKEND_DIR/main.py"
    sed -i 's/from \.database import/from database import/g' "$BACKEND_DIR/main.py"
    sed -i 's/from \.models import/from models import/g' "$BACKEND_DIR/main.py"
    sed -i 's/from \.schemas import/from schemas import/g' "$BACKEND_DIR/main.py"
    sed -i 's/from \.dependencies import/from dependencies import/g' "$BACKEND_DIR/main.py"
    sed -i 's/from \.routers import/from routers import/g' "$BACKEND_DIR/main.py"
    echo "✅ main.py fixed"
else
    echo "⚠️  main.py not found"
fi
echo ""

# Fix routers/__init__.py
echo "🔧 Fixing routers/__init__.py..."
if [ -f "$BACKEND_DIR/routers/__init__.py" ]; then
    sed -i 's/from \. import/from routers import/g' "$BACKEND_DIR/routers/__init__.py"
    echo "✅ routers/__init__.py fixed"
else
    echo "⚠️  routers/__init__.py not found"
fi
echo ""

# Fix all router files
echo "🔧 Fixing router files..."
if [ -d "$BACKEND_DIR/routers" ]; then
    for file in "$BACKEND_DIR/routers"/*.py; do
        if [ -f "$file" ] && [ "$(basename "$file")" != "__init__.py" ]; then
            echo "   Processing $(basename "$file")..."
            # Fix parent imports (from ..)
            sed -i 's/from \.\.models import/from models import/g' "$file"
            sed -i 's/from \.\.database import/from database import/g' "$file"
            sed -i 's/from \.\.schemas import/from schemas import/g' "$file"
            sed -i 's/from \.\.dependencies import/from dependencies import/g' "$file"
            sed -i 's/from \.\.config import/from config import/g' "$file"
            sed -i 's/from \.\. import models/import models/g' "$file"
            sed -i 's/from \.\. import database/import database/g' "$file"
            sed -i 's/from \.\. import schemas/import schemas/g' "$file"
            
            # Fix sibling imports (from .)
            sed -i 's/from \. import/import/g' "$file"
        fi
    done
    echo "✅ All router files fixed"
else
    echo "⚠️  routers directory not found"
fi
echo ""

# Show changes
echo "📋 Summary of changes:"
echo "   Converted relative imports (from . import) to absolute imports"
echo "   Converted parent imports (from .. import) to absolute imports"
echo ""

# Check for remaining relative imports
echo "🔍 Checking for remaining relative imports..."
remaining=$(grep -rn "from \.\." "$BACKEND_DIR" 2>/dev/null | grep -v ".pyc" | grep -v "__pycache__" | wc -l)
remaining_single=$(grep -rn "from \. import" "$BACKEND_DIR" 2>/dev/null | grep -v ".pyc" | grep -v "__pycache__" | wc -l)

if [ "$remaining" -gt 0 ] || [ "$remaining_single" -gt 0 ]; then
    echo "⚠️  Found $remaining parent relative imports and $remaining_single single relative imports still remaining"
    echo "   Run: grep -rn 'from \\.\\.\\|from \\. import' $BACKEND_DIR"
else
    echo "✅ No relative imports detected!"
fi
echo ""

echo "=== Fix Complete ==="
echo ""
echo "Next steps:"
echo "1. Review changes: diff $BACKUP_DIR/main.py $BACKEND_DIR/main.py"
echo "2. Rebuild: docker compose build --no-cache backend"
echo "3. Start: docker compose up -d"
echo "4. Check logs: docker compose logs -f backend"
echo ""
echo "If you need to rollback:"
echo "   cp $BACKUP_DIR/*.py $BACKEND_DIR/"
echo "   cp -r $BACKUP_DIR/routers/* $BACKEND_DIR/routers/"
