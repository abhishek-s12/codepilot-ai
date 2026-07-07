from fastapi import APIRouter, Depends
from services.analytics_service import get_repository_analytics
from api.auth import get_current_user_id
from services.auth_validation import verify_repo_access

router = APIRouter()


@router.get("/analytics")
def get_analytics(repo_path: str, user_id: str = Depends(get_current_user_id)):
    verify_repo_access(repo_path, user_id)
    return get_repository_analytics(repo_path)
