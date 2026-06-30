from fastapi import APIRouter

from api.schemas import RepositoryPathRequest
from services.repository_call_graph_service import (
    build_repository_call_graph
)

router = APIRouter()


@router.post("/call-graph")
def call_graph(payload: RepositoryPathRequest):

    return build_repository_call_graph(
        payload.repo_path
    )
