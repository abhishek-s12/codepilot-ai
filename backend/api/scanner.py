from fastapi import APIRouter
from services.scanner_service import scan_repository

router = APIRouter()


@router.get("/scan")
def scan_repo(repo_path: str):

    result = scan_repository(repo_path)

    return result
