# QuestLab Registration, Feedback & Messaging Upgrade Log

## 📝 General Information
- **Project**: User System & Authentication Upgrade
- **Start Date**: 2026-03-20
- **Status**: Completed

---

## 📅 Execution History

### Phase 1: Registration Improvements
- **2026-03-20**:
  - Updated `backend/routers/schools.py` to support `island_id` query parameter for filtering schools by country.
  - Created `seed-info/caribbean_geo_seed.sql` containing 14 Caribbean countries and mapped sample schools for Saint Kitts, Barbados, Trinidad, and Jamaica.
  - Refactored `RegisterPage.jsx` to implement cascading dropdowns for Country and School.
  - Verified `backend/schemas.py` for `SchoolOut` and `CountryOut` compatibility.

### Phase 2: Feedback Fix + Enhancement
- **2026-03-20**:
  - Modified `backend/routers/feedback.py` to prevent duplicate submissions for the same lesson by the same user.
  - Updated `backend/models.py` to make `lesson_id` nullable in the `feedback` table, enabling general platform feedback.
  - Created `frontend/src/pages/ExitSurveyPage.tsx` - a dedicated page for quick platform feedback after logout.
  - Updated `frontend/src/App.tsx`:
    - Integrated `logout` redirect logic to `ExitSurveyPage` (once per day).
    - Registered `/exit-survey` route.
    - Updated `AuthProvider` to handle redirection conditionally based on `lastFeedbackPromptDate` in `localStorage`.

### Phase 3: Mailing System Setup
- **2026-03-20**:
  - Installed `fastapi-mail` and `jinja2` in the backend virtual environment.
  - Updated `backend/config.py` with SMTP/Mail configuration settings.
  - Created `backend/utils/email_service.py` using `FastMail` for asynchronous email delivery.
  - Designed role-specific HTML templates in `backend/templates/email/`:
    - `welcome_student.html`: Tips for getting started.
    - `welcome_parent.html`: Includes the user's unique **Parent ID**.
    - `welcome_teacher.html`: Guide for setting up digital classrooms.
  - Updated `backend/tasks.py` to replace mock email functions with real `FastMail` implementations via Celery.
  - Updated `backend/routers/auth.py` to trigger role-specific welcome emails as background tasks upon registration.

### Phase 4: UX Integration (Frontend)
- **2026-03-20**:
  - Updated `frontend/src/pages/ParentDashboard.jsx`:
    - Added a prominent Parent ID display card in the header.
    - Implemented "Copy to Clipboard" functionality for the Parent ID.
    - Added visual feedback (check icon + toast) when the ID is copied.
  - Final audit of the registration flow to ensure all fields are correctly passed to the backend.

---

## 🛠 Commands & Scripts Ran
- `Updated backend/routers/schools.py`
- `Created seed-info/caribbean_geo_seed.sql`
- `Updated backend/routers/feedback.py`
- `Updated backend/models.py`
- `Created frontend/src/pages/ExitSurveyPage.tsx`
- `pip install fastapi-mail jinja2`
- `Created backend/utils/email_service.py`
- `Created backend/templates/email/*.html`
- `Updated backend/tasks.py`
- `Updated backend/routers/auth.py`
- `Updated frontend/src/pages/ParentDashboard.jsx`
