# schemas.py
# Consolidated Pydantic models for the Island Quest Lab API
# -------------------------------------------------------
# All models are compatible with the ORM classes defined in models.py.
# Import this file wherever you need request or response bodies.

from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, EmailStr, Field


# ----------------------------------------------------------------------
# USER SCHEMAS
# ----------------------------------------------------------------------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str
    parent_id: Optional[int] = None


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None
    level: Optional[str] = None
    streak: Optional[int] = None


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    avatar: str
    points: int
    level: int
    streak: int
    parent_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# ----------------------------------------------------------------------
# ISLAND / COUNTRY SCHEMAS
# ----------------------------------------------------------------------
class CountryCreate(BaseModel):
    name: str
    flag_emoji: str = "🏝️"


class CountryOut(BaseModel):
    id: int
    name: str
    flag_emoji: str = "🏝️"

    class Config:
        from_attributes = True


# ----------------------------------------------------------------------
# SCHOOL SCHEMAS
# ----------------------------------------------------------------------
class SchoolCreate(BaseModel):
    name: str
    island_id: Optional[int] = None
    address: Optional[str] = ""


class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    island_id: Optional[int] = None
    address: Optional[str] = None


class SchoolOut(BaseModel):
    id: int
    name: str
    island_id: Optional[int] = None
    address: Optional[str] = ""

    class Config:
        from_attributes = True


# ----------------------------------------------------------------------
# SUBJECT SCHEMAS
# ----------------------------------------------------------------------
class SubjectCreate(BaseModel):
    name: str


class SubjectUpdate(BaseModel):
    name: Optional[str] = None


class SubjectOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class SubjectOutEnhanced(BaseModel):
    id: int
    name: str
    color: str
    icon: str

    class Config:
        from_attributes = True


# ----------------------------------------------------------------------
# LESSON SCHEMAS
# ----------------------------------------------------------------------
class LessonCreate(BaseModel):
    concept_id: Optional[int] = None
    title: str
    content_html: str
    category: str = "General"
    difficulty: str = "beginner"
    estimated_time: int = 30
    points: int = 50
    grade_levels: Optional[List[str]] = None
    description: str = ""
    objectives: str = ""
    prerequisites: str = ""
    tags: Optional[List[str]] = None


class LessonUpdate(BaseModel):
    concept_id: Optional[int] = None
    title: Optional[str] = None
    content_html: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = None
    estimated_time: Optional[int] = None
    points: Optional[int] = None
    grade_levels: Optional[List[str]] = None
    description: Optional[str] = None
    objectives: Optional[str] = None
    prerequisites: Optional[str] = None
    tags: Optional[List[str]] = None


class LessonOut(BaseModel):
    id: int
    concept_id: Optional[int] = None
    title: str
    content_html: str
    creator_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LessonOutEnhanced(BaseModel):
    id: int
    concept_id: Optional[int] = None
    title: str
    content_html: str
    creator_id: Optional[int] = None
    created_at: datetime
    category: str
    difficulty: str
    estimated_time: int
    points: int
    grade_levels: List[str]
    description: str
    objectives: str
    prerequisites: str
    tags: List[str]
    subject_name: Optional[str] = None

    class Config:
        from_attributes = True


# ----------------------------------------------------------------------
# GAME SCHEMAS
# ----------------------------------------------------------------------
class GameCreate(BaseModel):
    lesson_id: Optional[int] = None
    game_engine_id: Optional[int] = None
    config_json: Dict[str, Any]


class GameUpdate(BaseModel):
    lesson_id: Optional[int] = None
    game_engine_id: Optional[int] = None
    config_json: Optional[Dict[str, Any]] = None


class GameOut(BaseModel):
    id: int
    lesson_id: Optional[int] = None
    game_engine_id: Optional[int] = None
    game_type: str  # Added game_type
    title: str       # Added title
    points: int      # Added points
    difficulty: str  # Added difficulty
    subject_name: Optional[str] = None # Added subject_name
    config_json: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ----------------------------------------------------------------------
# QUIZ SCHEMAS
# ----------------------------------------------------------------------
class QuizCreate(BaseModel):
    lesson_id: Optional[int] = None
    question: str
    question_type: str = "mc_single"
    options: List[str]
    correct_answer: str
    explanation: str = ""
    points: int = 10
    difficulty: str = "beginner"
    time_limit: int = 0
    image_url: str = ""
    audio_url: str = ""
    tags: List[str] = []


class QuizOut(BaseModel):
    id: int
    lesson_id: Optional[int] = None
    question: str
    question_type: str
    options: List[str]
    correct_answer: str
    explanation: str
    points: int
    difficulty: str
    time_limit: int
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    tags: List[str]

    class Config:
        from_attributes = True


class QuizOutEnhanced(QuizOut):
    title: str
    subject_id: Optional[int] = None
    subject_name: str
    total_points: int
    pass_score: int

    class Config:
        from_attributes = True


# Helper models for bulk quiz creation
class QuizBulkItem(BaseModel):
    question: str
    question_type: str = "mc_single"
    options: List[str]
    correct_answer: str
    explanation: str = ""
    points: int = 10
    difficulty: str = "beginner"


class QuizBulkCreate(BaseModel):
    lesson_id: int
    quizzes: List[QuizBulkItem]


class QuizSubmission(BaseModel):
    quiz_id: int
    answers: Dict[int, str]


class QuizResult(BaseModel):
    score: float
    points_earned: int
    passed: bool
    correct: int
    total: int
    results: List[Dict]


# ----------------------------------------------------------------------
# PROGRESS SCHEMAS
# ----------------------------------------------------------------------
class ProgressCreate(BaseModel):
    user_id: Optional[int] = None
    lesson_id: Optional[int] = None
    score: Optional[int] = None
    completed: bool = False


class ProgressOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    lesson_id: Optional[int] = None
    score: Optional[int] = None
    completed: bool
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ----------------------------------------------------------------------
# REWARD SCHEMAS
# ----------------------------------------------------------------------
class RewardCreate(BaseModel):
    name: str
    points_required: int
    for_user_id: Optional[int] = None


class RewardOut(BaseModel):
    id: int
    name: str
    points_required: int
    creator_id: Optional[int] = None
    for_user_id: Optional[int] = None

    class Config:
        from_attributes = True

# ----------------------------------------------------------------------
# LEADERBOARD SCHEMAS
# ----------------------------------------------------------------------
class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    display_name: str # Frontend expects this
    points: int
    level: str
    avatar: str
    role: str
    badges: List[str] # Frontend expects this

    class Config:
        from_attributes = True

# ----------------------------------------------------------------------
# BADGE SCHEMAS
# ----------------------------------------------------------------------
class BadgeOut(BaseModel):
    id: str
    name: str
    description: str
    color: str
    points_reward: int = 0
    icon: Optional[str] = None # Or an icon identifier

    class Config:
        from_attributes = True


# ----------------------------------------------------------------------
# TEMPLATE SCHEMA (used by the /templates endpoint)
# ----------------------------------------------------------------------
class TemplateCreate(BaseModel):
    name: str
    description: str = ""
    lesson_data: dict
    questions: List[dict]
    tags: List[str] = []
    is_public: bool = False


# ----------------------------------------------------------------------
# ANY OTHER SMALL HELPERS
# ----------------------------------------------------------------------
# (If you add more endpoints later, just drop the corresponding
#  Pydantic model here.)

# ----------------------------------------------------------------------
# ASSIGNMENT SCHEMAS
# ----------------------------------------------------------------------
class AssignmentCreate(BaseModel):
    student_id: int
    parent_id: Optional[int] = None
    teacher_id: Optional[int] = None

class AssignmentUpdate(BaseModel):
    student_id: Optional[int] = None
    parent_id: Optional[int] = None
    teacher_id: Optional[int] = None

class AssignmentOut(BaseModel):
    id: int
    student_id: int
    parent_id: Optional[int] = None
    teacher_id: Optional[int] = None
    created_at: datetime
    student_name: str
    parent_name: Optional[str] = None
    teacher_name: Optional[str] = None

    class Config:
        from_attributes = True
# ----------------------------------------------------------------------
# FEEDBACK SCHEMAS
# ----------------------------------------------------------------------
class FeedbackBase(BaseModel):
    user_id: int
    lesson_id: int
    rating: int # e.g., 1-5
    comment: Optional[str] = None


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackOut(FeedbackBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

