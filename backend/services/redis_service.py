import json
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


INDEXING_PROGRESS_PREFIX = "indexing_progress:"


def enqueue_indexing_task(repo_path: str, repo_id: str, user_id: str) -> bool:
    """
    Enqueue a repository indexing task via Celery.
    Replaces the old Redis rpush approach.
    """
    try:
        from tasks.indexing_tasks import index_repository_task

        index_repository_task.apply_async(
            args=[repo_path, repo_id, user_id],
            queue="indexing",
        )
        return True
    except Exception as e:
        print(f"[Celery] Failed to enqueue indexing task: {e}")
        return False


def update_indexing_progress(repo_path: str, progress_data: dict) -> bool:
    client = get_redis()
    if client is None:
        return False
    try:
        key = f"{INDEXING_PROGRESS_PREFIX}{repo_path}"
        client.set(key, json.dumps(progress_data))
        client.expire(key, 604800)  # Keep progress state for 7 days
        return True
    except Exception as e:
        print(f"[Redis Queue] Progress update error: {e}")
        return False


def get_indexing_progress(repo_path: str) -> dict:
    client = get_redis()
    if client is None:
        return None
    try:
        key = f"{INDEXING_PROGRESS_PREFIX}{repo_path}"
        val = client.get(key)
        if val:
            return json.loads(val)
        return None
    except Exception as e:
        print(f"[Redis Queue] Get progress error: {e}")
        return None


def enqueue_background_job(job_type: str, payload: dict) -> bool:
    """
    Enqueue a background S3/storage job via Celery.
    Replaces the old Redis rpush approach.
    """
    try:
        if job_type == "archive_and_upload":
            from tasks.indexing_tasks import archive_and_upload_task

            archive_and_upload_task.apply_async(
                kwargs=payload,
                queue="default",
            )
        else:
            print(f"[Celery] Unknown job_type '{job_type}' — skipping.")
            return False
        return True
    except Exception as e:
        print(f"[Celery] Failed to enqueue background job '{job_type}': {e}")
        return False


def acquire_repo_lock(repo_name: str, expire_seconds: int = 300) -> bool:
    """Acquires a distributed Redis lock to prevent concurrent S3/Git operations on the same repository."""
    client = get_redis()
    if client is None:
        return True  # Fallback: proceed if Redis is offline
    try:
        lock_key = f"lock:repo:{repo_name}"
        return bool(client.set(lock_key, "1", ex=expire_seconds, nx=True))
    except Exception as e:
        print(f"[Redis Lock] Failed to acquire lock for {repo_name}: {e}")
        return True


def release_repo_lock(repo_name: str):
    """Releases the distributed Redis lock for a repository."""
    client = get_redis()
    if client is None:
        return
    try:
        lock_key = f"lock:repo:{repo_name}"
        client.delete(lock_key)
    except Exception as e:
        print(f"[Redis Lock] Failed to release lock for {repo_name}: {e}")
