# 🚀 @Codexa

<p align="center">
  <b>An AI-powered codebase intelligence platform that helps developers understand unfamiliar GitHub repositories using Retrieval-Augmented Generation (RAG), semantic search, and Large Language Models.</b>
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

## 🌐 Live Demo

### Frontend

https://codepilot-ai-wine.vercel.app/

### Backend API

https://codepilot-backend-wx7u.onrender.com/

### Swagger Documentation

https://codepilot-backend-wx7u.onrender.com/docs

---

# 📖 Overview

Understanding a large codebase can be difficult, especially when:

- Joining a new company
- Exploring open-source repositories
- Reviewing legacy projects
- Preparing for interviews
- Understanding project architecture

**CodePilot AI** uses **AI + Semantic Search + Repository Analysis** to make understanding any repository significantly easier.

Instead of manually navigating hundreds of files, developers can simply ask questions in natural language.

---

# ✨ Features

| Feature | Status |
|----------|--------|
| Clone GitHub Repository | Completed |
| Repository Scanner | Completed |
| Semantic Code Indexing | Completed |
| ChromaDB Vector Store | Completed |
| Local Embeddings (Sentence Transformers) | Completed |
| AI Repository Chat (RAG) | Completed |
| Architecture Analysis | Completed |
| Repository Call Graph | Completed |
| Execution Flow Generation | Completed |
| FastAPI REST Backend | Completed |
| React Frontend | Completed |
| Docker Support | Completed |
| Render Deployment | Completed |
| Vercel Deployment | Completed |

---

# 🏗 System Architecture

```text
                    User
                     │
                     ▼
            React + Vite Frontend
                     │
                 Axios API
                     │
                     ▼
              FastAPI Backend
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
 Repository      ChromaDB      OpenRouter
  Scanner      Vector Store        LLM
      │              │              │
      └──────────────┼──────────────┘
                     ▼
           AI-Powered Responses
```

---

# 🔥 What CodePilot AI Can Do

### 📂 Clone GitHub Repositories

Clone any public GitHub repository directly from the application.

---

### 📑 Repository Scanning

- Recursive project scanning
- File discovery
- Metadata extraction
- Intelligent filtering

---

### 🧠 Semantic Repository Indexing

Builds vector embeddings of the repository for intelligent semantic search.

Powered by:

- Sentence Transformers
- ChromaDB

---

### 🤖 AI Repository Chat

Ask questions such as:

> Where is authentication implemented?

> Explain the project architecture.

> Which files define the API routes?

> How does user login work?

The AI answers using repository context instead of hallucinating.

---

### 🏛 Architecture Analysis

Automatically generates:

- High-level project overview
- Module relationships
- Directory structure insights

---

### 📈 Call Graph Generation

Analyze relationships between:

- Functions
- Modules
- Components

---

### 🔄 Repository Flow Analysis

Understand how:

- Requests move through the application
- Components communicate
- Business logic executes

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite 8
- Tailwind CSS v4
- Axios

---

## Backend

- FastAPI
- Python 3.11
- Uvicorn
- GitPython

---

## AI

- OpenRouter
- GPT-4o Mini (default)
- OpenAI-compatible API

---

## Vector Database

- ChromaDB

---

## Embeddings

- Sentence Transformers
- all-MiniLM-L6-v2

---

## Deployment

- Docker
- Render
- Vercel

---

# 📁 Project Structure

```text
codepilot-ai
│
├── backend
│   ├── api/
│   ├── services/
│   ├── vector_store/
│   ├── main.py
│   ├── settings.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 📡 REST API

## Clone Repository

```http
POST /repository/clone
```

```json
{
  "repo_url":"https://github.com/user/repository"
}
```

---

## Index Repository

```http
POST /indexer/index
```

```json
{
  "repo_path":"repos/my-project"
}
```

---

## Ask AI

```http
POST /ai/ask
```

```json
{
  "question":"Explain the authentication flow."
}
```

---

## Architecture

```http
POST /repository/architecture
```

---

## Call Graph

```http
POST /repository/call-graph
```

---

## Execution Flow

```http
POST /repository/flow
```

---

# ⚙ Environment Variables

Backend `.env`

```env
OPENROUTER_API_KEY=your-api-key

OPENROUTER_MODEL=openai/gpt-4o-mini

CORS_ORIGINS=http://localhost:5173,https://codepilot-ai-wine.vercel.app
```

---

# 🐳 Docker

## Build

```bash
docker build -t codepilot-backend .
```

## Run

```bash
docker run --env-file .env -p 8000:8000 codepilot-backend
```

---

# 🚀 Local Installation

## Clone Repository

```bash
git clone https://github.com/abhishek-s12/codepilot-ai.git

cd codepilot-ai
```

---

## Backend

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

Runs on

```
http://127.0.0.1:8000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs on

```
http://localhost:5173
```

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Containerization | Docker |
| Vector Database | ChromaDB |
| LLM Provider | OpenRouter |

---

# 🛣 Roadmap

- ✅ Repository cloning
- ✅ Repository indexing
- ✅ Semantic search
- ✅ AI repository chat
- ✅ Architecture analysis
- ✅ Call graph generation
- ✅ Execution flow generation
- ✅ Docker support
- ✅ Render deployment
- ✅ Vercel deployment
- ⏳ Authentication
- ⏳ Repository history
- ⏳ Streaming AI responses
- ⏳ Interactive dependency graph
- ⏳ Multi-repository workspace
- ⏳ Export documentation (PDF / Markdown)

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

# 👨‍💻 Author

**Abhishek Singh**

GitHub: https://github.com/abhishek-s12

---

# 📄 License

This project is licensed under the MIT License.

---

<p align="center">
⭐ If you found this project useful, consider giving it a star on GitHub!
</p>
