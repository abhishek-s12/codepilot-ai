from fastapi import APIRouter, Depends
from services.repository_graph_service import generate_repository_graph
from api.auth import get_current_user_id
from services.auth_validation import verify_repo_access

router = APIRouter()


@router.get("/graph")
def get_graph(repo_path: str, user_id: str = Depends(get_current_user_id)):
    verify_repo_access(repo_path, user_id)
    return generate_repository_graph(repo_path)
