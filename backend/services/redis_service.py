import redis
from settings import get_settings

settings = get_settings()

redis_client = None


def get_redis():
    global redis_client
    if redis_client is None:
        try:
            redis_client = redis.Redis.from_url(
                settings.redis_url, decode_responses=True, socket_timeout=5
            )
            # Ping to verify connection
            redis_client.ping()
        except Exception as e:
            print(
                f"[Redis Connection Error] Failed to connect to Redis at {settings.redis_url}. "
                f"Ensure Redis is running (e.g. 'docker compose up -d'). Error: {e}"
            )
            redis_client = None
    return redis_client


def get_cached_response(prompt_hash: str) -> str:
    client = get_redis()
    if client is None:
        return None
    try:
        return client.get(f"llm_cache:{prompt_hash}")
    except Exception as e:
        print(f"[Redis Cache] Read error: {e}")
        return None


def set_cached_response(prompt_hash: str, response: str, expire_seconds: int = 86400):
    client = get_redis()
    if client is None:
        return
    try:
        client.setex(f"llm_cache:{prompt_hash}", expire_seconds, response)
    except Exception as e:
        print(f"[Redis Cache] Write error: {e}")
