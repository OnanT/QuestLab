# backend/test_docker.py
import sys
print(f"Python version: {sys.version}")
print(f"Python path: {sys.path}")

try:
    import fastapi
    print(f"FastAPI version: {fastapi.__version__}")
except ImportError:
    print("FastAPI not installed")
