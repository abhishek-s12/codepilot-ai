# test_chroma.py

from vector_store.chroma_service import get_collection

collection = get_collection()
results = collection.get()

print("TOTAL DOCS:", len(results["documents"]))

for i in range(min(20, len(results["documents"]))):
    print("=" * 60)
    print("METADATA:")
    print(results["metadatas"][i])
