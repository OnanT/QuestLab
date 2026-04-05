# QuestLab

## What This Is

QuestLab is a game-first Caribbean learning platform for Grades 1–6 combining curriculum lessons, mini-games, narrative quests, and mastery-based progression. It aims to make learning engaging and culturally relevant for students, empower teachers with interactive tools, and provide schools with structured management and reporting.

## Core Value

To provide engaging, game-first learning experiences that are culturally relevant to Caribbean students, thereby fostering deeper understanding and improving educational outcomes.

## Requirements

### Validated

- [x] **AUTH-01**: User (student, teacher, admin) can create and manage an account, including secure authentication and authorization.
- [x] **LEARN-01**: Students can engage with learning content delivered as structured quests.
- [x] **CONT-01**: Learning content incorporates Caribbean history, geography, folklore, heroes, and environments.
- [x] **CURR-01**: Curriculum lessons are aligned with Grades 1-6 educational standards.
- [x] **FEED-01**: Students receive immediate feedback through quizzes and interactive elements.
- [x] **PROG-01**: Student progression is tracked based on mastery and participation.
- [x] **ADMIN-02**: Admin/Teachers can create, edit, and organize lessons, quizzes, and games (Content Management).
- [x] **ADMIN-03**: Admin can configure school, grade, and subject structures.
- [x] **UIX-01**: The platform features UI, navigation, rewards, and story elements designed to feel like an adventure game.
- [x] **GAME-04**: XP and level progression systems provide visible achievement and encourage engagement.
- [x] **GAME-05**: Achievements and badges are awarded for milestones and effort.

### Active

- [ ] **PROG-02**: Mastery indicators are displayed for topics and quests. (Partial: Progress tracking exists, UI indicators need verification).
- [ ] **PROG-03**: Time-on-task and attempt metrics are collected for detailed insights.
- [ ] **ADMIN-01**: Schools/administrators can access centralized dashboards for student progress and curriculum organization.
- [ ] **ADMIN-04**: Teachers/Admins can view detailed student activity and performance.
- [ ] **GAME-01**: Students can engage with learning content through interactive gameplay loops.
- [ ] **GAME-02**: Mini-games reinforcing lesson objectives are integrated into learning paths.
- [ ] **GAME-03**: Story hooks and contextual challenges are embedded to drive narrative immersion.
- [ ] **GAME-06**: In-game currency and unlockables are available for learners to customize their experience. (Partial: Rewards/Badges exist, currency logic needs verification).

### Out of Scope

- Secondary education (Forms 1–5 / high school) support in Phase 1.
- Advanced analytics beyond basic progress in initial pilot.

## Context

- **Technology Stack:** Frontend: React 19, Vite 7, Tailwind CSS 4, React Router 6. Backend: FastAPI 0.128, SQLAlchemy 2.0, PostgreSQL 15.
- **Architecture:** Decoupled service-oriented architecture with Nginx reverse proxy and Docker orchestration.
- **Testing:** Playwright for E2E, Pytest for backend integration tests.

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| Game-first approach | To maximize student engagement. | Success - Core loop implemented |
| Caribbean cultural relevance | To increase engagement and addressing the lack of culturally relatable learning experiences. | Ongoing - Seeding content |
| React 19 + Tailwind 4 | Use latest stable features for performance and DX. | Implemented |
| Modular FastAPI Routers | Maintainability as the feature set grows. | Implemented |

---
*Last updated: April 5, 2026*

## Traceability

| Requirement | Status | Verification |
|-------------|-------|--------|
| AUTH-01 | Completed | `auth.py`, `users.py`, `LoginPage.jsx` |
| LEARN-01 | Completed | `lessons.py`, `LessonsPage.jsx` |
| CONT-01 | Completed | Content in DB (Seeding) |
| CURR-01 | Completed | `subjects.py`, `concepts.py` |
| FEED-01 | Completed | `feedback.py`, `quizzes.py`, `FeedbackModal.jsx` |
| PROG-01 | Completed | `progress.py`, `StudentDashboard.jsx` |
| PROG-02 | Partial | `progress.py` |
| PROG-03 | Pending | |
| ADMIN-01 | Partial | `AdminDashboard.jsx` |
| ADMIN-02 | Completed | `admin.py`, `CreateLessonPage.jsx` |
| ADMIN-03 | Completed | `schools.py`, `subjects.py` |
| ADMIN-04 | Partial | `TeacherDashboard.jsx` |
| UIX-01 | Completed | `UniversalNavbar.jsx`, `LandingPage.jsx` |
| GAME-01 | Partial | `games.py`, `GamePlayerPage.jsx` |
| GAME-02 | Partial | `typing.py`, `typing_game.spec.ts` |
| GAME-03 | Partial | Lesson narratives |
| GAME-04 | Completed | `progress.py`, `leaderboard.py` |
| GAME-05 | Completed | `badges.py`, `AchievementsPage.jsx` |
| GAME-06 | Partial | `rewards.py` |
