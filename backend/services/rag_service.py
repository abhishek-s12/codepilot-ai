from services.search_service import search_codebase
from services.llm_service import generate_answer


def ask_codepilot(question: str):

    retrieved_chunks = search_codebase(question)

    context = ""

    for chunk in retrieved_chunks:

        context += f"""
FILE: {chunk['file']}

{chunk['snippet']}

----------------
"""

    prompt = f"""
You are an expert software engineer.

Answer the user's question using only the provided code context.

CODE CONTEXT:

{context}

QUESTION:

{question}
"""

    answer = generate_answer(prompt)

    return {
        "question": question,
        "answer": answer,
        "sources": retrieved_chunks
    }