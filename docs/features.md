# 🚀 Codexa (CodePilot AI) — Features and Platform Details

Codexa is a comprehensive, production-grade codebase intelligence, execution planning, and developer collaboration platform. It bridges the gap between static code analysis and agentic software engineering by integrating deep semantic indexing, abstract syntax tree (AST) parsing, real-time collaboration, and multi-agent task planning.

This document details every feature, service, and architectural component within Codexa.

---

## 📂 1. Core Repository & Code Processing

### Git Service
* **Repository Cloning**: Clone any public Git repository directly via HTTP.
* **VCS Integration**: Programmatic branch checking, branch switching, commit log inspection, and file diffing.
* **Blame & History**: Analyze file changes line-by-line using Git Blame and track historical revisions of specific files.

### Intelligent Scanner
* **Recursive Code Scanner**: Discovers files in a workspace directory while automatically ignoring noise folders (e.g., `.git`, `node_modules`, `dist`, `venv`, `__pycache__`, `.pytest_cache`).
* **Metadata Extractor**: Extracts details like file size, file extensions, and line counts during the scanning process.

### AST-Based Parser
* **Abstract Syntax Tree (AST) Parsing**: Specifically parses Python files to extract structure.
* **Symbol Discovery**: Identifies classes, methods, functions, decorators, global variables, and imports.
* **Semantic Chunking**: Instead of split-by-line-count chunking, code is divided along functional block boundaries (such as a class or a function) to preserve context for the LLM.
* **Language Fallbacks**: Uses regex-based line/paragraph parsing for non-Python languages.

---

## 🧠 2. Semantic Indexing & Vector Search

### Local Embeddings
* **Sentence Transformers**: Generates embeddings locally using the `all-MiniLM-L6-v2` model, removing dependency on paid embedding APIs.
* **Vector Length**: Outputs 384-dimensional dense vectors representing code semantics.

### Qdrant Vector Store
* **Qdrant Client**: High-performance vector search engine integration.
* **Deterministic Collections**: Creates collections mapped deterministically to repository paths.
* **Cosine Similarity**: Performs similarity searches to retrieve the most contextually relevant code snippets for a user query.
* **Reset & Cleanup**: Support for cleaning up indexed collections when a repository is deleted or re-indexed.

---

## 🤖 3. AI Code Assistants & RAG

### AI Chat (Retrieval-Augmented Generation)
* **OpenRouter LLM Integration**: Communicates with top LLMs (such as `gpt-4o-mini`) using OpenRouter's API.
* **Citations & References**: Returns answers labeled with clickable citations showing which files and lines were referenced by the AI to formulate the response.
* **Token Usage Tracking**: Counts prompt and completion tokens to estimate costs and manage context limits.

### AI Code Actions (Action Center)
* Predefined prompt templates optimized for one-click operations:
  * 🧠 **Explain File**: High-level and detailed analysis of what a file does.
  * 🧪 **Generate Tests**: Produces unit tests using standard testing frameworks (pytest, unittest).
  * 🐞 **Find Bugs**: Conducts static analysis to find logic issues, memory leaks, or execution bottlenecks.
  * ✨ **Refactor Code**: Simplifies complex functions and enforces clean code practices.
  * 📚 **Generate Docs**: Produces inline docstrings, comments, or external markdown documentation.
  * 🔒 **Security Audit**: Identifies OWASP vulnerabilities, hardcoded secrets, and unsafe APIs.
  * ⚡ **Performance Review**: Flags inefficient algorithms or database calls.

### Inline AI & Monaco Integration
* **Cursor-like Inline AI**: Select lines of code in the code viewer, right-click, and ask the AI to refactor, explain, or document that specific block.
* **Monaco Diff Editor**: Previews modified code side-by-side with original code, allowing users to Accept, Reject, Copy, or Undo edits.

---

## 📈 4. Repository & Codebase Visualization

### Architecture Analyzer
* **System Breakdown**: Explains modules, packages, directory structures, and high-level architectural patterns.
* **Module Relationships**: Traces how different subfolders interact with each other.

### Interactive Call Graph
* **XYFlow React Graph**: Renders a node-and-edge dependency graph showing function and module calling relationships.
* **Graph Interactions**: Search nodes, zoom/pan, click nodes to jump directly to their declaration in the Monaco editor, and highlight connection paths.

### Logic Flow Explainer
* **Execution Paths**: Traces step-by-step logic flows (e.g., "Request enters `main.py` -> matches `/auth/login` route -> calls `auth_service.py` -> queries DB -> returns JSON").

---

## 🔐 5. Identity, Access Control & Security

### Multi-tier Authentication
* **Developer Sandbox Mode**: A bypass authentication method to speed up local development testing.
* **GitHub & Google OAuth**: Production-ready OAuth 2.0 social login workflows.
* **Access & Refresh Tokens**: Employs short-lived JWT access tokens and long-lived refresh tokens with rotation and expiration checks.
* **Token Revocation**: Implements database-level token versioning to revoke active tokens immediately upon password changes or logouts.
* **Personal API Keys**: Generate API keys (`sk_live_...`) with SHA-256 hashing to interact with Codexa from external CLI tools, IDE extensions, or scripts.

### Role-Based Access Control (RBAC)
* **Roles**: Owner, Admin, Developer, Viewer.
* **Project Permissions**: Grants workspace or repository permissions based on membership checks, keeping multi-tenant data segregated.
* **Strict Mode Enforcer**: Configuration flag to toggle whether authentication is strictly checked or bypassed (sandbox mode).

---

## 🤝 6. Collaboration & Real-Time Sync

### WebSocket Manager
* **Real-time Synchronization**: Synchronizes active workspaces across multiple users.
* **Cursor Sharing**: Broadcasts developer cursor coordinates in real time.
* **Audit Trail**: Logs organization/project membership changes.
* **Shared Workspace Comments**: Allows commenting directly on files, components, and specific symbols.

---

## 🛠 7. Autonomous Task Planner

### AI Agent Workspace
* **Goal Sequence Planner**: Takes high-level feature requests (e.g., "Add email verification") and translates them into an actionable, dependency-aware task checklist.
* **Affected Files Scanner**: Scans imports and call graphs to automatically determine which files must be created, modified, or deleted.
* **Task Tracker**: Displays a live task timeline indicating state: `Todo`, `Running`, `Completed`, or `Failed`.
* **Automated Code Modifier**: Runs an agent that applies safe, incremental patches to files, presenting them as a git diff review.

---

## ☁ 8. DevOps, Telemetry & Storage

### AI DevOps
* **Containerization Generator**: Analyzes files and generates optimal Dockerfiles or `docker-compose.yml` configurations.
* **CI/CD Pipeline Generator**: Creates production-ready GitHub Actions or GitLab CI workflows.
* **Kubernetes Manifests**: Produces Helm charts or K8s deployment configurations.

### S3 / MinIO Object Storage
* **Encrypted File Backups**: Integrates with MinIO (local dev) or AWS S3 (production) using Server-Side Encryption (AES256).
* **Integrity Validation**: Calculates and records SHA-256 checksums in object metadata to prevent data corruption.
* **Auto-Bucket Provisioner**: Automatically verifies and creates required object buckets at application startup.

### Redis Caching & Rate Limiter
* **Redis Integration**: Uses Redis for rapid data lookups and rate limit monitoring.
* **Client IP Rate Limiting**: Limit API request volume based on category (Standard API vs. AI/LLM API) to protect against resource abuse.
* **Local Memory Fallback**: Automatically falls back to in-memory history if Redis is offline.

### Telemetry & Observability
* **Performance Dashboard**: Monitor backend latency, memory consumption, CPU usage, and index statistics.
* **System Health Diagnostics**: Live liveness (`/health/live`) and readiness (`/health/ready`) checks verifying Redis, S3, and Postgres database connectivity.
