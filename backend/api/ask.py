from fastapi import APIRouter

from api.schemas import QuestionRequest
from services.rag_service import ask_codepilot

router = APIRouter()


@router.post("/ask")
def ask(payload: QuestionRequest):

    return ask_codepilot(payload.question)
