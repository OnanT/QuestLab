# backend/schemas.py
from pydantic import BaseModel
from typing import List
from datetime import datetime

class SubjectOut(BaseModel):
    id: int
    name: str
    
    class Config:
        orm_mode = True

# Add other schemas as needed
class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    avatar: str
    points: int
    level: str
    streak: int
    parent_id: int = None
    created_at: datetime
    
    class Config:
        orm_mode = True