import hashlib
import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from settings import get_settings
from services.embedding_service import generate_embedding

settings = get_settings()
client = None


def get_client():
    global client
    if client is None:
        try:
            client = QdrantClient(
                host=settings.qdrant_host,
                port=settings.qdrant_port,
                check_compatibility=False
            )
        except Exception as e:
            print(
                f"[Qdrant Client Error] Failed to connect to Qdrant at {settings.qdrant_host}:{settings.qdrant_port}. "
                f"Ensure Qdrant is running (e.g. 'docker compose up -d'). Error: {e}"
            )
            client = None
    return client


COLLECTION_NAME = "code_chunks"


def get_collection_name_for_path(repo_path: str) -> str:
    """Deterministic, Qdrant-compatible collection name based on repository path."""
    if not repo_path:
        return COLLECTION_NAME
    normalized = repo_path.replace("\\", "/").strip("/")
    path_hash = hashlib.md5(normalized.encode("utf-8")).hexdigest()
    return f"repo_{path_hash}"


def init_collection(collection_name: str):
    cli = get_client()
    if cli is None:
        return
    try:
        collections = cli.get_collections()
        exists = any(c.name == collection_name for c in collections.collections)
        if not exists:
            cli.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )
    except Exception as e:
        print(f"[Qdrant Collection Init Fail] Error: {e}")


def add_chunk(chunk_id, text, metadata, collection_name: str = COLLECTION_NAME):
    cli = get_client()
    if cli is None:
        return
    init_collection(collection_name)
    vector = generate_embedding(text)
    
    # Generate valid UUID from chunk_id hash
    point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, chunk_id))
    
    try:
        cli.upsert(
            collection_name=collection_name,
            points=[
                PointStruct(
                    id=point_id,
                    vector=vector,
                    payload={"text": text, "metadata": metadata, "chunk_id": chunk_id}
                )
            ]
        )
    except Exception as e:
        print(f"[Qdrant Add Chunk Error] collection={collection_name}, error={e}")


def search_chunks(
    query: str, n_results: int = 5, collection_name: str = COLLECTION_NAME
):
    cli = get_client()
    if cli is None:
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}
    init_collection(collection_name)
    vector = generate_embedding(query)
    
    try:
        search_result = cli.query_points(
            collection_name=collection_name,
            query=vector,
            limit=n_results
        )
        
        ids = []
        documents = []
        metadatas = []
        distances = []
        for hit in search_result.points:
            ids.append(hit.payload.get("chunk_id", str(hit.id)))
            documents.append(hit.payload.get("text", ""))
            metadatas.append(hit.payload.get("metadata", {}))
            distances.append(hit.score)
            
        return {
            "ids": [ids],
            "documents": [documents],
            "metadatas": [metadatas],
            "distances": [distances]
        }
    except Exception as e:
        print(f"[Qdrant Search Error] collection={collection_name}, error={e}")
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}


def reset_collection(collection_name: str = COLLECTION_NAME):
    cli = get_client()
    if cli is None:
        return
    delete_collection(collection_name)
    init_collection(collection_name)


def delete_collection(collection_name: str):
    cli = get_client()
    if cli is None:
        return
    try:
        cli.delete_collection(collection_name=collection_name)
    except Exception:
        pass
