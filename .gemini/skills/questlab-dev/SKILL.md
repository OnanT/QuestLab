---
name: questlab-dev
description: Comprehensive technical orchestration for the QuestLab platform. Use when planning features, executing tasks, or debugging within the QuestLab (FastAPI/React/Docker) stack.
---

# QuestLab Developer Skill

This skill transforms Gemini CLI into a senior developer and architect specifically for the QuestLab project. It synthesizes the **Get Shit Done (GSD)** methodology with QuestLab's unique technical stack.

## Core Principles

- **Vertical Slices**: Always plan and implement features end-to-end (Database → API → UI) rather than in layers.
- **Goal-Backward Verification**: Start with what must be TRUE for the user, then define what must EXIST to support it.
- **Atomic Commits**: Every task execution must produce a specific commit in the format: `{type}({phase}-{plan}): {description}`.
- **Docker-First**: Assume all services run in Docker. Use `docker compose` logs and exec for debugging.
- **Asynchronous Emails**: All email logic must utilize Celery and FastAPI-Mail.

## 1. Research & Discovery

When starting a new feature or phase:

1.  **Map the Codebase**: Identify affected models in `backend/models.py`, routers in `backend/routers/`, and components in `frontend/src/`.
2.  **Verify Assumptions**: Use `grep` to check if a pattern (like a specific auth dependency) is already used.
3.  **Check for Stubs**: Look for `TODO` or `NotImplementedError` in areas you are touching.

## 2. Planning (Goal-Backward)

When creating a plan:

1.  **Define Success Criteria**: What 2-3 observable behaviors will prove this feature works?
2.  **Decompose into Tasks**: Break the phase into 2-3 tasks max.
3.  **Task Requirements**:
    - `<files>`: Exact paths.
    - `<action>`: Precise technical instructions.
    - `<verify>`: CLI commands (e.g., `pytest`, `curl`, `npx playwright test`).
    - `<done>`: Measurable acceptance criteria.

## 3. Execution (Atomic)

For every task:

1.  **RED**: Write a failing test (if logic-heavy).
2.  **GREEN**: Implement the minimal code to pass.
3.  **CLEAN**: Refactor and ensure all linting/formatting passes.
4.  **COMMIT**: Stage only task-related files and commit.

## 4. Verification

Never declare a phase complete until:

1.  **Level 1 (Existence)**: All planned files exist.
2.  **Level 2 (Substantive)**: Files contain real implementation, not just boilerplate or stubs.
3.  **Level 3 (Wired)**: The frontend calls the API, the API calls the DB, and data is rendered.

## 5. Technical Context (QuestLab Stack)

### Backend (FastAPI)

- Use Pydantic schemas for request/response validation.
- Enforce auth via `dependencies.py` (e.g., `get_current_user`).
- Business logic lives in `modules/` or `utils/`, routers only orchestrate.

### Frontend (React + Vite)

- Use Tailwind CSS for styling (prefer Vanilla CSS/Tailwind over third-party component libs unless already used).
- Centralize API calls using the established `axios` pattern.
- Handle loading/error states in every component.

### Infrastructure

- Nginx acts as the reverse proxy.
- PostgreSQL stores all relational data.
- Celery + Redis handles background tasks (emails, data processing).

## Anti-Patterns to Avoid

- **No Shared Mutable State**: Do not share state across unrelated layers.
- **No Manual CLI in Checkpoints**: Never ask the user to run a command that Claude can run (e.g., `npm install`, `docker compose up`).
- **No Horizontal Layers**: Don't plan "all models" in one phase and "all UI" in another.
- **No Blind Refactoring**: Do not "cleanup" code outside your current task scope.
