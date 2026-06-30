from fastapi import APIRouter

from services.repository_graph_service import generate_repository_graph

router = APIRouter()


@router.get("/graph")
def get_graph(repo_path: str):

    return generate_repository_graph(repo_path)
