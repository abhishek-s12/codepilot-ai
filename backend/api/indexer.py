from fastapi import APIRouter

from api.schemas import RepositoryPathRequest
from services.indexing_service import index_repository

router = APIRouter()


@router.post("/index")
def index_repo(payload: RepositoryPathRequest):

    result = index_repository(payload.repo_path)

    return result
