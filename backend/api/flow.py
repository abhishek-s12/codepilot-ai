from fastapi import APIRouter

from services.flow_explainer_service import (
    explain_flow
)

router = APIRouter()


@router.post("/flow")
def flow(repo_path: str):

    return explain_flow(repo_path)