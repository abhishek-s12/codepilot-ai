from fastapi import APIRouter

from services.search_service import search_codebase

router = APIRouter()


@router.get("/search")
def search(query: str):

    results = search_codebase(query)

    return results
