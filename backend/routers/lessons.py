# backend/routers/lessons.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from models import User, Lesson, Subject
from schemas import LessonCreate, LessonOut
from dependencies import get_db, get_current_user

router = APIRouter(prefix="/lessons", tags=["Lessons"])

@router.get("", response_model=List[LessonOut])
def get_lessons(
    skip: int = 0,
    limit: int = 100,
    concept_id: Optional[int] = None,
    creator_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all lessons with optional filters"""
    query = db.query(Lesson)
    
    if concept_id:
        query = query.filter(Lesson.concept_id == concept_id)
    if creator_id:
        query = query.filter(Lesson.creator_id == creator_id)
    
    lessons = query.offset(skip).limit(limit).all()
    
    # Convert string fields to lists for response
    result = []
    for lesson in lessons:
        lesson_dict = {c.name: getattr(lesson, c.name) for c in lesson.__table__.columns}
        lesson_dict['grade_levels'] = lesson.grade_levels.split(',') if lesson.grade_levels else []
        lesson_dict['tags'] = lesson.tags.split(',') if lesson.tags else []
        result.append(lesson_dict)
    
    return result

@router.get("/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Get a specific lesson by ID"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Convert to dict and parse string fields
    lesson_dict = {c.name: getattr(lesson, c.name) for c in lesson.__table__.columns}
    lesson_dict['grade_levels'] = lesson.grade_levels.split(',') if lesson.grade_levels else []
    lesson_dict['tags'] = lesson.tags.split(',') if lesson.tags else []
    
    return lesson_dict

@router.post("", response_model=LessonOut, status_code=status.HTTP_201_CREATED)
def create_lesson(
    lesson: LessonCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new lesson (requires teacher/parent/admin role)"""
    if current_user.role not in ['teacher', 'parent', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized to create lessons")
    
    # Convert lists to strings for database storage
    lesson_dict = lesson.dict()
    lesson_dict['grade_levels'] = ','.join(lesson_dict['grade_levels']) if lesson_dict['grade_levels'] else ''
    lesson_dict['tags'] = ','.join(lesson_dict['tags']) if lesson_dict['tags'] else ''
    
    db_lesson = Lesson(**lesson_dict, creator_id=current_user.id)
    
    try:
        db.add(db_lesson)
        db.commit()
        db.refresh(db_lesson)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create lesson")
    
    # Convert back for response
    lesson_out = {c.name: getattr(db_lesson, c.name) for c in db_lesson.__table__.columns}
    lesson_out['grade_levels'] = lesson.grade_levels
    lesson_out['tags'] = lesson.tags
    
    return lesson_out

@router.put("/{lesson_id}", response_model=LessonOut)
def update_lesson(
    lesson_id: int,
    lesson_update: LessonCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing lesson"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check authorization
    if lesson.creator_id != current_user.id and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized to update this lesson")
    
    update_data = lesson_update.dict(exclude_unset=True)
    
    # Handle grade_levels conversion
    if 'grade_levels' in update_data and update_data['grade_levels']:
        update_data['grade_levels'] = ','.join(update_data['grade_levels'])
    
    # Handle tags conversion
    if 'tags' in update_data and update_data['tags']:
        update_data['tags'] = ','.join(update_data['tags'])
    
    for field, value in update_data.items():
        setattr(lesson, field, value)
    
    try:
        db.commit()
        db.refresh(lesson)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update lesson")
    
    # Convert back for response
    lesson_out = {c.name: getattr(lesson, c.name) for c in lesson.__table__.columns}
    lesson_out['grade_levels'] = lesson_update.grade_levels
    lesson_out['tags'] = lesson_update.tags
    
    return lesson_out

@router.delete("/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a lesson"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check authorization
    if lesson.creator_id != current_user.id and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized to delete this lesson")
    
    try:
        db.delete(lesson)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to delete lesson")
    
    return {"message": "Lesson deleted successfully"}