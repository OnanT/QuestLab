from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Dict
from datetime import datetime

import models, schemas
from dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/progress",
    tags=["progress"],
)


@router.get("/parent/curriculum-status")
def get_parent_curriculum_status(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get completion status for all children of a parent for each lesson.
    """
    if current_user.role != 'parent':
        raise HTTPException(
            status_code=403, detail="Only parents can view curriculum status")
    
    students = db.query(models.User).filter(models.User.parent_id == current_user.id).all()
    student_ids = [s.id for s in students]
    
    if not student_ids:
        return {}
    
    # Get all progress records for these students
    progress_records = db.query(models.Progress).filter(
        models.Progress.user_id.in_(student_ids)
    ).all()
    
    # Group by lesson_id
    status = {}
    for p in progress_records:
        if p.lesson_id not in status:
            status[p.lesson_id] = []
        status[p.lesson_id].append({
            "student_id": p.user_id,
            "completed": p.completed,
            "score": p.score,
            "completed_at": p.completed_at
        })
    
    return status


@router.post("", response_model=schemas.ProgressOut)
def create_progress(
    progress: schemas.ProgressCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == 'student' and progress.user_id and progress.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Students can only create their own progress")

    if current_user.role == 'parent' and progress.user_id:
        student = db.query(models.User).filter(
            models.User.id == progress.user_id,
            models.User.parent_id == current_user.id
        ).first()
        if not student:
            raise HTTPException(
                status_code=403, detail="Can only create progress for your students")

    if not progress.user_id:
        progress.user_id = current_user.id

    db_progress = models.Progress(**progress.dict())

    if db_progress.completed:
        db_progress.completed_at = datetime.utcnow()

    try:
        db.add(db_progress)
        db.commit()
        db.refresh(db_progress)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Failed to create progress")

    return db_progress


@router.get("/user/{user_id}", response_model=List[schemas.ProgressOutEnhanced])
def get_user_progress(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id and current_user.role not in ['parent', 'admin', 'teacher']:
        raise HTTPException(
            status_code=403, detail="Not authorized to view this user's progress")

    if current_user.role in ['parent', 'teacher'] and current_user.id != user_id:
        student = None
        if current_user.role == 'parent':
            student = db.query(models.User).filter(
                models.User.id == user_id,
                models.User.parent_id == current_user.id
            ).first()
        elif current_user.role == 'teacher':
            student = db.query(models.User).filter(
                models.User.id == user_id,
                models.User.role == 'student'
            ).first()

        if not student:
            raise HTTPException(
                status_code=403, detail="Not authorized to view this user's progress")

    # Join with Lesson to get titles
    results = db.query(models.Progress, models.Lesson.title).outerjoin(
        models.Lesson, models.Progress.lesson_id == models.Lesson.id
    ).filter(models.Progress.user_id == user_id).order_by(
        models.Progress.completed_at.desc()
    ).offset(skip).limit(limit).all()
    
    progress_list = []
    for p, title in results:
        # Pydantic will pick up lesson_title if we set it on the object
        p.lesson_title = title if title else "Unknown Lesson"
        progress_list.append(p)
        
    return progress_list


@router.get("/lesson/{lesson_id}")
def get_lesson_progress(
    lesson_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress = db.query(models.Progress).filter(
        models.Progress.lesson_id == lesson_id,
        models.Progress.user_id == current_user.id
    ).first()

    if not progress:
        return {"completed": False, "score": 0}

    return {
        "completed": progress.completed,
        "score": progress.score,
        "completed_at": progress.completed_at
    }


@router.post("/lesson/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
    score: int = Body(100, embed=True),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lesson = db.query(models.Lesson).filter(
        models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    existing_progress = db.query(models.Progress).filter(
        models.Progress.lesson_id == lesson_id,
        models.Progress.user_id == current_user.id
    ).first()

    if existing_progress:
        existing_progress.completed = True
        existing_progress.score = score
        existing_progress.completed_at = datetime.utcnow()
    else:
        new_progress = models.Progress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            score=score,
            completed=True,
            completed_at=datetime.utcnow()
        )
        db.add(new_progress)

    current_user.points = (current_user.points or 0) + lesson.points

    try:
        db.commit()

        db.refresh(current_user)

        return {
            "message": "Lesson completed successfully",
            "points_awarded": lesson.points,
            "total_points": current_user.points,
            "score": score
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to save progress")
