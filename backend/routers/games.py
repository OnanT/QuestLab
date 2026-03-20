from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func
from typing import Optional

import models, schemas
from dependencies import get_db, get_current_user
from utils.achievements import check_user_achievements

router = APIRouter(
    prefix="/games",
    tags=["games"],
)

def get_game_type_from_engine(engine_name: str) -> str:
    """Helper to map engine names to frontend game types."""
    if not engine_name:
        return "unknown"
    
    # Handle CamelCase names in DB mapping to snake_case in frontend
    # SkillBuilder -> skill_builder
    # QuizBattle -> quiz_battle
    # StoryQuest -> story_quest
    # MapChallenge -> map_challenge
    mapping = {
        "SkillBuilder": "skill_builder",
        "QuizBattle": "quiz_battle",
        "StoryQuest": "story_quest",
        "MapChallenge": "map_challenge"
    }
    
    if engine_name in mapping:
        return mapping[engine_name]
        
    return engine_name.replace(" ", "_").lower()

@router.get("/list", response_model=list[schemas.GameOut])
def get_games_list(
    limit: Optional[int] = None,
    skip: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(models.Game).options(joinedload(models.Game.game_engine))

    if limit:
        query = query.limit(limit)

    games = query.offset(skip).all()

    # Manually create GameOut instances, extracting game_type from game_engine
    game_out_list = []
    for game in games:
        game_out_list.append(schemas.GameOut(
            id=game.id,
            lesson_id=game.lesson_id,
            game_engine_id=game.game_engine_id,
            game_type=get_game_type_from_engine(game.game_engine.name) if game.game_engine else "unknown",
            title=game.config_json.get("title", f"Game {game.id}"),
            points=game.config_json.get("points", 10),
            difficulty=game.config_json.get("difficulty", "medium"),
            created_at=game.created_at,
            config_json=game.config_json
        ))
    return game_out_list


@router.get("", response_model=list[schemas.GameOut])
def get_games_with_stats(
    limit: Optional[int] = None,
    skip: int = 0,
    lesson_id: Optional[int] = None,
    game_type: Optional[str] = None,
    subject_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(
        models.Game,
        models.Subject.name.label("subject_name")
    ).select_from(models.Game).join(models.Game.game_engine)

    # Relationship join to get subject_name
    query = query.join(models.Lesson, models.Game.lesson_id == models.Lesson.id, isouter=True)
    query = query.join(models.Concept, models.Lesson.concept_id == models.Concept.id, isouter=True)
    query = query.join(models.Topic, models.Concept.topic_id == models.Topic.id, isouter=True)
    query = query.join(models.CurriculumSubject, models.Topic.curriculum_subject_id == models.CurriculumSubject.id, isouter=True)
    query = query.join(models.Subject, models.CurriculumSubject.subject_id == models.Subject.id, isouter=True)

    if lesson_id:
        query = query.filter(models.Game.lesson_id == lesson_id)
    if game_type:
        # Convert snake_case (frontend) to CamelCase (backend DB)
        # e.g., skill_builder -> SkillBuilder
        camel_name = "".join(word.capitalize() for word in game_type.split("_"))
        query = query.filter(
            (models.GameEngine.name == game_type) | 
            (models.GameEngine.name == camel_name) |
            (models.GameEngine.name.ilike(game_type.replace("_", "")))
        )
    if subject_id:
        # subject_id lives on CurriculumSubject, not Topic
        query = query.filter(models.CurriculumSubject.subject_id == subject_id)
    if difficulty:
        # difficulty is stored in the config_json JSONB field
        # Using the ->> operator equivalent in SQLAlchemy to get the text value
        query = query.filter(models.Game.config_json["difficulty"].as_string() == difficulty)

    if limit:
        query = query.limit(limit)

    results = query.offset(skip).all()

    # Manually create GameOut instances
    game_out_list = []
    for game, subject_name in results:
        game_out_list.append(schemas.GameOut(
            id=game.id,
            lesson_id=game.lesson_id,
            game_engine_id=game.game_engine_id,
            game_type=get_game_type_from_engine(game.game_engine.name) if game.game_engine else "unknown",
            title=game.config_json.get("title", f"Game {game.id}"),
            points=game.config_json.get("points", 10),
            difficulty=game.config_json.get("difficulty", "medium"),
            subject_name=subject_name,
            created_at=game.created_at,
            config_json=game.config_json
        ))
    return game_out_list


@router.get("/{game_id}", response_model=schemas.GameOut)
def get_game(game_id: int, db: Session = Depends(get_db)):
    game = db.query(models.Game).options(joinedload(models.Game.game_engine)).filter(models.Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return schemas.GameOut(
        id=game.id,
        lesson_id=game.lesson_id,
        game_engine_id=game.game_engine_id,
        game_type=get_game_type_from_engine(game.game_engine.name) if game.game_engine else "unknown",
        title=game.config_json.get("title", f"Game {game.id}"),
        points=game.config_json.get("points", 10),
        difficulty=game.config_json.get("difficulty", "medium"),
        created_at=game.created_at,
        config_json=game.config_json
    )


@router.post("/{game_id}/submit", response_model=schemas.GameResult)
def submit_game_result(
    game_id: int,
    submission: schemas.GameSubmission,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    # Calculate points earned
    # For now, let's assume the score is the points earned, or capped by game points
    max_points = game.config_json.get("points", 10)
    
    # If it's a score-based game (0-100), map it to points
    points_earned = int((submission.score / 100) * max_points) if submission.score > max_points else submission.score
    points_earned = min(points_earned, max_points)

    # Update user points
    if points_earned > 0:
        current_user.points = (current_user.points or 0) + points_earned
        db.add(current_user)

    # Save progress
    progress = models.Progress(
        user_id=current_user.id,
        lesson_id=game.lesson_id,
        score=float(submission.score),
        completed=True,
        completed_at=func.now(),
        total_time_spent_seconds=submission.time_taken
    )
    db.add(progress)
    
    # Check for achievements and leveling
    check_user_achievements(db, current_user)
    
    try:
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    return schemas.GameResult(
        game_id=game.id,
        score=submission.score,
        points_earned=points_earned,
        new_total_points=current_user.points
    )


@router.post("", response_model=schemas.GameOut, status_code=status.HTTP_201_CREATED)
def create_game(
    game: schemas.GameCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ['teacher', 'parent', 'admin']:
        raise HTTPException(
            status_code=403, detail="Not authorized to create games")

    db_game = models.Game(**game.dict())

    try:
        db.add(db_game)
        db.commit()
        db.refresh(db_game)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create game")

    return db_game