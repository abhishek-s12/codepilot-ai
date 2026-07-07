from fastapi import APIRouter, Depends
from api.schemas import RepositoryPathRequest
from services.repository_call_graph_service import build_repository_call_graph
from api.auth import get_current_user_id
from services.auth_validation import verify_repo_access

router = APIRouter()


@router.post("/call-graph")
def call_graph(payload: RepositoryPathRequest, user_id: str = Depends(get_current_user_id)):
    verify_repo_access(payload.repo_path, user_id)
    return build_repository_call_graph(payload.repo_path)
