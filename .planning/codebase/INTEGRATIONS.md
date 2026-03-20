# External Integrations

**Analysis Date:** 2024-07-28

## APIs & External Services

**Error Tracking:**
- Sentry - Error tracking and performance monitoring for the backend.
  - SDK/Client: `sentry-sdk` (Python)
  - Auth: DSN is currently hardcoded in `venv/lib/python3.12/site-packages/fastapi_cloud_cli/utils/sentry.py`. It should ideally be configured via environment variables.

## Data Storage

**Databases:**
- PostgreSQL (version 15)
  - Connection: Configured via `DATABASE_URL` environment variable, e.g., `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}`.
  - Client: `SQLAlchemy` (ORM) and `psycopg2-binary` (driver) in the backend.
  - Persistence: Data is stored in a Docker volume `postgres_data`.
  - Initialization: `init.sql` is executed on container startup for database schema creation.

**File Storage:**
- Local filesystem within the backend container, mounted via a Docker volume.
  - Path: `/app/uploads` within the container, mapped to `uploads_volume` Docker volume.
  - Serving: Files are served by the backend via the `/uploads/` endpoint, proxied by Nginx.

**Caching:**
- None detected.

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication implemented in the backend.
  - Implementation: Uses `python-jose` and `passlib[bcrypt]` for token generation/validation and password hashing.
  - Configuration: `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES` are environment variables configured in `backend/config.py`.

## Monitoring & Observability

**Error Tracking:**
- Sentry (as noted above).

**Logs:**
- Standard application logs for backend are likely directed to `stdout`/`stderr` of the Docker containers, which Docker handles.
- Nginx access and error logs are configured to `/var/log/nginx/access.log` and `/var/log/nginx/error.log` respectively, and mounted from `./nginx/nginx.conf`.

## CI/CD & Deployment

**Hosting:**
- Dockerized deployment, likely on a Linux server.

**CI Pipeline:**
- Not detected within the provided codebase structure.

## Environment Configuration

**Required env vars:**
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL` (constructed from above, or explicitly set)
- `SECRET_KEY` (for JWT)
- `ALGORITHM` (for JWT)
- `ACCESS_TOKEN_EXPIRE_MINUTES` (for JWT)
- `UPLOAD_PATH`
- `CORS_ORIGINS`
- `FRONTEND_URL` (used in backend for CORS configuration)

**Secrets location:**
- Environment variables are expected to be set in the deployment environment (e.g., in a `.env` file for `docker-compose` or directly in the orchestrator).
- Sentry DSN is hardcoded in `venv/lib/python3.12/site-packages/fastapi_cloud_cli/utils/sentry.py`.

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- None detected.

## Infrastructure Components

**Docker & Docker Compose:**
- **Docker**: Containerization of all services (`postgres`, `backend`, `nginx`, `certbot`).
- **Docker Compose (`docker-compose.yml`)**: Orchestrates the multi-container application. Defines services, networks, volumes, and environment variables.

**Nginx:**
- **Role**: Reverse proxy, static file server for frontend, and SSL termination.
- **Configuration (`nginx/nginx.conf`)**:
    - Listens on ports 80 (HTTP, redirects to HTTPS) and 443 (HTTPS).
    - Serves static frontend assets from `/usr/share/nginx/html`.
    - Proxies `/api/` requests to `http://backend:8000`.
    - Proxies `/uploads/` requests to `http://backend/uploads/`.
    - Manages SSL certificates obtained by Certbot.

**Certbot:**
- **Role**: Automatically obtains and renews SSL/TLS certificates from Let's Encrypt.
- **Integration**: Works with Nginx by sharing mounted volumes (`./certbot/www` and `./certbot/conf`) to store challenge files and certificates.

---

*Integration audit: 2024-07-28*
