from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import os
import uuid

from api.schemas import RepositoryPathRequest
from services.auth_service import get_user_id_from_token
from services.db_service import (
    create_repository,
    update_repository_status,
    get_repositories_for_user,
)
from services.redis_service import (
    enqueue_indexing_task,
    get_indexing_progress,
    update_indexing_progress,
)

router = APIRouter()


@router.post("/index")
def index_repo(payload: RepositoryPathRequest):
    # Enqueue indexing dynamically via REST (for compatibility)
    repo_name = os.path.basename(payload.repo_path.replace("\\", "/").rstrip("/"))
    repo_id = str(uuid.uuid4())
    create_repository(
        repo_id=repo_id,
        user_id="mock-dev",
        name=repo_name,
        path=payload.repo_path,
        branch="main",
        status="indexing",
    )
    enqueue_indexing_task(payload.repo_path, repo_id, "mock-dev")
    return {"status": "queued", "repo_id": repo_id}


@router.websocket("/progress")
async def websocket_indexer(websocket: WebSocket):
    await websocket.accept()
    try:
        # Receive setup payload
        data = await websocket.receive_json()
        repo_path = data.get("repo_path")

        if not repo_path:
            await websocket.send_json(
                {
                    "progress": 100,
                    "stage": "Failed",
                    "message": "Repository path is required.",
                }
            )
            await websocket.close()
            return

        # Authenticate via query token or use mock sandbox fallback
        token = websocket.query_params.get("token")
        user_id = None
        if token:
            user_id = get_user_id_from_token(token)
        if not user_id:
            user_id = "mock-dev"

        repo_name = os.path.basename(repo_path.replace("\\", "/").rstrip("/"))
        if not repo_name:
            repo_name = "unnamed-repo"

        # Check if repo already registered
        user_repos = get_repositories_for_user(user_id)
        existing_repo = None
        for r in user_repos:
            if r["repository_path"] == repo_path:
                existing_repo = r
                break

        if existing_repo:
            repo_id = existing_repo["id"]
        else:
            repo_id = str(uuid.uuid4())
            create_repository(
                repo_id=repo_id,
                user_id=user_id,
                name=repo_name,
                path=repo_path,
                branch="main",
                status="indexing",
            )

        # Check if task is already running in background
        current_status = get_indexing_progress(repo_path)
        is_active = current_status and not (
            current_status.get("completed") or current_status.get("failed")
        )

        if not is_active:
            update_repository_status(repo_id, "indexing")
            initial_status = {
                "progress": 0,
                "stage": "Queued",
                "message": "Adding task to queue...",
                "completed": False,
                "failed": False,
            }
            update_indexing_progress(repo_path, initial_status)
            enqueue_indexing_task(repo_path, repo_id, user_id)

        # Stream background progress status updates to the client from Redis
        last_progress = -1
        last_stage = ""

        while True:
            current_status = get_indexing_progress(repo_path)
            if not current_status:
                await asyncio.sleep(0.1)
                continue

            if (
                current_status.get("progress") != last_progress
                or current_status.get("stage") != last_stage
            ):
                await websocket.send_json(
                    {
                        "progress": current_status.get("progress"),
                        "stage": current_status.get("stage"),
                        "message": current_status.get("message"),
                    }
                )
                last_progress = current_status.get("progress")
                last_stage = current_status.get("stage")

            if current_status.get("completed") or current_status.get("failed"):
                break

            await asyncio.sleep(0.05)

    except WebSocketDisconnect:
        print("Indexer WebSocket disconnected client-side.")
    except Exception as e:
        print(f"WS Indexer Error: {e}")
        try:
            await websocket.send_json(
                {"progress": 100, "stage": "Failed", "message": f"Error: {str(e)}"}
            )
        except Exception:
            pass
