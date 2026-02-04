from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend import models, schemas
from backend.database import get_db
from backend.dependencies import get_current_active_user

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_model=schemas.FeedbackOut, status_code=status.HTTP_201_CREATED)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    """
    Create new feedback.
    """
    db_feedback = models.Feedback(**feedback.dict(), user_id=current_user.id)
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


@router.get("/lesson/{lesson_id}", response_model=List[schemas.FeedbackOut])
def get_feedback_by_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all feedback for a specific lesson.
    """
    feedback = db.query(models.Feedback).filter(models.Feedback.lesson_id == lesson_id).all()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback for this lesson not found")
    return feedback


@router.get("/user/{user_id}", response_model=List[schemas.FeedbackOut])
def get_feedback_by_user(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all feedback given by a specific user.
    """
    feedback = db.query(models.Feedback).filter(models.Feedback.user_id == user_id).all()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback by this user not found")
    return feedback