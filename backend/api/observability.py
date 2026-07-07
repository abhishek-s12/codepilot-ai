from fastapi import APIRouter, Depends
from services.observability_service import get_telemetry_metrics
from api.auth import get_current_user_id

router = APIRouter()


@router.get("/metrics")
def get_metrics(user_id: str = Depends(get_current_user_id)):
    """Endpoint that returns system logging metrics and diagnostics."""
    return get_telemetry_metrics()
