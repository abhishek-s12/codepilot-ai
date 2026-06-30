# pyrefly: ignore [missing-import]
import chromadb
from chromadb.errors import NotFoundError
from services.embedding_service import generate_embedding

COLLECTION_NAME = "code_chunks"

client = chromadb.PersistentClient(path="chroma_db")


class LocalEmbeddingFunction(chromadb.EmbeddingFunction):
    def __call__(self, input: chromadb.Documents) -> chromadb.Embeddings:
        return [generate_embedding(doc) for doc in input]


def get_collection():
    try:
        return client.get_or_create_collection(
            name=COLLECTION_NAME, embedding_function=LocalEmbeddingFunction()
        )
    except ValueError as e:
        if "embedding function" in str(e).lower() or "conflict" in str(e).lower():
            try:
                client.delete_collection(COLLECTION_NAME)
            except Exception:
                pass
            return client.get_or_create_collection(
                name=COLLECTION_NAME, embedding_function=LocalEmbeddingFunction()
            )
        raise e


def add_chunk(chunk_id, text, metadata):
    try:
        collection = get_collection()
        collection.add(
            ids=[chunk_id],
            documents=[text],
            metadatas=[metadata],
        )
    except NotFoundError:
        collection = get_collection()
        collection.add(
            ids=[chunk_id],
            documents=[text],
            metadatas=[metadata],
        )


def search_chunks(query: str, n_results: int = 5):
    collection = get_collection()

    return collection.query(
        query_texts=[query],
        n_results=n_results,
    )


def reset_collection():
    try:
        client.delete_collection(COLLECTION_NAME)
    except NotFoundError:
        pass

    return get_collection()
