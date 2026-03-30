# QuestLab Email System Guide

## 1. Overview
QuestLab uses a robust, asynchronous email system to handle onboarding, security (OTP), and communication. The system is built on **FastAPI-Mail** and **Celery**, ensuring that email delivery never blocks the user experience.

---

## 2. Configuration (`.env`)
To enable emails, the following variables must be configured in your `.env` file. If these are missing or incorrect, emails will fail or use default (mock) behavior.

```env
# SMTP Server Details
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_FROM=noreply@questlab.onan.shop
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=QuestLab

# Security Settings
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
USE_CREDENTIALS=True
VALIDATE_CERTS=True
```

> **Note for Gmail Users**: You must use an **App Password**, not your regular password. Enable 2FA on your Google account first.

---

## 3. How It Works (The Workflow)

### A. The Trigger
When a user performs an action (e.g., clicks "Create Account"), the API endpoint receives the request.

### B. The Background Task (Celery)
Instead of sending the email immediately, the API "offloads" the job to **Celery**. 
- **File**: `backend/routers/auth.py`
- **Logic**: `send_welcome_email.delay(email, username, role, user_id)`
- **Benefit**: The user gets a "Success" message instantly, while the email is sent in the background.

### C. The Email Service
The Celery worker picks up the task and uses the `EmailService` utility.
- **File**: `backend/utils/email_service.py`
- **Library**: `fastapi-mail`
- **Templates**: It fetches role-specific HTML from `backend/templates/email/`.

### D. Variable Injection
The system automatically injects dynamic data into the templates:
- **Student**: Gets their username and a login link.
- **Parent**: Receives their unique **Parent ID** (essential for linking children).
- **Teacher**: Gets a guide for setting up classrooms.

---

## 4. Troubleshooting

### 1. Emails aren't arriving
- Check the Celery worker logs: `docker-compose logs celery_worker`.
- Verify SMTP credentials in `.env`.
- Ensure your firewall allows outbound traffic on port 587.

### 2. Registration Fails
- The registration logic is designed to succeed **even if the email fails**.
- If the entire registration fails, check the backend logs for database or validation errors.

---

## 5. Templates Architecture
Templates are stored in `backend/templates/email/`. They use **Jinja2** syntax (e.g., `{{ username }}`).

| Template | Used For | Key Variables |
|----------|----------|---------------|
| `welcome_student.html` | New Student Signup | `username`, `login_url` |
| `welcome_parent.html` | New Parent Signup | `username`, `parent_id`, `login_url` |
| `welcome_teacher.html` | New Teacher Signup | `username`, `login_url` |
| `otp_email.html` | Password Resets | `otp_code` |

---

## 6. Development vs Production
In development, if no SMTP server is provided, the system will log the email content to the console instead of sending it.
