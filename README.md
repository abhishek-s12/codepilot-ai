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
│   │   ├── App.jsx                     # Main UI with all tabs and panels
│   │   ├── index.css                   # Design system (glassmorphism, fonts, animations)
│   │   └── services
│   │       └── api.js                  # Axios API client
│   │
│   └── package.json
│
├── backend
│   │
│   ├── api
│   │   ├── architecture.py             # Endpoints for architecture explanation
│   │   ├── ask.py                      # Endpoint for querying AI assistant
│   │   ├── call_graph.py               # Endpoints for call graph generation
│   │   ├── flow.py                     # Endpoints for execution flow tracing
│   │   ├── graph.py                    # Endpoints for import dependency graph
│   │   ├── indexer.py                  # Endpoints for repository indexing
│   │   ├── repository.py               # Endpoints for cloning and repository info
│   │   ├── review.py                   # Endpoints for repository code review
│   │   ├── scanner.py                  # Endpoints for scanning file paths
│   │   ├── search.py                   # Endpoints for semantic searching
│   │   └── schemas.py                  # Shared Pydantic request models
│   │
│   ├── services
│   │   ├── architecture_ai_service.py  # AI service to generate architecture reports
│   │   ├── architecture_service.py     # Base service for architecture scanning
│   │   ├── ast_chunker_service.py      # Extracts code structures (AST) for chunks
│   │   ├── call_graph_service.py       # Extracts call metrics inside a file
│   │   ├── chunker_service.py          # Base chunk splitting logic
│   │   ├── embedding_service.py        # Connects with Local SentenceTransformers
│   │   ├── flow_explainer_service.py   # AI flow explanation logic
│   │   ├── flow_service.py             # Base flow analysis service
│   │   ├── indexing_service.py         # Indexes repos into vector store
│   │   ├── llm_service.py              # LLM wrapper client (OpenRouter)
│   │   ├── rag_service.py              # Retrieval QA chat processor
│   │   ├── reader_service.py           # Helper for reading files safely
│   │   ├── repo_service.py             # Git clone wrapper logic
│   │   ├── repository_call_graph_service.py # Core cross-file call resolver
│   │   ├── repository_graph_service.py # Core import dependency builder
│   │   ├── review_service.py           # AI code reviewer engine
│   │   ├── scanner_service.py          # Scans files and filters extensions
│   │   ├── search_service.py           # ChromaDB search service
│   │   └── symbol_service.py           # Symbol/function registry helper
│   │
│   ├── vector_store
│   │   └── chroma_service.py           # ChromaDB collection wrapper
│   │
│   ├── test_architecture.py            # Script to test architecture generator
│   ├── test_ast.py                     # Script to test AST parsing
│   ├── test_call_graph.py              # Script to test call graph resolution
│   ├── test_chroma.py                  # Script to check ChromaDB document counts
│   ├── test_flow.py                    # Script to test flow generation
│   ├── test_flow_explainer.py          # Script to test AI flow explainer
│   ├── test_repo_graph.py              # Script to test import dependency graph
│   ├── test_repository_call_graph.py   # Script to test multi-file call graphs
│   ├── test_symbols.py                 # Script to test symbol extraction
│   ├── settings.py                     # Centralized settings and .env loader
│   ├── main.py                         # FastAPI App Entrypoint
│   └── requirements.txt                # Python package list
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
{
  "repo_url": "https://github.com/owner/repo"
}
```

### Index Repository

```http
POST /indexer/index
```

```json
{
  "repo_path": "repos/my-repo"
}
```

### Ask AI Questions

```http
POST /ai/ask
```

```json
{
  "question": "Which files define the API routes?"
}
```

### Generate Architecture Report

```http
POST /repository/architecture
```

```json
{
  "repo_path": "repos/my-repo"
}
```

### Generate Call Graph

```http
POST /repository/call-graph
```

```json
{
  "repo_path": "repos/my-repo"
}
```

### Generate Execution Flow

```http
POST /repository/flow
```

```json
{
  "repo_path": "repos/my-repo"
}
```

### Get Dependency Graph

```http
GET /repository/graph?repo_path=repos/my-repo
```

### Review Repository

```http
POST /repository/review?repo_path=repos/my-repo
```

### Scan Repository Directory

```http
GET /scanner/scan?repo_path=repos/my-repo
```

### Semantic / Keyword Search

```http
GET /search/search?query=explain_flow
```

----

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

## Verification Scripts

The backend includes several quick test scripts to verify individual components (AST parsing, database storage, call graph analysis, etc.) without launching the API server:

```bash
cd backend
# Make sure virtual environment is active (venv\Scripts\activate or source venv/bin/activate)

# Verify AST extraction and symbol parsing
python test_ast.py
python test_symbols.py

# Verify ChromaDB connection and check total indexed documents
python test_chroma.py

# Verify import dependency and call graph resolution
python test_repo_graph.py
python test_repository_call_graph.py

# Verify AI/analysis flow logic
python test_flow_explainer.py
python test_architecture.py
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
