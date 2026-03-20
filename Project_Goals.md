# QuestLab — Project Goals

## 1. Primary Mission (Non‑Negotiable)
QuestLab exists to deliver **game‑first, culturally relevant learning for Caribbean students**, prioritizing engagement, mastery, and exploration over worksheets, rote memorization, and high‑pressure exams.

Success is measured by:
- Sustained learner engagement
- Demonstrated concept mastery through play
- Cultural resonance and relevance

---

## 2. Target Users
- **Primary & lower secondary learners** (Grades 1–6 initially)
- **Teachers** seeking interactive, no‑pen‑and‑paper lessons
- **Parents/guardians** supporting learning at home

---

## 3. Core Pillars (Alignment Criteria)
All features should clearly support at least one pillar below:

1. **Game‑Driven Learning**
   - Lessons feel like quests
   - Learning happens through interaction, not worksheets

2. **Caribbean‑First Context**
   - Culture, history, geography, and realities are core—not cosmetic

3. **Mastery‑Based Progression**
   - Progress unlocks through understanding and practice
   - No punitive failure loops

4. **Narrative & Exploration**
   - Story hooks, world‑building, and discovery drive motivation

5. **Low‑Pressure Motivation**
   - Personal growth over competition
   - Rewards without leaderboard anxiety

---

## 4. In‑Scope Features (v1–v2 Horizon)
These are expected to exist or be actively developed.

### Learning Experience
- Lessons structured as quests
- Mini‑games reinforcing lesson objectives
- Embedded quizzes with immediate feedback
- Story hooks and contextual challenges

### Gamification
- XP and level progression
- Achievements and badges
- In‑game currency and unlockables

### Progress & Insight
- Per‑learner progress tracking
- Mastery indicators
- Time‑on‑task and attempt metrics

### Admin & Teacher Tools
- Lesson and content management
- School, grade, subject configuration
- Student progress visibility

### Platform Foundations
- React‑based frontend
- Python (FastAPI) backend
- PostgreSQL as source of truth
- JWT auth with Argon2 password hashing

---

## 5. Explicit Non‑Goals (For Now)
These should **not** be treated as missing features.

- Real‑time multiplayer gameplay
- High‑stakes exams or timed tests
- Competitive global leaderboards
- External LMS integrations
- Monetization beyond pilot‑friendly models

---

## 6. Evolution Rules
Guidance for future expansion and roadmap decisions:

- New game engines are **plug‑ins**, not replacements
- Narrative depth increases after core learning loops stabilize
- Mobile apps follow PWA maturity (offline‑first priority)
- Cultural breadth expands island‑by‑island

---

## 7. Quality & Security Principles
- Deterministic curriculum data seeding
- Role‑based access (student, teacher, admin)
- Testable, maintainable APIs
- CI‑friendly architecture

---

## 8. Alignment Contract
If a feature:
- Does not support a Core Pillar, or
- Adds complexity without learner value

…it should be questioned, deferred, or removed.

This document is the **alignment contract** used by GSD to detect drift, gaps, and mis‑prioritization.

