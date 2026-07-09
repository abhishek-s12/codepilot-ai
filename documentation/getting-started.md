# Getting Started Guide

This guide will walk you through setting up Codexa (CodePilot AI) for local development.

---

## 📋 Prerequisites

Before you start, make sure you have the following installed on your machine:

| Tool | Version | Purpose |
|---|---|---|
| **Python** | 3.11.x | Backend API and Celery workers |
| **Node.js** | ≥ 18.x | Frontend React development |
| **Docker & Compose** | Latest | Running PostgreSQL, Redis, Qdrant, MinIO, and Observability stack |
| **Git** | Latest | Cloning repositories and managing source code |

---

## 🛠 Local Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/abhishek-s12/codepilot-ai.git
cd codepilot-ai
```

### 2. Backend Virtual Environment Setup
Navigate to the `backend` folder, create a virtual environment, and install dependencies:
```bash
cd backend
python -m venv venv

# Activate on Windows:
venv\Scripts\activate

# Activate on macOS/Linux:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt
```

### 3. Environment Variables Configuration
Create a `.env` file in the `backend` directory. Copy the template below:
```env
# ── LLM Configuration ─────────────────────────────────────────────────────────
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_API_KEY=your_openrouter_api_key_here
LLM_MODEL=openai/gpt-4o-mini
LLM_APP_NAME="CodePilot AI"

# ── Database Connections ──────────────────────────────────────────────────────
# local fallback automatically activates if Postgres is unreachable
DATABASE_URL=postgresql://codepilot:codepilot_pass_123@localhost:5432/codepilot
REDIS_URL=redis://localhost:6379/0
QDRANT_HOST=localhost
QDRANT_PORT=6333

# ── Object Storage (S3 / MinIO) ───────────────────────────────────────────────
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY=minio_user
S3_SECRET_KEY=minio_password_123
S3_BUCKET_NAME=codepilot-storage

# ── Security & Authentication ─────────────────────────────────────────────────
JWT_SECRET=your_jwt_signing_key_here
ENFORCE_STRICT_AUTH=false
ALLOW_DEV_SANDBOX_LOGIN=true

# ── Observability ─────────────────────────────────────────────────────────────
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

> [!WARNING]
> Never commit real secrets to Git. Always use a secure values injector or environment manager.

### 4. Start Local Infrastructure
Start all backend services (PostgreSQL, Redis, Qdrant, MinIO, and Grafana monitoring tools) using Docker Compose from the root directory:
```bash
# Run from the project root (where docker-compose.yml is located)
docker compose up -d
```
Verify that all containers are healthy:
```bash
docker compose ps
```

### 5. Run Database Migrations
Run Alembic migrations to build the tables in PostgreSQL:
```bash
# Run from the backend directory with venv active
alembic upgrade head
```

### 6. Start the Asynchronous Celery Worker
Start a Celery worker locally to process task queues:
```bash
# Run from the backend directory with venv active
celery -A celery_app worker --loglevel=info -Q indexing,default
```

### 7. Run the Frontend Development Server
Open a new terminal window, navigate to the frontend directory, install dependencies, and run:
```bash
cd frontend
npm install
npm run dev
```

The application will now be available at:
* **Frontend UI**: `http://localhost:5173`
* **FastAPI Docs (Swagger)**: `http://localhost:8000/docs`
* **Celery Flower (Queue Monitor)**: `http://localhost:5555`
* **Grafana Dashboards**: `http://localhost:3000` (credentials: `admin` / `codepilot_grafana_pass`)
