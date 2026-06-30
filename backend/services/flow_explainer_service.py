from services.flow_service import generate_flow
from services.llm_service import generate_answer


def explain_flow(repo_path: str):

    flow = generate_flow(repo_path)

    prompt = f"""
You are a senior software architect.

Explain the following code execution flow in simple terms.

FLOW:

{flow}

Explain:
1. What happens first
2. What functions are called
3. Overall purpose of the flow
"""

    explanation = generate_answer(prompt)

    return {"flow": flow, "explanation": explanation}
