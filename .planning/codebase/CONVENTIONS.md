# Coding Conventions

**Analysis Date:** 2024-07-25

## Naming Patterns

### Frontend (TypeScript/React)

- **Files:** `PascalCase` for component files (e.g., `StudentDashboard.tsx`, `LessonsPage.tsx`).
- **Components:** `PascalCase` for React components (e.g., `AuthProvider`, `ProtectedRoute`).
- **Functions:** `camelCase` for functions and methods (e.g., `login`, `register`).
- **Variables:** `camelCase` for general variables (e.g., `user`, `loading`). `UPPER_SNAKE_CASE` for module-level constants (e.g., `BACKEND_URL`).
- **Types:** `PascalCase` for `interface` and `type` definitions (e.g., `AuthContextType`).

### Backend (Python)

- **Files:** `snake_case` for modules (e.g., `users.py`, `dependencies.py`).
- **Functions:** `snake_case` for functions (e.g., `read_users_me`, `get_current_user`).
- **Variables:** `snake_case` for variables (e.g., `current_user`, `db_student`).

## Code Style

### Frontend (TypeScript/React)

- **Formatting:** No `.prettierrc` file was detected. Formatting is not strictly enforced. Source files show a style consistent with Prettier defaults (2-space indentation, double quotes, semicolons).
- **Styling:** Primarily uses utility classes in `className` attributes, consistent with a framework like Tailwind CSS. A global `App.css` file also exists.
- **Linting:** ESLint is used. The configuration is in `frontend/eslint.config.js`.
  - It extends `eslint:recommended` and `typescript-eslint:recommended`.
  - It uses plugins for React Hooks (`eslint-plugin-react-hooks`) and React Refresh (`eslint-plugin-react-refresh`).

### Backend (Python)

- **Formatting:** No `black`, `isort`, or other formatter configurations were detected. Formatting is not programmatically enforced. Code generally follows PEP 8 guidelines (e.g., 4-space indentation).
- **Linting:** No `flake8` or other linter configurations were detected. Linting is not programmatically enforced.
- **Typing:** Python type hints are used for function signatures in FastAPI routes (e.g., `db: Session = Depends(get_db)`), but are not applied to all internal variables.

## Import Organization

### Frontend (TypeScript/React)

Imports are manually grouped in the following order:
1.  External libraries (`react`, `axios`).
2.  Internal components/pages (`./pages/LandingPage`).
3.  CSS files (`./App.css`).
- **Path Aliases:** No `tsconfig.json` path aliases are configured. Imports use relative paths.

### Backend (Python)

Imports are manually grouped in the following order:
1.  External libraries (`fastapi`, `sqlalchemy`).
2.  Internal project modules (`models`, `schemas`, `dependencies`).

## Error Handling

### Frontend (TypeScript/React)

- **Async Operations:** `try...catch` blocks are used within async functions to handle API call failures.
- **Global Errors:** An `axios` response interceptor in `frontend/src/App.tsx` handles `401 Unauthorized` errors by clearing local storage and redirecting to the login page.
- **User Feedback:** The `sonner` library (`toast`) is used to display success or error messages to the user.

### Backend (Python)

- **HTTP Errors:** `fastapi.HTTPException` is raised to return specific HTTP error codes and details to the client (e.g., for "Not Found" or "Forbidden").
- **Database Errors:** `try...except IntegrityError` blocks are used around database commits (`db.commit()`) to handle transaction failures and ensure the session is rolled back.

## Comments

- **Frontend:** Occasional single-line comments are present. JSDoc/TSDoc is not consistently used.
- **Backend:** Docstrings and comments are largely absent. Code is expected to be self-documenting.

---

*Convention analysis: 2024-07-25*
