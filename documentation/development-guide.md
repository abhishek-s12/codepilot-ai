# Developer & Operations Guide

This guide covers operational tasks such as database migrations, running tests, manual task recovery, and tracing diagnostics.

---

## 🧪 Running Automated Tests

To ensure code stability, run tests locally within the backend virtual environment:

```bash
# Navigate to the backend directory
cd backend

# Activate virtual environment
venv\Scripts\activate

# Run the complete test suite ignoring cloned repositories
pytest . -v --ignore=venv --ignore=repos
```

All 33 tests should compile and pass successfully, including:
* **AST Parsing & Chunking** (`test_ast.py`)
* **Auth & RBAC Controls** (`test_auth_rbac.py`)
* **Celery eager task execution** (`test_celery_tasks.py`)
* **S3 Storage Operations** (`test_storage.py`)
* **DevOps Plan Generator** (`test_v5_platform.py`)

---

## 🗄️ Database Migrations with Alembic

We use **Alembic** to manage database schema updates for PostgreSQL. All migration scripts are stored in `backend/migrations/versions/`.

### 1. Creating a New Migration
When you modify or add database structures, generate a new migration file:
```bash
# Run from the backend folder
alembic revision -m "description_of_changes"
```
This creates a template file in `backend/migrations/versions/`. Open the file and write your logic inside `upgrade()` and `downgrade()`:
```python
def upgrade() -> None:
    op.create_table(
        'new_table',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False)
    )

def downgrade() -> None:
    op.drop_table('new_table')
```

### 2. Applying Migrations
Apply pending migrations to update your local or remote database:
```bash
alembic upgrade head
```

### 3. Reverting Migrations
Roll back the database state by a single revision or revert completely:
```bash
# Revert the latest migration
alembic downgrade -1

# Revert all migrations back to base schema
alembic downgrade base
```

---

## 🛠️ Task Management & Recovery

### stuck Task Recovery
In production, worker containers can occasionally crash or restart while processing heavy repositories. This leaves tasks marked as `indexing` in the database indefinitely.

We provide a cleanup script to automatically find and re-queue stuck indexing tasks:
```bash
# Run from the backend directory with venv active
python management/requeue_stuck_tasks.py
```

* **Behavior**: Scrapes the database for repositories stuck in `indexing` status for over **30 minutes** and dispatches them back onto the Celery `indexing` queue.
* **Cron Integration**: In production, it is recommended to set up a CronJob calling this script every 15 minutes.

---

## 📈 Adding Custom Telemetry Metrics

To expose custom metrics for Prometheus, import the registry from `services.metrics_service` and record events:

```python
from services.metrics_service import (
    llm_tokens_total,
    active_ws_connections,
    celery_tasks_total
)

# 1. Increment a Counter
llm_tokens_total.inc(value=150)

# 2. Record values on a Gauge
active_ws_connections.set(len(active_sessions))

# 3. Track events on a Histogram
with celery_tasks_total.labels(queue="indexing", status="success").time():
    # Execute task logic...
    pass
```
The FastAPI metrics instrumentator exposes these automatically under `http://localhost:8000/metrics`.
