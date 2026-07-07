from services.db_service import get_db
from vector_store.qdrant_service import reset_collection

print("Resetting database state...")
# Reset Vector DB
reset_collection()
print("Qdrant collections reset.")

# Truncate Cache and Telemetry tables in PostgreSQL
tables = ["embedding_cache", "llm_cache", "analytics_cache", "telemetry_logs"]

try:
    conn = get_db()
    cursor = conn.cursor()
    for table in tables:
        cursor.execute(f"TRUNCATE TABLE {table} CASCADE")
        print(f"Truncated table: {table}")
    conn.commit()
    conn.close()
except Exception as e:
    print(f"PostgreSQL Truncate Error: {e}")

print("Done. Clean state prepared for Public Beta Release!")
