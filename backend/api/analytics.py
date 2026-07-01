from fastapi import APIRouter
from services.analytics_service import get_repository_analytics

router = APIRouter()


@router.get("/analytics")
def get_analytics(repo_path: str):
    return get_repository_analytics(repo_path)
