from fastapi import APIRouter

from services.repository_call_graph_service import (
    build_repository_call_graph
)

router = APIRouter()


@router.get("/call-graph")
def call_graph(repo_path: str):

    return build_repository_call_graph(
        repo_path
    )