# codepilot-ai

An AI-powered repository analysis platform that helps developers understand unfamiliar codebases through intelligent code explanations, repository indexing, and architecture insights.

CodePilot AI scans source code, processes project structures, and leverages Large Language Models (LLMs) to generate contextual explanations for files, functions, and repository workflows.

---

## Overview

Understanding large codebases is difficult, especially when joining new projects or exploring open-source repositories.

CodePilot AI simplifies this process by:

- Scanning repositories
- Extracting source code information
- Building repository context
- Generating AI-powered explanations
- Visualizing project structure
- Helping developers navigate code faster

---

## Current Features

### Repository Scanner

- Recursively scans project directories
- Detects supported source code files
- Ignores unnecessary files and folders
- Collects repository metadata

### AI Code Explanation

- Explains files and code snippets
- Generates human-readable summaries
- Helps understand unfamiliar code

### Repository Indexing

- Processes source files
- Builds searchable repository context
- Prepares repository data for AI analysis

### Flow Generation

- Analyzes repository structure
- Generates project flow descriptions
- Helps visualize component interactions

### REST API Backend

Built using FastAPI with dedicated endpoints for:

- Repository indexing
- Flow generation
- AI-powered repository analysis

---

## Tech Stack

### Frontend

- React 19
- Vite 8
- TailwindCSS v4
- JavaScript (ES Modules)
- Axios

### Backend

- FastAPI
- Python
- Uvicorn
- ChromaDB (vector store)
- Sentence Transformers (local embeddings)

### AI Layer

- OpenRouter API (OpenAI-compatible)
- Any model supported by OpenRouter (default: `openai/gpt-4o-mini`)

### Development Tools

- Git
- GitHub
- VS Code

---

## Project Structure

```text
CodePilot-AI
│
├── frontend
│   ├── src
│   │   ├── App.jsx        # Main UI with all tabs and panels
│   │   ├── index.css      # Design system (glassmorphism, fonts, animations)
│   │   └── services
│   │       └── api.js     # Axios API client
│   │
│   └── package.json
│
├── backend
│   │
│   ├── api
│   │   ├── architecture.py
│   │   ├── ask.py
│   │   ├── call_graph.py
│   │   ├── flow.py
│   │   ├── graph.py
│   │   ├── indexer.py
│   │   ├── repository.py
│   │   ├── review.py
│   │   ├── scanner.py
│   │   ├── search.py
│   │   └── schemas.py
│   │
│   ├── services
│   │   ├── scanner_service.py
│   │   ├── repo_service.py
│   │   ├── flow_explainer_service.py
│   │   ├── repository_call_graph_service.py
│   │   ├── repository_graph_service.py
│   │   ├── call_graph_service.py
│   │   ├── ast_chunker_service.py
│   │   ├── embedding_service.py
│   │   ├── rag_service.py
│   │   ├── llm_service.py
│   │   └── indexing_service.py
│   │
│   ├── vector_store
│   │   └── chroma_service.py
│   │
│   ├── settings.py
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

---

## API Endpoints

### Clone Repository

```http
POST /repository/clone
```

```json
{ "repo_url": "https://github.com/owner/repo" }
```

### Index Repository

```http
POST /indexer/index
```

```json
{ "repo_path": "repos/my-repo" }
```

### Ask AI Questions

```http
POST /ai/ask
```

```json
{ "question": "Which files define the API routes?" }
```

### Generate Architecture Report

```http
POST /repository/architecture
```

### Generate Call Graph

```http
POST /repository/call-graph
```

### Generate Execution Flow

```http
POST /repository/flow
```

---

## Backend LLM Configuration

The backend uses an OpenAI-compatible client. Configure your LLM provider in `backend/.env`:

```env
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_API_KEY=your-openrouter-api-key
LLM_MODEL=openai/gpt-4o-mini
LLM_APP_NAME=CodePilot AI
LLM_SITE_URL=http://localhost:5173
```

---

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/abhishek-s12/codepilot-ai.git
cd codepilot-ai
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

Expected output:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Expected output:

```
Local: http://localhost:5173
```

---

## Development Status

- Repository Scanning ✅
- Repository Indexing ✅
- ChromaDB Vector Store ✅
- Local Semantic Embeddings ✅
- AI Chat (RAG) ✅
- Architecture Analysis ✅
- Call Graph Generation ✅
- Execution Flow Tracing ✅
- Premium Frontend UI ✅
- OpenRouter / OpenAI-compatible LLM ✅

---

## Author

Abhishek Kumar

---

## License

MIT License
