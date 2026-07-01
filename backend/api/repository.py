from fastapi import APIRouter, HTTPException
import os

from api.schemas import RepositoryCloneRequest
from services.repo_service import clone_repository
from services.reader_service import read_file

router = APIRouter()


@router.post("/clone")
def clone_repo(payload: RepositoryCloneRequest):

    path = clone_repository(str(payload.repo_url))

    return {"status": "success", "path": path}


@router.get("/file")
def get_file_content(path: str):
    abs_path = os.path.abspath(path)
    abs_repos = os.path.abspath("repos")
    if not abs_path.startswith(abs_repos):
        raise HTTPException(status_code=403, detail="Access denied")
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="File not found")

    content = read_file(abs_path)
    return {"content": content}
