import os
import psycopg2
import psycopg2.pool
import psycopg2.extras
from settings import get_settings

settings = get_settings()
db_pool = None


def get_pool():
    global db_pool
    if db_pool is None:
        try:
            db_pool = psycopg2.pool.ThreadedConnectionPool(
                1, 20, dsn=settings.postgres_url
            )
        except Exception as e:
            print(f"[DB Error] Failed to connect to PostgreSQL: {e}")
            raise
    return db_pool


class PoolConnectionWrapper:
    def __init__(self, pool, conn):
        self._pool = pool
        self._conn = conn

    def __getattr__(self, name):
        return getattr(self._conn, name)

    def cursor(self, *args, **kwargs):
        kwargs.setdefault("cursor_factory", psycopg2.extras.DictCursor)
        return self._conn.cursor(*args, **kwargs)

    def close(self):
        if self._pool and self._conn:
            self._pool.putconn(self._conn)
            self._conn = None
            self._pool = None


def get_db():
    pool = get_pool()
    if pool is None:
        raise Exception("Pool is None")
    conn = pool.getconn()
    return PoolConnectionWrapper(pool, conn)


def run_alembic_migrations():
    from alembic.config import Config
    from alembic import command

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ini_path = os.path.join(base_dir, "alembic.ini")

    alembic_cfg = Config(ini_path)
    alembic_cfg.set_main_option(
        "sqlalchemy.url", settings.postgres_url.replace("%", "%%")
    )

    print("[DB] Running Alembic migrations...")
    command.upgrade(alembic_cfg, "head")
    print("[DB] Alembic migrations completed successfully.")


def init_db():
    try:
        run_alembic_migrations()
    except Exception as e:
        print(
            f"[DB Warning] Database migrations failed or database is unreachable on startup: {e}. "
            f"The application will continue starting up."
        )


def create_user(user_id: str, email: str, name: str, avatar_url: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO users (id, email, name, avatar_url)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                name = EXCLUDED.name,
                avatar_url = EXCLUDED.avatar_url
            """,
            (user_id, email, name, avatar_url),
        )
        conn.commit()
    finally:
        conn.close()


def get_user(user_id: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def create_repository(
    repo_id: str, user_id: str, name: str, path: str, branch: str, status: str
):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO repositories (id, user_id, repository_name, repository_path, branch, status)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (repo_id, user_id, name, path, branch, status),
        )
        conn.commit()
    finally:
        conn.close()


def get_repositories_for_user(user_id: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT * FROM repositories WHERE user_id = %s ORDER BY last_accessed DESC",
            (user_id,),
        )
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def update_repository_status(
    repo_id: str, status: str, files_indexed: int = None, chunks_indexed: int = None
):
    conn = get_db()
    cursor = conn.cursor()
    try:
        if files_indexed is not None and chunks_indexed is not None:
            cursor.execute(
                """
                UPDATE repositories
                SET status = %s, files_indexed = %s, chunks_indexed = %s, indexed_at = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (status, files_indexed, chunks_indexed, repo_id),
            )
        else:
            cursor.execute(
                "UPDATE repositories SET status = %s WHERE id = %s",
                (status, repo_id),
            )
        conn.commit()
    finally:
        conn.close()


def delete_repository(repo_id: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM repositories WHERE id = %s", (repo_id,))
        conn.commit()
    finally:
        conn.close()


def create_report(
    report_id: str,
    repository_id: str,
    name: str,
    report_type: str,
    s3_key: str,
    file_size: int,
):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO reports (id, repository_id, name, report_type, s3_key, file_size)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (report_id, repository_id, name, report_type, s3_key, file_size),
        )
        conn.commit()
    finally:
        conn.close()


def get_reports_by_repo(repository_id: str) -> list[dict]:
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT * FROM reports WHERE repository_id = %s ORDER BY created_at DESC",
            (repository_id,),
        )
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_report(report_id: str) -> dict | None:
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM reports WHERE id = %s", (report_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()
