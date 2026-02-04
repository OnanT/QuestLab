from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from dependencies import get_db, get_current_user, get_current_active_user_with_role

router = APIRouter(prefix="/admin/users", tags=["admin-users"])
# ---------- LIST USERS ----------
@router.get("/", response_model=List[schemas.UserOut])
@router.get("", response_model=List[schemas.UserOut])
def list_users(role: str | None = None,
               db: Session = Depends(get_db),
               current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    query = db.query(models.User)
    if role:
        query = query.filter(models.User.role == role)
    return query.all()

@router.get("/parent/dashboard")
async def temp_parent_dashboard():
    return {"message": "Parent dashboard - implement properly"}


@router.post("/templates", status_code=201)
def create_template(
    template: schemas.TemplateCreate,
    current_user: models.User = Depends(get_current_active_user_with_role(['admin', 'teacher'])),
    db: Session = Depends(get_db)
):
# ---------- GET SINGLE USER ----------
@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int,
             db: Session = Depends(get_db),
             current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ---------- UPDATE USER ----------
@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int,
                payload: schemas.UserUpdate,
                db: Session = Depends(get_db),
                current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


# ---------- DELETE USER ----------
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int,
                db: Session = Depends(get_db),
                current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return
    
    # In a real app, you'd have a templates table
    # For now, we'll store it in a JSON file or separate table

    return {
        "message": "Template created",
        "template_id": 1,  # Replace with actual ID
        "share_url": f"/templates/1"
    }
