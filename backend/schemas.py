# backend/schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
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
    email: str
    role: str
    avatar: str
    points: int
    level: str
    streak: int
    parent_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Lesson Schemas
class LessonCreate(BaseModel):
    concept_id: Optional[int] = None
    title: str
    content_html: str
    category: str = "General"
    difficulty: str = "beginner"
    estimated_time: int = 30
    points: int = 50
    grade_levels: List[str] = []
    description: str = ""
    objectives: str = ""
    prerequisites: str = ""
    tags: List[str] = []

class LessonOut(BaseModel):
    id: int
    concept_id: Optional[int]
    title: str
    content_html: str
    creator_id: Optional[int]
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
    
    class Config:
        from_attributes = True

# Game Schemas
class GameCreate(BaseModel):
    lesson_id: Optional[int] = None
    game_engine_id: Optional[int] = None
    config_json: dict

class GameOut(BaseModel):
    id: int
    lesson_id: Optional[int]
    game_engine_id: Optional[int]
    config_json: dict
    created_at: datetime
    
    class Config:
        from_attributes = True

# Quiz Schemas
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
    lesson_id: Optional[int]
    question: str
    question_type: str
    options: List[str]
    correct_answer: str
    explanation: str
    points: int
    difficulty: str
    time_limit: int
    image_url: str
    audio_url: str
    tags: List[str]
    
    class Config:
        from_attributes = True

class QuizBulkCreate(BaseModel):
    lesson_id: int
    quizzes: List[QuizCreate]

# Progress Schemas
class ProgressCreate(BaseModel):
    user_id: Optional[int] = None
    lesson_id: Optional[int] = None
    score: Optional[int] = None
    completed: bool = False

class ProgressOut(BaseModel):
    id: int
    user_id: Optional[int]
    lesson_id: Optional[int]
    score: Optional[int]
    completed: bool
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Subject Schemas
class SubjectCreate(BaseModel):
    name: str
    description: str = ""
    icon: str = "book"
    color: str = "#008080"

class SubjectOut(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    color: str
    
    class Config:
        from_attributes = True

# School/Island Schemas
class IslandOut(BaseModel):
    id: int
    name: str
    flag_emoji: str
    
    class Config:
        from_attributes = True

class SchoolCreate(BaseModel):
    name: str
    island_id: Optional[int] = None
    address: str = ""

class SchoolOut(BaseModel):
    id: int
    name: str
    island_id: Optional[int]
    address: str
    
    class Config:
        from_attributes = True

# Assignment Schemas
class AssignmentCreate(BaseModel):
    student_id: int
    parent_id: Optional[int] = None
    teacher_id: Optional[int] = None

class AssignmentOut(BaseModel):
    id: int
    student_id: int
    parent_id: Optional[int]
    teacher_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True