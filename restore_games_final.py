import os
import subprocess
import glob
import re

def patch_and_run():
    # Use DATABASE_URL from environment
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("❌ DATABASE_URL not found in environment")
        return

    scripts = glob.glob("quest-scripts/seed-*.py") + glob.glob("quest-scripts/seed_*.py")
    
    for script in sorted(scripts):
        if "seed_enhanced_games.py" in script or "restore" in script:
            continue
            
        print(f"🛠 Patching and running {script}...")
        
        with open(script, 'r') as f:
            content = f.read()
            
        # 1. Define get_db_connection at the very top to override anything
        # 2. Aggressively remove load_dotenv references
        
        prefix = f"""
import os, psycopg2, json
def get_db_connection():
    return psycopg2.connect("{db_url}")
"""
        patched_content = prefix + content
        
        # Remove load_dotenv imports and calls
        patched_content = re.sub(r'from dotenv import load_dotenv', '', patched_content)
        patched_content = re.sub(r'import load_dotenv', '', patched_content)
        patched_content = re.sub(r'load_dotenv\(.*?\)', '', patched_content)
        
        # Replace direct connect calls
        patched_content = re.sub(r'psycopg2\.connect\(.*?\)', f'psycopg2.connect("{db_url}")', patched_content, flags=re.DOTALL)

        try:
            print(f"🚀 Running patched {script}...")
            result = subprocess.run(["docker", "exec", "-i", "questlab_backend", "python3", "-"], input=patched_content.encode('utf-8'), capture_output=True)
            if result.returncode == 0:
                stdout = result.stdout.decode('utf-8').strip()
                print(f"✅ {script} success: {stdout}")
            else:
                stderr = result.stderr.decode('utf-8').strip()
                print(f"❌ {script} failed: {stderr}")
        except Exception as e:
            print(f"💥 {script} error: {e}")

    # Finally, re-run the enhanced games script
    print("✨ Seeding enhanced games...")
    with open("backend/quest-scripts/seed_enhanced_games.py", 'r') as f:
        enhanced_content = f.read()
    subprocess.run(["docker", "exec", "-i", "questlab_backend", "python3", "-"], input=enhanced_content.encode('utf-8'))

if __name__ == "__main__":
    patch_and_run()
