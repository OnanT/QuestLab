from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import string

import models
import schemas
from dependencies import (
    get_db, verify_password, create_access_token, get_password_hash
)
from config import settings
from tasks import send_welcome_email, send_otp_email

router = APIRouter(tags=["auth"])


@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    - Validates username and email uniqueness
    - Validates parent_id if provided
    - Assigns default organization
    - Triggers welcome email
    """

    # Check if username exists
    existing_user = db.query(models.User).filter(
        models.User.username == user.username
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    # Check if email exists
    existing_email = db.query(models.User).filter(
        models.User.email == user.email
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Validate parent_id if provided
    if user.parent_id:
        parent = db.query(models.User).filter(
            models.User.id == user.parent_id
        ).first()
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent not found"
            )
        if parent.role != 'parent':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent ID does not belong to a parent user"
            )

    # Get or create default organization
    default_org = db.query(models.Organization).filter(
        models.Organization.id == settings.DEFAULT_ORGANIZATION_ID
    ).first()

    if not default_org:
        # Create default organization if it doesn't exist
        default_org = models.Organization(
            id=settings.DEFAULT_ORGANIZATION_ID,
            name=settings.DEFAULT_ORGANIZATION_NAME,
            slug="quest-lab",
            organization_type="platform",
            is_active=True
        )
        db.add(default_org)
        db.flush()  # Get the ID without committing

    # Hash password
    hashed_password = get_password_hash(user.password)

    # Create new user
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        country=user.country,
        school=user.school,
        grade=user.grade,
        parent_id=user.parent_id,
        organization_id=default_org.id,  # ✅ FIXED: Added organization_id
        display_name=user.username,
        is_active=True,
        created_at=datetime.utcnow()
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

    # Trigger welcome email in background (don't fail registration if this fails)
    try:
        send_welcome_email.delay(db_user.email, db_user.username)
    except Exception as e:
        # Just log the error, don't raise an exception
        print(f"Error sending welcome email: {e}")

    return db_user


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    """
    Generate OTP for password reset
    """
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        # We return 200 even if user not found for security reasons (prevent email enumeration)
        return {"message": "If your email is registered, you will receive an OTP shortly."}

    # Generate 6-digit OTP
    otp_code = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.utcnow() + timedelta(minutes=15)

    # Store OTP in database (or replace if exists)
    existing_otp = db.query(models.PasswordResetOTP).filter(models.PasswordResetOTP.user_id == user.id).first()
    if existing_otp:
        existing_otp.otp_code = otp_code
        existing_otp.expires_at = expires_at
    else:
        new_otp = models.PasswordResetOTP(
            user_id=user.id,
            otp_code=otp_code,
            expires_at=expires_at
        )
        db.add(new_otp)

    db.commit()

    # Send OTP via Celery task
    send_otp_email.delay(user.email, otp_code)

    return {"message": "OTP sent to your email."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: schemas.PasswordResetVerify, db: Session = Depends(get_db)):
    """
    Verify OTP and reset password
    """
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp_record = db.query(models.PasswordResetOTP).filter(
        models.PasswordResetOTP.user_id == user.id,
        models.PasswordResetOTP.otp_code == request.otp_code
    ).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    if otp_record.expires_at < datetime.utcnow():
        db.delete(otp_record)
        db.commit()
        raise HTTPException(status_code=400, detail="OTP code expired")

    # Reset password
    user.hashed_password = get_password_hash(request.new_password)
    
    # Delete OTP record after successful use
    db.delete(otp_record)
    db.commit()

    return {"message": "Password reset successfully. You can now login with your new password."}


@router.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login endpoint
    - Accepts username or email
    - Returns JWT access token
    """

    # Try to find user by username first
    user = db.query(models.User).filter(
        models.User.username == form_data.username
    ).first()

    # If not found by username, try email
    if not user:
        user = db.query(models.User).filter(
            models.User.email == form_data.username
        ).first()

    # Verify credentials
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()

    # Create access token
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role, "id": user.id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
