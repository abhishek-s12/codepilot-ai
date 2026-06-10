from fastapi import APIRouter
from services.repo_service import clone_repository

router = APIRouter()


@router.post("/clone")
def clone_repo(repo_url: str):

    path = clone_repository(repo_url)

    return {
        "status": "success",
        "path": path
    }