from fastapi import APIRouter

from api.schemas import RepositoryPathRequest
from services.architecture_ai_service import explain_architecture

router = APIRouter()


@router.post("/architecture")
def architecture(payload: RepositoryPathRequest):

    return explain_architecture(payload.repo_path)
