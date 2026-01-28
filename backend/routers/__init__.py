# ==================== routers/__init__.py ====================
from . import users, lessons, quizzes, games, progress, subjects, admin

__all__ = ["users", "lessons", "quizzes", "games", "progress", "subjects", "admin"]


# ==================== routers/quizzes.py ====================
# backend/routers/quizzes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from ..models import User, Quiz
from ..schemas import QuizCreate, QuizOut, QuizBulkCreate
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.get("", response_model=List[QuizOut])
def get_quizzes(
    skip: int = 0,
    limit: int = 100,
    lesson_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all quizzes with optional lesson filter"""
    query = db.query(Quiz)
    
    if lesson_id:
        query = query.filter(Quiz.lesson_id == lesson_id)
    
    quizzes = query.offset(skip).limit(limit).all()
    
    # Convert options and tags strings to lists
    result = []
    for quiz in quizzes:
        quiz_dict = {c.name: getattr(quiz, c.name) for c in quiz.__table__.columns}
        quiz_dict['options'] = quiz.options.split(',') if quiz.options else []
        quiz_dict['tags'] = quiz.tags.split(',') if quiz.tags else []
        result.append(quiz_dict)
    
    return result

@router.get("/{quiz_id}", response_model=QuizOut)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    """Get a specific quiz by ID"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    quiz_dict = {c.name: getattr(quiz, c.name) for c in quiz.__table__.columns}
    quiz_dict['options'] = quiz.options.split(',') if quiz.options else []
    quiz_dict['tags'] = quiz.tags.split(',') if quiz.tags else []
    
    return quiz_dict

@router.post("", response_model=QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz: QuizCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new quiz (requires teacher/parent/admin role)"""
    if current_user.role not in ['teacher', 'parent', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized to create quizzes")
    
    # Convert lists to strings for database storage
    quiz_dict = quiz.dict()
    quiz_dict['options'] = ','.join(quiz_dict['options'])
    quiz_dict['tags'] = ','.join(quiz_dict['tags']) if quiz_dict['tags'] else ''
    
    db_quiz = Quiz(**quiz_dict)
    
    try:
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create quiz")
    
    # Convert back to list for response
    quiz_out = {c.name: getattr(db_quiz, c.name) for c in db_quiz.__table__.columns}
    quiz_out['options'] = quiz.options
    quiz_out['tags'] = quiz.tags
    
    return quiz_out

@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def create_quizzes_bulk(
    bulk: QuizBulkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create multiple quizzes at once"""
    if current_user.role not in ['teacher', 'parent', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized to create quizzes")
    
    created_quizzes = []
    
    for quiz_data in bulk.quizzes:
        # Convert lists to strings
        quiz_dict = quiz_data.dict()
        quiz_dict['lesson_id'] = bulk.lesson_id
        quiz_dict['options'] = ','.join(quiz_dict['options'])
        quiz_dict['tags'] = ','.join(quiz_dict.get('tags', []))
        
        db_quiz = Quiz(**quiz_dict)
        
        try:
            db.add(db_quiz)
            db.commit()
            db.refresh(db_quiz)
            
            # Convert back to list for response
            quiz_out = {c.name: getattr(db_quiz, c.name) for c in db_quiz.__table__.columns}
            quiz_out['options'] = quiz_data.options
            quiz_out['tags'] = quiz_data.tags
            created_quizzes.append(quiz_out)
            
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Failed to create quiz: {quiz_data.question}")
    
    return {
        "message": f"Created {len(created_quizzes)} quizzes",
        "count": len(created_quizzes),
        "quizzes": created_quizzes
    }


# ==================== routers/games.py ====================
# backend/routers/games.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from ..models import User, Game
from ..schemas import GameCreate, GameOut
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/games", tags=["Games"])

@router.get("/list")
def get_games_list(
    limit: Optional[int] = None,
    skip: int = 0,
    db: Session = Depends(get_db)
):
    """Get games list for frontend dashboard"""
    query = db.query(Game)
    
    if limit:
        query = query.limit(limit)
    
    games = query.offset(skip).all()
    
    # Convert to frontend format
    game_list = []
    for game in games:
        game_list.append({
            "id": game.id,
            "title": f"Game {game.id}",
            "game_engine_id": game.game_engine_id or 1,
            "points": 10,
            "difficulty": "medium",
            "config_json": game.config_json
        })
    
    return game_list

@router.get("")
def get_games(
    limit: Optional[int] = None,
    skip: int = 0,
    lesson_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all games with optional filters"""
    query = db.query(Game)
    
    if lesson_id:
        query = query.filter(Game.lesson_id == lesson_id)
    
    if limit:
        query = query.limit(limit)
    
    games = query.offset(skip).all()
    
    # Convert to frontend format with stats
    game_list = []
    for game in games:
        game_list.append({
            "id": game.id,
            "title": f"Game {game.id}",
            "game_engine_id": game.game_engine_id or 1,
            "points": 10,
            "difficulty": "medium",
            "config_json": game.config_json,
            "lesson_id": game.lesson_id
        })
    
    return game_list

@router.get("/{game_id}", response_model=GameOut)
def get_game(game_id: int, db: Session = Depends(get_db)):
    """Get a specific game by ID"""
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

@router.post("", response_model=GameOut, status_code=status.HTTP_201_CREATED)
def create_game(
    game: GameCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new game (requires teacher/parent/admin role)"""
    if current_user.role not in ['teacher', 'parent', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized to create games")
    
    db_game = Game(**game.dict())
    
    try:
        db.add(db_game)
        db.commit()
        db.refresh(db_game)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create game")
    
    return db_game

@router.delete("/{game_id}")
def delete_game(
    game_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a game"""
    if current_user.role not in ['admin']:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    try:
        db.delete(game)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to delete game")
    
    return {"message": "Game deleted successfully"}


# ==================== routers/progress.py ====================
# backend/routers/progress.py
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from datetime import datetime
from ..models import User, Progress, Lesson
from ..schemas import ProgressCreate, ProgressOut
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.post("", response_model=ProgressOut, status_code=status.HTTP_201_CREATED)
def create_progress(
    progress: ProgressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record progress for a lesson"""
    # Students can only create their own progress
    if current_user.role == 'student' and progress.user_id and progress.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Students can only create their own progress")
    
    # Parents can create progress for their children
    if current_user.role == 'parent' and progress.user_id:
        student = db.query(User).filter(
            User.id == progress.user_id,
            User.parent_id == current_user.id
        ).first()
        if not student:
            raise HTTPException(status_code=403, detail="Can only create progress for your students")
    
    # Set user_id to current user if not specified
    if not progress.user_id:
        progress.user_id = current_user.id
    
    db_progress = Progress(**progress.dict())
    
    if db_progress.completed:
        db_progress.completed_at = datetime.utcnow()
    
    try:
        db.add(db_progress)
        db.commit()
        db.refresh(db_progress)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create progress")
    
    return db_progress

@router.get("/user/{user_id}", response_model=List[ProgressOut])
def get_user_progress(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get progress for a specific user"""
    # Check authorization
    if current_user.id != user_id and current_user.role not in ['parent', 'admin', 'teacher']:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's progress")
    
    # If parent or teacher, check if they have access to this student
    if current_user.role in ['parent', 'teacher'] and current_user.id != user_id:
        student = None
        if current_user.role == 'parent':
            student = db.query(User).filter(
                User.id == user_id,
                User.parent_id == current_user.id
            ).first()
        elif current_user.role == 'teacher':
            student = db.query(User).filter(
                User.id == user_id,
                User.role == 'student'
            ).first()
        
        if not student:
            raise HTTPException(status_code=403, detail="Not authorized to view this user's progress")
    
    progress_list = db.query(Progress).filter(Progress.user_id == user_id).offset(skip).limit(limit).all()
    return progress_list

@router.get("/lesson/{lesson_id}")
def get_lesson_progress(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's progress for a specific lesson"""
    progress = db.query(Progress).filter(
        Progress.lesson_id == lesson_id,
        Progress.user_id == current_user.id
    ).first()
    
    if not progress:
        return {"completed": False, "score": 0}
    
    return {
        "completed": progress.completed,
        "score": progress.score,
        "completed_at": progress.completed_at
    }

@router.post("/lesson/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
    score: int = Body(100, embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a lesson as completed and award points"""
    # Check if lesson exists
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check if progress already exists
    existing_progress = db.query(Progress).filter(
        Progress.lesson_id == lesson_id,
        Progress.user_id == current_user.id
    ).first()
    
    if existing_progress:
        # Update existing progress
        existing_progress.completed = True
        existing_progress.score = score
        existing_progress.completed_at = datetime.utcnow()
    else:
        # Create new progress
        new_progress = Progress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            score=score,
            completed=True,
            completed_at=datetime.utcnow()
        )
        db.add(new_progress)
    
    # Award points to user
    current_user.points = (current_user.points or 0) + lesson.points
    
    try:
        db.commit()
        db.refresh(current_user)
        
        return {
            "message": "Lesson completed successfully",
            "points_awarded": lesson.points,
            "total_points": current_user.points,
            "score": score
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to save progress")