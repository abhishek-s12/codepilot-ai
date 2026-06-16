# reindex.py

from services.indexing_service import index_repository

result = index_repository("repos/codepilot-ai")

print(result)