# Technology Stack

**Analysis Date:** 2024-07-30

## Languages

**Primary:**
- TypeScript - Frontend development (React)
- Python - Backend development (FastAPI)

## Runtime

**Environment:**
- Node.js 18 - Frontend build and execution in development
- Python 3.10+ - Backend execution
- Nginx - Frontend static file serving and reverse proxy
- PostgreSQL 15 - Database server

**Package Manager:**
- npm - Frontend package management
- pip - Backend package management
- Lockfile: `frontend/package-lock.json` (npm), `backend/requirements.txt` (pip)

## Frameworks

**Core:**
- React 19 - Frontend UI library (`frontend/package.json`)
- FastAPI 0.128 - Backend API framework (`backend/requirements.txt`, `backend/main.py`)
- Radix UI - Frontend UI component library (`frontend/package.json`)
- Tailwind CSS - Frontend utility-first CSS framework (`frontend/package.json`)

**Testing:**
- Playwright - End-to-end testing (`playwright.config.ts`)
- Pytest - Backend unit/integration testing (`backend/requirements.txt`, `backend/tests/`)

**Build/Dev:**
- Vite 7.2 - Frontend build tool (`frontend/package.json`, `frontend/vite.config.ts`)
- Uvicorn - ASGI server for FastAPI (`backend/requirements.txt`)
- Docker - Containerization (`Dockerfile` in `frontend/` and `backend/`)
- Docker Compose - Orchestration of multi-container applications (`docker-compose.yml`)

## Key Dependencies

**Critical:**
- SQLAlchemy 2.0 - Python ORM for database interactions (`backend/requirements.txt`, `backend/models.py`, `backend/database.py`)
- Psycopg2-binary - PostgreSQL adapter for Python (`backend/requirements.txt`)
- Pydantic - Data validation and settings management for Python (`backend/requirements.txt`)
- Axios - Promise-based HTTP client for the browser and node.js (`frontend/package.json`)
- React Router DOM - Declarative routing for React (`frontend/package.json`)
- Sentry SDK - Error tracking and performance monitoring (`backend/requirements.txt`)

**Infrastructure:**
- Nginx - Web server and reverse proxy (`nginx/nginx.conf`, `frontend/Dockerfile`, `docker-compose.yml`)
- Certbot - Automatic SSL/TLS certificate management (`certbot/`, `docker-compose.yml`)
- Python-dotenv - Loading environment variables from `.env` files (`backend/requirements.txt`)
- Argon2-cffi, Passlib, Python-jose - Security and authentication related libraries (`backend/requirements.txt`)

## Configuration

**Environment:**
- Environment variables are loaded from `.env` files, typically managed by `python-dotenv` in the backend and potentially directly by the build process in the frontend.
- Key configurations for services are defined in `docker-compose.yml`.

**Build:**
- Frontend: `vite.config.ts` for Vite, `frontend/Dockerfile` for Docker build.
- Backend: `backend/requirements.txt` for Python dependencies, `backend/Dockerfile` for Docker build.

## Platform Requirements

**Development:**
- Docker Desktop (or equivalent Docker engine) for running services.
- Node.js and npm (or yarn) for frontend development outside Docker.
- Python and pip for backend development outside Docker.

**Production:**
- Docker compatible environment (e.g., Linux server with Docker Engine) for container deployment.
- Potentially a cloud provider for hosting (e.g., AWS, GCP, Azure, DigitalOcean).

---

*Stack analysis: 2024-07-30*
