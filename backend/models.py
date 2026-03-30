from sqlalchemy import (
    Column, Integer, String, Boolean, Text, ForeignKey,
    DateTime, Numeric, CheckConstraint, Index, TIMESTAMP, JSON, text
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid


# ============================================================================
# ANALYTICS & SESSIONS
# ============================================================================

class LessonTimeLog(Base):
    __tablename__ = "lesson_time_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey('lessons.id', ondelete="CASCADE"), nullable=False)
    session_start = Column(DateTime, server_default=func.now())
    duration_seconds = Column(Integer, default=0)

    # Relationships
    user = relationship("User")
    lesson = relationship("Lesson")


class UserAnalytics(Base):
    __tablename__ = "user_analytics"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, server_default=func.now())
    lessons_started = Column(Integer, default=0)
    lessons_completed = Column(Integer, default=0)
    total_time_minutes = Column(Numeric(10, 2), default=0)
    points_earned = Column(Integer, default=0)
    feedback_given = Column(Integer, default=0)

    # Relationships
    user = relationship("User")


class PopularityMetrics(Base):
    __tablename__ = "popularity_metrics"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id', ondelete="CASCADE"), nullable=False)
    views_7d = Column(Integer, default=0)
    completions_7d = Column(Integer, default=0)
    views_30d = Column(Integer, default=0)
    completions_30d = Column(Integer, default=0)
    views_total = Column(Integer, default=0)
    completions_total = Column(Integer, default=0)
    popularity_score = Column(Numeric(10, 2), default=0)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    lesson = relationship("Lesson")


class RealTimeSession(Base):
    __tablename__ = "real_time_sessions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    session_id = Column(String(255), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    last_heartbeat = Column(DateTime, server_default=func.now())
    connected_at = Column(DateTime, server_default=func.now())
    disconnected_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User")


# ============================================================================
# ORGANIZATIONS (Multi-tenancy)
# ============================================================================

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(UUID(as_uuid=True), unique=True,
                  nullable=False, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    organization_type = Column(String(50), default='school')
    contact_email = Column(String(150))
    contact_phone = Column(String(50))
    address = Column(Text)
    max_users = Column(Integer, default=1000)
    max_storage_mb = Column(Integer, default=5000)
    primary_color = Column(String(7), default='#3B82F6')
    logo_url = Column(String(255))
    is_active = Column(Boolean, default=True)
    settings = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    users = relationship("User", back_populates="organization")
    lessons = relationship("Lesson", back_populates="organization")
    schools = relationship("School", back_populates="organization")
    usage_stats = relationship("OrganizationUsageStats", back_populates="organization")


class OrganizationUsageStats(Base):
    __tablename__ = "organization_usage_stats"
    id = Column(Integer, primary_key=True)
    organization_id = Column(Integer, ForeignKey(
        'organizations.id'), nullable=False)
    total_users = Column(Integer, default=0)
    active_users_30d = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    total_storage_mb = Column(Numeric(10, 2), default=0)
    total_api_calls = Column(Integer, default=0)
    date = Column(DateTime, server_default=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="usage_stats")


# ============================================================================
# USERS
# ============================================================================

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True,
                  nullable=False, default=uuid.uuid4)
    organization_id = Column(Integer, ForeignKey(
        'organizations.id'), nullable=False)
    username = Column(String(150), unique=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)  # FIXED: 255 chars
    display_name = Column(String(150))  # NEW: Added from schemas/questlab_full
    role = Column(String(50), nullable=False)
    avatar = Column(String(150), default='default_avatar.png')
    points = Column(Integer, default=0)
    badges = Column(Text, default='')
    level = Column(Integer, default=1)  # FIXED: Integer not String
    streak = Column(Integer, default=0)
    country = Column(String(150))
    school = Column(String(255))
    grade = Column(Integer)
    marketing_opt_in = Column(Boolean, default=False)
    parent_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    last_login = Column(DateTime)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, onupdate=text("CURRENT_TIMESTAMP"))

    # Relationships
    organization = relationship("Organization", back_populates="users")
    children = relationship("User", backref="parent", remote_side=[id])
    lessons_created = relationship("Lesson", back_populates="creator")
    progress = relationship("Progress", back_populates="user")
    media_uploaded = relationship("Media", back_populates="uploader")
    rewards_created = relationship(
        "Reward", foreign_keys="Reward.creator_id", back_populates="creator")
    rewards_received = relationship(
        "Reward", foreign_keys="Reward.for_user_id", back_populates="recipient")
    feedback_given = relationship("Feedback", back_populates="user")
    assignments_as_student = relationship(
        "Assignment", foreign_keys="Assignment.student_id", back_populates="student")
    assignments_as_parent = relationship(
        "Assignment", foreign_keys="Assignment.parent_id", back_populates="parent")
    assignments_as_teacher = relationship(
        "Assignment", foreign_keys="Assignment.teacher_id", back_populates="teacher")


# ============================================================================
# COUNTRIES
# ============================================================================

class Country(Base):
    __tablename__ = "countries"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)

    # Relationships
    curriculum_subjects = relationship(
        "CurriculumSubject", back_populates="country")
    school_years = relationship("SchoolYear", back_populates="country")
    schools = relationship("School", back_populates="island")
    cultural_practices = relationship(
        "CulturalPractice", back_populates="country")
    geographical_features = relationship(
        "GeographicalFeature", back_populates="country")
    historical_figures = relationship(
        "HistoricalFigure", back_populates="country")

# ============================================================================
# SCHOOL YEARS & TERMS
# ============================================================================


class SchoolYear(Base):
    __tablename__ = "school_years"
    id = Column(Integer, primary_key=True)
    country_id = Column(Integer, ForeignKey('countries.id'), nullable=True)
    year_label = Column(String(150), nullable=False)

    # Relationships
    country = relationship("Country", back_populates="school_years")
    terms = relationship("Term", back_populates="school_year")


class Term(Base):
    __tablename__ = "terms"
    id = Column(Integer, primary_key=True)
    school_year_id = Column(Integer, ForeignKey(
        'school_years.id'), nullable=True)
    term_number = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)

    # Relationships
    school_year = relationship("SchoolYear", back_populates="terms")
    topics = relationship("Topic", back_populates="term")


# ============================================================================
# SCHOOLS
# ============================================================================

class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey(
        "organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    island_id = Column(Integer, ForeignKey("countries.id"))
    address = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="schools")
    island = relationship("Country", back_populates="schools")


# ============================================================================
# SUBJECTS & CURRICULUM
# ============================================================================

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)

    # Relationships
    curriculum_subjects = relationship(
        "CurriculumSubject", back_populates="subject")


class CurriculumSubject(Base):
    __tablename__ = "curriculum_subjects"
    id = Column(Integer, primary_key=True)
    country_id = Column(Integer, ForeignKey('countries.id'), nullable=True)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=True)
    grade_level = Column(Integer, nullable=False)

    # Relationships
    country = relationship("Country", back_populates="curriculum_subjects")
    subject = relationship("Subject", back_populates="curriculum_subjects")
    topics = relationship("Topic", back_populates="curriculum_subject")


# ============================================================================
# TOPICS & CONCEPTS
# ============================================================================

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True)
    curriculum_subject_id = Column(Integer, ForeignKey(
        'curriculum_subjects.id'), nullable=True)
    term_id = Column(Integer, ForeignKey('terms.id'), nullable=True)
    title = Column(String(150), nullable=False)

    # Relationships
    curriculum_subject = relationship(
        "CurriculumSubject", back_populates="topics")
    term = relationship("Term", back_populates="topics")
    concepts = relationship("Concept", back_populates="topic")


class Concept(Base):
    __tablename__ = "concepts"
    id = Column(Integer, primary_key=True)
    topic_id = Column(Integer, ForeignKey('topics.id'), nullable=True)
    title = Column(String(150), nullable=False)

    # Relationships
    topic = relationship("Topic", back_populates="concepts")
    lessons = relationship("Lesson", back_populates="concept")


# ============================================================================
# LESSONS
# ============================================================================

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True,
                  nullable=False, default=uuid.uuid4)
    organization_id = Column(Integer, ForeignKey(
        'organizations.id'), nullable=False)
    concept_id = Column(Integer, ForeignKey('concepts.id'), nullable=True)
    title = Column(String(150), nullable=False)
    content_html = Column(Text, nullable=False)
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    version_number = Column(Integer, default=1)
    is_published = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, onupdate=text("CURRENT_TIMESTAMP"))
    published_at = Column(DateTime)

    # Existing columns
    category = Column(String(50), default='General')
    difficulty = Column(String(20), default='beginner')
    estimated_time = Column(Integer, default=30)
    points = Column(Integer, default=50)
    points_possible = Column(Integer, default=100)
    grade_levels_str = Column('grade_levels', Text, default='')
    description = Column(Text, default='')
    objectives = Column(Text, default='')
    prerequisites = Column(Text, default='')
    tags_str = Column('tags', Text, default='')

    # Analytics columns
    view_count = Column(Integer, default=0)
    completion_count = Column(Integer, default=0)

    @property
    def grade_levels(self) -> list[str]:
        if self.grade_levels_str:
            return [gl.strip() for gl in self.grade_levels_str.split(',') if gl.strip()]
        return []

    @grade_levels.setter
    def grade_levels(self, grade_levels_list: list[str]):
        self.grade_levels_str = ','.join(grade_levels_list)

    @property
    def tags(self) -> list[str]:
        if self.tags_str:
            return [tag.strip() for tag in self.tags_str.split(',') if tag.strip()]
        return []

    @tags.setter
    def tags(self, tags_list: list[str]):
        self.tags_str = ','.join(tags_list)

    # Relationships
    organization = relationship("Organization", back_populates="lessons")
    concept = relationship("Concept", back_populates="lessons")
    creator = relationship("User", back_populates="lessons_created")
    games = relationship("Game", back_populates="lesson")
    media = relationship("Media", back_populates="lesson")
    progress = relationship("Progress", back_populates="lesson")
    quizzes = relationship("Quiz", back_populates="lesson")
    feedback_received = relationship("Feedback", back_populates="lesson")
    analytics = relationship("LessonAnalytics", back_populates="lesson")


class LessonAnalytics(Base):
    __tablename__ = "lesson_analytics"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=False)
    date = Column(DateTime, server_default=func.now())
    views = Column(Integer, default=0)
    completions = Column(Integer, default=0)
    avg_score = Column(Numeric(5, 2))
    avg_time_spent_seconds = Column(Integer, default=0)

    # Relationships
    lesson = relationship("Lesson", back_populates="analytics")

# ============================================================================
# GAME ENGINES & GAMES
# ============================================================================


class GameEngine(Base):
    __tablename__ = "game_engines"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)

    # Relationships
    games = relationship("Game", back_populates="game_engine")


class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    game_engine_id = Column(Integer, ForeignKey(
        'game_engines.id'), nullable=True)
    config_json = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    lesson = relationship("Lesson", back_populates="games")
    game_engine = relationship("GameEngine", back_populates="games")
    media = relationship("Media", back_populates="game")


# ============================================================================
# MEDIA
# ============================================================================

class Media(Base):
    __tablename__ = "media"
    id = Column(Integer, primary_key=True)
    filename = Column(String(150), nullable=False)
    filetype = Column(String(50), nullable=False)
    file_category = Column(String(20), default='other')
    file_size_bytes = Column(Integer, default=0)
    url = Column(String(255), nullable=False)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    game_id = Column(Integer, ForeignKey('games.id'), nullable=True)
    uploaded_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    uploaded_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')

    @property
    def file_size_mb(self) -> float:
        return self.file_size_bytes / (1024 * 1024) if self.file_size_bytes else 0

    # Relationships
    lesson = relationship("Lesson", back_populates="media")
    game = relationship("Game", back_populates="media")
    uploader = relationship("User", back_populates="media_uploaded")


# ============================================================================
# QUIZZES
# ============================================================================

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    question = Column(Text, nullable=False)
    question_type = Column(String(20), default='mc_single')
    options_str = Column('options', Text, nullable=False)
    correct_answer = Column(String(150), nullable=False)
    explanation = Column(Text, default='')
    points = Column(Integer, default=10)
    difficulty = Column(String(20), default='beginner')
    time_limit = Column(Integer, default=0)
    image_url = Column(Text, default='')
    audio_url = Column(Text, default='')
    tags_str = Column('tags', Text, default='')

    @property
    def options(self) -> list[str]:
        if self.options_str:
            return [opt.strip() for opt in self.options_str.split(',') if opt.strip()]
        return []

    @options.setter
    def options(self, options_list: list[str]):
        self.options_str = ','.join(options_list)

    @property
    def tags(self) -> list[str]:
        if self.tags_str:
            return [tag.strip() for tag in self.tags_str.split(',') if tag.strip()]
        return []

    @tags.setter
    def tags(self, tags_list: list[str]):
        self.tags_str = ','.join(tags_list)

    # Relationships
    lesson = relationship("Lesson", back_populates="quizzes")


# ============================================================================
# PROGRESS
# ============================================================================

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    score = Column(Integer, nullable=True)
    completed = Column(Boolean, default=False)
    completed_at = Column(TIMESTAMP, nullable=True)
    total_time_spent_seconds = Column(Integer, default=0)

    @property
    def time_spent_minutes(self) -> int:
        return self.total_time_spent_seconds // 60 if self.total_time_spent_seconds else 0

    # Relationships
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")


# ============================================================================
# REWARDS
# ============================================================================

class Reward(Base):
    __tablename__ = "rewards"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    points_required = Column(Integer, nullable=False)
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    for_user_id = Column(Integer, ForeignKey('users.id'), nullable=True)

    # Relationships
    creator = relationship("User", foreign_keys=[
                           creator_id], back_populates="rewards_created")
    recipient = relationship("User", foreign_keys=[
                             for_user_id], back_populates="rewards_received")


# ============================================================================
# FEEDBACK
# ============================================================================

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey(
        "lessons.id", ondelete="CASCADE"), nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='valid_rating'),
        Index('idx_feedback_lesson', 'lesson_id'),
        Index('idx_feedback_user', 'user_id'),
    )

    # Relationships
    user = relationship("User", back_populates="feedback_given")
    lesson = relationship("Lesson", back_populates="feedback_received")


class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(Integer, ForeignKey(
        "users.id", ondelete="SET NULL"), nullable=True)
    teacher_id = Column(Integer, ForeignKey(
        "users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("User", foreign_keys=[
                           student_id], back_populates="assignments_as_student")
    parent = relationship("User", foreign_keys=[
                          parent_id], back_populates="assignments_as_parent")
    teacher = relationship("User", foreign_keys=[
                           teacher_id], back_populates="assignments_as_teacher")


class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    otp_code = Column(String(6), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    user = relationship("User")


# ======================================================================
# CARIBBEAN CULTURAL MODELS (NEW)
# ======================================================================
class CulturalPractice(Base):
    __tablename__ = "cultural_practices"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    practice_type = Column(String(100))
    country_id = Column(Integer, ForeignKey('countries.id'))
    description = Column(Text)
    historical_context = Column(Text)
    contemporary_practice = Column(Text)
    tags = Column(Text)

    # Relationships
    country = relationship("Country", back_populates="cultural_practices")


class GeographicalFeature(Base):
    __tablename__ = "geographical_features"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    feature_type = Column(String(100))
    country_id = Column(Integer, ForeignKey('countries.id'))
    latitude = Column(Numeric(10, 7))
    longitude = Column(Numeric(10, 7))
    elevation_meters = Column(Integer)
    description = Column(Text)
    scientific_significance = Column(Text)

    # Relationships
    country = relationship("Country", back_populates="geographical_features")


class HistoricalFigure(Base):
    __tablename__ = "historical_figures"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    birth_year = Column(Integer)
    death_year = Column(Integer)
    country_id = Column(Integer, ForeignKey('countries.id'))
    contribution = Column(Text)
    legacy = Column(Text)

    # Relationships
    country = relationship("Country", back_populates="historical_figures")
