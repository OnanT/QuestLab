from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional

import models, schemas
from dependencies import get_db, get_current_user, get_current_active_user_with_role

router = APIRouter(
    prefix="/lessons",
    tags=["lessons"],
)


@router.get("/create")
def check_lesson_create_access(current_user: models.User = Depends(get_current_active_user_with_role(['admin', 'teacher']))):
    return {"message": "Authorized to create lessons"}


@router.get("", response_model=List[schemas.LessonOut])
def get_lessons(
    skip: int = 0,
    limit: int = 100,
    concept_id: Optional[int] = None,
    creator_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Lesson)

    if concept_id:
        query = query.filter(models.Lesson.concept_id == concept_id)
    if creator_id:
        query = query.filter(models.Lesson.creator_id == creator_id)

    lessons = query.offset(skip).limit(limit).all()
    return lessons


@router.get("/{lesson_id}", response_model=schemas.LessonOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


@router.get("/enhanced/{lesson_id}", response_model=schemas.LessonOutEnhanced)
def get_lesson_enhanced(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    lesson_dict = {c.name: getattr(
        lesson, c.name) for c in lesson.__table__.columns if c.name not in ['grade_levels_str', 'tags_str']}

    lesson_dict['grade_levels'] = lesson.grade_levels if lesson.grade_levels else []
    lesson_dict['tags'] = lesson.tags if lesson.tags else []
    lesson_dict['subject_name'] = lesson.category
    lesson_dict['is_published'] = lesson.is_published
    lesson_dict['is_featured'] = lesson.is_featured
    lesson_dict['view_count'] = lesson.view_count
    lesson_dict['completion_count'] = lesson.completion_count

    return lesson_dict


@router.post("", response_model=schemas.LessonOutEnhanced, status_code=status.HTTP_201_CREATED)
def create_lesson(
    lesson: schemas.LessonCreate,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin', 'teacher'])),
    db: Session = Depends(get_db)
):
    # Validate concept exists if provided
    if lesson.concept_id:
        concept = db.query(models.Concept).filter(models.Concept.id == lesson.concept_id).first()
        if not concept:
            raise HTTPException(status_code=400, detail="Concept not found")

    lesson_dict = lesson.dict()
    lesson_dict['grade_levels_str'] = ','.join(
        lesson_dict['grade_levels']) if lesson_dict['grade_levels'] is not None else ''
    lesson_dict['tags_str'] = ','.join(
        lesson_dict['tags']) if lesson_dict['tags'] is not None else ''
    
    del lesson_dict['grade_levels']
    del lesson_dict['tags']

    db_lesson = models.Lesson(
        **lesson_dict, 
        creator_id=current_user.id,
        organization_id=current_user.organization_id
    )

    try:
        db.add(db_lesson)
        db.commit()
        db.refresh(db_lesson)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create lesson")

    lesson_out = {c.name: getattr(
        db_lesson, c.name) for c in db_lesson.__table__.columns if c.name not in ['grade_levels_str', 'tags_str']}
    lesson_out['grade_levels'] = db_lesson.grade_levels if db_lesson.grade_levels else []
    lesson_out['tags'] = db_lesson.tags if db_lesson.tags else []
    lesson_out['subject_name'] = db_lesson.category
    lesson_out['is_published'] = db_lesson.is_published
    lesson_out['is_featured'] = db_lesson.is_featured
    lesson_out['view_count'] = db_lesson.view_count
    lesson_out['completion_count'] = db_lesson.completion_count

    return lesson_out


@router.put("/{lesson_id}", response_model=schemas.LessonOutEnhanced)
def update_lesson(
    lesson_id: int,
    lesson_update: schemas.LessonUpdate,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin', 'teacher'])),
    db: Session = Depends(get_db)
):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    if current_user.role == 'teacher' and lesson.creator_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this lesson")

    update_data = lesson_update.dict(exclude_unset=True)

    if 'grade_levels' in update_data:
        update_data['grade_levels_str'] = ','.join(update_data['grade_levels']) if update_data['grade_levels'] is not None else ''
        del update_data['grade_levels']

    if 'tags' in update_data:
        update_data['tags_str'] = ','.join(update_data['tags']) if update_data['tags'] is not None else ''
        del update_data['tags']

    for field, value in update_data.items():
        setattr(lesson, field, value)

    try:
        db.commit()
        db.refresh(lesson)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update lesson")

    lesson_out = {c.name: getattr(
        lesson, c.name) for c in lesson.__table__.columns if c.name not in ['grade_levels_str', 'tags_str']}
    lesson_out['grade_levels'] = lesson.grade_levels if lesson.grade_levels else []
    lesson_out['tags'] = lesson.tags if lesson.tags else []
    lesson_out['subject_name'] = lesson.category
    lesson_out['is_published'] = lesson.is_published
    lesson_out['is_featured'] = lesson.is_featured
    lesson_out['view_count'] = lesson.view_count
    lesson_out['completion_count'] = lesson.completion_count

    return lesson_out


@router.delete("/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin', 'teacher'])),
    db: Session = Depends(get_db)
):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    if current_user.role == 'teacher' and lesson.creator_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this lesson")

    try:
        db.delete(lesson)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to delete lesson")

    return {"message": "Lesson deleted successfully"}