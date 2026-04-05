# Codebase Structure

**Analysis Date:** 2026-04-05

## Directory Layout

```
questlab/
├── backend/          # FastAPI backend application
│   ├── routers/      # Modular API endpoints (19+ modules)
│   ├── schemas/      # Pydantic models (modularized)
│   ├── models.py     # SQLAlchemy models
│   ├── main.py       # Application entry point
│   └── templates/    # Email & HTML templates
├── frontend/         # React SPA
│   ├── src/
│   │   ├── pages/    # Route components (admin, parent, student)
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/    # Custom React hooks
│   │   └── lib/      # Utils & shared config
│   └── public/       # Static assets
├── nginx/            # Reverse proxy configuration
├── tests/            # Playwright E2E tests
├── quest-scripts/    # Operational & deployment scripts
├── .planning/        # Project planning & state
├── ARCHITECTURE.md   # Power Tools architecture
└── GEMINI.md         # Engineering guide & mandates
```

## Key File Locations

- `docker-compose.yml`: Service orchestration.
- `backend/main.py`: Backend entry point & router inclusion.
- `frontend/src/App.tsx`: Frontend routing & root component.
- `backend/models.py`: Database schema definition.
- `playwright.config.ts`: E2E test configuration.

---

*Structure analysis: 2026-04-05*
