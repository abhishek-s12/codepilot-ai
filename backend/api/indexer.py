from fastapi import APIRouter

from services.indexing_service import index_repository

router = APIRouter()


@router.post("/index")
def index_repo(repo_path: str):

    result = index_repository(repo_path)

    return result