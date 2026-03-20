from fastapi import APIRouter
from typing import List, Optional

import schemas

router = APIRouter(
    prefix="/badges",
    tags=["badges"],
)

# Static list of badges for demonstration purposes
# In a real application, these might come from a database or configuration file
BADGES_DATA = [
    schemas.BadgeOut(
        id="first_quiz",
        name="First Quiz Conqueror",
        description="Completed your very first quiz!",
        color="#06B6D4", # Tailwind teal-500
        points_reward=10,
        icon="Trophy"
    ),
    schemas.BadgeOut(
        id="quiz_master_5",
        name="Quiz Master (5)",
        description="Completed 5 quizzes with flying colors!",
        color="#F59E0B", # Tailwind amber-500
        points_reward=50,
        icon="Star"
    ),
    schemas.BadgeOut(
        id="quiz_master_10",
        name="Quiz Master (10)",
        description="Conquered 10 quizzes – you're on a roll!",
        color="#D97706", # Tailwind orange-600
        points_reward=100,
        icon="Crown"
    ),
    schemas.BadgeOut(
        id="first_game",
        name="Game Initiator",
        description="Played your first educational game!",
        color="#8B5CF6", # Tailwind violet-500
        points_reward=10,
        icon="Gamepad2"
    ),
    schemas.BadgeOut(
        id="game_explorer_5",
        name="Game Explorer (5)",
        description="Explored 5 different games!",
        color="#10B981", # Tailwind emerald-500
        points_reward=50,
        icon="Target"
    ),
    schemas.BadgeOut(
        id="century_100",
        name="Century Scorer",
        description="Reached 100 total points!",
        color="#EC4899", # Tailwind pink-500
        points_reward=100,
        icon="Zap"
    ),
    schemas.BadgeOut(
        id="champion_500",
        name="Point Champion",
        description="Accumulated 500 total points!",
        color="#6366F1", # Tailwind indigo-500
        points_reward=250,
        icon="Award"
    ),
    schemas.BadgeOut(
        id="legend_1000",
        name="QuestLab Legend",
        description="Achieved 1000 total points – truly legendary!",
        color="#EF4444", # Tailwind red-500
        points_reward=500,
        icon="Flame"
    ),
]


@router.get("", response_model=List[schemas.BadgeOut])
async def get_all_badges():
    return BADGES_DATA
