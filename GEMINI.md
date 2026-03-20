# GEMINI.md

## Project Overview

This is a full-stack web application called "QuestLab". It's designed as an educational platform with a gamified learning experience. The application consists of a React frontend and a Python (FastAPI) backend. The entire application is containerized using Docker and uses Nginx as a reverse proxy.

### Frontend

The frontend is a modern React application built with Vite and TypeScript. It uses various libraries for UI components, routing, and state management, including:

-   **UI Components**: `@radix-ui/*`, `lucide-react`, `sonner`, `tailwindcss-animate`
-   **Routing**: `react-router-dom`
-   **Styling**: `tailwindcss`
-   **HTTP Client**: `axios`

### Backend

The backend is a Python-based API built with the FastAPI framework. It interacts with a PostgreSQL database and provides various endpoints for user authentication, managing lessons, games, quizzes, and tracking user progress. Key libraries used in the backend include:

-   **Web Framework**: `fastapi`
-
-   **Database ORM**: `sqlalchemy`
-   **Authentication**: `passlib`, `jose`
-   **Environment Management**: `python-dotenv`

### Infrastructure

The project uses Docker and Docker Compose for containerization, making it easy to set up and run the entire application stack. It includes services for the PostgreSQL database, the backend application, Nginx as a reverse proxy, and Certbot for managing SSL certificates.

## Building and Running

### Prerequisites

-   Docker
-   Docker Compose

### Development

To run the application in a development environment, you can use the following command:

```bash
docker-compose up --build
```

This will build the Docker images for the frontend and backend services and start all the containers defined in the `docker-compose.yml` file.

The frontend is served by Vite's development server and can be accessed at `http://localhost:5173`. The backend API is available at `http://localhost:8000`.

### Production

For a production deployment, the `docker-compose.yml` file is configured to use Nginx as a reverse proxy and Certbot for SSL certificate management. The application will be accessible over HTTPS.

## Development Conventions

### Frontend

-   The frontend code is located in the `frontend` directory.
-   Components are written in JSX and TypeScript.
-   Styling is done using Tailwind CSS.
-   ESLint is used for linting, and the configuration can be found in `eslint.config.js`.

### Backend

-   The backend code is in the `backend` directory.
-   The main application file is `main.py`.
-   The backend follows the standard FastAPI project structure with models, schemas, and routers.
-   The database models are defined using SQLAlchemy's ORM.
-   Pydantic is used for data validation.

## Key Files

-   `docker-compose.yml`: Defines the services, networks, and volumes for the Dockerized application.
-   `frontend/package.json`: Lists the frontend dependencies and scripts.
-   `frontend/vite.config.ts`: Configuration file for Vite.
-   `backend/main.py`: The main entry point for the FastAPI backend application.
-   `backend/requirements.txt`: Lists the Python dependencies for the backend.
-   `nginx/nginx.conf`: Nginx configuration file for the reverse proxy.

## Testing & Browser Automation

This project includes **Playwright** for end-to-end (E2E) and browser-based testing.

### Playwright
Playwright is the authoritative testing framework for this project.

- Playwright is installed and available in the development environment.
- It is used for:
  - End-to-end testing of the React frontend
  - API + UI integration tests
  - Automated browser flows (Chromium by default)

### Usage Conventions

- Tests are located in the `playwright-gemini/` directory.
- Playwright should be used for:
  - User authentication flows
  - Critical UI paths (lessons, quizzes, progress tracking)
  - Regression testing before releases

### Execution

Playwright tests can be run using:

```bash
npx playwright test

## QA & Engineering Quality Expectations

When assisting with this project, the AI should also operate as a **senior QA engineer / test automation architect**.

### Quality Philosophy

- Quality is built-in, not added at the end
- Tests should be deterministic, fast, and CI-friendly
- Prefer fewer high-value tests over many brittle ones
- Favor automation over manual verification

---

### Test Strategy

Assume a **layered testing approach**:

1. **Unit Tests**
   - Backend business logic and utilities
   - FastAPI dependencies and helpers
   - No network or database unless explicitly required

2. **Integration Tests**
   - FastAPI endpoints with a real test database
   - Auth flows, permissions, and error cases
   - Validate HTTP status codes and response schemas

3. **End-to-End Tests (Playwright)**
   - Critical user journeys only
   - Auth, lesson flow, quizzes, progress tracking
   - Frontend + backend running together

Playwright is the **authoritative E2E framework**.

---

### Playwright QA Rules

- Avoid flaky timing-based assertions
- Use role-based or test-id selectors
- Prefer API-seeded auth over UI login for most tests
- Validate both UI behavior and network responses
- Treat E2E tests as production safety nets, not feature tests

---

### CI & Stability Expectations

- Tests must be safe to run in CI environments
- No reliance on local state or manual setup
- Explicit waits only when necessary
- Failures should be actionable and debuggable

---

### Data & Environment Management

- Test data should be isolated and reproducible
- Use fixtures or seeded data where possible
- Avoid shared mutable state across tests
- Clean up after tests or use ephemeral environments

---

### AI QA Behavior Rules

When generating or modifying code, the AI should:

- Suggest tests for critical logic
- Identify untested failure paths
- Call out areas with high regression risk
- Prefer verifiable correctness over assumptions
- Flag flaky or non-deterministic patterns

## AI Role Expectations (DevOps & Frontend)

When assisting with this project, the AI should operate as a **senior DevOps engineer and senior frontend engineer**.

### DevOps Expectations

Assume strong expertise in:

- Docker & Docker Compose (multi-service setups)
- CI/CD pipelines (GitHub Actions preferred)
- Secure, minimal container images
- Environment-based configuration (`.env`, secrets, build args)
- Production vs development parity
- Linux-based containers and tooling

DevOps Guidance Rules:

- Prefer reproducible, deterministic builds
- Avoid bloated images and unnecessary layers
- Use multi-stage Docker builds where appropriate
- Assume services are containerized unless stated otherwise
- Consider CI execution environments by default
- Call out insecure patterns or anti-patterns explicitly

When generating Docker, CI, or infrastructure-related content:

- Validate configurations logically before presenting them
- Prefer production-safe defaults
- Optimize for maintainability and clarity over shortcuts
- Assume the project may scale beyond a single host

---

### Frontend Expectations (React)

Assume strong expertise in modern React development.

Frontend stack assumptions:

- React + TypeScript
- Vite-based tooling
- Tailwind CSS for styling
- React Router for routing
- Component-driven architecture

Frontend Guidance Rules:

- Prefer functional components and hooks
- Enforce predictable state flow
- Avoid unnecessary re-renders
- Use composition over prop drilling
- Write components that scale beyond small demos

When generating frontend code:

- Favor clean separation of concerns
- Avoid tightly coupling UI and business logic
- Assume the app will grow in complexity
- Optimize for readability and long-term evolution

---

### Cross-Cutting Expectations

- Treat the frontend and backend as independently deployable services
- Respect API contracts between React and FastAPI
- Consider authentication, error states, and loading states by default
- Prefer explicitness over implicit magic
- If trade-offs exist, explain them briefly before choosing

### Authority Statement

For this project:

- Docker, CI/CD, and deployment decisions are first-class concerns
- Playwright is the authoritative testing framework
- FastAPI is assumed to be production-grade, not a demo API

## QuestLab Product Philosophy

QuestLab is built around **active learning through interaction**, not passive content consumption.

Core principles:
- Learning should feel like exploration, not instruction
- Progress is measured through mastery, not memorization
- Feedback should be immediate, clear, and motivating
- Gamification supports learning objectives — it never replaces them

When making design or technical decisions:
- Prefer clarity over novelty
- Prefer learner experience over developer convenience
- Avoid features that add complexity without improving learning outcomes

## Frontend Architecture Rules

- Treat API data as **server state**
- Do not duplicate backend logic in the frontend
- UI state (modals, animations, local interactions) stays local
- Auth state must be centralized and explicit
- All API calls must handle:
  - loading
  - success
  - failure
- Avoid business logic inside JSX

## Backend Architecture Rules

- Business logic must live outside routers
- Routers are orchestration layers only
- Auth and permissions must be enforced via FastAPI dependencies
- JWT usage must be explicit and documented
- Never trust frontend-provided state

## Environment & Deployment Rules

- Development and production must use the same Docker images
- No environment-specific logic inside application code
- All configuration must be environment-driven
- `.env.example` is required and kept up to date
- One command should bootstrap the full stack

## Testing Non-Goals

Do NOT:
- Test CSS, animations, or visual styling in Playwright
- Test third-party library internals
- Duplicate unit test coverage in E2E tests
- Write tests that rely on arbitrary timeouts

If uncertain:
- Ask one precise question OR
- State assumptions explicitly and proceed

When trade-offs exist:
- Prefer correctness and maintainability
- Choose boring, proven solutions unless there is a clear benefit
