from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

import models, schemas
from dependencies import get_db

router = APIRouter(
    prefix="/curriculum",
    tags=["curriculum"],
)

@router.get("/subjects", response_model=List[schemas.CurriculumSubjectOut])
def get_curriculum_subjects(
    country_id: Optional[int] = None, 
    grade_level: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.CurriculumSubject).options(joinedload(models.CurriculumSubject.subject))
    if country_id:
        query = query.filter(models.CurriculumSubject.country_id == country_id)
    if grade_level:
        query = query.filter(models.CurriculumSubject.grade_level == grade_level)
    
    results = query.all()
    
    # Flatten subject name for easier frontend consumption
    for res in results:
        res.subject_name = res.subject.name if res.subject else "Unknown"
        
    return results

@router.get("/topics", response_model=List[schemas.TopicOut])
def get_topics(
    curriculum_subject_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Topic)
    if curriculum_subject_id:
        query = query.filter(models.Topic.curriculum_subject_id == curriculum_subject_id)
    return query.all()

@router.get("/concepts", response_model=List[schemas.ConceptOut])
def get_concepts(
    topic_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Concept)
    if topic_id:
        query = query.filter(models.Concept.topic_id == topic_id)
    return query.all()
