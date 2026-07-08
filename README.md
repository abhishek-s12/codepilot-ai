# 🚀 Codexa (CodePilot AI)

<p align="center">
  <b>An AI-powered codebase intelligence and collaboration platform that helps developers understand, document, and collaborate on complex repositories using RAG, semantic search, AST-based symbol parsing, and Large Language Models.</b>
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20Store-red?logo=qdrant)
![MinIO](https://img.shields.io/badge/MinIO-S3%20Storage-C92A3E?logo=minio)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

## 🌐 Live Demo

### Frontend

[https://codepilot-ai-wine.vercel.app/](https://codepilot-ai-wine.vercel.app/)

### Backend API

[https://codepilot-backend-wx7u.onrender.com/](https://codepilot-backend-wx7u.onrender.com/)

### Swagger Documentation

[https://codepilot-backend-wx7u.onrender.com/docs](https://codepilot-backend-wx7u.onrender.com/docs)

---

# 📖 Overview

Understanding a large or unfamiliar codebase is a significant challenge when joining a new team, exploring open-source repositories, reviewing legacy projects, or analyzing project architecture.

**Codexa** solves this by combining **Semantic Search + AST Symbol Analysis + Real-time Collaboration + AI Assistant**. Instead of manually navigating hundreds of files, developers can ask questions in natural language, visualize call graphs, explore code flow, run autonomous tasks, and collaborate with their team in real time.

---

# ✨ Features

| Feature                         |    Status    | Description                                                                                 |
| :------------------------------ | :----------: | :------------------------------------------------------------------------------------------ |
| **Clone GitHub Repository**     | ✅ Completed | Clone public repositories directly into the analysis workspace.                             |
| **Repository Scanner & Parser** | ✅ Completed | Recursive scanner with intelligent file filtering and AST parsing.                          |
| **Semantic Code Indexing**      | ✅ Completed | Generate embeddings with Sentence Transformers for semantic search.                         |
| **Qdrant Vector Database**      | ✅ Completed | Scalable vector store for lightning-fast similarity search on code chunks.                  |
| **AI Repository Chat (RAG)**    | ✅ Completed | Ask codebase questions in natural language with source file citations.                      |
| **Architecture Analysis**       | ✅ Completed | Automatic high-level architectural insights and directory summaries.                        |
| **Repository Call Graph**       | ✅ Completed | Interactive mapping of component and function dependencies using XYFlow.                    |
| **Execution Flow Explainer**    | ✅ Completed | Explains step-by-step how requests and business logic traverse the app.                     |
| **Auth & RBAC Hardening**       | ✅ Completed | JWT authentication, OAuth (Google/GitHub), RBAC, and personal API keys (`sk_live_...`).     |
| **Real-time Collaboration**     | ✅ Completed | Real-time workspace synchronization and messaging using WebSockets.                         |
| **Redis Cache & Rate Limiting** | ✅ Completed | Redis-backed caching and client-IP based rate limiting for backend APIs.                    |
| **S3 / MinIO Object Storage**   | ✅ Completed | Secure file storage with server-side encryption (AES256) and SHA-256 metadata verification. |
| **Autonomous Task Planner**     | ✅ Completed | Automated task sequencing and agentic code modification.                                    |
| **Observability Telemetry**     | ✅ Completed | Standardized logging, latency tracking, and system health checks.                           |

---

# 🏗 System Architecture

```text
                                  User / Team
                                       │
                            WebSocket ╱ ╲ Axios API
                                     ↙     ↘
                          React + Vite Frontend
                                    │
                                    ▼
                             FastAPI Backend
                                    │
   ┌───────────┬────────────┬───────┴───────┬────────────┬───────────┐
   ▼           ▼            ▼               ▼            ▼           ▼
Repository   Redis      PostgreSQL        Qdrant     OpenRouter   S3/MinIO
 Scanner   (Rate Limit/   (RDBMS/         (Vector       LLM       (Storage/
 (AST/Git)   Caching)    SQLite Fallback)  Store)     (AI Engine) Encryption)
```

---

# 🛠 Tech Stack

### Frontend

- **React 19 & Vite 8** — Ultra-fast development server and optimized build.
- **Tailwind CSS v4** — Utility-first styling.
- **XYFlow React** — Dynamic rendering of call graphs and component relationships.
- **Monaco Editor** — In-browser code editing and viewing with syntax highlighting.
- **Lucide Icons & Axios** — Sleek iconography and promise-based HTTP client.

### Backend

- **FastAPI** — High-performance ASGI web framework.
- **Python 3.11** — Modern features and typing.
- **Uvicorn** — Lightning-fast ASGI web server implementation.
- **Psycopg2** — Thread-pooled PostgreSQL client.
- **GitPython** — Programmatic repository interaction.
- **Boto3** — AWS S3 / MinIO client integration.
- **Redis Client** — Multi-category rate limit cache.

### Vector Store & AI

- **Qdrant** — Production-grade vector store.
- **Sentence Transformers** — Local embeddings using `all-MiniLM-L6-v2`.
- **OpenRouter** — Unified LLM access (default: `openai/gpt-4o-mini`).

### Database & Storage

- **PostgreSQL** — Primary relational database for user records, API keys, and workspace metadata.
- **SQLite** (`codepilot.db`) — Local development/fallback storage when PostgreSQL is offline.
- **MinIO / S3** — Object storage for uploaded code artifacts and metadata.

---

# 📁 Project Structure

```text
codepilot-ai
├── backend
│   ├── api/             # API routes (auth, repos, search, collaboration, planner, etc.)
│   ├── services/        # Business logic (auth_service, storage_service, redis_service, etc.)
│   ├── models/          # Database models / schemas
│   ├── parsers/         # Code parsers and AST analysis
│   ├── vector_store/    # Qdrant client services and indexing helpers
│   ├── main.py          # FastAPI application initialization & middlewares
│   ├── settings.py      # Pydantic Settings management (loads .env)
│   ├── worker.py        # Background task processor
│   ├── requirements.txt # Backend dependencies
│   └── Dockerfile       # Application Docker build file
├── frontend
│   ├── src/
│   │   ├── components/  # Reusable UI widgets (auth, explorer, collaboration, etc.)
│   │   ├── tabs/        # Workspace views (Overview, Chat, Call Graph, Observability, etc.)
│   │   ├── App.jsx      # Main application hub
│   │   └── index.css    # Tailwind styling system
│   ├── package.json     # Node.json package configuration
│   └── vite.config.js   # Vite server settings
├── docker-compose.yml   # Multi-container orchestration (production/dev stack)
└── README.md
```

---

# 📡 Key REST API Endpoints

### 🔐 Authentication

- `POST /auth/sandbox-login` — Development bypass login.
- `POST /auth/refresh` — Issue new JWT access token from refresh token.
- `GET /auth/github/login` — GitHub OAuth URL generation.
- `POST /auth/keys` — Generate user personal API keys (`sk_live_...`).

### 📂 Repository Management

- `POST /repository/clone` — Clone repository from a GitHub URL.
- `POST /indexer/index` — Scan files and insert embeddings into Qdrant.
- `GET /repositories` — List registered and indexed repositories.

### 🤖 AI Code Intelligence

- `POST /ai/ask` — Ask natural language questions with codebase context.
- `POST /repository/architecture` — Retrieve project structure explanations.
- `POST /repository/call-graph` — Build static call graphs for workspace files.
- `POST /repository/flow` — Trace step-by-step logic execution flows.

---

# ⚙ Environment Variables

Create a `.env` file in the root or `backend` folder matching this configuration:

```env
# LLM Provider (OpenRouter)
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_API_KEY=your-openrouter-api-key
LLM_MODEL=openai/gpt-4o-mini
LLM_APP_NAME=CodePilot AI
LLM_SITE_URL=http://localhost:5173

# Database (PostgreSQL / Auto-fallback to SQLite if empty)
DATABASE_URL=postgresql://codepilot:codepilot_pass_123@localhost:5435/codepilot

# Redis Cache & Rate Limiting
REDIS_URL=redis://localhost:6379/0

# Qdrant Vector Store
QDRANT_HOST=localhost
QDRANT_PORT=6333

# S3 / MinIO Object Storage
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY=minio_user
S3_SECRET_KEY=minio_password_123
S3_BUCKET_NAME=codepilot-storage

# Authentication (JWT)
JWT_SECRET_KEY=change-this-to-a-long-random-secret-in-production
ALLOW_DEV_SANDBOX_LOGIN=true
ENFORCE_STRICT_AUTH=true
```

---

# 🐳 Docker Compose Deployment

The simplest way to run Codexa locally with all its dependencies (Postgres, Redis, Qdrant, MinIO, Backend, Worker, Nginx) is via **Docker Compose**:

### 1. Copy Environment File

Ensure a `.env` file exists in the root directory.

### 2. Start Services

```bash
docker compose up -d
```

This starts:

- **`codepilot-postgres`** (Port `5435`)
- **`codepilot-redis`** (Port `6379`)
- **`codepilot-qdrant`** (Port `6333`)
- **`codepilot-minio`** (Ports `9000` / `9001`)
- **`codepilot-migrate`** (One-shot DB migration container)
- **`codepilot-backend`** (FastAPI app on port `8000`)
- **`codepilot-worker`** (Background worker)
- **`codepilot-nginx`** (Reverse proxy exposing the API on port `80`)

### 3. Check Logs

```bash
docker compose logs -f backend worker
```

---

# 🚀 Local Development Installation

### 1. Clone & Set Up Repository

```bash
git clone https://github.com/abhishek-s12/codepilot-ai.git
cd codepilot-ai
```

### 2. Start Backend Services

Ensure you have Python 3.11 installed.

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

The API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 3. Start Frontend App

Ensure you have Node.js installed.

```bash
cd frontend
npm install
npm run dev
```

The interface will be running at [http://localhost:5173](http://localhost:5173).

---

# 🛣 Roadmap

- ✅ Repository cloning & recursive scanning
- ✅ Qdrant Vector database migration
- ✅ Local embeddings (`all-MiniLM-L6-v2`)
- ✅ AI repository chat (RAG)
- ✅ Architecture analysis
- ✅ Interactive Call graph & Flow visualization
- ✅ User authentication (OAuth & JWT) & Hardened RBAC
- ✅ Redis-backed Rate limiting & Caching
- ✅ S3 / MinIO Storage with AES256 encryption
- ✅ Real-time collaboration via WebSockets
- ✅ Background Task Worker
- ⏳ Multi-repository workspace support
- ⏳ Interactive dependency graph enhancements
- ⏳ Streaming AI responses in chat
- ⏳ PDF / Markdown documentation export

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

# 👨‍💻 Author

**Abhishek Kumar**

GitHub: [https://github.com/abhishek-s12](https://github.com/abhishek-s12)

---

# 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
⭐ If you found this project useful, consider giving it a star on GitHub!
</p>
