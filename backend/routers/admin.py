from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
import models
import schemas
from dependencies import get_db, get_current_active_user_with_role

router = APIRouter(prefix="/admin", tags=["admin"])

# ---------- STATS ----------

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db),
                   current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    """
    Get comprehensive system statistics for the admin dashboard.
    """
    user_counts = db.query(models.User.role, func.count(models.User.id)).group_by(models.User.role).all()
    roles_map = {role: count for role, count in user_counts}
    
    total_users = sum(roles_map.values())
    total_lessons = db.query(models.Lesson).count()
    total_quizzes = db.query(models.Quiz).count()
    total_games = db.query(models.Game).count()
    total_assignments = db.query(models.Assignment).count()
    total_feedback = db.query(models.Feedback).count()
    
    # Recent activity
    recent_users = db.query(models.User).order_by(models.User.created_at.desc()).limit(5).all()
    recent_feedback = db.query(models.Feedback).order_by(models.Feedback.created_at.desc()).limit(5).all()
    
    return {
        "counts": {
            "users": total_users,
            "roles": roles_map,
            "lessons": total_lessons,
            "quizzes": total_quizzes,
            "games": total_games,
            "assignments": total_assignments,
            "feedback": total_feedback
        },
        "recent_users": [schemas.UserOut.from_orm(u) for u in recent_users],
        "recent_feedback": [schemas.FeedbackOut.from_orm(f) for f in recent_feedback]
    }

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


@router.patch("/users/{user_id}", response_model=schemas.UserOut)
def update_user_admin(user_id: int,
                     payload: schemas.UserUpdateAdmin,
                     db: Session = Depends(get_db),
                     current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    """
    Update any user field, including role and points, restricted to admins.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    try:
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
        
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


# ---------- CONTENT ----------

@router.get("/quizzes", response_model=List[schemas.QuizOutEnhanced])
def list_quizzes_admin(db: Session = Depends(get_db),
                      current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    """
    List all quizzes for admin management.
    """
    from sqlalchemy.orm import joinedload
    quizzes = db.query(models.Quiz).options(
        joinedload(models.Quiz.lesson)
        .joinedload(models.Lesson.concept)
        .joinedload(models.Concept.topic)
        .joinedload(models.Topic.curriculum_subject)
        .joinedload(models.CurriculumSubject.subject)
    ).all()

    result = []
    for quiz in quizzes:
        lesson = quiz.lesson
        subject = lesson.concept.topic.curriculum_subject.subject if lesson and lesson.concept and lesson.concept.topic and lesson.concept.topic.curriculum_subject else None

        quiz_out = schemas.QuizOutEnhanced(
            id=quiz.id,
            lesson_id=quiz.lesson_id,
            title=lesson.title if lesson else "No Title",
            question=quiz.question,
            question_type=quiz.question_type,
            options=quiz.options,
            correct_answer=quiz.correct_answer,
            explanation=quiz.explanation,
            points=quiz.points,
            difficulty=quiz.difficulty,
            time_limit=quiz.time_limit,
            image_url=quiz.image_url,
            audio_url=None, 
            tags=quiz.tags,
            subject_id=subject.id if subject else None,
            subject_name=subject.name if subject else "Uncategorized",
            total_points=quiz.points, 
            pass_score=70 
        )
        result.append(quiz_out)

    return result


@router.patch("/quizzes/{quiz_id}", response_model=schemas.QuizOut)
def update_quiz_admin(quiz_id: int,
                     payload: schemas.QuizUpdate,
                     db: Session = Depends(get_db),
                     current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    """
    Update a quiz.
    """
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(quiz, field, value)
    
    try:
        db.commit()
        db.refresh(quiz)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
        
    return quiz


@router.delete("/quizzes/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz_admin(quiz_id: int,
                     db: Session = Depends(get_db),
                     current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    db.delete(quiz)
    db.commit()
    return


@router.get("/games", response_model=List[schemas.GameOut])
def list_games_admin(db: Session = Depends(get_db),
                    current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    """
    List all games for admin management.
    """
    from sqlalchemy.orm import joinedload
    from routers.games import get_game_type_from_engine
    
    query = db.query(
        models.Game,
        models.Subject.name.label("subject_name")
    ).select_from(models.Game).join(models.Game.game_engine)

    query = query.join(models.Lesson, models.Game.lesson_id == models.Lesson.id, isouter=True)
    query = query.join(models.Concept, models.Lesson.concept_id == models.Concept.id, isouter=True)
    query = query.join(models.Topic, models.Concept.topic_id == models.Topic.id, isouter=True)
    query = query.join(models.CurriculumSubject, models.Topic.curriculum_subject_id == models.CurriculumSubject.id, isouter=True)
    query = query.join(models.Subject, models.CurriculumSubject.subject_id == models.Subject.id, isouter=True)

    results = query.all()

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


@router.patch("/games/{game_id}", response_model=schemas.GameOut)
def update_game_admin(game_id: int,
                     payload: schemas.GameUpdate,
                     db: Session = Depends(get_db),
                     current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    """
    Update a game.
    """
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(game, field, value)
    
    try:
        db.commit()
        db.refresh(game)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
        
    from routers.games import get_game_type_from_engine
    # Fetch again with joinedload to get game_engine for response model
    game = db.query(models.Game).options(joinedload(models.Game.game_engine)).filter(models.Game.id == game_id).first()
    
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


@router.delete("/games/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_game_admin(game_id: int,
                     db: Session = Depends(get_db),
                     current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    db.delete(game)
    db.commit()
    return


@router.get("/game-engines", response_model=List[Dict])
def list_game_engines_admin(db: Session = Depends(get_db),
                           current_user: models.User = Depends(get_current_active_user_with_role(['admin']))):
    """
    List all available game engines.
    """
    engines = db.query(models.GameEngine).all()
    return [{"id": e.id, "name": e.name} for e in engines]


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
