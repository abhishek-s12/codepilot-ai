from fastapi import APIRouter, Depends
from api.schemas import RepositoryPathRequest
from services.review_service import review_repository
from api.auth import get_current_user_id
from services.auth_validation import verify_repo_access

router = APIRouter()


@router.post("/repository")
def review(payload: RepositoryPathRequest, user_id: str = Depends(get_current_user_id)):
    verify_repo_access(payload.repo_path, user_id)
    return review_repository(payload.repo_path)
