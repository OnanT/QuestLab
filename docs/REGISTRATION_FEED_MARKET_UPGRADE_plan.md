# Registration, Feedback & Messaging System Upgrade Plan

## 1. Project Overview
- **Scope**: Enhancement of the user registration flow, fixing and improving the feedback system, and implementing a robust mailing/notification architecture.
- **Goals**: 
    - Provide a seamless registration experience with cascading country and school selections.
    - Ensure a reliable feedback system with a daily nudge for users.
    - Establish a professional communication channel for onboarding and marketing.
- **Constraints**: 
    - Maintain compatibility with existing PostgreSQL schema.
    - Ensure mobile-first responsiveness for all new UI components.
    - Optimize for Caribbean-specific educational contexts.

---

## 2. System Review (Current State)

### Registration System
- **Current Flow**: Users enter country and school as plain text fields.
- **Gaps**: Inconsistent data (typos), poor UX (manual entry), and lack of data validation for schools mapped to specific islands.

### Feedback System
- **Current Behavior**: Simple submission form for lesson ratings and comments.
- **Identified Issues**: 
    - Submission failure due to lack of explicit error handling in the frontend.
    - No prevention of duplicate submissions for the same lesson.
    - No mechanism to encourage feedback after a session ends.

### Mailing System
- **Current Capabilities**: Non-existent. No automated emails for registration or password resets.
- **Limitations**: Missing onboarding touchpoint, no marketing reach, and no automated parent-student link verification.
- **Improvements**: Integration of `fastapi-mail` with SMTP/SES support and HTML templating via Jinja2.

---

## 3. Feature Enhancements

### Registration Improvements
- **Dropdown Logic**: 
    - `CountrySelect`: Fetches list from `/api/country`.
    - `SchoolSelect`: Fetches filtered list from `/api/schools?country_id={id}`.
- **Data Flow**: Frontend state triggers a school list refresh whenever the country selection changes.
- **Validation**: Ensure `country` and `school` fields are mandatory for students and teachers.

### Feedback System Improvements
- **Submission Fix**: 
    - **Backend**: Implement a "one feedback per lesson" constraint (or daily limit).
    - **Frontend**: Add loading states, success toasts, and clear validation errors.
- **Improved UX**: A modal or dedicated page with star ratings and categorized feedback (Content, Fun, Difficulty).
- **Daily Redirect Logic**: 
    - After signout, the system checks `localStorage` for `lastFeedbackPromptDate`.
    - If `null` or `!today`, redirect to `/feedback/general`.

### Mailing System Enhancements
- **Architecture**:
    - **Service**: FastAPI-Mail (SMTP/Amazon SES).
    - **Background Tasks**: Emails sent via FastAPI `BackgroundTasks` to avoid blocking API responses.
- **Template System**:
    - HTML templates stored in `backend/templates/email/`.
    - Variable injection for user names, IDs, and dynamic links.
- **Automation Flows**:
    - **Student Signup**: Welcome email with tips to start.
    - **Parent Signup**: Welcome email including their **Parent ID** and instructions on how to link their children.
    - **Teacher Signup**: Guide on setting up their first class.
- **Configurability**: Admin-toggleable notification settings for marketing vs. system emails.

---

## 4. Implementation Strategy (Phases)

### Phase 1: Registration Improvements
- **Tasks**:
    - Update `backend/routers/schools.py` to support filtering by `country_id`.
    - Seed expanded Caribbean country/school data.
    - Refactor `RegisterPage.jsx` to use cascading dropdowns.
- **Dependencies**: Database access, updated API endpoints.
- **Risks**: Potential data mismatch if existing users have text-based country names.

### Phase 2: Feedback Fix + Enhancement
- **Tasks**:
    - Add `CheckConstraint` or logic to prevent duplicate feedback in `backend/routers/feedback.py`.
    - Create a persistent "Feedback Redirect" middleware in the frontend.
    - Design the new Feedback UI components.
- **Dependencies**: Frontend routing logic.
- **Risks**: Annoying users with too many redirects (must be strictly once per day).

### Phase 3: Mailing System Setup
- **Tasks**:
    - Install `fastapi-mail` and configure `.env` variables.
    - Create Jinja2 templates for Welcome emails (Parent/Student/Teacher).
    - Implement `email_service.py` utility in the backend.
- **Dependencies**: SMTP credentials.
- **Risks**: Emails being flagged as spam (need proper headers/SPF/DKIM).

### Phase 4: UX Integration (Frontend)
- **Tasks**:
    - Final UI polish on registration and feedback forms.
    - Integration of "Parent ID" display in the Parent Dashboard.
- **Dependencies**: Successful API integrations.

---

## 5. Data Models & Seeding

### SQL Seed Scripts:

#### Caribbean Countries
```sql
INSERT INTO countries (name) VALUES 
('Antigua and Barbuda'), ('Bahamas'), ('Barbados'), ('Belize'), 
('Dominica'), ('Grenada'), ('Guyana'), ('Haiti'), ('Jamaica'), 
('Saint Kitts and Nevis'), ('Saint Lucia'), ('Saint Vincent and the Grenadines'), 
('Suriname'), ('Trinidad and Tobago');
```

#### Schools Mapped to Countries
```sql
-- Sample mapping for St. Kitts & Nevis
INSERT INTO schools (name, island_id, organization_id, address) 
SELECT 'Basseterre High School', id, 1, 'Basseterre, St. Kitts' 
FROM countries WHERE name = 'Saint Kitts and Nevis';

SELECT 'Charlestown Secondary School', id, 1, 'Charlestown, Nevis' 
FROM countries WHERE name = 'Saint Kitts and Nevis';

-- Sample mapping for Barbados
INSERT INTO schools (name, island_id, organization_id, address) 
SELECT 'Harrison College', id, 1, 'Crumpton St, Bridgetown' 
FROM countries WHERE name = 'Barbados';
```

---

## 6. Frontend Architecture

- **Components**:
    - `CascadingGeoSelect`: Reusable component for Country/School logic.
    - `FeedbackRating`: Star-based rating component.
    - `EmailPreview`: (Admin only) Tool to preview templates.
- **State Management**:
    - Use `React Context` or `Zustand` for caching the country/school list to avoid redundant API calls.
- **API Integration**:
    - `GET /api/country`: Fetch all islands.
    - `GET /api/schools?island_id=X`: Fetch filtered schools.
    - `POST /api/feedback`: Submit feedback.

---

## 7. API Design

| Endpoint | Method | Payload | Description |
|----------|--------|---------|-------------|
| `/api/schools` | GET | `?island_id=int` | Returns schools for a specific country. |
| `/api/feedback` | POST | `{rating: int, comment: str, lesson_id: int}` | Submits user feedback. |
| `/api/mail/test` | POST | `{email: str, template: str}` | (Admin) Send a test email. |

---

## 8. Messaging & Email System

### Templates:
1. **Welcome (Student)**: "Welcome to QuestLab, {{username}}! Ready for your first lesson?"
2. **Welcome (Parent)**: "Welcome, {{username}}! Use **Parent ID: {{id}}** to link your children's accounts."
3. **Newsletter**: Marketing blast for new lesson releases.

### Trigger Flow:
- `auth_router.register` -> `BackgroundTasks.add_task(send_welcome_email, user)`

---

## 9. UX Flows

- **Registration**:
    1. User selects "Student" role.
    2. User selects "Barbados" from dropdown.
    3. School dropdown populates with Barbadian schools.
    4. User completes registration.
    5. **Trigger**: Welcome email sent.

- **Post-logout Feedback Redirect**:
    1. User clicks "Sign Out".
    2. Auth system clears tokens.
    3. Middleware checks `localStorage.lastFeedbackDate`.
    4. Redirect to `/feedback/exit-survey`.
    5. User submits or clicks "Skip".
    6. Redirect to `/login`.

---

## 10. Timeline & Milestones

- **Day 1**: Backend API updates (Filtering, Feedback constraints) + SQL Seeding.
- **Day 2**: Frontend Registration refactor (Cascading dropdowns).
- **Day 3**: Mailing system infrastructure (FastAPI-Mail + Templates).
- **Day 4**: Feedback System UX + Logout Redirect logic.
- **Day 5**: Testing, Bug fixes, and Documentation.

---

## 11. Risks & Considerations
- **Data Privacy**: Ensure Parent IDs are shared securely.
- **Email Delivery**: Monitor bounce rates; use a dedicated provider (Postmark/SendGrid) for production.
- **UX Friction**: Ensure the feedback redirect is non-intrusive and easily skippable.
