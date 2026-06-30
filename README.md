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

- React
- Vite
- JavaScript
- Axios

### Backend

- FastAPI
- Python
- Uvicorn

### AI Layer

- Google Gemini API
- Generative AI Models

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
│   │   ├── components
│   │   ├── pages
│   │   └── services
│   │
│   └── package.json
│
├── backend
│   │
│   ├── api
│   │   ├── chat.py
│   │   ├── flow.py
│   │   └── repository.py
│   │
│   ├── services
│   │   ├── scanner_service.py
│   │   ├── repo_service.py
│   │   ├── flow_explainer_service.py
│   │   └── llm_service.py
│   │
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

---

## API Endpoints

### Index Repository

```http
POST /repository/index
```

Indexes a local repository and prepares it for analysis.

Example Request:

```json
{
  "repo_path": "D:/projects/my-app"
}
```

---

### Generate Repository Flow

```http
POST /flow
```

Analyzes repository structure and generates workflow explanations.

---

### Ask Repository Questions

```http
POST /chat/ask
```

Allows users to ask questions about the indexed repository.

Example:

```json
{
  "question": "Explain authentication flow"
}
```

---

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/codepilot-ai.git

cd codepilot-ai
```

---

### 2. Backend Setup

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn main:app --reload
```

Expected Output:

```bash
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

### 3. Frontend Setup

Move to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Expected Output:

```bash
Local: http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside backend:

```env
GEMINI_API_KEY=your_api_key_here
```

---

## Example Workflow

### Step 1

Start backend server:

```bash
uvicorn main:app --reload
```

### Step 2

Start frontend:

```bash
npm run dev
```

### Step 3

Provide repository path:

```text
D:\Projects\SampleRepo
```

### Step 4

Click:

```text
Index Repository
```

### Step 5

Generate:

```text
Repository Flow
```

### Step 6

Ask Questions:

```text
How does authentication work?
```

```text
Explain project architecture.
```

```text
Which files handle API requests?
```

---

## Challenges Solved

- Understanding large repositories quickly
- Reducing onboarding time for developers
- Providing AI-generated project documentation
- Improving code discoverability
- Making repository navigation easier

---

## Future Improvements

- Vector database integration
- Semantic code search
- GitHub repository URL import
- Repository architecture diagrams
- Multi-LLM support
- Ollama local model integration
- Repository dependency graphs
- Code quality analysis
- Team knowledge assistant

---

## Development Status

Current Phase:

- Repository Scanning ✅
- Repository Indexing ✅
- AI Explanations ✅
- Flow Generation 🚧
- Architecture Visualization 🚧
- Advanced RAG 🚧

---

## Author

Abhishek Kumar


---

## License

MIT License
