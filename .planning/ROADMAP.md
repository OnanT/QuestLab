# QuestLab Project Roadmap

## Overview

This roadmap outlines the phased development for QuestLab, a game-first Caribbean learning platform for Grades 1–6. It prioritizes establishing a secure, functional core learning loop with culturally relevant content, followed by incremental integration of gamification and comprehensive teacher/admin tools, and finally, advanced game mechanics and content expansion. This approach ensures foundational stability, continuous engagement, and responsiveness to iterative feedback.

## Phases

### Phase 1: Foundation & Core Learning Loop
**Goal:** Users (students, teachers, admins) can securely access the platform, students can engage with culturally relevant, standards-aligned learning content presented as quests, and teachers/admins can manage basic content and curriculum structure.
**Dependencies:** None
**Requirements:** AUTH-01, LEARN-01, CURR-01, CONT-01, FEED-01, PROG-01, PROG-02, ADMIN-02, ADMIN-03, UIX-01
**Success Criteria:**
1.  A new user (student, teacher, or admin) can successfully create an account and log in/out securely.
2.  A student can complete a full learning quest, including interactive content and embedded quizzes, receiving immediate feedback.
3.  A student's mastery and progress for a completed quest or topic are accurately tracked and displayed.
4.  An admin or teacher can create a new learning quest, add curriculum-aligned content, and assign it to a student or group.
5.  The learning quest content visually reflects Caribbean culture, history, or geography.
**Plans:**
- [ ] 01-01-PLAN.md — Implement Feedback Model and Schema
- [ ] 01-02-PLAN.md — Implement Feedback API Endpoints
- [ ] 01-03-PLAN.md — Implement Role-Based Access Control (RBAC) for Admin Endpoints
- [ ] 01-04-PLAN.md — Student UI: Lesson List and Detail with Progress
- [ ] 01-05-PLAN.md — Student UI: Submit Feedback
- [ ] 01-06-PLAN.md — Admin UI: Manage Lessons and Subjects

### Phase 2: Core Gamification & Teacher/Admin Insights
**Goal:** The core learning experience is enhanced with foundational gamification elements, and teachers/admins have comprehensive dashboards to monitor student engagement and performance metrics.
**Dependencies:** Phase 1
**Requirements:** GAME-01, GAME-03, GAME-04, GAME-05, ADMIN-01, ADMIN-04, PROG-03
**Success Criteria:**
1.  A student completing a quest or learning activity receives visible XP and progresses through levels.
2.  A student is awarded and can view badges or achievements for reaching specific milestones or exhibiting effort.
3.  An admin or teacher can view a centralized dashboard showing aggregated student progress, activity, time-on-task, and attempt metrics across the school or class.
4.  The narrative and challenges within quests include engaging story hooks that encourage continued play.

### Phase 3: Advanced Gamification & Content Expansion
**Goal:** The platform offers a rich, immersive game-driven learning experience with integrated mini-games and a virtual economy, significantly expanding engagement opportunities.
**Dependencies:** Phase 2
**Requirements:** GAME-02, GAME-06
**Success Criteria:**
1.  A student encounters and successfully completes a mini-game embedded within a learning quest, reinforcing lesson objectives.
2.  A student earns and can spend in-game currency to acquire cosmetic items or unlock customizations for their avatar/profile.
3.  The overall learning journey feels like a continuous, rewarding adventure with diverse interactive elements.

## Progress

| Phase | Status | % Complete | Notes |
|-------|--------|------------|-------|
| 1     | Planned | 0%         |       |
| 2     | Pending | 0%         |       |
| 3     | Pending | 0%         |       |

## Traceability
*(This section will be automatically updated with requirement-to-phase mappings once approved and stored in REQUIREMENTS.md)*