from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
import shutil
import os
import uuid
from pathlib import Path

import models, schemas
from dependencies import get_db, get_current_user, get_current_active_user, get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

UPLOAD_DIR = Path("uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    # Convert comma-separated string to list for the response schema
    current_user.badges = [b.strip() for b in current_user.badges.split(',') if b.strip()] if isinstance(current_user.badges, str) else []
    return current_user


@router.get("/{user_id}", response_model=schemas.UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Convert comma-separated string to list for the response schema
    user.badges = [b.strip() for b in user.badges.split(',') if b.strip()] if isinstance(user.badges, str) else []
    return user


@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check authorization
    if current_user.id != user_id and current_user.role != 'admin':
        raise HTTPException(
            status_code=403, detail="Not authorized to update this user")

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

    # Convert badges for response
    user.badges = [b.strip() for b in user.badges.split(',') if b.strip()] if isinstance(user.badges, str) else []
    return user


@router.post("/avatar", response_model=schemas.UserOut)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Upload and set user avatar
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Generate unique filename
    extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{extension}"
    file_path = UPLOAD_DIR / filename

    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    # Update user avatar URL
    # Assuming the app mounts /uploads to serve files
    current_user.avatar = f"/uploads/avatars/{filename}"
    db.commit()
    db.refresh(current_user)

    # Convert badges for response
    current_user.badges = [b.strip() for b in current_user.badges.split(',') if b.strip()] if isinstance(current_user.badges, str) else []
    return current_user


@router.get("/stats/me")
def get_my_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress_records = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id).all()
    completed = [p for p in progress_records if p.completed]
    
    # Heuristic to distinguish quizzes from games if not explicitly tracked
    # Usually quizzes are linked to lessons, games might have more time spent or specific lesson types
    # For now, let's count all as completed lessons, but split by some criteria if possible
    # Alternatively, just return counts of progress records
    
    quizzes_count = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id,
        models.Progress.completed == True
    ).count()
    
    # For now, let's assume games are tracked in Progress too
    games_count = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id,
        models.Progress.total_time_spent_seconds > 0
    ).count()

    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "total_points": current_user.points or 0,
        "level": current_user.level or 1,
        "streak": current_user.streak or 0,
        "completed_lessons": len(completed),
        "quizzes_completed": quizzes_count,
        "games_played": games_count,
        "badges": [b.strip() for b in current_user.badges.split(',') if b.strip()] if current_user.badges else [],
        "total_lessons_attempted": len(progress_records),
        "average_score": sum([p.score or 0 for p in completed]) / len(completed) if completed else 0
    }


@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    progress_records = db.query(models.Progress).filter(
        models.Progress.user_id == user_id).all()
    completed = [p for p in progress_records if p.completed]
    
    quizzes_count = db.query(models.Progress).filter(
        models.Progress.user_id == user_id,
        models.Progress.completed == True
    ).count()
    
    games_count = db.query(models.Progress).filter(
        models.Progress.user_id == user_id,
        models.Progress.total_time_spent_seconds > 0
    ).count()

    return {
        "user_id": user_id,
        "username": user.username,
        "total_points": user.points or 0,
        "level": user.level or 1,
        "streak": user.streak or 0,
        "completed_lessons": len(completed),
        "quizzes_completed": quizzes_count,
        "games_played": games_count,
        "badges": [b.strip() for b in user.badges.split(',') if b.strip()] if user.badges else [],
        "total_lessons_attempted": len(progress_records),
        "average_score": sum([p.score or 0 for p in completed]) / len(completed) if completed else 0
    }


@router.get("/my-students", response_model=List[schemas.UserOut])
def get_my_students(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ['parent', 'teacher']:
        raise HTTPException(
            status_code=403, detail="Only parents and teachers can view their students")

    if current_user.role == 'parent':
        students = db.query(models.User).filter(
            models.User.parent_id == current_user.id).all()
    else:  # teacher
        students = db.query(models.User).filter(
            models.User.role == 'student').all()

    return students


@router.post("/register-student", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register_student(
    student: schemas.UserCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != 'parent':
        raise HTTPException(
            status_code=403, detail="Only parents can register students")

    existing_user = db.query(models.User).filter(
        models.User.username == student.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    existing_email = db.query(models.User).filter(
        models.User.email == student.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(student.password)
    db_student = models.User(
        username=student.username,
        email=student.email,
        hashed_password=hashed_password,
        role='student',
        parent_id=current_user.id
    )

    try:
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Failed to register student")

    return db_student
