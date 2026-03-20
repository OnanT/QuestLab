from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func
from typing import List, Optional

import models, schemas
from dependencies import get_db, get_current_user
from utils.achievements import check_user_achievements

router = APIRouter(
    prefix="/quizzes",
    tags=["quizzes"],
)


@router.get("", response_model=List[schemas.QuizOutEnhanced])
def get_quizzes(
    skip: int = 0,
    limit: int = 100,
    subject_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    grade_level: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Quiz).options(
        joinedload(models.Quiz.lesson)
        .joinedload(models.Lesson.concept)
        .joinedload(models.Concept.topic)
        .joinedload(models.Topic.curriculum_subject)
        .joinedload(models.CurriculumSubject.subject)
    )

    if subject_id:
        query = query.join(models.Lesson).join(models.Concept).join(models.Topic).join(models.CurriculumSubject).filter(models.CurriculumSubject.subject_id == subject_id)
    
    if difficulty:
        query = query.filter(models.Quiz.difficulty == difficulty)

    if grade_level:
        query = query.join(models.Lesson).join(models.Concept).join(models.Topic).join(models.CurriculumSubject).filter(models.CurriculumSubject.grade_level == grade_level)

    quizzes = query.offset(skip).limit(limit).all()

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


@router.post("", response_model=schemas.QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz: schemas.QuizCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ['teacher', 'parent', 'admin']:
        raise HTTPException(
            status_code=403, detail="Not authorized to create quizzes")

    quiz_dict = quiz.dict()
    db_quiz = models.Quiz(**quiz_dict)

    try:
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create quiz")

    return db_quiz


@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def create_quizzes_bulk(
    bulk: schemas.QuizBulkCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ['teacher', 'parent', 'admin']:
        raise HTTPException(
            status_code=403, detail="Not authorized to create quizzes")

    created_quizzes = []

    for quiz_data in bulk.quizzes:
        quiz_dict = quiz_data.dict()
        quiz_dict['lesson_id'] = bulk.lesson_id
        
        db_quiz = models.Quiz(**quiz_dict)

        try:
            db.add(db_quiz)
            db.commit()
            db.refresh(db_quiz)
            created_quizzes.append(db_quiz)

        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400, detail=f"Failed to create quiz: {quiz_data.question}")

    return {
        "message": f"Created {len(created_quizzes)} quizzes",
        "count": len(created_quizzes),
        "quizzes": created_quizzes
    }


@router.get("/{quiz_id}", response_model=schemas.QuizOutEnhanced)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(models.Quiz).options(
        joinedload(models.Quiz.lesson)
        .joinedload(models.Lesson.concept)
        .joinedload(models.Concept.topic)
        .joinedload(models.Topic.curriculum_subject)
        .joinedload(models.CurriculumSubject.subject)
    ).filter(models.Quiz.id == quiz_id).first()
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

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
    
    return quiz_out
    
    
@router.get("/lesson/{lesson_id}", response_model=List[schemas.QuizOutEnhanced])
def get_lesson_quizzes(lesson_id: int, db: Session = Depends(get_db)):
    quizzes = db.query(models.Quiz).options(
        joinedload(models.Quiz.lesson)
        .joinedload(models.Lesson.concept)
        .joinedload(models.Concept.topic)
        .joinedload(models.Topic.curriculum_subject)
        .joinedload(models.CurriculumSubject.subject)
    ).filter(models.Quiz.lesson_id == lesson_id).all()
    
    if not quizzes:
        raise HTTPException(status_code=404, detail="No quizzes found for this lesson")

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


@router.post("/{quiz_id}/submit", response_model=schemas.QuizResult)
def submit_quiz(
    quiz_id: int,
    submission: schemas.QuizSubmission,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    correct = 0
    total = 1  # Since we have only one question per quiz for now
    results = []

    # Try both string and integer keys to handle different JSON serialization behaviors
    user_answer = submission.answers.get(str(quiz.id)) or submission.answers.get(quiz.id)
    is_correct = user_answer == quiz.correct_answer

    if is_correct:
        correct += 1

    results.append({
        "question_id": quiz.id,
        "user_answer": user_answer,
        "correct_answer": quiz.correct_answer,
        "is_correct": is_correct,
        "explanation": quiz.explanation
    })

    score = (correct / total) * 100
    passed = score >= 70  # Assuming 70% is the passing score
    points_earned = quiz.points if passed else 0

    # Update user points
    if points_earned > 0:
        current_user.points = (current_user.points or 0) + points_earned
        db.add(current_user)

    # Save progress
    progress = models.Progress(
        user_id=current_user.id,
        lesson_id=quiz.lesson_id,
        score=score,
        completed=passed,
        completed_at=func.now()
    )
    db.add(progress)
    
    # Check for achievements and leveling
    check_user_achievements(db, current_user)
    
    db.commit()

    return schemas.QuizResult(
        score=score,
        points_earned=points_earned,
        passed=passed,
        correct=correct,
        total=total,
        results=results
    )


@router.post("/lesson/{lesson_id}/submit", response_model=schemas.QuizResult)
def submit_lesson_quizzes(
    lesson_id: int,
    submission: schemas.QuizSubmission,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    quizzes = db.query(models.Quiz).filter(models.Quiz.lesson_id == lesson_id).all()
    if not quizzes:
        raise HTTPException(status_code=404, detail="No quizzes found for this lesson")

    correct = 0
    total = len(quizzes)
    results = []
    total_possible_points = sum(q.points for q in quizzes)
    earned_points_sum = 0

    for quiz in quizzes:
        user_answer = submission.answers.get(str(quiz.id)) or submission.answers.get(quiz.id)
        is_correct = user_answer == quiz.correct_answer

        if is_correct:
            correct += 1
            earned_points_sum += quiz.points

        results.append({
            "question_id": quiz.id,
            "user_answer": user_answer,
            "correct_answer": quiz.correct_answer,
            "is_correct": is_correct,
            "explanation": quiz.explanation
        })

    score = (correct / total) * 100 if total > 0 else 0
    passed = score >= 70  # Assuming 70% is the passing score
    
    # Points earned is the sum of points for correct answers, if passed? 
    # Or just sum of points for correct answers? Let's say if passed, you get all points for correct answers.
    points_earned = earned_points_sum if passed else 0

    # Update user points
    if points_earned > 0:
        current_user.points = (current_user.points or 0) + points_earned
        db.add(current_user)

    # Save progress
    progress = models.Progress(
        user_id=current_user.id,
        lesson_id=lesson_id,
        score=score,
        completed=passed,
        completed_at=func.now()
    )
    db.add(progress)
    
    # Check for achievements and leveling
    check_user_achievements(db, current_user)
    
    db.commit()

    return schemas.QuizResult(
        score=score,
        points_earned=points_earned,
        passed=passed,
        correct=correct,
        total=total,
        results=results
    )