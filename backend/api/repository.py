from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, BackgroundTasks
import os

from api.schemas import RepositoryCloneRequest
from services.repo_service import clone_repository, archive_and_upload_repo
from services.reader_service import read_file

from utils.security import validate_safe_path

router = APIRouter()


class SaveFileRequest(BaseModel):
    path: str
    content: str


@router.post("/clone")
def clone_repo(payload: RepositoryCloneRequest, background_tasks: BackgroundTasks):
    path, repo_name, needs_backup = clone_repository(str(payload.repo_url))

    if needs_backup:
        background_tasks.add_task(
            archive_and_upload_repo, path, repo_name, str(payload.repo_url)
        )

    return {"status": "success", "path": path}


@router.get("/file")
def get_file_content(path: str):
    abs_path = validate_safe_path(path)
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="File not found")

    content = read_file(abs_path)
    return {"content": content}


@router.post("/save-file")
def save_file_content(payload: SaveFileRequest):
    abs_path = validate_safe_path(payload.path)
    try:
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(payload.content)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
