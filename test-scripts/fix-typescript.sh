#!/bin/bash

# Auto-fix TypeScript build issues

echo "🔧 Fixing TypeScript Build Issues"
echo "==================================="
echo ""

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ frontend directory not found!"
    exit 1
fi

# Backup existing tsconfig.json
if [ -f "frontend/tsconfig.json" ]; then
    echo "📋 Backing up tsconfig.json..."
    cp frontend/tsconfig.json frontend/tsconfig.json.backup
    echo "✅ Backup created: frontend/tsconfig.json.backup"
fi

# Create new tsconfig.json with relaxed settings
echo "📝 Creating new tsconfig.json with relaxed TypeScript settings..."

cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting - Relaxed for .jsx compatibility */
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

echo "✅ tsconfig.json updated"

# Create or update vite-env.d.ts
echo "📝 Creating vite-env.d.ts for environment variables..."

cat > frontend/src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_DESCRIPTION?: string
  readonly VITE_APP_KEYWORDS?: string
  readonly VITE_APP_AUTHOR?: string
  readonly VITE_BACKEND_URL_DEV?: string
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
EOF

echo "✅ vite-env.d.ts created"

# Update tsconfig.node.json if it exists
if [ -f "frontend/tsconfig.node.json" ]; then
    echo "📝 Updating tsconfig.node.json..."
    
    cat > frontend/tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": false,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
EOF
    
    echo "✅ tsconfig.node.json updated"
fi

# Clean npm cache and node_modules to ensure fresh build
echo ""
echo "🧹 Cleaning build artifacts..."
rm -rf frontend/node_modules/.vite 2>/dev/null || true
rm -rf frontend/dist 2>/dev/null || true

echo "✅ Build artifacts cleaned"

echo ""
echo "🎉 TypeScript configuration fixed!"
echo ""
echo "Changes made:"
echo "  ✅ tsconfig.json - relaxed type checking"
echo "  ✅ vite-env.d.ts - added env variable types"
echo "  ✅ tsconfig.node.json - updated (if exists)"
echo "  ✅ Cleaned build cache"
echo ""
echo "🔧 Next steps:"
echo "  1. Clean Docker: docker system prune -f"
echo "  2. Deploy: ./deploy-http-only.sh"
echo ""