from services.search_service import search_codebase
from services.llm_service import generate_answer


def ask_codepilot(question: str, repo_path: str = None):

    retrieved_chunks = search_codebase(question, repo_path=repo_path)

    context = ""

    for chunk in retrieved_chunks:
        context += f"""
FILE: {chunk["file"]}

{chunk["snippet"]}

----------------
"""

    prompt = f"""
You are a codebase assistant.

Answer ONLY using the provided context.

If the answer is not present in the context, say:

"I could not find the answer in the indexed repository."

CODE CONTEXT:

{context}

QUESTION:

{question}
"""

    print("=" * 80)
    print(prompt)
    print("=" * 80)

    answer = generate_answer(prompt)

    return {"question": question, "answer": answer, "sources": retrieved_chunks}


def ask_codepilot_stream(question: str, repo_path: str = None):
    from services.search_service import search_codebase
    from services.llm_service import generate_answer_stream
    import json

    retrieved_chunks = search_codebase(question, repo_path=repo_path)

    # Yield sources first
    yield json.dumps({"type": "sources", "sources": retrieved_chunks}) + "\n"

    context = ""

    for chunk in retrieved_chunks:
        context += f"""
FILE: {chunk["file"]}

{chunk["snippet"]}

----------------
"""

    prompt = f"""
You are a codebase assistant.

Answer ONLY using the provided context.

If the answer is not present in the context, say:

"I could not find the answer in the indexed repository."

CODE CONTEXT:

{context}

QUESTION:

{question}
"""

    try:
        for token in generate_answer_stream(prompt):
            yield json.dumps({"type": "token", "token": token}) + "\n"
    except Exception as e:
        yield json.dumps({"type": "error", "message": str(e)}) + "\n"
