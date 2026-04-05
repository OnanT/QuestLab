from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

import models, schemas
from dependencies import get_db, get_current_active_user_with_role

router = APIRouter(
    prefix="/concepts",
    tags=["concepts"],
)

@router.get("", response_model=List[schemas.ConceptOut])
def get_concepts(topic_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Concept)
    if topic_id:
        query = query.filter(models.Concept.topic_id == topic_id)
    return query.all()

@router.get("/{concept_id}", response_model=schemas.ConceptOut)
def get_concept(concept_id: int, db: Session = Depends(get_db)):
    concept = db.query(models.Concept).filter(models.Concept.id == concept_id).first()
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    return concept

@router.post("", response_model=schemas.ConceptOut, status_code=status.HTTP_201_CREATED)
def create_concept(
    concept: schemas.ConceptCreate,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin'])),
    db: Session = Depends(get_db)
):
    db_concept = models.Concept(**concept.dict())
    try:
        db.add(db_concept)
        db.commit()
        db.refresh(db_concept)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create concept")
    return db_concept

@router.put("/{concept_id}", response_model=schemas.ConceptOut)
def update_concept(
    concept_id: int,
    concept_update: schemas.ConceptCreate,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin'])),
    db: Session = Depends(get_db)
):
    db_concept = db.query(models.Concept).filter(models.Concept.id == concept_id).first()
    if not db_concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    
    for field, value in concept_update.dict().items():
        setattr(db_concept, field, value)
        
    try:
        db.commit()
        db.refresh(db_concept)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update concept")
    return db_concept

@router.delete("/{concept_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_concept(
    concept_id: int,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin'])),
    db: Session = Depends(get_db)
):
    concept = db.query(models.Concept).filter(models.Concept.id == concept_id).first()
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    db.delete(concept)
    db.commit()
    return None
