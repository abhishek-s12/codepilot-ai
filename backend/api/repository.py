from fastapi import APIRouter

from api.schemas import RepositoryCloneRequest
from services.repo_service import clone_repository

router = APIRouter()


@router.post("/clone")
def clone_repo(payload: RepositoryCloneRequest):

    path = clone_repository(str(payload.repo_url))

    return {"status": "success", "path": path}
