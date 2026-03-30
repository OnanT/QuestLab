from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from datetime import datetime

import models
from dependencies import get_db, get_current_user
from modules.typing.services import typing_service
from schemas.typing_schemas import TypingResultSchema, TypingResultResponse
from utils.achievements import check_user_achievements

router = APIRouter(
    prefix="/typing",
    tags=["typing"],
)

@router.post("/complete", response_model=TypingResultResponse)
def complete_typing(
    payload: TypingResultSchema,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Evaluate typing performance
    stats = typing_service.evaluate_typing(
        payload.input_text,
        payload.target,
        payload.time_ms
    )
    
    # 2. Find the game to get lesson_id and base points
    game = db.query(models.Game).filter(models.Game.id == payload.game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    # 3. Calculate shell reward
    shells_awarded = typing_service.calculate_shell_reward(stats.accuracy, stats.wpm)
    
    # 4. Update user points (Shells)
    if shells_awarded > 0:
        current_user.points = (current_user.points or 0) + shells_awarded
        db.add(current_user)
    
    # 5. Save/Update progress
    # We use the existing progress pattern
    existing_progress = db.query(models.Progress).filter(
        models.Progress.lesson_id == game.lesson_id,
        models.Progress.user_id == current_user.id
    ).first()
    
    if existing_progress:
        # Update if current score is higher or it wasn't completed
        if not existing_progress.completed or stats.accuracy > (existing_progress.score or 0):
            existing_progress.completed = True
            existing_progress.score = int(stats.accuracy)
            existing_progress.completed_at = datetime.utcnow()
            existing_progress.total_time_spent_seconds = payload.time_ms // 1000
    else:
        new_progress = models.Progress(
            user_id=current_user.id,
            lesson_id=game.lesson_id,
            score=int(stats.accuracy),
            completed=True,
            completed_at=datetime.utcnow(),
            total_time_spent_seconds=payload.time_ms // 1000
        )
        db.add(new_progress)
    
    # 6. Check for achievements
    check_user_achievements(db, current_user)
    
    try:
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save results: {str(e)}")
    
    return TypingResultResponse(
        accuracy=stats.accuracy,
        wpm=stats.wpm,
        errors=stats.errors,
        passed=stats.passed,
        shells_awarded=shells_awarded
    )

@router.get("/lesson/{game_id}")
def get_typing_lesson(
    game_id: int,
    db: Session = Depends(get_db)
):
    # This might be redundant as we have /api/games/{id}, 
    # but the plan specified GET /typing/lesson/{id}
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Typing lesson not found")
    return game
