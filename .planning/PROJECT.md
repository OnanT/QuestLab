# QuestLab

## What This Is

QuestLab is a game-first Caribbean learning platform for Grades 1–6 combining curriculum lessons, mini-games, narrative quests, and mastery-based progression. It aims to make learning engaging and culturally relevant for students, empower teachers with interactive tools, and provide schools with structured management and reporting.

## Core Value

To provide engaging, game-first learning experiences that are culturally relevant to Caribbean students, thereby fostering deeper understanding and improving educational outcomes.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **AUTH-01**: User (student, teacher, admin) can create and manage an account, including secure authentication and authorization.
- [ ] **LEARN-01**: Students can engage with learning content delivered as structured quests.
- [ ] **CONT-01**: Learning content incorporates Caribbean history, geography, folklore, heroes, and environments.
- [ ] **CURR-01**: Curriculum lessons are aligned with Grades 1-6 educational standards.
- [ ] **FEED-01**: Students receive immediate feedback through quizzes and interactive elements.
- [ ] **PROG-01**: Student progression is tracked based on mastery and participation.
- [ ] **PROG-02**: Mastery indicators are displayed for topics and quests.
- [ ] **PROG-03**: Time-on-task and attempt metrics are collected for detailed insights.
- [ ] **ADMIN-01**: Schools/administrators can access centralized dashboards for student progress and curriculum organization.
- [ ] **ADMIN-02**: Admin/Teachers can create, edit, and organize lessons, quizzes, and games (Content Management).
- [ ] **ADMIN-03**: Admin can configure school, grade, and subject structures.
- [ ] **ADMIN-04**: Teachers/Admins can view detailed student activity and performance.
- [ ] **UIX-01**: The platform features UI, navigation, rewards, and story elements designed to feel like an adventure game.
- [ ] **GAME-01**: Students can engage with learning content through interactive gameplay loops.
- [ ] **GAME-02**: Mini-games reinforcing lesson objectives are integrated into learning paths.
- [ ] **GAME-03**: Story hooks and contextual challenges are embedded to drive narrative immersion.
- [ ] **GAME-04**: XP and level progression systems provide visible achievement and encourage engagement.
- [ ] **GAME-05**: Achievements and badges are awarded for milestones and effort.
- [ ] **GAME-06**: In-game currency and unlockables are available for learners to customize their experience.

### Out of Scope

- Secondary education (Forms 1–5 / high school) support in Phase 1 — This is a Phase 2 expansion.
- Aggressive monetization beyond freemium and school pilot programs in Phase 1 — Phase 1 focuses on validation and adoption.
- Advanced analytics and standardized testing alignment (e.g., CSEC/CXC) in Phase 1 — These are Phase 2+ features.

## Context

- **Existing Code:** Brownfield detection indicated no significant existing codebase, so this is a greenfield project.
- **Technology Stack:** Frontend: React/TypeScript (Vite, Tailwind CSS, React Router, Axios). Backend: Python (FastAPI, SQLAlchemy, PostgreSQL). Infrastructure: Docker, Nginx, Certbot.
- **User Research:** Detailed user needs identified for students, teachers, schools, and parents.
- **Pedagogy:** Emphasizes storytelling, exploration, and cultural relevance to increase engagement and comprehension.

## Constraints

- **Phase 1 Scope**: Focus strictly on Grades 1-6 (Primary Education).
- **Business Model**: Freemium core content with premium features for school licenses/classroom subscriptions and optional parent subscriptions in Phase 1. Grants and education partnerships for funding.
- **Timeline**: Implicit in Phase 1 validation and adoption goals; needs to be quick enough to gather feedback effectively.
- **Resources**: Assumed to be constrained, driving focus on MVP for Phase 1.

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| Game-first approach | To maximize student engagement and make learning feel like play, not schoolwork. | — Pending |
| Caribbean cultural relevance | To increase engagement, comprehension, and address the lack of culturally relatable learning experiences. | — Pending |
| Freemium + School Pilot business model for Phase 1 | To prioritize validation and adoption, gather feedback, and establish product-market fit before aggressive monetization. | — Pending |

---
*Last updated: February 4, 2026 after initialization*

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| LEARN-01 | Phase 1 | Pending |
| CONT-01 | Phase 1 | Pending |
| CURR-01 | Phase 1 | Pending |
| FEED-01 | Phase 1 | Pending |
| PROG-01 | Phase 1 | Pending |
| PROG-02 | Phase 1 | Pending |
| PROG-03 | Phase 2 | Pending |
| ADMIN-01 | Phase 2 | Pending |
| ADMIN-02 | Phase 1 | Pending |
| ADMIN-03 | Phase 1 | Pending |
| ADMIN-04 | Phase 2 | Pending |
| UIX-01 | Phase 1 | Pending |
| GAME-01 | Phase 2 | Pending |
| GAME-02 | Phase 3 | Pending |
| GAME-03 | Phase 2 | Pending |
| GAME-04 | Phase 2 | Pending |
| GAME-05 | Phase 2 | Pending |
| GAME-06 | Phase 3 | Pending |