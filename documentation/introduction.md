# Introduction to Codexa (CodePilot AI)

Codexa (CodePilot AI) is a production-grade, highly scalable, AI-powered codebase intelligence and collaboration platform. It is designed to help developers, engineering managers, and security teams understand, navigate, document, and collaborate on complex software repositories.

By combining **Static Code Analysis (AST)**, **Retrieval-Augmented Generation (RAG)**, **Real-time Synchronization (WebSockets)**, and **Distributed Task Queues (Celery)**, Codexa transforms raw codebases into interactive, searchable, and explainable developer spaces.

---

## 🎯 The Core Problem

When developers join a new project, start reviewing legacy code, or assess a massive monolithic codebase, they face several critical bottlenecks:
1. **CPU Starvation on Heavy Operations**: Compiling call dependency graphs, parsing Abstract Syntax Trees (AST), and generating vector embeddings are CPU-intensive tasks that lock backend servers.
2. **Context Fragmentation**: Developers must jump between IDEs, wikis, Slack, and flowcharts to understand how code functions and communicate with teammates.
3. **Database Write Locking**: Standard single-user local file databases (like SQLite) fail to scale under high concurrent reads/writes from multiple developers in a team.
4. **Lack of Flow Clarity**: Traditional static search tools find *where* a class is defined, but not *how* requests and data flow through the application at runtime.

---

## ✨ Key Capabilities & Features

Codexa resolves these bottlenecks with an enterprise-grade set of features:

### 1. Codebase RAG & Semantic Search
* **Deep Code Indexing**: Codebases are scanned, chunked, and stored in a high-performance **Qdrant Vector Database**.
* **Natural Language Chat**: Ask questions such as *"How does our payment gateway authenticate?"* or *"Where do we handle rate-limiting?"* and receive precise answers with file citations and line links.
* **Smart LLM Caching**: Dual-layer caching (local SQL + Redis) ensures repeat questions load instantly and saves API costs.

### 2. AST-Based Code Intelligence
* **Dependency Call Graphs**: Interactive dependency mapping rendering function-level callers and callees using XYFlow.
* **Execution Flow Explainer**: Translates step-by-step business logic across files into human-readable narratives.
* **Symbol Directory**: Fast symbols indexing (classes, methods, functions) across all parsed repositories.

### 3. Distributed Task Architecture
* **Celery Background Workers**: Offloads repository cloning, ZIP archiving, AST parsing, and vector embedding generation to asynchronous Celery worker nodes.
* **Real-time Progress Streaming**: WebSocket connections push parsing progress updates from Redis straight to the frontend, giving developers live feedback.

### 4. Advanced Security & RBAC
* **Authentication Hardening**: JWT session tokens combined with OAuth2 login providers (Google and GitHub).
* **Role-Based Access Control (RBAC)**: Fine-grained permissions check user permissions before accessing, modifying, or indexing codebases.
* **Personal API Keys**: Developers can generate secure, cryptographically hashed API keys (`sk_live_...`) to access APIs programmatically.

### 5. Multi-Tenant Observability & Operations
* **Centralized Dashboard**: Real-time telemetry dashboard detailing HTTP rates, error percentiles, latency metrics, active WebSocket counts, and Celery queue depths.
* **Log Aggregation**: Grafana Loki gathers container logs, simplifying debugging.
