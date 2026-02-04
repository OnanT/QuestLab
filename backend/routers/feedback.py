from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from dependencies import get_db, get_current_active_user

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

@router.get("/lesson/{lesson_id}", response_model=List[schemas.FeedbackOut])
def get_feedback_by_lesson(lesson_id: int, db: Session = Depends(get_db)):
    feedback_entries = db.query(models.Feedback).filter(models.Feedback.lesson_id == lesson_id).all()
    if not feedback_entries:
        raise HTTPException(status_code=404, detail="No feedback found for this lesson")
    return feedback_entries

@router.get("/user/{user_id}", response_model=List[schemas.FeedbackOut])
def get_feedback_by_user(user_id: int, db: Session = Depends(get_db)):
    feedback_entries = db.query(models.Feedback).filter(models.Feedback.user_id == user_id).all()
    if not feedback_entries:
        raise HTTPException(status_code=404, detail="No feedback found from this user")
    return feedback_entries
