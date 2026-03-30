from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from dependencies import get_db, get_current_active_user, get_current_active_user_with_role

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"],
)

@router.post("/", response_model=schemas.FeedbackOut, status_code=status.HTTP_201_CREATED)
def create_feedback(
    feedback: schemas.FeedbackCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Submit feedback for a lesson or general platform
    """
    # Check if user already submitted feedback for this lesson
    if feedback.lesson_id:
        existing_feedback = db.query(models.Feedback).filter(
            models.Feedback.user_id == current_user.id,
            models.Feedback.lesson_id == feedback.lesson_id
        ).first()
        
        if existing_feedback:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already submitted feedback for this lesson"
            )

    db_feedback = models.Feedback(
        user_id=current_user.id,
        lesson_id=feedback.lesson_id,
        rating=feedback.rating,
        comment=feedback.comment
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/", response_model=List[schemas.FeedbackOut])
def get_all_feedback(
    current_user: models.User = Depends(get_current_active_user_with_role(["admin", "teacher"])),
    db: Session = Depends(get_db)
):
    """
    Get all feedback (Admin/Teacher only)
    """
    return db.query(models.Feedback).order_by(models.Feedback.created_at.desc()).all()

@router.get("/lesson/{lesson_id}", response_model=List[schemas.FeedbackOut])
def get_feedback_by_lesson(lesson_id: int, db: Session = Depends(get_db)):
    feedback_entries = db.query(models.Feedback).filter(models.Feedback.lesson_id == lesson_id).all()
    return feedback_entries

@router.get("/user/{user_id}", response_model=List[schemas.FeedbackOut])
def get_feedback_by_user(
    user_id: int, 
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Only allow users to see their own feedback, or admins/teachers to see any
    if current_user.id != user_id and current_user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    feedback_entries = db.query(models.Feedback).filter(models.Feedback.user_id == user_id).all()
    return feedback_entries
