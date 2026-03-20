#!/bin/bash

# QuestLab Power Tools Installation Script
# This script installs all aliases, functions, and the TUI menu

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║                                                       ║"
    echo "║     🎓 QuestLab Power Tools Installation 🎓          ║"
    echo "║                                                       ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Detect shell
detect_shell() {
    if [ -n "$BASH_VERSION" ]; then
        echo "bash"
    elif [ -n "$ZSH_VERSION" ]; then
        echo "zsh"
    else
        echo "unknown"
    fi
}

print_header

echo -e "${WHITE}This will install:${NC}"
echo "  ✨ 100+ powerful aliases"
echo "  🎯 Smart helper functions"
echo "  🖥️  Beautiful interactive TUI menu"
echo "  📚 Comprehensive help system"
echo ""

read -p "Continue with installation? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Installation cancelled"
    exit 0
fi

# Detect shell
SHELL_TYPE=$(detect_shell)
print_info "Detected shell: $SHELL_TYPE"

# Determine config file
if [ "$SHELL_TYPE" = "bash" ]; then
    RC_FILE="$HOME/.bashrc"
elif [ "$SHELL_TYPE" = "zsh" ]; then
    RC_FILE="$HOME/.zshrc"
else
    print_error "Unsupported shell. Please use bash or zsh."
    exit 1
fi

print_info "Will modify: $RC_FILE"
echo ""

# Step 1: Copy files
print_info "Step 1: Installing files..."

# Copy aliases file
if [ -f "questlab-aliases" ]; then
    cp questlab-aliases ~/.questlab-aliases
    print_success "Aliases installed to ~/.questlab-aliases"
else
    print_error "questlab-aliases file not found!"
    exit 1
fi

# Copy menu script
if [ -f "questlab-menu" ]; then
    sudo cp questlab-menu /usr/local/bin/questlab-menu
    sudo chmod +x /usr/local/bin/questlab-menu
    print_success "TUI menu installed to /usr/local/bin/questlab-menu"
else
    print_error "questlab-menu file not found!"
    exit 1
fi

# Copy help script
if [ -f "questlab-help" ]; then
    sudo cp questlab-help /usr/local/bin/questlab-help
    sudo chmod +x /usr/local/bin/questlab-help
    print_success "Help system installed to /usr/local/bin/questlab-help"
else
    print_error "questlab-help file not found!"
    exit 1
fi

echo ""

# Step 2: Add to shell config
print_info "Step 2: Configuring shell..."

# Check if already sourced
if grep -q "questlab-aliases" "$RC_FILE"; then
    print_warning "Aliases already configured in $RC_FILE"
else
    # Add source line to config file
    cat >> "$RC_FILE" << 'EOF'

# ═══════════════════════════════════════════════
# 🎓 QuestLab Power Tools
# ═══════════════════════════════════════════════
if [ -f ~/.questlab-aliases ]; then
    . ~/.questlab-aliases
fi
EOF
    print_success "Added aliases to $RC_FILE"
fi

echo ""

# Step 3: Create directories
print_info "Step 3: Creating directories..."

mkdir -p ~/questlab/logs
mkdir -p ~/questlab/scripts
mkdir -p ~/questlab/backups

print_success "Directories created"
echo ""

# Step 4: Install dependencies (optional)
print_info "Step 4: Checking dependencies..."

# Check for jq
if ! command -v jq &> /dev/null; then
    print_warning "jq not found (used for JSON formatting)"
    read -p "Install jq? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo apt-get update && sudo apt-get install -y jq
        print_success "jq installed"
    fi
else
    print_success "jq is installed"
fi

# Check for docker
if ! command -v docker &> /dev/null; then
    print_warning "Docker not found"
    print_info "Install Docker with: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
else
    print_success "Docker is installed"
fi

# Check for docker compose
if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose not found"
else
    print_success "Docker Compose is installed"
fi

echo ""

# Step 5: Create quick reference card
print_info "Step 5: Creating quick reference..."

cat > ~/questlab/QUICK_REFERENCE.md << 'EOF'
# 🎓 QuestLab Quick Reference Card

## 🚀 Getting Started
```bash
menu           # Launch interactive TUI
qhelp          # Show all commands
qhelp docker   # Category-specific help
```

## ⚡ Most Used Commands

### Docker Control
```bash
qup            # Start all services
qdown          # Stop all services
qrestart       # Restart everything
logs           # View all logs (live)
qstatus        # Show service status
```

### Database
```bash
psql           # Access database
list-users     # Show all users
questlab_clean_seed.sql          # Load seed data
db-backup      # Backup database
```

### Deployment
```bash
deploy         # Full deployment
verify         # Verify deployment
health         # Check API health
```

### Git
```bash
gs             # Git status
gsave          # Quick save
gbackup        # Backup with timestamp
```

## 🔥 Power User Tips

1. **Quick Container Access**
   ```bash
   qdb            # Jump into database shell
   qbe            # Backend container shell
   ```

2. **Smart Logging**
   ```bash
   logb           # Backend logs only
   logdb          # Database logs only
   ```

3. **One-Line Fixes**
   ```bash
   fix-ports      # Clear stuck ports
   fix-perms      # Fix permissions
   ```

## 📱 Emergency Commands

```bash
qdown && qup               # Full restart
dclean-safe && qrebuild    # Nuclear option
kill-port 80 && qrestart   # Port conflict fix
```

## 🎯 Common Workflows

### Deploy Fresh Installation
```bash
cd ~/questlab
deploy
verify
load-seed
```

### Update and Redeploy
```bash
gsave
qdown
qrebuild
verify
```

### Database Reset
```bash
qdown
fix-db
questlab_clean_seed.sql
qup
```

### View Logs for Debugging
```bash
logs              # All logs
logb              # Just backend
health            # Check API
```

## 💡 Pro Tips

- Type `menu` instead of memorizing commands
- Use `qhelp [category]` for detailed help
- Bookmark this file for quick reference
- Set up `questlab` tmux session for split-pane workflow

## 🆘 Getting Help

```bash
qhelp              # General help
qhelp docker       # Docker commands
qhelp database     # Database commands
menu               # Interactive TUI
```

---
Last updated: $(date +%Y-%m-%d)
EOF

print_success "Quick reference created at ~/questlab/QUICK_REFERENCE.md"
echo ""

# Step 6: Final steps
print_info "Step 6: Finalizing installation..."

# Reload shell config
if [ "$SHELL_TYPE" = "bash" ]; then
    source ~/.bashrc 2>/dev/null || true
elif [ "$SHELL_TYPE" = "zsh" ]; then
    source ~/.zshrc 2>/dev/null || true
fi

print_success "Installation complete!"
echo ""

# Success message
echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║           🎉 Installation Successful! 🎉             ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${WHITE}🚀 Get Started:${NC}"
echo ""
echo "  1. Restart your terminal OR run:"
echo -e "     ${GREEN}source $RC_FILE${NC}"
echo ""
echo "  2. Launch the TUI menu:"
echo -e "     ${GREEN}menu${NC} or ${GREEN}qmenu${NC}"
echo ""
echo "  3. View all commands:"
echo -e "     ${GREEN}qhelp${NC}"
echo ""
echo "  4. Quick reference:"
echo -e "     ${GREEN}cat ~/questlab/QUICK_REFERENCE.md${NC}"
echo ""

echo -e "${YELLOW}💡 Pro Tip:${NC}"
echo "  Type 'menu' for an interactive interface!"
echo "  All commands are now available in your terminal."
echo ""

echo -e "${CYAN}📚 Resources:${NC}"
echo "  • Quick Reference: ~/questlab/QUICK_REFERENCE.md"
echo "  • Aliases File: ~/.questlab-aliases"
echo "  • TUI Menu: /usr/local/bin/questlab-menu"
echo "  • Help System: /usr/local/bin/questlab-help"
echo ""

print_warning "Please restart your terminal or run: source $RC_FILE"
echo ""
