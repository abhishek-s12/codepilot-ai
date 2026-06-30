from fastapi import APIRouter

from api.schemas import RepositoryPathRequest
from services.flow_explainer_service import explain_flow

router = APIRouter()


@router.post("/flow")
def flow(payload: RepositoryPathRequest):

    return explain_flow(payload.repo_path)
