# 🎓 QuestLab Power Tools

A comprehensive TUI (Text User Interface) and alias system for managing your QuestLab deployment with ease and style!

## ✨ Features

### 🖥️ Interactive TUI Menu
- Beautiful terminal interface with color-coded sections
- Easy navigation through all management tasks
- Real-time status monitoring
- No need to memorize commands!

### ⚡ 100+ Power Aliases
- Docker container management
- Database operations
- Git workflow automation
- Network diagnostics
- System monitoring
- And much more!

### 📚 Smart Help System
- Context-sensitive help
- Category-based command reference
- Quick examples and workflows
- Built-in documentation

### 🎯 Organized by Function
1. **Deployment & Setup** - Quick start, SSL, verification
2. **Docker Management** - Containers, logs, stats
3. **Database Operations** - Queries, backups, seed data
4. **Monitoring & Logs** - Health checks, live logs
5. **Maintenance & Fixes** - Common issues, quick fixes
6. **Network & Testing** - Connectivity, diagnostics
7. **Git & Backup** - Version control, backups
8. **Help & Documentation** - Comprehensive guides

## 🚀 Installation

### Quick Install (Recommended)

```bash
# Make the installer executable
chmod +x install-power-tools.sh

# Run the installer
./install-power-tools.sh

# Restart your terminal or reload your shell config
source ~/.bashrc  # or source ~/.zshrc for zsh
```

### Manual Install

```bash
# Copy aliases to home directory
cp questlab-aliases ~/.questlab-aliases

# Install menu script
sudo cp questlab-menu /usr/local/bin/questlab-menu
sudo chmod +x /usr/local/bin/questlab-menu

# Install help script
sudo cp questlab-help /usr/local/bin/questlab-help
sudo chmod +x /usr/local/bin/questlab-help

# Add to your .bashrc or .zshrc
echo 'if [ -f ~/.questlab-aliases ]; then . ~/.questlab-aliases; fi' >> ~/.bashrc

# Reload shell
source ~/.bashrc
```

## 🎮 Usage

### Launch the TUI Menu

```bash
menu        # or qmenu, or questlab-menu
```

### Quick Commands

```bash
# Docker
qup              # Start all services
qdown            # Stop all services
qrestart         # Restart everything
logs             # View all logs (live)

# Database
psql             # Access database shell
list-users       # Show all users
seed1            # Load seed data

# Deployment
deploy           # Full deployment
verify           # Verify deployment
health           # Check API health

# Git
gs               # Git status
gsave            # Quick save (add+commit+push)
gbackup          # Backup with timestamp
```

### Help System

```bash
qhelp            # Show all categories
qhelp docker     # Docker-specific help
qhelp database   # Database help
qhelp git        # Git help
qhelp network    # Network help
```

## 📋 Command Categories

### 🐳 Docker Commands

```bash
# Service Control
qup              # Start all services
qdown            # Stop all services
qrestart         # Restart all services
qrebuild         # Rebuild and restart
qstatus          # Show service status

# HTTP Mode
qup-http         # Start in HTTP mode
qdown-http       # Stop HTTP mode
qrestart-http    # Restart HTTP mode

# Logs
logs             # View all logs (live)
logb             # Backend logs only
logdb            # Database logs only
logn             # Nginx logs only

# Container Access
qdb              # Shell into database
qbe              # Shell into backend
qfe              # Shell into nginx

# Monitoring
dstats           # Resource usage
dspace           # Disk space usage
dps              # Running containers
```

### 🗄️ Database Commands

```bash
# Access
psql             # PostgreSQL shell
psqlshell        # Bash shell in container

# Data Management
seed1            # Load seed data
load-seed        # Run seed data script
db-backup        # Backup database
db-restore FILE  # Restore from backup

# Quick Queries
list-users       # Show all users
list-lessons     # Show all lessons
count-users      # Count users by role
show-tables      # List all tables
db-size          # Show database size
```

### 🚀 Deployment Commands

```bash
deploy           # Quick start deployment
verify           # Verify deployment
fix-db           # Fix database issues
init-ssl         # Initialize SSL certificates
use-ssl          # Use existing certificates
health           # Check backend health
health-all       # Check all services
```

### 📝 Git Commands

```bash
# Basic
gs               # Git status
ga FILE          # Add file
gaa              # Add all files
gc 'message'     # Commit with message
gp               # Push to remote
gl               # Pretty log graph

# Quick Actions
gsave            # Quick save (add+commit+push)
gbackup          # Backup with timestamp
gquick 'msg'     # Quick commit with custom message
```

### 🌐 Network Commands

```bash
# Information
myip             # Show public IP
localip          # Show local IP
ports            # Show open ports
check-port PORT  # Check specific port

# Testing
test-http        # Test HTTP connection
test-api         # Test API endpoint
test-dns         # Test DNS resolution
ping-google      # Ping Google DNS

# Port Management
kill-port PORT   # Kill process on port
fix-ports        # Clear ports 80 & 443
fix-firewall     # Configure firewall rules
```

### 🔧 Maintenance Commands

```bash
fix-perms        # Fix file permissions
fix-firewall     # Configure firewall
fix-ports        # Clear stuck ports
fix-db           # Fix database

restart-backend  # Restart backend only
restart-nginx    # Restart nginx only
restart-db       # Restart database only

show-env         # Show environment variables
show-config      # Show configuration
```

## 🎯 Common Workflows

### Fresh Installation

```bash
cd ~/questlab
deploy           # Full deployment
verify           # Verify it's working
load-seed        # Load demo data
health           # Check API
```

### Daily Development

```bash
qup              # Start services
logs             # Monitor logs
# ... do your work ...
gsave            # Save changes
qrestart         # Restart if needed
```

### Database Operations

```bash
psql             # Open database shell
list-users       # Check users
seed1            # Load seed data
db-backup        # Create backup
```

### Troubleshooting

```bash
qstatus          # Check service status
logs             # View logs
health           # Check API health
fix-ports        # Clear port conflicts
qrebuild         # Nuclear option
```

### Before Git Push

```bash
gs               # Check status
gd               # Review changes
gaa              # Add all files
gc "Fix bug X"   # Commit
gp               # Push
```

## 💡 Pro Tips

1. **Use the TUI Menu**
   - Type `menu` instead of memorizing all commands
   - Navigate visually through options
   - Perfect for beginners and experts alike

2. **Tab Completion**
   - Most aliases support tab completion
   - Start typing and hit Tab

3. **Chain Commands**
   ```bash
   qdown && qrebuild && verify
   ```

4. **Watch Commands**
   ```bash
   watch -n 2 "qstatus"  # Auto-refresh status
   ```

5. **Quick Access**
   ```bash
   q       # Jump to questlab directory
   qback   # Jump to backend
   qfront  # Jump to frontend
   ```

6. **Tmux Sessions**
   ```bash
   questlab      # Create/attach to main session
   qsession      # Create split-pane setup
   ```

## 🛠️ Customization

### Add Your Own Aliases

Edit `~/.questlab-aliases` and add:

```bash
# My custom aliases
alias mycmd='docker compose exec backend python manage.py mycmd'
```

### Modify the TUI

Edit `/usr/local/bin/questlab-menu` to add new menu items or change behavior.

### Custom Help Categories

Edit `/usr/local/bin/questlab-help` to add your own help sections.

## 📁 File Locations

```
~/.questlab-aliases              # Main aliases file
/usr/local/bin/questlab-menu     # TUI menu script
/usr/local/bin/questlab-help     # Help system
~/questlab/QUICK_REFERENCE.md    # Quick reference card
~/questlab/backups/              # Backup location
~/questlab/logs/                 # Log files
```

## 🐛 Troubleshooting

### Aliases Not Working

```bash
# Reload your shell config
source ~/.bashrc  # or ~/.zshrc

# Or restart your terminal
```

### TUI Menu Not Found

```bash
# Reinstall menu script
sudo cp questlab-menu /usr/local/bin/questlab-menu
sudo chmod +x /usr/local/bin/questlab-menu
```

### Permission Denied

```bash
# Fix permissions
chmod +x *.sh
fix-perms  # If aliases are loaded
```

### Docker Commands Failing

```bash
# Check Docker is running
docker ps

# Add user to docker group (one-time)
sudo usermod -aG docker $USER
# Then log out and log back in
```

## 🔄 Updates

To update the power tools:

```bash
# Pull latest changes
git pull

# Reinstall
./install-power-tools.sh

# Reload shell
source ~/.bashrc
```

## 🆘 Getting Help

1. **Interactive TUI**: `menu`
2. **Command Reference**: `qhelp`
3. **Category Help**: `qhelp docker`, `qhelp database`, etc.
4. **Quick Reference**: `cat ~/questlab/QUICK_REFERENCE.md`

## 🎨 Screenshots

### Main Menu
```
╔════════════════════════════════════════════════════════════════╗
║                  🎓 QuestLab Control Center 🎓                  ║
║                 Interactive Management Console                 ║
╚════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━ Current Status ━━━━━━━━━━━━━━━━

  PostgreSQL:  ● Running
  Backend:     ● Running
  Nginx:       ● Running

  Public IP:   http://123.456.789.0
  Local IP:    http://192.168.1.100

━━━━━━━━━━━━━━━━━━━━ Menu ━━━━━━━━━━━━━━━━━━━━━━

  [1] 🚀 Deployment & Setup
  [2] 🐳 Docker Management
  [3] 🗄️  Database Operations
  [4] 📊 Monitoring & Logs
  [5] 🔧 Maintenance & Fixes
  [6] 🌐 Network & Testing
  [7] 📝 Git & Backup
  [8] 💡 Help & Documentation
  [9] ⚙️  System Information

  [0] 🚪 Exit
```

## 📜 License

MIT License - Feel free to use, modify, and distribute!

## 🤝 Contributing

Contributions welcome! Feel free to:
- Add new aliases
- Improve the TUI
- Fix bugs
- Add documentation

## 👨‍💻 Author

**Onan Thomas**
- Created with ❤️ for the QuestLab project

---

**Happy Teaching! 🎓**

For more information, type `menu` or `qhelp` in your terminal!
