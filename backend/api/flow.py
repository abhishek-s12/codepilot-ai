from fastapi import APIRouter, Depends
from api.schemas import RepositoryPathRequest
from services.flow_explainer_service import explain_flow
from api.auth import get_current_user_id
from services.auth_validation import verify_repo_access

router = APIRouter()


@router.post("/flow")
def flow(payload: RepositoryPathRequest, user_id: str = Depends(get_current_user_id)):
    verify_repo_access(payload.repo_path, user_id)
    return explain_flow(payload.repo_path)
