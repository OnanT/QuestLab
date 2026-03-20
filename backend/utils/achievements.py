from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import logging

logger = logging.getLogger(__name__)

def get_level_from_points(points: int) -> int:
    """Calculate user level based on total points.
    Each level requires 100 points.
    Level 1: 0-99 points
    Level 2: 100-199 points
    etc.
    """
    return (points // 100) + 1

def check_user_achievements(db: Session, user: models.User):
    """Check and award badges based on user progress and points."""
    # Ensure badges is a string
    current_badges = user.badges.split(',') if user.badges else []
    current_badges = [b.strip() for b in current_badges if b.strip()]
    
    new_badges = []
    
    # 1. Check points-based badges
    total_points = user.points or 0
    
    if total_points >= 100 and "century_100" not in current_badges:
        new_badges.append("century_100")
    if total_points >= 500 and "champion_500" not in current_badges:
        new_badges.append("champion_500")
    if total_points >= 1000 and "legend_1000" not in current_badges:
        new_badges.append("legend_1000")
        
    # 2. Check quiz-based badges
    # We need to count unique completed quizzes/lessons from progress
    # But Progress model doesn't explicitly distinguish between quiz and game
    # However, we can count progress records where completed=True
    # For a more accurate count, we might need to look at specific tables
    
    # Let's count how many distinct lessons have been completed
    completed_count = db.query(models.Progress).filter(
        models.Progress.user_id == user.id,
        models.Progress.completed == True
    ).count()
    
    if completed_count >= 1 and "first_quiz" not in current_badges:
        # This is a bit broad, but works as a "First Completion" badge
        new_badges.append("first_quiz")
    if completed_count >= 5 and "quiz_master_5" not in current_badges:
        new_badges.append("quiz_master_5")
    if completed_count >= 10 and "quiz_master_10" not in current_badges:
        new_badges.append("quiz_master_10")
        
    # 3. Check game-based badges
    # Same here, for now we use the same completion count or total points
    # In a more advanced system, we'd track GameSubmission specifically
    
    # Update level
    new_level = get_level_from_points(total_points)
    if new_level != user.level:
        user.level = new_level
        logger.info(f"User {user.username} leveled up to {new_level}!")
    
    # Add new badges
    if new_badges:
        updated_badges = current_badges + new_badges
        user.badges = ",".join(updated_badges)
        logger.info(f"User {user.username} earned badges: {new_badges}")
        
    return new_badges, new_level
