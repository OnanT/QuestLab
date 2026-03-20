from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

import models, schemas
from dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/rewards",
    tags=["rewards"],
)


@router.post("", response_model=schemas.RewardOut, status_code=status.HTTP_201_CREATED)
def create_reward(
    reward: schemas.RewardCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ['parent', 'admin']:
        raise HTTPException(
            status_code=403, detail="Not authorized to create rewards")

    if reward.for_user_id and current_user.role == 'parent':
        student = db.query(models.User).filter(
            models.User.id == reward.for_user_id,
            models.User.parent_id == current_user.id
        ).first()
        if not student:
            raise HTTPException(
                status_code=403, detail="Can only create rewards for your students")

    db_reward = models.Reward(**reward.dict(), creator_id=current_user.id)

    try:
        db.add(db_reward)
        db.commit()
        db.refresh(db_reward)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create reward")

    return db_reward
