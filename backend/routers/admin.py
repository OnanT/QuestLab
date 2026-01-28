# backend/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from models import User, Assignment, School, Island, Subject
from schemas import (
    UserOut, AssignmentCreate, AssignmentOut, 
    SchoolCreate, SchoolOut, IslandOut, SubjectCreate, SubjectOut
)
from dependencies import get_db, get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency to require admin role"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Users Management
@router.get("/users", response_model=List[UserOut])
def get_all_users(
    role: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all users (admin only)"""
    query = db.query(User)
    
    if role and role != "all":
        query = query.filter(User.role == role)
    
    users = query.offset(skip).limit(limit).all()
    return users

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete a user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't allow deleting yourself
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    try:
        db.delete(user)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to delete user")
    
    return {"message": "User deleted successfully"}

# Assignments Management
@router.get("/assignments", response_model=List[dict])
def get_assignments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all student assignments"""
    assignments = db.query(Assignment).offset(skip).limit(limit).all()
    
    result = []
    for a in assignments:
        student = db.query(User).filter(User.id == a.student_id).first()
        parent = db.query(User).filter(User.id == a.parent_id).first() if a.parent_id else None
        teacher = db.query(User).filter(User.id == a.teacher_id).first() if a.teacher_id else None
        
        result.append({
            "id": a.id,
            "student_id": a.student_id,
            "student_name": student.username if student else "Unknown",
            "parent_id": a.parent_id,
            "parent_name": parent.username if parent else None,
            "teacher_id": a.teacher_id,
            "teacher_name": teacher.username if teacher else None,
            "created_at": a.created_at
        })
    
    return result

@router.post("/assignments", response_model=AssignmentOut, status_code=201)
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a student assignment"""
    # Verify student exists
    student = db.query(User).filter(User.id == assignment.student_id).first()
    if not student or student.role != 'student':
        raise HTTPException(status_code=400, detail="Invalid student ID")
    
    # Verify parent if provided
    if assignment.parent_id:
        parent = db.query(User).filter(User.id == assignment.parent_id).first()
        if not parent or parent.role != 'parent':
            raise HTTPException(status_code=400, detail="Invalid parent ID")
    
    # Verify teacher if provided
    if assignment.teacher_id:
        teacher = db.query(User).filter(User.id == assignment.teacher_id).first()
        if not teacher or teacher.role != 'teacher':
            raise HTTPException(status_code=400, detail="Invalid teacher ID")
    
    db_assignment = Assignment(**assignment.dict())
    
    try:
        db.add(db_assignment)
        db.commit()
        db.refresh(db_assignment)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create assignment")
    
    return db_assignment

@router.delete("/assignments/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete an assignment"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    try:
        db.delete(assignment)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to delete assignment")
    
    return {"message": "Assignment deleted successfully"}