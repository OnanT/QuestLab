# Codebase Concerns

**Analysis Date:** 2024-07-25

## Security Considerations

**Default Secret Key:**

- **Risk:** The `SECRET_KEY` used for signing JWTs is a default, publicly known value: "your_super_secret_key_here_change_this_in_production". This allows anyone to forge authentication tokens, granting them unauthorized access to any user's account and protected endpoints. This is a critical vulnerability.
- **Files:** `backend/.env`, `backend/config.py`, `backend/config.py.backup`, `test-scripts/main.py.backup2`
- **Current mitigation:** None.
- **Recommendations:** Immediately generate a strong, random secret and load it from a secure environment variable in production. The `.env` file should be for local development only and should not be committed to version control.

**Hardcoded Database Password:**

- **Risk:** The PostgreSQL database password is hardcoded directly into `.env` and other backup files. If these files are ever accidentally committed to version control, the database credentials will be exposed, leading to a full data breach.
- **Files:** `.env`, `.env.backup2`, `.env.backup3`, `test-scripts/dbtest.py`, `docker-compose.yml` (references the env var). The password appears to be `QuestSecureTurtle` or `QuestSecureTurtle`.
- **Current mitigation:** Relies on `.env` not being checked into git.
- **Recommendations:** Use a secrets management system (like Doppler, Vault, or cloud-provider-specific services) for production. For local development, ensure `.env` is in `.gitignore`.

**Weak Passwords in Scripts:**

- **Risk:** Various scripts for seeding and testing use extremely weak, hardcoded passwords like "password123", "admin123", etc. This promotes a poor security culture and could lead to these passwords being used in staging or even production environments.
- **Files:** `load-seed1.sh`, `test-scripts/create_demo_users.py`, `tests/games_page_test.ts`
- **Current mitigation:** None.
- **Recommendations:** Scripts should generate random passwords or pull from secure environment variables. Avoid committing any passwords to version control.

## Tech Debt

**Hardcoded Data Seeding:**

- **Issue:** The primary data seeding mechanism relies on a massive, highly-repetitive SQL file (`seed_nev_dom_expanded.sql`).
- **Files:** `backend/seed_nev_dom_expanded.sql` (1.9MB), `questlab_full.sql` (132KB)
- **Impact:** Extremely difficult to maintain, update, or understand the seed data. Adding a new concept or grade level requires duplicating large blocks of SQL, which is error-prone and time-consuming.
- **Fix approach:** Refactor data seeding into a programmatic script (e.g., in `generate_seed_data.py`). Data should be defined in a more abstract, maintainable format like JSON or CSV, and the script should generate the SQL dynamically.

**Frontend "TODO" Comments:**

- **Issue:** The codebase contains `TODO` comments indicating incomplete or temporary implementations.
- **Files:**
  - `frontend/src/pages/QuizPlayerPage.jsx`: "TODO: This is a temporary fix to address the data model mismatch." This suggests a potential bug or inconsistency between frontend and backend data models.
  - `frontend/src/components/LoginForm.jsx`: "TODO: replace with API call". This component likely uses mock data and is not functional.
- **Impact:** These represent known-incomplete work that can lead to bugs or unexpected behavior.
- **Fix approach:** Address each TODO. Investigate the data model mismatch in `QuizPlayerPage.jsx` and implement the actual API call in `LoginForm.jsx`.

**Potentially Overly-Complex Components:**

- **Issue:** Some frontend page components are significantly larger than others, suggesting they may have too many responsibilities (god components).
- **Files:** `frontend/src/pages/CreateLessonPage.jsx` (76KB), `frontend/src/pages/AdminDashboard.jsx` (56KB)
- **Impact:** Large components are difficult to test, maintain, and reason about. They often lead to bugs when changes are made.
- **Fix approach:** Review these components and break them down into smaller, single-responsibility sub-components. Extract complex logic into custom hooks.

## Test Coverage Gaps

**Backend API Coverage:**

- **What's not tested:** The vast majority of the backend API. There is only one test file (`backend/tests/test_main.py`) for 14 router files that define the core application logic.
- **Files:** All files in `backend/routers/`, including critical ones like `auth.py`, `users.py`, `quizzes.py`, and `lessons.py`.
- **Risk:** Critical bugs in business logic, authentication, and authorization can go unnoticed. Refactoring or adding new features is extremely risky and likely to cause regressions.
- **Priority:** High.

**Frontend Test Coverage:**

- **What's not tested:** Component-level behavior and unit logic. There are only 3 Playwright E2E test files for the entire frontend, which consists of many pages and UI components.
- **Files:** All files under `frontend/src/pages` and `frontend/src/components`.
- **Risk:** UI components can have visual regressions or broken states that are not caught automatically. Business logic within components is untested.
- **Priority:** Medium. It's less critical than the backend gap but still significant for ensuring a stable user experience.
