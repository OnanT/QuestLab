# Architecture

**Analysis Date:** 2024-08-01

## Pattern Overview

**Overall:** Client-Server Architecture with a Reverse Proxy

The project follows a classic three-tier architecture, composed of a client (frontend), a server (backend), and a database. The entire application is containerized using Docker and orchestrated via `docker-compose.yml`.

**Key Characteristics:**
- **Monolithic Backend:** A single FastAPI application serves all API endpoints.
- **Single-Page Application (SPA) Frontend:** A React application provides the user interface.
- **Reverse Proxy Gateway:** Nginx acts as the single entry point for all traffic, routing requests to either the frontend or backend service and handling SSL termination.

## Layers

**1. Proxy / Gateway (Nginx)**
- **Purpose:** To act as a secure entry point, handle SSL, and route traffic.
- **Location:** `nginx/`
- **Contains:** Nginx configuration files (`nginx.conf`).
- **Behavior:**
    - Listens on ports 80 and 443.
    - Redirects all HTTP traffic to HTTPS.
    - Serves the static frontend application for root (`/`) requests.
    - Forwards all requests prefixed with `/api/` to the backend service.
    - Forwards requests to `/uploads/` to the backend service.

**2. Client (React SPA)**
- **Purpose:** To provide a dynamic and responsive user interface in the browser.
- **Location:** `frontend/`
- **Contains:** React components, pages, routing logic, and static assets, written in TypeScript.
- **Depends on:** The backend API for all data and business logic.
- **Used by:** End-users via their web browsers.

**3. Server (FastAPI API)**
- **Purpose:** To handle business logic, process data, manage user authentication, and interact with the database.
- **Location:** `backend/`
- **Contains:** Python code, API endpoints (routers), database models (SQLAlchemy), and business logic.
- **Depends on:** The PostgreSQL database for data persistence.
- **Used by:** The frontend application.

**4. Database (PostgreSQL)**
- **Purpose:** To provide persistent storage for all application data.
- **Location:** Managed by Docker; configuration is in `postgres-config/`.
- **Contains:** Relational data tables (users, lessons, quizzes, etc.).
- **Used by:** The backend service exclusively.

## Data Flow

**Initial Page Load:**
1. User's browser sends a GET request to `https://questlab.onan.shop/`.
2. Nginx receives the request on port 443.
3. The `location /` block matches, and Nginx serves the static `index.html` file from `/usr/share/nginx/html` (the built React app).
4. The browser loads the React application's JavaScript and CSS assets.

**API Data Request (e.g., fetching lessons):**
1. The React app (running in the browser) makes a GET request to `/api/lessons/`.
2. The browser sends this request to `https://questlab.onan.shop/api/lessons/`.
3. Nginx receives the request. The `location /api/` block matches.
4. Nginx proxies the request to the `backend` service at `http://backend:8000/lessons/`.
5. The FastAPI application receives the request, processes it through the `lessons` router, fetches data from the PostgreSQL database, and returns a JSON response.
6. The response travels back through Nginx to the user's browser, where the React app consumes the data and updates the UI.

## Key Abstractions

**API Routers**
- **Purpose:** To group related API endpoints into modular files.
- **Examples:** `backend/routers/users.py`, `backend/routers/lessons.py`, `backend/routers/admin.py`.
- **Pattern:** Each file defines a `fastapi.APIRouter` which is then included in the main application instance in `backend/main.py`.

**ORM Models**
- **Purpose:** To define the database schema and interact with it using Python objects instead of raw SQL.
- **Examples:** `backend/models.py` contains classes like `User`, `Lesson`, and `Quiz` that map to database tables via SQLAlchemy.

**React Components & Pages**
- **Purpose:** To create a reusable and organized UI.
- **Examples:**
  - Reusable UI elements: `frontend/src/components/ui/`
  - Page-level components: `frontend/src/pages/`
  - Application layout: `frontend/src/App.tsx`

## Entry Points

**Orchestration:**
- **Location:** `docker-compose.yml`
- **Triggers:** Running `docker-compose up`.
- **Responsibilities:** Defines and launches the `frontend`, `backend`, `db`, and `nginx` services.

**Web Traffic:**
- **Location:** `nginx/nginx.conf`
- **Triggers:** Any HTTP/HTTPS request to the server's domain.
- **Responsibilities:** Routing traffic to the correct service.

**Backend API Server:**
- **Location:** `backend/main.py`
- **Triggers:** Started by `uvicorn` within the backend Docker container.
- **Responsibilities:** Initializes the FastAPI app, includes all routers, and creates database tables.

**Frontend Application:**
- **Location:** `frontend/src/main.tsx`
- **Triggers:** Loaded by the browser when `index.html` is served.
- **Responsibilities:** Renders the root React component and sets up client-side routing.

## Error Handling

**Strategy:** Centralized in the backend, client-side handling for UI feedback.
- **Backend:** FastAPI uses standard HTTP status codes (e.g., `404 Not Found`, `422 Unprocessable Entity`). Custom exceptions are likely handled by FastAPI's exception middleware.
- **Frontend:** API requests made with `axios` use `try/catch` blocks or `.catch()` promises to handle non-2xx responses from the backend and update the UI accordingly (e.g., showing an error message).

## Cross-Cutting Concerns

**Authentication:**
- **Approach:** Implemented using JSON Web Tokens (JWT).
- **Location:** `backend/routers/auth.py` handles token creation and validation. `passlib` is used for password hashing. API endpoints are protected using FastAPI dependencies that verify the JWT.

**Validation:**
- **Approach:** Pydantic models are used for request and response validation.
- **Location:** `backend/schemas.py` defines the data shapes for API inputs and outputs. FastAPI automatically validates incoming request bodies against these schemas.

---
*Architecture analysis: 2024-08-01*
