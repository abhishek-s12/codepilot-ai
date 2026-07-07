from fastapi import APIRouter, Depends
from services.scanner_service import scan_repository
from api.auth import get_current_user_id
from services.auth_validation import verify_repo_access

router = APIRouter()


@router.get("/scan")
def scan_repo(repo_path: str, user_id: str = Depends(get_current_user_id)):
    # Verify read access to the repository
    verify_repo_access(repo_path, user_id)
    result = scan_repository(repo_path)
    return result
