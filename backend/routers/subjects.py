from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

import models, schemas
from dependencies import get_db, get_current_user, get_current_active_user_with_role

router = APIRouter(
    prefix="/subjects",
    tags=["subjects"],
)


@router.get("", response_model=List[schemas.SubjectOut])
def get_subjects(db: Session = Depends(get_db)):
    subjects = db.query(models.Subject).all()
    return subjects


@router.post("", response_model=schemas.SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(
    subject: schemas.SubjectCreate,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin'])),
    db: Session = Depends(get_db)
):

    existing = db.query(models.Subject).filter(
        models.Subject.name == subject.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subject already exists")

    db_subject = models.Subject(name=subject.name)

    try:
        db.add(db_subject)
        db.commit()
        db.refresh(db_subject)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create subject")

    return db_subject


@router.put("/{subject_id}", response_model=schemas.SubjectOut)
def update_subject(
    subject_id: int,
    subject_update: schemas.SubjectCreate,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin'])),
    db: Session = Depends(get_db)
):

    db_subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db_subject.name = subject_update.name

    try:
        db.commit()
        db.refresh(db_subject)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update subject")

    return db_subject


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    subject_id: int,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin'])),
    db: Session = Depends(get_db)
):


    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    try:
        db.delete(subject)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to delete subject: {str(e)}")

    return None


@router.get("/enhanced", response_model=List[schemas.SubjectOutEnhanced])
def get_subjects_enhanced(db: Session = Depends(get_db)):
    subject_mapping = {
        "Math": {"color": "#3B82F6", "icon": "calculator"},
        "Science": {"color": "#10B981", "icon": "flask"},
        "History": {"color": "#F59E0B", "icon": "landmark"},
        "Language": {"color": "#8B5CF6", "icon": "book-open"},
        "Art": {"color": "#EC4899", "icon": "palette"},
        "Technology": {"color": "#06B6D4", "icon": "cpu"}
    }

    subjects = db.query(models.Subject).all()
    enhanced_subjects = []

    for subject in subjects:
        mapping = subject_mapping.get(
            subject.name, {"color": "#6B7280", "icon": "book"})
        enhanced_subjects.append({
            "id": subject.id,
            "name": subject.name,
            "color": mapping["color"],
            "icon": mapping["icon"]
        })

    return enhanced_subjects
