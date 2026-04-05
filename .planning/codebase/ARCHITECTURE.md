# Architecture

**Analysis Date:** 2026-04-05

## Pattern Overview

**Overall:** Decoupled Service-Oriented Architecture with Nginx Reverse Proxy.

QuestLab utilizes a containerized multi-tier architecture designed for scalability and clear separation of concerns.

## Layers

**1. Proxy / Gateway (Nginx)**
- Handles SSL termination via Certbot.
- Routes `/api/*` and `/uploads/*` to the Backend.
- Serves the built React SPA for all other requests.

**2. Client (React SPA)**
- React 19 + TypeScript.
- Component-driven architecture using Radix UI and Tailwind CSS 4.
- State management via server-state (Axios) and local hooks.

**3. Server (FastAPI API)**
- Modularized via `APIRouter` (e.g., `auth`, `lessons`, `badges`).
- Asynchronous execution for performance.
- Stateless JWT authentication.

**4. Database (PostgreSQL)**
- Relational schema managed via SQLAlchemy 2.0.
- Persistent storage via Docker volumes.

## Data Flow

1. **Client Request**: Browser hits `questlab.onan.shop`.
2. **Nginx Routing**: Nginx serves static files or proxies to the backend container.
3. **Backend Processing**: FastAPI validates the request (Schema), applies Auth (Dependency), and interacts with the DB (Model).
4. **Response**: JSON payload returned to the SPA for UI update.

## Cross-Cutting Concerns

- **Auth**: JWT Bearer tokens with Argon2 password hashing.
- **Validation**: Strict Pydantic schemas for all API I/O.
- **Testing**: Playwright for cross-browser E2E verification.

---

*Architecture analysis: 2026-04-05*
