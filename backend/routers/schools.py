from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

import models, schemas
from dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/schools",
    tags=["schools"],
)


@router.get("", response_model=List[schemas.SchoolOut])
def get_schools(db: Session = Depends(get_db)):
    """Get all schools"""
    schools = db.query(models.School).all()
    return schools


@router.post("", response_model=schemas.SchoolOut, status_code=status.HTTP_201_CREATED)
def create_school(
    school: schemas.SchoolCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new school - Admin only"""
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=403, detail="Only admins can create schools")

    db_school = models.School(
        name=school.name,
        island_id=school.island_id,
        address=school.address
    )

    try:
        db.add(db_school)
        db.commit()
        db.refresh(db_school)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create school")

    return db_school


@router.put("/{school_id}", response_model=schemas.SchoolOut)
def update_school(
    school_id: int,
    school_update: schemas.SchoolCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a school - Admin only"""
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=403, detail="Only admins can update schools")

    db_school = db.query(models.School).filter(
        models.School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")

    db_school.name = school_update.name
    db_school.island_id = school_update.island_id
    db_school.address = school_update.address

    try:
        db.commit()
        db.refresh(db_school)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update school")

    return db_school


@router.delete("/{school_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_school(
    school_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a school - Admin only"""
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=403, detail="Only admins can delete schools")

    school = db.query(models.School).filter(
        models.School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    try:
        db.delete(school)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to delete school: {str(e)}")

    return None
