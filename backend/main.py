from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

import models
from database import engine
from config import settings
from routers import (
    auth, users, lessons, subjects, games, quizzes,
    progress, media, rewards, islands, schools, leaderboard, badges, feedback,
)
from schemas import (
    UserCreate, UserOut, Token,
    LessonCreate, LessonOutEnhanced,
    CountryCreate, CountryOut,
    SchoolCreate, SchoolOut,
    SubjectCreate, SubjectOutEnhanced,
    QuizCreate, QuizOut, QuizBulkCreate,
    ProgressCreate, ProgressOut,
    RewardCreate, RewardOut,
    GameCreate, GameOut,
    TemplateCreate,
)
# Import admin routers
from routers.admin import router as admin_router

# Create all tables in the database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Quest Lab API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://192.168.100.189:5173",
                   "http://localhost:5173", "http://192.168.100.153:5173", "http://questlab.onan.shop", "http://200.50.85.80", "https://questlab.onan.shop"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded media
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(lessons.router)
app.include_router(subjects.router)
app.include_router(games.router)
app.include_router(quizzes.router)
app.include_router(progress.router)
app.include_router(media.router)
app.include_router(rewards.router)
app.include_router(islands.router)
app.include_router(schools.router)
app.include_router(leaderboard.router)
app.include_router(badges.router)
app.include_router(feedback.router)

# Include the master admin router (which includes all admin sub-routers)
app.include_router(admin_router)

@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Quest Lab API", "status": "running", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}