from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from dependencies import get_db

router = APIRouter(
    prefix="/leaderboard",
    tags=["leaderboard"],
)


@router.get("", response_model=List[schemas.LeaderboardEntry])
def get_leaderboard(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    users = db.query(models.User).order_by(
        models.User.points.desc()).limit(limit).all()

    leaderboard = []
    for i, user in enumerate(users):
        leaderboard.append(schemas.LeaderboardEntry(
            rank=i + 1,
            user_id=user.id,
            username=user.username,
            display_name=user.display_name or user.username,
            points=user.points or 0,
            level=str(user.level) if user.level else "1",
            avatar=user.avatar or "default_avatar.png",
            role=user.role,
            badges=[badge.strip() for badge in user.badges.split(',') if badge.strip()] if user.badges else [] # Convert comma-separated string to list
        ))

    return leaderboard
