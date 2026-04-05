
import sys
import os
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

import models
import schemas
from database import SessionLocal

def test_user_serialization():
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        print(f"Found {len(users)} users.")
        
        for user in users:
            try:
                # Attempt to create UserOut from the user model
                # We use from_orm if it's Pydantic v1, or from_attributes if v2
                # But since we defined Config.from_attributes = True, we can use model_validate in v2
                # or from_orm in v1.
                
                # Check version
                import pydantic
                is_v2 = pydantic.VERSION.startswith('2.')
                
                if is_v2:
                    user_out = schemas.UserOut.model_validate(user)
                else:
                    user_out = schemas.UserOut.from_orm(user)
                    
                print(f"✅ Serialized user {user.id}: {user.username}")
            except Exception as e:
                print(f"❌ Failed to serialize user {user.id} ({user.username}):")
                print(f"   Error: {str(e)}")
                # Print more details about the user object
                print(f"   uuid: {getattr(user, 'uuid', 'MISSING')}")
                print(f"   created_at: {getattr(user, 'created_at', 'MISSING')}")
                print(f"   role: {getattr(user, 'role', 'MISSING')}")
                print(f"   organization_id: {getattr(user, 'organization_id', 'MISSING')}")
                
    finally:
        db.close()

if __name__ == "__main__":
    test_user_serialization()
