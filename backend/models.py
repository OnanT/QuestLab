# backend/models.py
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, TIMESTAMP, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

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
    level = Column(String(50), default='Explorer')
    streak = Column(Integer, default=0)
    parent_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')
    
    children = relationship("User", backref="parent", remote_side=[id])
    lessons_created = relationship("Lesson", back_populates="creator")
    progress = relationship("Progress", back_populates="user")
    media_uploaded = relationship("Media", back_populates="uploader")
    rewards_created = relationship("Reward", foreign_keys="Reward.creator_id", back_populates="creator")
    rewards_received = relationship("Reward", foreign_keys="Reward.for_user_id", back_populates="recipient")

class Country(Base):
    __tablename__ = "countries"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    curriculum_subjects = relationship("CurriculumSubject", back_populates="country")
    school_years = relationship("SchoolYear", back_populates="country")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, default='')
    icon = Column(String(50), default='book')
    color = Column(String(20), default='#008080')
    curriculum_subjects = relationship("CurriculumSubject", back_populates="subject")

class CurriculumSubject(Base):
    __tablename__ = "curriculum_subjects"
    id = Column(Integer, primary_key=True)
    country_id = Column(Integer, ForeignKey('countries.id'), nullable=True)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=True)
    grade_level = Column(Integer, nullable=False)
    country = relationship("Country", back_populates="curriculum_subjects")
    subject = relationship("Subject", back_populates="curriculum_subjects")
    topics = relationship("Topic", back_populates="curriculum_subject")

class SchoolYear(Base):
    __tablename__ = "school_years"
    id = Column(Integer, primary_key=True)
    country_id = Column(Integer, ForeignKey('countries.id'), nullable=True)
    year_label = Column(String(150), nullable=False)
    country = relationship("Country", back_populates="school_years")
    terms = relationship("Term", back_populates="school_year")

class Term(Base):
    __tablename__ = "terms"
    id = Column(Integer, primary_key=True)
    school_year_id = Column(Integer, ForeignKey('school_years.id'), nullable=True)
    term_number = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)
    school_year = relationship("SchoolYear", back_populates="terms")
    topics = relationship("Topic", back_populates="term")

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True)
    curriculum_subject_id = Column(Integer, ForeignKey('curriculum_subjects.id'), nullable=True)
    term_id = Column(Integer, ForeignKey('terms.id'), nullable=True)
    title = Column(String(150), nullable=False)
    curriculum_subject = relationship("CurriculumSubject", back_populates="topics")
    term = relationship("Term", back_populates="topics")
    concepts = relationship("Concept", back_populates="topic")

class Concept(Base):
    __tablename__ = "concepts"
    id = Column(Integer, primary_key=True)
    topic_id = Column(Integer, ForeignKey('topics.id'), nullable=True)
    title = Column(String(150), nullable=False)
    topic = relationship("Topic", back_populates="concepts")
    lessons = relationship("Lesson", back_populates="concept")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True)
    concept_id = Column(Integer, ForeignKey('concepts.id'), nullable=True)
    title = Column(String(150), nullable=False)
    content_html = Column(Text, nullable=False)
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')
    category = Column(String(50), default='General')
    difficulty = Column(String(20), default='beginner')
    estimated_time = Column(Integer, default=30)
    points = Column(Integer, default=50)
    grade_levels = Column(Text, default='')
    description = Column(Text, default='')
    objectives = Column(Text, default='')
    prerequisites = Column(Text, default='')
    tags = Column(Text, default='')
    
    concept = relationship("Concept", back_populates="lessons")
    creator = relationship("User", back_populates="lessons_created")
    games = relationship("Game", back_populates="lesson")
    media = relationship("Media", back_populates="lesson")
    progress = relationship("Progress", back_populates="lesson")
    quizzes = relationship("Quiz", back_populates="lesson")

class GameEngine(Base):
    __tablename__ = "game_engines"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    games = relationship("Game", back_populates="game_engine")

class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    game_engine_id = Column(Integer, ForeignKey('game_engines.id'), nullable=True)
    config_json = Column(JSON, nullable=False)
    created_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')
    lesson = relationship("Lesson", back_populates="games")
    game_engine = relationship("GameEngine", back_populates="games")
    media = relationship("Media", back_populates="game")

class Media(Base):
    __tablename__ = "media"
    id = Column(Integer, primary_key=True)
    filename = Column(String(150), nullable=False)
    filetype = Column(String(50), nullable=False)
    file_category = Column(String(20), default='other')
    url = Column(String(255), nullable=False)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    game_id = Column(Integer, ForeignKey('games.id'), nullable=True)
    uploaded_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    uploaded_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')
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
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id'), nullable=True)
    question = Column(Text, nullable=False)
    question_type = Column(String(20), default='mc_single')
    options = Column(Text, nullable=False)
    correct_answer = Column(String(150), nullable=False)
    explanation = Column(Text, default='')
    points = Column(Integer, default=10)
    difficulty = Column(String(20), default='beginner')
    time_limit = Column(Integer, default=0)
    image_url = Column(Text, default='')
    audio_url = Column(Text, default='')
    tags = Column(Text, default='')
    lesson = relationship("Lesson", back_populates="quizzes")

class Reward(Base):
    __tablename__ = "rewards"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    points_required = Column(Integer, nullable=False)
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    for_user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    creator = relationship("User", foreign_keys=[creator_id], back_populates="rewards_created")
    recipient = relationship("User", foreign_keys=[for_user_id], back_populates="rewards_received")

class Island(Base):
    __tablename__ = "islands"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    flag_emoji = Column(String(10), default='🏝️')
    schools = relationship("School", back_populates="island")

class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    island_id = Column(Integer, ForeignKey('islands.id'), nullable=True)
    address = Column(Text, default='')
    island = relationship("Island", back_populates="schools")

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    parent_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    teacher_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')