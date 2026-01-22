# migrate.py
from main import Base, engine, SessionLocal
import sys

def migrate_database():
    print("🚀 Starting database migration...")
    
    try:
        # Create all tables (this will add new columns if using SQLite with new table)
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables updated successfully!")
        
        # If using PostgreSQL, we need to alter tables instead
        # You might want to use Alembic for production
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    migrate_database()