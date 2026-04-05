"""
Pydantic Schemas for Request/Response Validation
Type-safe data validation and serialization
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
from uuid import UUID

# ============================================================================
# ENUMS
# ============================================================================

class UserRole(str, Enum):
    STUDENT = "student"
    PARENT = "parent"
    TEACHER = "teacher"
    ADMIN = "admin"
    GUEST = "guest"


class Difficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


# ============================================================================
# USER SCHEMAS
# ============================================================================

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    role: UserRole
    country: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[int] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    parent_id: Optional[int] = None

    @field_validator('password', mode='before')
    @classmethod
    def password_strength(cls, v):
        """Validate password strength requirements."""
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar: Optional[str] = None
    email: Optional[EmailStr] = None
    country: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[int] = None
    parent_id: Optional[int] = None

    class Config:
        orm_mode = True


class UserUpdateAdmin(UserUpdate):
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    points: Optional[int] = None
    level: Optional[int] = None


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


class UserOut(BaseModel):
    id: int
    uuid: Optional[UUID] = None
    username: str
    email: str
    display_name: Optional[str] = None
    role: str
    avatar: Optional[str] = None
    points: int = 0
    level: int = 1
    badges: List[str] = []
    streak: int = 0
    country: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[int] = None
    parent_id: Optional[int] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

    @field_validator('badges', mode='before')
    @classmethod
    def parse_badges(cls, v):
        if isinstance(v, str):
            return [b.strip() for b in v.split(',') if b.strip()]
        return v or []

    class Config:
        from_attributes = True


class UserOutWithStats(UserOut):
    total_points: int = 0
    quizzes_completed: int = 0
    games_played: int = 0
    average_score: float = 0


# ============================================================================
# AUTH SCHEMAS
# ============================================================================

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetVerify(BaseModel):
    email: EmailStr
    otp_code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=6)


# ============================================================================
# TOPICS & CONCEPTS SCHEMAS
# ============================================================================

class TopicBase(BaseModel):
    title: str
    curriculum_subject_id: Optional[int] = None
    term_id: Optional[int] = None

class TopicOut(TopicBase):
    id: int
    class Config:
        from_attributes = True

class ConceptBase(BaseModel):
    title: str
    topic_id: int

class ConceptCreate(ConceptBase):
    pass

class ConceptOut(ConceptBase):
    id: int
    class Config:
        from_attributes = True

# ============================================================================
# LESSON SCHEMAS
# ============================================================================

class LessonBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    content_html: str
    category: str = "General"
    difficulty: Difficulty = Difficulty.BEGINNER
    estimated_time: int = 30
    points: int = 50
    points_possible: int = 100
    description: str = ""
    objectives: str = ""
    prerequisites: str = ""
    tags: List[str] = [] # Changed from str to List[str]


class LessonCreate(LessonBase):
    concept_id: Optional[int] = None
    grade_levels: List[str] = [] # Added


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    content_html: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    estimated_time: Optional[int] = None
    points: Optional[int] = None
    description: Optional[str] = None
    objectives: Optional[str] = None
    prerequisites: Optional[str] = None
    tags: Optional[List[str]] = None
    grade_levels: Optional[List[str]] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None


class LessonOut(LessonBase):
    id: int
    uuid: Optional[UUID] = None
    creator_id: Optional[int] = None
    is_published: bool = True
    is_featured: bool = False
    view_count: Optional[int] = 0
    completion_count: Optional[int] = 0
    created_at: Optional[datetime] = None
    grade_levels: List[str] = []

    @field_validator('tags', 'grade_levels', mode='before')
    @classmethod
    def parse_comma_strings(cls, v):
        if isinstance(v, str):
            return [item.strip() for item in v.split(',') if item.strip()]
        return v or []

    class Config:
        from_attributes = True


class LessonOutEnhanced(BaseModel):
    id: int
    uuid: Optional[UUID] = None
    concept_id: Optional[int] = None
    title: str
    content_html: str
    creator_id: Optional[int] = None
    created_at: Optional[datetime] = None
    category: str
    difficulty: str
    estimated_time: int
    points: int
    grade_levels: List[str] = []
    description: str
    objectives: str
    prerequisites: str
    tags: List[str] = []
    is_published: bool = True
    is_featured: bool = False
    view_count: Optional[int] = 0
    completion_count: Optional[int] = 0
    subject_name: Optional[str] = None

    @field_validator('tags', 'grade_levels', mode='before')
    @classmethod
    def parse_comma_strings(cls, v):
        if isinstance(v, str):
            return [item.strip() for item in v.split(',') if item.strip()]
        return v or []

    class Config:
        from_attributes = True

# ============================================================================
# QUIZ SCHEMAS
# ============================================================================


class QuizBase(BaseModel):
    question: str
    question_type: str = "mc_single"
    options: List[str] # Changed from str to List[str]
    correct_answer: str
    explanation: str = ""
    points: int = 10
    difficulty: Difficulty = Difficulty.BEGINNER
    time_limit: int = 0
    image_url: str = ""
    audio_url: str = ""
    tags: List[str] = []


class QuizCreate(QuizBase):
    lesson_id: Optional[int] = None


class QuizBulkCreate(BaseModel):
    lesson_id: Optional[int] = None
    quizzes: List[QuizBase]


class QuizOut(QuizBase):
    id: int
    lesson_id: Optional[int] = None

    class Config:
        orm_mode = True
        from_attributes = True


class QuizUpdate(BaseModel):
    lesson_id: Optional[int] = None
    question: Optional[str] = None
    question_type: Optional[str] = None
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    points: Optional[int] = None
    difficulty: Optional[Difficulty] = None
    time_limit: Optional[int] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    tags: Optional[List[str]] = None


class QuizOutEnhanced(BaseModel):
    id: int
    lesson_id: Optional[int] = None
    title: str
    question: str
    question_type: str
    options: List[str] # Changed from str to List[str]
    correct_answer: str
    explanation: Optional[str] = ""
    points: int
    difficulty: str
    time_limit: Optional[int] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    tags: List[str] = [] # Changed from Optional[str] to List[str]
    subject_id: Optional[int] = None
    subject_name: Optional[str] = "Uncategorized"
    total_points: int
    pass_score: int = 70

    class Config:
        from_attributes = True


class QuizSubmission(BaseModel):
    answers: dict


class QuizResult(BaseModel):
    score: float
    points_earned: int
    passed: bool
    correct: int
    total: int
    results: List[dict]


# ============================================================================
# PROGRESS SCHEMAS
# ============================================================================

class ProgressCreate(BaseModel):
    lesson_id: int
    score: Optional[int] = None
    completed: bool = False
    total_time_spent_seconds: int = 0


class ProgressOut(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    score: Optional[int]
    completed: bool
    completed_at: Optional[datetime]
    total_time_spent_seconds: int

    class Config:
        orm_mode = True
        from_attributes = True


class ProgressOutEnhanced(ProgressOut):
    lesson_title: Optional[str] = None


# ============================================================================
# REWARD SCHEMAS
# ============================================================================

class RewardCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    points_required: int = Field(..., gt=0)
    for_user_id: Optional[int] = None


class RewardOut(BaseModel):
    id: int
    name: str
    points_required: int
    creator_id: Optional[int]
    for_user_id: Optional[int]

    class Config:
        orm_mode = True
        from_attributes = True


# ============================================================================
# SUBJECT SCHEMAS
# ============================================================================

class SubjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class SubjectOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
        from_attributes = True


class SubjectOutEnhanced(BaseModel):
    id: int
    name: str
    color: str
    icon: str

    class Config:
        from_attributes = True


# ============================================================================
# COUNTRY/ISLAND SCHEMAS
# ============================================================================

class CountryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class CountryOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
        from_attributes = True


# ============================================================================
# SCHOOL SCHEMAS
# ============================================================================

class SchoolCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    island_id: Optional[int] = None
    address: Optional[str] = None


class SchoolOut(BaseModel):
    id: int
    name: str
    island_id: Optional[int]
    address: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


# ============================================================================
# GAME SCHEMAS
# ============================================================================

class GameCreate(BaseModel):
    lesson_id: int
    game_engine_id: int
    config_json: dict


class GameUpdate(BaseModel):
    lesson_id: Optional[int] = None
    game_engine_id: Optional[int] = None
    config_json: Optional[dict] = None


class GameOut(BaseModel):
    id: int
    lesson_id: int
    game_engine_id: int
    game_type: Optional[str] = None
    title: Optional[str] = None
    points: Optional[int] = 10
    difficulty: Optional[str] = "medium"
    subject_name: Optional[str] = None
    config_json: dict
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class GameSubmission(BaseModel):
    game_id: int
    score: int
    time_taken: int
    data: Optional[dict] = None


class GameResult(BaseModel):
    game_id: int
    score: int
    points_earned: int
    new_total_points: int


# ============================================================================
# TEMPLATE SCHEMAS (for content creation)
# ============================================================================

class TemplateCreate(BaseModel):
    name: str
    template_type: str
    content: dict


# ============================================================================
# ASSIGNMENT SCHEMAS
# ============================================================================

class AssignmentCreate(BaseModel):
    student_id: int
    parent_id: Optional[int] = None
    teacher_id: Optional[int] = None


class AssignmentOut(BaseModel):
    id: int
    student_id: int
    parent_id: Optional[int]
    teacher_id: Optional[int]
    student_name: Optional[str] = None
    parent_name: Optional[str] = None
    teacher_name: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


# ============================================================================
# FEEDBACK SCHEMAS
# ============================================================================

class FeedbackCreate(BaseModel):
    lesson_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class FeedbackOut(BaseModel):
    id: int
    user_id: int
    lesson_id: Optional[int]
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True


# ============================================================================
# BADGE SCHEMAS
# ============================================================================

class BadgeOut(BaseModel):
    id: str
    name: str
    description: str
    color: str
    points_reward: int
    icon: str


# ============================================================================
# LEADERBOARD SCHEMAS
# ============================================================================

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    display_name: str
    points: int
    level: str # or int
    avatar: str
    role: str
    badges: List[str]

    @field_validator('badges', mode='before')
    @classmethod
    def parse_badges(cls, v):
        if isinstance(v, str):
            return [b.strip() for b in v.split(',') if b.strip()]
        return v or []
