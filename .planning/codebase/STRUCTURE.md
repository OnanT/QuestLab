# Codebase Structure

**Analysis Date:** 2024-08-01

## Directory Layout

```
questlab/
├── backend/          # Python FastAPI backend application
├── certbot/          # Let's Encrypt certificate files
├── frontend/         # React (Vite + TypeScript) frontend application
├── nginx/            # Nginx reverse proxy configuration
├── postgres-config/  # PostgreSQL configuration files
├── tests/            # End-to-end and integration tests (Playwright)
├── .planning/        # GSD agent planning and analysis documents
├── docker-compose.yml # Main Docker orchestration file
├── package.json      # Root project dependencies (e.g., for Playwright)
└── README.md         # Project README
```

## Directory Purposes

**`backend/`**
- **Purpose:** Contains the entire backend API server.
- **Contains:** Python source code (`.py`), dependency lists (`requirements.txt`), and the Dockerfile for the backend service.
- **Key subdirectories:**
    - `routers/`: API endpoint definitions, with one file per resource (e.g., `users.py`, `lessons.py`).
    - `admin/`: A sub-package for admin-specific API endpoints.
    - `models.py`: SQLAlchemy ORM models that define the database tables.
    - `schemas.py`: Pydantic schemas for data validation and serialization.
    - `database.py`: Database connection and session management.
    - `main.py`: The main FastAPI application entry point.

**`frontend/`**
- **Purpose:** Contains the entire frontend Single-Page Application (SPA).
- **Contains:** TypeScript (`.ts`, `.tsx`), CSS, and static assets.
- **Key subdirectories:**
    - `src/`: The main application source code.
    - `src/components/`: Reusable React components (e.g., buttons, cards).
    - `src/pages/`: Top-level components representing application pages/routes.
    - `src/lib/`: Utility functions and shared logic.
    - `public/`: Static assets that are copied directly to the build output.
    - `vite.config.ts`: Vite build and development server configuration.

**`nginx/`**
- **Purpose:** Holds the configuration for the Nginx reverse proxy.
- **Contains:** `nginx.conf`, which defines routing, SSL, and proxying rules.

**`postgres-config/`**
- **Purpose:** Stores the configuration files for the PostgreSQL database container.
- **Contains:** `postgresql.conf` and `pg_hba.conf`.

**`tests/`**
- **Purpose:** Contains end-to-end tests for the application.
- **Contains:** Playwright test scripts (`.spec.ts`) that simulate user interactions in a browser.

## Key File Locations

**Orchestration & Entry Points:**
- `docker-compose.yml`: Defines and configures all services (`backend`, `frontend`, `db`, `nginx`). This is the primary entry point for starting the entire application stack.
- `nginx/nginx.conf`: The main web server configuration, routing all incoming traffic.
- `backend/main.py`: The entry point for the Python API server, where the FastAPI app is initialized.
- `frontend/src/main.tsx`: The entry point for the React application, where the root component is rendered into the DOM.

**Configuration:**
- `backend/config.py`: Backend configuration, loaded from environment variables using Pydantic's `BaseSettings`.
- `frontend/vite.config.ts`: Frontend build, dev server, and path alias configuration.
- `package.json` (root): Defines dev dependencies for running tests (e.g., Playwright).
- `frontend/package.json`: Defines frontend dependencies and scripts.
- `backend/requirements.txt`: Defines backend Python dependencies.

**Core Logic:**
- `backend/routers/`: Business logic is primarily located within the API endpoint functions in this directory.
- `backend/models.py`: Defines the application's data structure and relationships.
- `frontend/src/pages/`: Contains the primary logic for each view in the user interface.

## Naming Conventions

**Files:**
- **Backend (Python):** `snake_case.py` (e.g., `lessons.py`, `database.py`).
- **Frontend (TypeScript/React):** `PascalCase.tsx` for components (e.g., `LessonCard.tsx`) and `camelCase.ts` for non-component files (e.g., `apiClient.ts`).
- **Tests:** `kebab-case.spec.ts` or `snake_case_test.ts` (e.g., `games_page_test.ts`).

**Directories:**
- Generally `kebab-case` or `snake_case` (e.g., `postgres-config`, `test-scripts`).

## Where to Add New Code

**New API Feature (e.g., "Comments"):**
1.  **Router:** Create a new router file `backend/routers/comments.py`.
2.  **Schema:** Add `CommentCreate`, `CommentUpdate`, `CommentOut` schemas to `backend/schemas.py`.
3.  **Model:** Add a `Comment` model to `backend/models.py` and generate a migration.
4.  **Integration:** Import and include the new router in `backend/main.py`.

**New Frontend Page (e.g., "Profile Page"):**
1.  **Component:** Create the page component file at `frontend/src/pages/ProfilePage.tsx`.
2.  **API Client:** Add functions to interact with the profile API endpoints (likely in a shared API client module).
3.  **Routing:** Add a new route in the client-side router (likely in `frontend/src/App.tsx`) that maps a URL path to `ProfilePage`.

**New Shared UI Component (e.g., "Avatar"):**
- **Implementation:** Create the component file at `frontend/src/components/ui/Avatar.tsx`. Import and use it in other components or pages.

**New E2E Test:**
- **Test File:** Add a new test file in the `tests/` directory, such as `profile-page.spec.ts`.

---
*Structure analysis: 2024-08-01*
