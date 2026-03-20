#!/usr/bin/env python3
"""
Script to integrate new API endpoints into existing backend/main.py
This script helps avoid manual copy-paste errors
"""

import sys
import shutil
from datetime import datetime
from pathlib import Path

def create_backup(main_py_path):
    """Create a timestamped backup of main.py"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = main_py_path.parent / f"main.py.backup_{timestamp}"
    shutil.copy2(main_py_path, backup_path)
    print(f"✓ Backup created: {backup_path}")
    return backup_path

def read_file(filepath):
    """Read file content"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def find_insertion_point(content):
    """Find where to insert new endpoints"""
    # Look for the subjects endpoint section
    subjects_section = "# ==================== SUBJECT ENDPOINTS ===================="
    idx = content.find(subjects_section)
    
    if idx == -1:
        # Try alternate markers
        idx = content.find("@app.get(\"/subjects\"")
    
    if idx == -1:
        print("⚠ Could not find subjects endpoint. Manual integration required.")
        return -1
    
    # Find the end of the subjects section (look for next major section or end of file)
    end_markers = [
        "# ==================== HEALTH",
        "# ==================== PARENT",
        "@app.on_event(\"startup\")",
        "if __name__ == \"__main__\":"
    ]
    
    end_idx = len(content)
    for marker in end_markers:
        marker_idx = content.find(marker, idx)
        if marker_idx != -1 and marker_idx < end_idx:
            end_idx = marker_idx
    
    return end_idx

def check_if_already_patched(content):
    """Check if the endpoints already exist"""
    indicators = [
        "class School(Base):",
        "@app.get(\"/islands\"",
        "@app.post(\"/schools\"",
        "@app.post(\"/subjects\""
    ]
    
    existing = []
    for indicator in indicators:
        if indicator in content:
            existing.append(indicator)
    
    return existing

def integrate_endpoints(main_py_path, fixed_py_path):
    """Integrate new endpoints into main.py"""
    print("\n" + "="*60)
    print("QuestLab API Integration Script")
    print("="*60 + "\n")
    
    # Read files
    print("Reading files...")
    main_content = read_file(main_py_path)
    fixed_content = read_file(fixed_py_path)
    
    # Check if already patched
    existing = check_if_already_patched(main_content)
    if existing:
        print("\n⚠ Warning: Some endpoints may already exist:")
        for item in existing:
            print(f"  - {item}")
        response = input("\nContinue anyway? (y/n): ")
        if response.lower() != 'y':
            print("Aborted.")
            return False
    
    # Create backup
    print("\nCreating backup...")
    backup_path = create_backup(main_py_path)
    
    # Find insertion point
    print("\nFinding insertion point...")
    insertion_point = find_insertion_point(main_content)
    
    if insertion_point == -1:
        print("\n❌ Could not automatically find insertion point.")
        print("Please manually add the endpoints from main_fixed.py")
        print(f"Backup saved at: {backup_path}")
        return False
    
    print(f"✓ Found insertion point at character position {insertion_point}")
    
    # Insert new content
    print("\nIntegrating new endpoints...")
    new_content = (
        main_content[:insertion_point] + 
        "\n\n" + fixed_content + "\n\n" +
        main_content[insertion_point:]
    )
    
    # Write updated file
    write_file(main_py_path, new_content)
    print("✓ New endpoints integrated successfully")
    
    # Summary
    print("\n" + "="*60)
    print("Integration Complete!")
    print("="*60)
    print(f"\nBackup location: {backup_path}")
    print("\nAdded endpoints:")
    print("  - GET /islands")
    print("  - POST /islands")
    print("  - DELETE /islands/{id}")
    print("  - GET /schools")
    print("  - POST /schools")
    print("  - PUT /schools/{id}")
    print("  - DELETE /schools/{id}")
    print("  - POST /subjects")
    print("  - PUT /subjects/{id}")
    print("  - DELETE /subjects/{id}")
    
    print("\nNext steps:")
    print("1. Review the changes in backend/main.py")
    print("2. Run database migration: docker-compose exec postgres psql -U questlab -d questlab_db < add_schools_table.sql")
    print("3. Restart backend: docker-compose restart backend")
    print("4. Test the endpoints")
    
    return True

def main():
    # Check if running from correct directory
    if not Path("backend/main.py").exists():
        print("❌ Error: backend/main.py not found")
        print("Please run this script from the project root directory")
        return 1
    
    if not Path("main_fixed.py").exists():
        print("❌ Error: main_fixed.py not found")
        print("Please ensure main_fixed.py is in the current directory")
        return 1
    
    main_py_path = Path("backend/main.py")
    fixed_py_path = Path("main_fixed.py")
    
    success = integrate_endpoints(main_py_path, fixed_py_path)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
