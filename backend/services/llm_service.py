import requests

from settings import get_settings

settings = get_settings()


def generate_answer(prompt: str):
    if not settings.llm_api_key:
        raise ValueError("LLM_API_KEY is not set. Add your OpenRouter API key to backend/.env.")

    response = requests.post(
        f"{settings.llm_base_url}/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.llm_api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.llm_site_url,
            "X-Title": settings.llm_app_name,
        },
        json={
            "model": settings.llm_model,
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=120,
    )
    response.raise_for_status()
    data = response.json()

    return data["choices"][0]["message"]["content"]
