from vector_store.chroma_service import search_chunks, get_collection_name_for_path


def search_codebase(query: str, repo_path: str = None):

    collection_name = get_collection_name_for_path(repo_path)
    results = search_chunks(query, collection_name=collection_name)

    formatted = []

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    distances = results["distances"][0]

    for doc, meta, distance in zip(docs, metas, distances):
        formatted.append(
            {
                "file": meta["file_name"],
                "path": meta["file_path"],
                "symbol": meta.get("symbol"),
                "type": meta.get("symbol_type"),
                "score": round(distance, 4),
                "snippet": doc,
            }
        )

    return formatted
