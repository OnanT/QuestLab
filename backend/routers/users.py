# backend/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from models import User
from schemas import UserOut, UserUpdate
from dependencies import get_db, get_current_user, get_current_active_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current authenticated user"""
    return current_user

@router.get("/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user information"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check authorization
    if current_user.id != user_id and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    
    # Update fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Update failed")
    
    return user

@router.get("/stats/me")
def get_my_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's statistics"""
    from models import Progress
    
    progress_records = db.query(Progress).filter(Progress.user_id == current_user.id).all()
    completed = [p for p in progress_records if p.completed]
    
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "total_points": current_user.points or 0,
        "level": current_user.level or "Explorer",
        "streak": current_user.streak or 0,
        "completed_lessons": len(completed),
        "total_lessons_attempted": len(progress_records),
        "average_score": sum([p.score or 0 for p in completed]) / len(completed) if completed else 0
    }

@router.get("/{user_id}/stats")
def get_user_stats(
    user_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get stats for any user (requires authorization)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check authorization
    if current_user.id != user_id and current_user.role not in ['admin', 'teacher', 'parent']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from models import Progress
    progress_records = db.query(Progress).filter(Progress.user_id == user_id).all()
    completed = [p for p in progress_records if p.completed]
    
    return {
        "user_id": user_id,
        "username": user.username,
        "total_points": user.points,
        "level": user.level,
        "streak": user.streak,
        "completed_lessons": len(completed),
        "total_lessons_attempted": len(progress_records),
        "average_score": sum([p.score or 0 for p in completed]) / len(completed) if completed else 0
    }