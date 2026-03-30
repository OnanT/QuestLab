import os
import subprocess
import glob

def restore():
    scripts = glob.glob("/app/quest-scripts/seed-*.py") + glob.glob("/app/quest-scripts/seed_*.py")
    for script in sorted(scripts):
        if "seed_enhanced_games.py" in script or "restore_all_games.py" in script:
            continue
        print(f"Running {script}...")
        try:
            result = subprocess.run(["python3", script], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"OK: {script}")
            else:
                print(f"FAIL: {script} - {result.stderr}")
        except Exception as e:
            print(f"ERROR: {script} - {e}")
    subprocess.run(["python3", "/app/quest-scripts/seed_enhanced_games.py"])

if __name__ == "__main__":
    restore()
