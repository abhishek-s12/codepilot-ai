import requests
import json

from settings import get_settings

settings = get_settings()


def generate_answer(prompt: str):
    if not settings.llm_api_key:
        raise ValueError(
            "LLM_API_KEY is not set. Add your OpenRouter API key to backend/.env."
        )

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


def generate_answer_stream(prompt: str):
    if not settings.llm_api_key:
        raise ValueError(
            "LLM_API_KEY is not set. Add your OpenRouter API key to backend/.env."
        )

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
            "stream": True,
        },
        stream=True,
        timeout=120,
    )
    response.raise_for_status()

    for line in response.iter_lines():
        if line:
            decoded_line = line.decode("utf-8").strip()
            if decoded_line.startswith("data: "):
                data_str = decoded_line[6:]
                if data_str == "[DONE]":
                    break
                try:
                    data = json.loads(data_str)
                    delta = data["choices"][0]["delta"]
                    if "content" in delta:
                        yield delta["content"]
                except Exception:
                    pass
