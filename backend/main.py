from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

import models
from database import engine
from config import settings
from routers import (
    auth, users, lessons, subjects, games, quizzes,
    progress, media, rewards, schools, leaderboard, badges, feedback, country,
    admin, typing
)
from schemas import (
    UserCreate, UserOut, Token,
    LessonCreate, LessonOut,
    CountryCreate, CountryOut,
    SchoolCreate, SchoolOut,
    SubjectCreate, SubjectOut,
    QuizCreate, QuizOut, QuizBulkCreate,
    ProgressCreate, ProgressOut,
    RewardCreate, RewardOut,
    GameCreate, GameOut,
    TemplateCreate,
)

# Create all tables in the database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Quest Lab API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://192.168.100.189:5173",
                   "http://localhost:5173", "http://192.168.100.153:5173", "http://questlab.onan.shop", "https://questlab.onan.shop"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded media
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# Include routers with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(lessons.router, prefix="/api")
app.include_router(subjects.router, prefix="/api")
app.include_router(games.router, prefix="/api")
app.include_router(quizzes.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(media.router, prefix="/api")
app.include_router(rewards.router, prefix="/api")
app.include_router(country.router, prefix="/api")
app.include_router(schools.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
app.include_router(badges.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(typing.router, prefix="/api")



@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Quest Lab API", "status": "running", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
