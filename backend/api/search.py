from fastapi import APIRouter

from services.search_service import search_codebase

router = APIRouter()


@router.get("/search")
def search(query: str, repo_path: str = None):

    results = search_codebase(query, repo_path)

    return results
