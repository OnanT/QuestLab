# QuestLab User System Plan

## 1. Project Overview
The QuestLab User System is a production-grade identity and profile management solution designed to support a multi-role educational ecosystem (Students, Parents, Teachers, and Admins). The system prioritizes security, ease of onboarding, and verified communication channels to ensure a safe learning environment for Caribbean students.

## 2. Feature Breakdown & Mapping

### Module A: Authentication & Identity
| Feature | Components | Implementation Notes |
|--------|-----------|------|
| **Advanced Registration** | Multi-step Form, Schema Validation | Handles optional `parent_id` and student metadata. |
| **Secure Login** | JWT (OAuth2), Secure Cookies | 24h token expiry with refresh logic. |
| **Password Recovery** | Email/SMS/OTP Flow | Multi-channel support for high accessibility. |
| **Social Auth** | Google OAuth2 | Optional integration for friction-less onboarding. |

### Module B: Profile & Presence
| Feature | Components | Implementation Notes |
|--------|-----------|------|
| **User Profiles** | Profile API, Metadata Store | Tracks school, grade, and country. |
| **Avatar System** | Multer/File Upload, Image Resizing | Optimized storage in `/uploads/avatars`. |
| **User Relationship** | Parent-Student Linking | Nullable `parent_id` with verification logic. |

### Module C: Communication & Feedback
| Feature | Components | Implementation Notes |
|--------|-----------|------|
| **Transactional Email** | SMTP/SendGrid Integration | Welcome emails and reset triggers. |
| **Mailing List** | Newsletter Sync | Opt-in flag for curriculum updates. |
| **Feedback System** | Feedback Portal, Admin Review | Captures UX issues and content reports. |

---

## 3. Implementation Strategy (Phases)

### Phase 1: Core Authentication & Registration
*   **Goal**: Establish a robust, validated registration and login flow.
*   **Implementation**: Update FastAPI models and Pydantic schemas to support optional fields. Implement `unique` constraints on email and username.
*   **Dependencies**: PostgreSQL, Passlib (Argon2).

### Phase 2: Profile System & Avatar Management
*   **Goal**: Enable users to personalize their accounts and manage metadata.
*   **Implementation**: Create `/users/profile` endpoints. Implement file upload handling for avatars with 200x200px auto-cropping.
*   **Dependencies**: Python `Pillow`, `multipart` form-data support.

### Phase 3: Communication Layer
*   **Goal**: Automate onboarding and engagement.
*   **Implementation**: Integrate background tasks for sending "Welcome" emails upon successful registration. Implement a basic opt-in mailing list flag.
*   **Dependencies**: FastAPI `BackgroundTasks`, Jinja2 (for email templates).

### Phase 4: Recovery & Security
*   **Goal**: Ensure users can safely regain access to their accounts.
*   **Implementation**: Implement a 6-digit OTP system for password resets. Support both Email and SMS (via Twilio/Local API).
*   **Dependencies**: Redis (for OTP storage/expiry).

### Phase 5: Enhancements & Feedback
*   **Goal**: Polish the UX and gather qualitative data.
*   **Implementation**: Add Google Auth via `authlib`. Create a `/feedback` endpoint for user-submitted reports.
*   **Dependencies**: Google Cloud Console (Client ID/Secret).

---

## 4. System Design & Data Models

### User & Profile Schema
| Table: `users` | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID/Serial | PK |
| `username` | String | Unique, Indexed |
| `email` | String | Unique, Indexed |
| `hashed_password` | String | Argon2 |
| `role` | Enum | [student, parent, teacher, admin] |
| `is_active` | Boolean | Default: True |

| Table: `profiles` | Type | Constraints |
| :--- | :--- | :--- |
| `user_id` | FK | References `users(id)`, PK |
| `country` | String | Nullable |
| `school` | String | Nullable |
| `grade` | Integer | Nullable (1-12) |
| `parent_id` | FK | References `users(id)`, Nullable |
| `avatar_url` | String | Default: `/assets/default-avatar.png` |
| `marketing_opt_in` | Boolean | Default: False |

---

## 5. API Design (Blueprints)

### Auth Endpoints
*   `POST /api/auth/register`
    *   **Payload**: `{ username, email, password, role, school?, grade?, country?, parent_id? }`
    *   **Response**: `201 Created` + User Object.
*   `POST /api/auth/login`
    *   **Payload**: `{ username, password }` (Form data)
    *   **Response**: `{ access_token, token_type: "bearer" }`
*   `POST /api/auth/forgot-password`
    *   **Payload**: `{ email_or_phone }`
    *   **Response**: `200 OK` (OTP sent).

### Profile Endpoints
*   `GET /api/users/me` (Protected)
*   `PATCH /api/users/profile` (Update school, grade, etc.)
*   `POST /api/users/avatar` (Upload image/multipart)

---

## 6. Execution Blueprints

### A. Backend Logic Flow (Pseudo-code)
```python
@router.post("/register")
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Verify unique email/username
    if get_user_by_email(db, user_in.email):
        raise HTTPException(400, "Email already registered")
    
    # 2. Hash password
    hashed_pwd = pwd_context.hash(user_in.password)
    
    # 3. Create User record
    db_user = models.User(..., hashed_password=hashed_pwd)
    db.add(db_user); db.commit()
    
    # 4. Create Profile record (Handles optional parent_id)
    db_profile = models.Profile(user_id=db_user.id, **user_metadata)
    db.add(db_profile); db.commit()
    
    # 5. Trigger Welcome Email (Background Task)
    background_tasks.add_task(send_welcome_email, db_user.email)
    
    return db_user
```

### B. Password Reset Flow (OTP)
1.  **Request**: User submits email.
2.  **Generate**: System creates 6-digit code, stores in Redis with 15-min TTL.
3.  **Deliver**: Send via email template using `Jinja2`.
4.  **Verify**: User submits code + new password.
5.  **Update**: System verifies code in Redis, updates database, clears TTL.

---

## 7. Security & Validation

### Password Policy
*   Minimum 8 characters.
*   Must contain at least 1 uppercase letter, 1 number, and 1 special character.
*   Prohibit top 1000 common passwords.

### Security Constraints
*   **Rate Limiting**: Max 5 registration attempts per IP per hour.
*   **Input Sanitization**: Use Pydantic for strict type checking; escape all string inputs to prevent XSS.
*   **CORS**: Only allow the QuestLab frontend domain and local development ports.

---

## 8. Timeline & Milestones

| Day | Milestone | Deliverables |
| :--- | :--- | :--- |
| **Day 1** | **Database & Core Auth** | Updated schemas, Hash logic, Registration API. |
| **Day 2** | **Profile & Avatars** | Profile PATCH endpoints, Multer/Upload handling. |
| **Day 3** | **Communication** | SendGrid integration, Welcome email templates. |
| **Day 4** | **Security & Recovery** | Redis OTP logic, Password reset UI flow. |
| **Day 5** | **Feedback & QA** | Google Auth, Feedback system, E2E Playwright tests. |

---

## 9. Risks & Considerations
*   **Email Deliverability**: Emails may land in spam. *Mitigation: Use verified SendGrid/Mailgun domains and DKIM records.*
*   **Privacy (COPPA)**: Student data requires high protection. *Mitigation: Minimal data collection; `parent_id` linking ensures parental oversight.*
*   **File Storage**: Local storage in `/uploads` may not scale in a cluster. *Mitigation: Abstract file storage behind a service for future S3 migration.*

---
*Generated: 2026-03-19*  
*Status: Implementation Ready*