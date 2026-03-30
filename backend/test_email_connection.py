import sys
import os
import asyncio
from pathlib import Path

# Add the current directory to sys.path to import local modules
sys.path.append(os.getcwd())

from config import settings
from utils.email_service import conf
from fastapi_mail import FastMail, MessageSchema, MessageType

async def test_connection():
    print("--- SMTP Connection Test ---")
    print(f"Server: {settings.MAIL_SERVER}:{settings.MAIL_PORT}")
    print(f"Username: {settings.MAIL_USERNAME}")
    print(f"From: {settings.MAIL_FROM}")
    
    # Recommendation for Gmail
    if "gmail.com" in settings.MAIL_SERVER and "@" not in settings.MAIL_USERNAME:
        print("\n[WARNING]: For Gmail, MAIL_USERNAME usually needs to be your full email address (e.g., yourname@gmail.com).")
    
    message = MessageSchema(
        subject="QuestLab SMTP Test",
        recipients=[settings.MAIL_FROM], # Send to self
        body="If you are reading this, the QuestLab email system is correctly configured! 🚀",
        subtype=MessageType.plain
    )

    fm = FastMail(conf)
    try:
        print("\nAttempting to send test email...")
        await fm.send_message(message)
        print("\n✅ SUCCESS: Email sent successfully!")
        print(f"Check your inbox: {settings.MAIL_FROM}")
    except Exception as e:
        print(f"\n❌ FAILED: Could not send email.")
        print(f"Error details: {str(e)}")
        
        if "Authentication failed" in str(e) or "535" in str(e):
            print("\nPossible solutions:")
            print("1. Ensure MAIL_USERNAME is your full email address.")
            print("2. Ensure MAIL_PASSWORD is an 'App Password', not your main account password.")
            print("3. Ensure 2FA is enabled on your Google account.")

if __name__ == "__main__":
    asyncio.run(test_connection())
