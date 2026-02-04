from sqlalchemy import text
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, ForeignKey, TIMESTAMP, JSON, DateTime,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(150), unique=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(150), nullable=False)
    role = Column(String(50), nullable=False)
    avatar = Column(String(150), default='default_avatar.png')
    points = Column(Integer, default=0)
    badges = Column(Text, default='')
    level = Column(Integer, default=1)
    streak = Column(Integer, default=0)
    parent_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    children = relationship("User", backref="parent", remote_side=[id])
    lessons_created = relationship("Lesson", back_populates="creator")
    progress = relationship("Progress", back_populates="user")
    media_uploaded = relationship("Media", back_populates="uploader")
    rewards_created = relationship(
        "Reward", foreign_keys="Reward.creator_id", back_populates="creator")
    rewards_received = relationship(
        "Reward", foreign_keys="Reward.for_user_id", back_populates="recipient")
    feedback_given = relationship("Feedback", back_populates="user")


class Country(Base):
    __tablename__ = "countries"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)

    # Relationships
    curriculum_subjects = relationship(
        "CurriculumSubject", back_populates="country")
    school_years = relationship("SchoolYear", back_populates="country")
    schools = relationship("School", back_populates="island")


class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)

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


class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True)
    concept_id = Column(Integer, ForeignKey('concepts.id'), nullable=True)
    title = Column(String(150), nullable=False)
    content_html = Column(Text, nullable=False)
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    # New columns
    category = Column(String(50), default='General')
    difficulty = Column(String(20), default='beginner')
    estimated_time = Column(Integer, default=30)
    points = Column(Integer, default=50)
    grade_levels_str = Column('grade_levels', Text, default='')
    description = Column(Text, default='')
    objectives = Column(Text, default='')
    prerequisites = Column(Text, default='')
    tags_str = Column('tags', Text, default='')

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
    concept = relationship("Concept", back_populates="lessons")
    creator = relationship("User", back_populates="lessons_created")
    games = relationship("Game", back_populates="lesson")
    media = relationship("Media", back_populates="lesson")
    progress = relationship("Progress", back_populates="lesson")
    quizzes = relationship("Quiz", back_populates="lesson")
    feedback_received = relationship("Feedback", back_populates="lesson")


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
    config_json = Column(JSON, nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    lesson = relationship("Lesson", back_populates="games")
    game_engine = relationship("GameEngine", back_populates="games")
    media = relationship("Media", back_populates="game")


class Media(Base):
    __tablename__ = "media"
    id = Column(Integer, primary_key=True)
    filename = Column(String(150), nullable=False)
    filetype = Column(String(50), nullable=False)
    file_category = Column(String(20), default='other')  # New field
    url = Column(String(255), nullable=False)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    game_id = Column(Integer, ForeignKey('games.id'), nullable=True)
    uploaded_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    uploaded_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')

    # Relationships
    lesson = relationship("Lesson", back_populates="media")
    game = relationship("Game", back_populates="media")
    uploader = relationship("User", back_populates="media_uploaded")


class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    score = Column(Integer, nullable=True)
    completed = Column(Boolean, default=False)
    completed_at = Column(TIMESTAMP, nullable=True)

    # Relationships
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")


class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    question = Column(Text, nullable=False)
    question_type = Column(String(20), default='mc_single')
    options_str = Column('options', Text, nullable=False)
    correct_answer = Column(String(150), nullable=False)
    # New columns
    explanation = Column(Text, default='')
    points = Column(Integer, default=10)
    difficulty = Column(String(20), default='beginner')
    time_limit = Column(Integer, default=0)
    image_url = Column(Text, default='')
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


class Reward(Base):
    __tablename__ = "rewards"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    points_required = Column(Integer, nullable=False)
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    for_user_id = Column(Integer, ForeignKey('users.id'), nullable=True)

    # Relationships
    creator = relationship(
        "User", foreign_keys=[creator_id], back_populates="rewards_created")
    recipient = relationship(
        "User", foreign_keys=[for_user_id], back_populates="rewards_received")


class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    island_id = Column(Integer, ForeignKey('countries.id'), nullable=True)
    address = Column(Text, default='')
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    island = relationship("Country", back_populates="schools")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships (optional but handy)
    student = relationship("User", foreign_keys=[student_id])
    parent = relationship("User", foreign_keys=[parent_id])
    teacher = relationship("User", foreign_keys=[teacher_id])


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=False)
    rating = Column(Integer, nullable=False) # e.g., 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    user = relationship("User", back_populates="feedback_given")
    lesson = relationship("Lesson", back_populates="feedback_received")