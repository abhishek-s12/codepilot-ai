from fastapi import APIRouter

from services.rag_service import ask_codepilot

router = APIRouter()


@router.post("/ask")
def ask(question: str):

    return ask_codepilot(question)