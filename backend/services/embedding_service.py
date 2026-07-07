import hashlib
import json
from functools import lru_cache

from sentence_transformers import SentenceTransformer


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    """Load and cache the embedding model."""
    return SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str) -> list[float]:
    """Generate an embedding vector for the given text, with persistent SQLite cache."""
    if not text:
        return []

    text_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
    db_path = "codepilot.db"

    # Try retrieving from SQLite cache
    try:
        from services.db_service import get_db

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT embedding FROM embedding_cache WHERE text_hash = %s", (text_hash,)
        )
        row = cursor.fetchone()
        if row:
            conn.close()
            return json.loads(row[0])
    except Exception as e:
        print(f"[Embedding Cache] Read error: {e}")
    finally:
        try:
            conn.close()
        except Exception:
            pass

    # Generate using model
    vector = get_model().encode(text).tolist()

    # Save back to SQLite cache
    try:
        from services.db_service import get_db

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO embedding_cache (text_hash, embedding)
            VALUES (%s, %s)
            ON CONFLICT (text_hash) DO UPDATE SET embedding = EXCLUDED.embedding
            """,
            (text_hash, json.dumps(vector)),
        )
        conn.commit()
    except Exception as e:
        print(f"[Embedding Cache] Write error: {e}")
    finally:
        try:
            conn.close()
        except Exception:
            pass

    return vector
