from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from dependencies import get_db, get_current_active_user_with_role

router = APIRouter(prefix="/admin", tags=["admin"])

# ---------- USERS ----------

@router.get("/users", response_model=List[schemas.UserOut])
def list_users(role: str | None = None,
               db: Session = Depends(get_db),
               current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    query = db.query(models.User)
    if role:
        query = query.filter(models.User.role == role)
    return query.all()


@router.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int,
             db: Session = Depends(get_db),
             current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int,
                db: Session = Depends(get_db),
                current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return


# ---------- ASSIGNMENTS ----------

@router.get("/assignments", response_model=List[schemas.AssignmentOut])
def list_assignments(db: Session = Depends(get_db),
                    current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    assignments = db.query(models.Assignment).all()
    
    result = []
    for a in assignments:
        student = db.query(models.User).filter(models.User.id == a.student_id).first()
        parent = db.query(models.User).filter(models.User.id == a.parent_id).first() if a.parent_id else None
        teacher = db.query(models.User).filter(models.User.id == a.teacher_id).first() if a.teacher_id else None
        
        result.append(schemas.AssignmentOut(
            id=a.id,
            student_id=a.student_id,
            parent_id=a.parent_id,
            teacher_id=a.teacher_id,
            student_name=student.display_name if student else "Unknown",
            parent_name=parent.display_name if parent else None,
            teacher_name=teacher.display_name if teacher else None,
            created_at=a.created_at
        ))
    return result


@router.post("/assignments", response_model=schemas.AssignmentOut, status_code=status.HTTP_201_CREATED)
def create_assignment(payload: schemas.AssignmentCreate,
                     db: Session = Depends(get_db),
                     current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    db_assignment = models.Assignment(**payload.dict())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return list_assignments(db, current_user)[-1] # Quick way to get the enriched object


@router.delete("/assignments/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(assignment_id: int,
                     db: Session = Depends(get_db),
                     current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(assignment)
    db.commit()
    return
