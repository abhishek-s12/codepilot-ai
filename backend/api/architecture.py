from fastapi import APIRouter, Depends
from api.schemas import RepositoryPathRequest
from services.architecture_ai_service import explain_architecture
from api.auth import get_current_user_id
from services.auth_validation import verify_repo_access

router = APIRouter()


@router.post("/architecture")
def architecture(payload: RepositoryPathRequest, user_id: str = Depends(get_current_user_id)):
    verify_repo_access(payload.repo_path, user_id)
    return explain_architecture(payload.repo_path)
