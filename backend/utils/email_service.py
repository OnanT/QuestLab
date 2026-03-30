import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from config import settings
from pathlib import Path

# Get the directory of the current file (backend/utils)
# Then go up one level to backend/
TEMPLATE_FOLDER = Path(__file__).parent.parent / "templates" / "email"

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=settings.VALIDATE_CERTS,
    TEMPLATE_FOLDER=TEMPLATE_FOLDER
)

async def send_welcome_email(email: EmailStr, username: str, role: str, user_id: int):
    """
    Send a welcome email based on the user's role.
    """
    template_name = f"welcome_{role}.html"
    
    # Map role names to template names if necessary (e.g., student, parent, teacher)
    # Ensure role is lower case
    role = role.lower()
    if role not in ["student", "parent", "teacher"]:
        template_name = "welcome_student.html" # Default
    else:
        template_name = f"welcome_{role}.html"

    # Context for the template
    template_body = {
        "username": username,
        "login_url": f"{settings.FRONTEND_URL}/login",
        "parent_id": user_id if role == "parent" else None
    }

    message = MessageSchema(
        subject=f"Welcome to QuestLab, {username}!",
        recipients=[email],
        template_body=template_body,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message, template_name=template_name)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
