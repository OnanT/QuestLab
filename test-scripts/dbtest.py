import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://onant:new_secure_password@localhost/islandquestdb")

try:
    # Parse connection string
    if DATABASE_URL.startswith("postgresql://"):
        conn_str = DATABASE_URL.replace("postgresql://", "")
        user_pass, host_db = conn_str.split("@")
        username, password = user_pass.split(":")
        host_port, database = host_db.split("/")
        host, port = host_port.split(":") if ":" in host_port else (host_port, "5432")
        
        print(f"Testing connection to: {host}:{port}")
        print(f"Username: {username}")
        print(f"Database: {database}")
    
    # Try to connect
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="onant",
        password="new_secure_password",
        database="islandquestdb"
    )
    print("✅ Connection successful!")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")