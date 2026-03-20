# Technology Stack

**Project:** QuestLab
**Researched:** 2024-07-31

## Recommended Stack

### Core Frameworks
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **React** | 19.2.0 | Frontend UI Library | Provides a robust component-based architecture for building interactive user interfaces, well-suited for dynamic educational content. The large ecosystem and community support ensure long-term viability and access to a wealth of resources. |
| **Vite** | 7.2.4 | Frontend Build Tool | Offers extremely fast cold start times and instant hot module replacement (HMR), significantly improving developer experience for the React frontend. |
| **FastAPI** | 0.128.0 | Backend API Framework | A modern, fast (high performance), web framework for building APIs with Python 3.7+ based on standard Python type hints. It automatically generates interactive API documentation (Swagger UI/ReDoc), which is invaluable for development and integration. Its asynchronous capabilities are ideal for concurrent user requests. |
| **Uvicorn** | 0.40.0 | ASGI Server | Powers FastAPI, providing a high-performance asynchronous server for handling web requests efficiently. |

### Database
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **PostgreSQL** | (latest stable via Docker) | Relational Database | A powerful, open-source object-relational database system known for its reliability, feature robustness, and performance. It is well-suited for complex data relationships inherent in educational platforms (users, lessons, progress, gamification elements) and offers strong transactional consistency. |
| **SQLAlchemy** | 2.0.45 | Python ORM | Provides an elegant and robust Object Relational Mapper (ORM) for Python, allowing developers to interact with the PostgreSQL database using Python objects rather than raw SQL. This improves developer productivity, reduces errors, and makes the database layer more maintainable. |
| **psycopg2-binary** | 2.9.11 | PostgreSQL Adapter | The most popular PostgreSQL adapter for Python, providing efficient and reliable connectivity between SQLAlchemy/FastAPI and the PostgreSQL database. |

### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Docker / Docker Compose** | (latest stable) | Containerization / Orchestration | Enables consistent development, testing, and production environments by packaging applications and their dependencies into portable containers. Docker Compose simplifies the management of multi-container applications (frontend, backend, database, nginx). |
| **Nginx** | (latest stable via Docker) | Reverse Proxy / Web Server | Serves the frontend static assets, acts as a reverse proxy for the FastAPI backend, and handles SSL termination. Nginx is highly performant, reliable, and scalable, making it an excellent choice for production environments. |
| **Certbot** | (latest stable via Docker) | SSL Certificate Management | Automates the process of obtaining and renewing free SSL/TLS certificates from Let's Encrypt, ensuring secure HTTPS communication for the application. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **TypeScript** | ~5.9.3 | Static Type Checker (Frontend) | Enhances code quality and maintainability in the React frontend by adding static types, catching errors at compile time rather than runtime, and improving developer experience with better autocompletion and refactoring tools. |
| **TailwindCSS** | ^4.1.18 | CSS Framework (Frontend) | A utility-first CSS framework that allows for rapid UI development directly in markup. Its highly customizable nature ensures a unique and consistent design system without overriding pre-built components. |
| **Axios** | ^1.13.2 | HTTP Client (Frontend) | A promise-based HTTP client for the browser and Node.js, used for making API requests from the React frontend to the FastAPI backend. Provides a clean API, interceptors, and error handling. |
| **React Router DOM** | ^6.30.2 | Routing Library (Frontend) | Manages navigation within the single-page application (SPA), enabling declarative routing and dynamic content loading without full page reloads. |
| **argon2-cffi** | 25.1.0 | Password Hashing (Backend) | Provides robust and secure password hashing using the Argon2 algorithm, as required by project goals. Crucial for protecting user credentials. |
| **python-jose** | 3.5.0 | JWT Handling (Backend) | Handles JSON Web Token (JWT) creation and verification, essential for implementing secure, stateless authentication and authorization in the FastAPI backend. |
| **Pydantic** | 2.12.5 | Data Validation / Settings (Backend) | Used extensively in FastAPI for data validation, serialization, and deserialization, ensuring API endpoints receive and return data in the expected format. Also used for managing application settings. |
| **python-dotenv** | 1.2.1 | Environment Variables (Backend) | Loads environment variables from a `.env` file, simplifying configuration management across different environments (development, testing, production). |
| **pytest** | (latest via requirements.txt) | Testing Framework (Backend) | A mature and widely adopted testing framework for Python, used for writing comprehensive unit, integration, and functional tests for the FastAPI backend. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Frontend UI** | React | Vue, Angular, Svelte | React was explicitly stated in `Project_Goals.md`. While other frameworks are viable, React's component model and ecosystem align well with the project's interactive nature. |
| **Backend Framework** | FastAPI | Django, Flask, Node.js (Express) | FastAPI was explicitly stated in `Project_Goals.md`. Its modern async capabilities, built-in Pydantic integration, and auto-generated docs make it a strong choice for high-performance APIs compared to other Python frameworks for this use case, and provides a good alternative to Node.js for backend. |
| **Database** | PostgreSQL | MySQL, MongoDB | PostgreSQL offers advanced features, strong data integrity, and better support for complex queries and geographical data (if needed later) than MySQL. MongoDB (NoSQL) was less suited given the structured, relational nature of educational content and user progress. |
| **ORM** | SQLAlchemy | Django ORM (if Django) | SQLAlchemy is a highly flexible and powerful ORM, well-suited for FastAPI. Django ORM is tightly coupled with Django, which was not chosen. |

## Installation

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd backend
pip install -r requirements.txt

# Docker-Compose based setup for full stack
# (This project uses custom aliases for Docker management,
# e.g., `qup`, `qdown`, `qrestart` as per README.md)
# Manual command:
# docker compose up -d --build
```

## Sources

- `/home/onant/opt/questlab/frontend/package.json`
- `/home/onant/opt/questlab/backend/requirements.txt`
- `/home/onant/opt/questlab/Project_Goals.md`
- General knowledge of these technologies and their common use cases.
