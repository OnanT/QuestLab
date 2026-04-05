# tasks.py
# Celery background tasks for Quest Lab
# Analytics aggregation, session cleanup, popularity updates

from celery import Celery
from celery.schedules import crontab
from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session
import os
import logging

from database import SessionLocal
from models import (
    Lesson, User, Progress, LessonTimeLog, Feedback,
    LessonAnalytics, UserAnalytics, PopularityMetrics,
    RealTimeSession, Organization, OrganizationUsageStats,
    Media
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Celery
celery_app = Celery(
    'questlab',
    broker=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour max
    worker_prefetch_multiplier=4,
    worker_max_tasks_per_child=1000,
)


# ============================================================================
# COMMUNICATION TASKS
# ============================================================================

@celery_app.task(
    name='tasks.send_welcome_email',
    bind=True,
    autoretry_for=(Exception,),
    max_retries=3,
    retry_backoff=True
)
def send_welcome_email(self, email: str, username: str, role: str, user_id: int):
    """
    Send a welcome email to a newly registered user
    """
    import asyncio
    from utils.email_service import send_welcome_email as send_email_func
    
    logger.info(f"Attempting to send welcome email to {email} (User: {username}, Role: {role}). Attempt {self.request.retries + 1}")
    
    # Celery tasks are sync by default, but our service is async
    try:
        loop = asyncio.get_event_loop()
        success = loop.run_until_complete(send_email_func(email, username, role, user_id))
        
        if not success:
            logger.warning(f"Email service returned failure for {email}. Retrying...")
            raise Exception("Email service failure")
            
        return {"status": "success", "email": email}
    except Exception as e:
        logger.error(f"Error in send_welcome_email task: {str(e)}")
        raise e



@celery_app.task(
    name='tasks.send_otp_email',
    bind=True,
    autoretry_for=(Exception,),
    max_retries=3,
    retry_backoff=True
)
def send_otp_email(self, email: str, otp_code: str):
    """
    Send an OTP email for password reset using HTML template.
    """
    import asyncio
    from utils.email_service import send_password_reset_email
    
    logger.info(f"Attempting to send OTP email to {email}. Attempt {self.request.retries + 1}")
    
    try:
        loop = asyncio.get_event_loop()
        success = loop.run_until_complete(send_password_reset_email(email, otp_code))
        
        if not success:
            logger.warning(f"OTP email service returned failure for {email}. Retrying...")
            raise Exception("Email service failure")
            
        return {"status": "success", "email": email}
    except Exception as e:
        logger.error(f"Error in send_otp_email task: {str(e)}")
        raise e


@celery_app.task(
    name='tasks.send_feedback_email',
    bind=True,
    autoretry_for=(Exception,),
    max_retries=3,
    retry_backoff=True
)
def send_feedback_email(
    self,
    recipient_email: str,
    username: str,
    role: str,
    rating: int,
    comment: str,
    feedback_type: str,
    lesson_title: str = None
):
    """
    Send a notification email when new feedback is submitted.
    """
    import asyncio
    from utils.email_service import send_feedback_notification
    
    logger.info(f"Attempting to send feedback notification to {recipient_email}. Attempt {self.request.retries + 1}")
    
    try:
        loop = asyncio.get_event_loop()
        success = loop.run_until_complete(
            send_feedback_notification(
                recipient_email, username, role, rating, comment, feedback_type, lesson_title
            )
        )
        
        if not success:
            logger.warning(f"Feedback email service returned failure for {recipient_email}. Retrying...")
            raise Exception("Email service failure")
            
        return {"status": "success", "email": recipient_email}
    except Exception as e:
        logger.error(f"Error in send_feedback_email task: {str(e)}")
        raise e


# ============================================================================
# ANALYTICS TASKS
# ============================================================================
...

@celery_app.task(name='tasks.aggregate_lesson_analytics')
def aggregate_lesson_analytics(date_str: str = None):
    """
    Aggregate daily analytics for all lessons
    Called daily at 1 AM via celery beat
    """
    db = SessionLocal()
    try:
        # Use provided date or yesterday
        if date_str:
            target_date = datetime.fromisoformat(date_str).date()
        else:
            target_date = (datetime.utcnow() - timedelta(days=1)).date()
        
        lessons = db.query(Lesson).filter(Lesson.is_published == True).all()
        aggregated = 0
        
        for lesson in lessons:
            # Count views (time logs)
            views = db.query(LessonTimeLog).filter(
                func.date(LessonTimeLog.session_start) == target_date,
                LessonTimeLog.lesson_id == lesson.id
            ).count()
            
            # Count unique users
            unique_users = db.query(
                func.count(func.distinct(LessonTimeLog.user_id))
            ).filter(
                func.date(LessonTimeLog.session_start) == target_date,
                LessonTimeLog.lesson_id == lesson.id
            ).scalar() or 0
            
            # Count completions
            completions = db.query(Progress).filter(
                func.date(Progress.completed_at) == target_date,
                Progress.lesson_id == lesson.id,
                Progress.completed == True
            ).count()
            
            # Average score
            avg_score = db.query(func.avg(Progress.score)).filter(
                func.date(Progress.completed_at) == target_date,
                Progress.lesson_id == lesson.id,
                Progress.completed == True,
                Progress.score.isnot(None)
            ).scalar() or 0.0
            
            # Average time (in minutes)
            avg_time_seconds = db.query(
                func.avg(LessonTimeLog.duration_seconds)
            ).filter(
                func.date(LessonTimeLog.session_start) == target_date,
                LessonTimeLog.lesson_id == lesson.id,
                LessonTimeLog.duration_seconds.isnot(None)
            ).scalar() or 0
            avg_time_minutes = avg_time_seconds / 60 if avg_time_seconds else 0.0
            
            # Average rating
            avg_rating = db.query(func.avg(Feedback.rating)).filter(
                func.date(Feedback.created_at) == target_date,
                Feedback.lesson_id == lesson.id
            ).scalar() or 0.0
            
            # Feedback count
            feedback_count = db.query(Feedback).filter(
                func.date(Feedback.created_at) == target_date,
                Feedback.lesson_id == lesson.id
            ).count()
            
            # Create or update analytics record
            analytics = db.query(LessonAnalytics).filter(
                LessonAnalytics.lesson_id == lesson.id,
                func.date(LessonAnalytics.date) == target_date
            ).first()
            
            if analytics:
                analytics.views = views
                analytics.unique_users = unique_users
                analytics.completions = completions
                analytics.average_score = float(avg_score)
                analytics.average_time_minutes = float(avg_time_minutes)
                analytics.average_rating = float(avg_rating)
                analytics.feedback_count = feedback_count
            else:
                analytics = LessonAnalytics(
                    lesson_id=lesson.id,
                    date=datetime.combine(target_date, datetime.min.time()),
                    views=views,
                    unique_users=unique_users,
                    completions=completions,
                    average_score=float(avg_score),
                    average_time_minutes=float(avg_time_minutes),
                    average_rating=float(avg_rating),
                    feedback_count=feedback_count
                )
                db.add(analytics)
            
            aggregated += 1
        
        db.commit()
        return {
            'date': target_date.isoformat(),
            'lessons_processed': aggregated,
            'status': 'success'
        }
        
    except Exception as e:
        db.rollback()
        return {
            'status': 'error',
            'error': str(e)
        }
    finally:
        db.close()


@celery_app.task(name='tasks.aggregate_user_analytics')
def aggregate_user_analytics(date_str: str = None):
    """Aggregate daily analytics for all users"""
    db = SessionLocal()
    try:
        if date_str:
            target_date = datetime.fromisoformat(date_str).date()
        else:
            target_date = (datetime.utcnow() - timedelta(days=1)).date()
        
        users = db.query(User).filter(User.is_active == True).all()
        aggregated = 0
        
        for user in users:
            # Lessons started (new progress records)
            lessons_started = db.query(Progress).filter(
                func.date(Progress.completed_at) == target_date,
                Progress.user_id == user.id
            ).count()
            
            # Lessons completed
            lessons_completed = db.query(Progress).filter(
                func.date(Progress.completed_at) == target_date,
                Progress.user_id == user.id,
                Progress.completed == True
            ).count()
            
            # Total time spent
            total_time_seconds = db.query(
                func.sum(LessonTimeLog.duration_seconds)
            ).filter(
                func.date(LessonTimeLog.session_start) == target_date,
                LessonTimeLog.user_id == user.id,
                LessonTimeLog.duration_seconds.isnot(None)
            ).scalar() or 0
            total_time_minutes = total_time_seconds / 60
            
            # Points earned (from completed lessons)
            points_earned = db.query(
                func.sum(Lesson.points)
            ).join(
                Progress, Progress.lesson_id == Lesson.id
            ).filter(
                func.date(Progress.completed_at) == target_date,
                Progress.user_id == user.id,
                Progress.completed == True
            ).scalar() or 0
            
            # Feedback given
            feedback_given = db.query(Feedback).filter(
                func.date(Feedback.created_at) == target_date,
                Feedback.user_id == user.id
            ).count()
            
            # Create or update analytics
            analytics = db.query(UserAnalytics).filter(
                UserAnalytics.user_id == user.id,
                func.date(UserAnalytics.date) == target_date
            ).first()
            
            if analytics:
                analytics.lessons_started = lessons_started
                analytics.lessons_completed = lessons_completed
                analytics.total_time_minutes = float(total_time_minutes)
                analytics.points_earned = int(points_earned)
                analytics.feedback_given = feedback_given
            else:
                analytics = UserAnalytics(
                    user_id=user.id,
                    date=datetime.combine(target_date, datetime.min.time()),
                    lessons_started=lessons_started,
                    lessons_completed=lessons_completed,
                    total_time_minutes=float(total_time_minutes),
                    points_earned=int(points_earned),
                    feedback_given=feedback_given
                )
                db.add(analytics)
            
            aggregated += 1
        
        db.commit()
        return {
            'date': target_date.isoformat(),
            'users_processed': aggregated,
            'status': 'success'
        }
        
    except Exception as e:
        db.rollback()
        return {'status': 'error', 'error': str(e)}
    finally:
        db.close()


@celery_app.task(name='tasks.update_popularity_metrics')
def update_popularity_metrics():
    """Update popularity metrics for all lessons"""
    db = SessionLocal()
    try:
        lessons = db.query(Lesson).filter(Lesson.is_published == True).all()
        updated = 0
        
        now = datetime.utcnow()
        seven_days_ago = now - timedelta(days=7)
        thirty_days_ago = now - timedelta(days=30)
        
        for lesson in lessons:
            # Get or create popularity metrics
            metrics = db.query(PopularityMetrics).filter(
                PopularityMetrics.lesson_id == lesson.id
            ).first()
            
            if not metrics:
                metrics = PopularityMetrics(lesson_id=lesson.id)
                db.add(metrics)
            
            # 7-day metrics
            metrics.views_7d = db.query(LessonTimeLog).filter(
                LessonTimeLog.lesson_id == lesson.id,
                LessonTimeLog.session_start >= seven_days_ago
            ).count()
            
            metrics.completions_7d = db.query(Progress).filter(
                Progress.lesson_id == lesson.id,
                Progress.completed == True,
                Progress.completed_at >= seven_days_ago
            ).count()
            
            # 30-day metrics
            metrics.views_30d = db.query(LessonTimeLog).filter(
                LessonTimeLog.lesson_id == lesson.id,
                LessonTimeLog.session_start >= thirty_days_ago
            ).count()
            
            metrics.completions_30d = db.query(Progress).filter(
                Progress.lesson_id == lesson.id,
                Progress.completed == True,
                Progress.completed_at >= thirty_days_ago
            ).count()
            
            # All-time metrics
            metrics.views_total = db.query(LessonTimeLog).filter(
                LessonTimeLog.lesson_id == lesson.id
            ).count()
            
            metrics.completions_total = db.query(Progress).filter(
                Progress.lesson_id == lesson.id,
                Progress.completed == True
            ).count()
            
            # Popularity score (weighted: recent activity counts more)
            metrics.popularity_score = (
                (metrics.views_7d * 5.0) +
                (metrics.completions_7d * 10.0) +
                (metrics.views_30d * 2.0) +
                (metrics.completions_30d * 5.0) +
                (metrics.views_total * 0.5) +
                (metrics.completions_total * 1.0)
            )
            
            updated += 1
        
        db.commit()
        return {
            'lessons_updated': updated,
            'status': 'success'
        }
        
    except Exception as e:
        db.rollback()
        return {'status': 'error', 'error': str(e)}
    finally:
        db.close()


# ============================================================================
# CLEANUP TASKS
# ============================================================================

@celery_app.task(name='tasks.cleanup_inactive_sessions')
def cleanup_inactive_sessions(hours: int = 24):
    """Clean up inactive WebSocket sessions"""
    db = SessionLocal()
    try:
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        
        # Mark old sessions as inactive
        count = db.query(RealTimeSession).filter(
            RealTimeSession.last_heartbeat < cutoff,
            RealTimeSession.is_active == True
        ).update({
            'is_active': False,
            'disconnected_at': datetime.utcnow()
        })
        
        db.commit()
        return {
            'sessions_cleaned': count,
            'status': 'success'
        }
        
    except Exception as e:
        db.rollback()
        return {'status': 'error', 'error': str(e)}
    finally:
        db.close()


@celery_app.task(name='tasks.update_denormalized_metrics')
def update_denormalized_metrics():
    """Update denormalized metrics on Lesson table"""
    db = SessionLocal()
    try:
        lessons = db.query(Lesson).all()
        updated = 0
        
        for lesson in lessons:
            # Update view count
            lesson.view_count = db.query(LessonTimeLog).filter(
                LessonTimeLog.lesson_id == lesson.id
            ).count()
            
            # Update completion count
            lesson.completion_count = db.query(Progress).filter(
                Progress.lesson_id == lesson.id,
                Progress.completed == True
            ).count()
            
            # Update average score
            avg_score = db.query(func.avg(Progress.score)).filter(
                Progress.lesson_id == lesson.id,
                Progress.completed == True,
                Progress.score.isnot(None)
            ).scalar()
            lesson.average_score = float(avg_score) if avg_score else 0.0
            
            # Update average rating
            avg_rating = db.query(func.avg(Feedback.rating)).filter(
                Feedback.lesson_id == lesson.id
            ).scalar()
            lesson.average_rating = float(avg_rating) if avg_rating else 0.0
            
            # Update total time spent
            total_time = db.query(
                func.sum(Progress.total_time_spent_seconds)
            ).filter(
                Progress.lesson_id == lesson.id
            ).scalar()
            lesson.total_time_spent_minutes = int(total_time / 60) if total_time else 0
            
            updated += 1
        
        db.commit()
        return {
            'lessons_updated': updated,
            'status': 'success'
        }
        
    except Exception as e:
        db.rollback()
        return {'status': 'error', 'error': str(e)}
    finally:
        db.close()


# ============================================================================
# ORGANIZATION USAGE TRACKING
# ============================================================================

@celery_app.task(name='tasks.track_organization_usage')
def track_organization_usage():
    """Track daily usage statistics for organizations"""
    db = SessionLocal()
    try:
        organizations = db.query(Organization).filter(
            Organization.is_active == True
        ).all()
        
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        tracked = 0
        
        for org in organizations:
            # Total users
            total_users = db.query(User).filter(
                User.organization_id == org.id
            ).count()
            
            # Active users (last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            active_users = db.query(func.count(func.distinct(User.id))).filter(
                User.organization_id == org.id,
                User.last_login >= thirty_days_ago
            ).scalar() or 0
            
            # Total lessons
            total_lessons = db.query(Lesson).filter(
                Lesson.organization_id == org.id
            ).count()
            
            # Total storage
            total_storage_bytes = db.query(
                func.sum(Media.file_size_bytes)
            ).join(
                User, Media.uploaded_by == User.id
            ).filter(
                User.organization_id == org.id
            ).scalar() or 0
            total_storage_mb = total_storage_bytes / (1024 * 1024)
            
            # Create or update usage stats
            stats = db.query(OrganizationUsageStats).filter(
                OrganizationUsageStats.organization_id == org.id,
                func.date(OrganizationUsageStats.date) == today.date()
            ).first()
            
            if stats:
                stats.total_users = total_users
                stats.active_users_30d = active_users
                stats.total_lessons = total_lessons
                stats.total_storage_mb = float(total_storage_mb)
            else:
                stats = OrganizationUsageStats(
                    organization_id=org.id,
                    total_users=total_users,
                    active_users_30d=active_users,
                    total_lessons=total_lessons,
                    total_storage_mb=float(total_storage_mb),
                    date=today
                )
                db.add(stats)
            
            tracked += 1
        
        db.commit()
        return {
            'organizations_tracked': tracked,
            'status': 'success'
        }
        
    except Exception as e:
        db.rollback()
        return {'status': 'error', 'error': str(e)}
    finally:
        db.close()


# ============================================================================
# CELERY BEAT SCHEDULE
# ============================================================================

celery_app.conf.beat_schedule = {
    # Daily analytics at 1 AM
    'aggregate-lesson-analytics': {
        'task': 'tasks.aggregate_lesson_analytics',
        'schedule': crontab(hour=1, minute=0),
    },
    'aggregate-user-analytics': {
        'task': 'tasks.aggregate_user_analytics',
        'schedule': crontab(hour=1, minute=30),
    },
    
    # Update popularity every 15 minutes
    'update-popularity-metrics': {
        'task': 'tasks.update_popularity_metrics',
        'schedule': crontab(minute='*/15'),
    },
    
    # Clean up sessions every 30 minutes
    'cleanup-inactive-sessions': {
        'task': 'tasks.cleanup_inactive_sessions',
        'schedule': crontab(minute='*/30'),
    },
    
    # Update denormalized metrics every hour
    'update-denormalized-metrics': {
        'task': 'tasks.update_denormalized_metrics',
        'schedule': crontab(minute=0),
    },
    
    # Track organization usage daily at 2 AM
    'track-organization-usage': {
        'task': 'tasks.track_organization_usage',
        'schedule': crontab(hour=2, minute=0),
    },
}

# Set timezone
celery_app.conf.timezone = 'UTC'