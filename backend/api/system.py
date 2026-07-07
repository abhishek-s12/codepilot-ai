from fastapi import APIRouter
from services.websocket_manager import manager

router = APIRouter()


@router.get("/system/websocket/metrics")
def get_websocket_metrics():
    """Returns WebSocket operational metrics for dashboard tracking."""
    return manager.get_metrics()
