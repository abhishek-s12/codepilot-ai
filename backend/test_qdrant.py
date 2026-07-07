# test_qdrant.py
from services.db_service import init_db

init_db()
from vector_store.qdrant_service import search_chunks, add_chunk

print("Testing Qdrant connectivity...")
add_chunk(
    "test_id_123",
    "def my_sample_code(): pass",
    {"file_name": "sample.py", "file_path": "sample.py"},
)
print("Add chunk succeeded.")

results = search_chunks("sample code")
print("Search results:")
print(results)
