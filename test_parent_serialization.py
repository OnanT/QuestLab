
import sys
import os
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

import models
import schemas
from database import SessionLocal

def test_serialization():
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        print(f"Found {len(users)} users.")
        
        import pydantic
        is_v2 = pydantic.VERSION.startswith('2.')
        print(f"Pydantic Version: {pydantic.VERSION} (is_v2: {is_v2})")
        
        for user in users:
            # Add stats attributes like in the router
            user.total_points = user.points or 0
            user.quizzes_completed = 0
            user.games_played = 0
            user.average_score = 0.0
            
            # Fix badges if string
            if isinstance(user.badges, str):
                user.badges = [b.strip() for b in user.badges.split(',') if b.strip()]
            elif not user.badges:
                user.badges = []

            try:
                if is_v2:
                    user_out = schemas.UserOutWithStats.model_validate(user)
                else:
                    user_out = schemas.UserOutWithStats.from_orm(user)
                # print(f"✅ Serialized {user.role} {user.id}: {user.username}")
            except Exception as e:
                print(f"❌ Failed to serialize {user.role} {user.id} ({user.username}):")
                print(f"   Error: {str(e)}")
                # Print specific values that might cause failure
                for field in ['id', 'uuid', 'username', 'email', 'role', 'points', 'level', 'badges', 'is_active', 'created_at']:
                    val = getattr(user, field, 'MISSING')
                    print(f"   {field}: {val} ({type(val)})")
        
        print("Test complete.")
                
    finally:
        db.close()

if __name__ == "__main__":
    test_serialization()
