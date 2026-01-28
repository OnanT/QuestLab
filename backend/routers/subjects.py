# backend/routers/subjects.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from models import User, Subject, School, Island
from schemas import SubjectCreate, SubjectOut, SchoolCreate, SchoolOut, IslandOut
from dependencies import get_db, get_current_user

router = APIRouter(tags=["Subjects & Schools"])

# Subjects
@router.get("/subjects", response_model=List[SubjectOut])
def get_subjects(db: Session = Depends(get_db)):
    """Get all subjects"""
    subjects = db.query(Subject).all()
    return subjects

@router.get("/subjects/enhanced", response_model=List[SubjectOut])
def get_subjects_enhanced(db: Session = Depends(get_db)):
    """Get subjects with enhanced data (colors, icons)"""
    subjects = db.query(Subject).all()
    return subjects

@router.post("/subjects", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(
    subject: SubjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new subject (admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_subject = Subject(**subject.dict())
    
    try:
        db.add(db_subject)
        db.commit()
        db.refresh(db_subject)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create subject")
    
    return db_subject

@router.delete("/subjects/{subject_id}")
def delete_subject(
    subject_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a subject (admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    try:
        db.delete(subject)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to delete subject")
    
    return {"message": "Subject deleted successfully"}

# Islands
@router.get("/islands", response_model=List[IslandOut])
def get_islands(db: Session = Depends(get_db)):
    """Get all islands"""
    islands = db.query(Island).all()
    return islands

# Schools
@router.get("/schools", response_model=List[dict])
def get_schools(
    island_id: int = None,
    db: Session = Depends(get_db)
):
    """Get all schools"""
    query = db.query(School)
    
    if island_id:
        query = query.filter(School.island_id == island_id)
    
    schools = query.all()
    
    result = []
    for school in schools:
        island = db.query(Island).filter(Island.id == school.island_id).first() if school.island_id else None
        result.append({
            "id": school.id,
            "name": school.name,
            "island_id": school.island_id,
            "island_name": island.name if island else None,
            "address": school.address
        })
    
    return result

@router.post("/schools", response_model=SchoolOut, status_code=status.HTTP_201_CREATED)
def create_school(
    school: SchoolCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new school (admin only)"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Verify island exists if provided
    if school.island_id:
        island = db.query(Island).filter(Island.id == school.island_id).first()
        if not island:
            raise HTTPException(status_code=400, detail="Island not found")
    
    db_school = School(**school.dict())
    
    try:
        db.add(db_school)
        db.commit()
        db.refresh(db_school)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create school")
    
    return db_school