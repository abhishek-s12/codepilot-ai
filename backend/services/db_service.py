import sqlite3

DB_PATH = "codepilot.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Create users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Create repositories table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS repositories (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        repository_name TEXT,
        repository_path TEXT,
        branch TEXT,
        indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        files_indexed INTEGER DEFAULT 0,
        chunks_indexed INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    conn.commit()
    conn.close()


def create_user(user_id: str, email: str, name: str, avatar_url: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT OR REPLACE INTO users (id, email, name, avatar_url)
            VALUES (?, ?, ?, ?)
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
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
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
            VALUES (?, ?, ?, ?, ?, ?)
        """,
            (repo_id, user_id, name, path, branch, status),
        )
        conn.commit()
    finally:
        conn.close()


def get_repository(repo_id: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM repositories WHERE id = ?", (repo_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def get_repositories_for_user(user_id: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT * FROM repositories WHERE user_id = ? ORDER BY last_accessed DESC",
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
                SET status = ?, files_indexed = ?, chunks_indexed = ?, indexed_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """,
                (status, files_indexed, chunks_indexed, repo_id),
            )
        else:
            cursor.execute(
                "UPDATE repositories SET status = ? WHERE id = ?", (status, repo_id)
            )
        conn.commit()
    finally:
        conn.close()


def update_repository_access(repo_id: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE repositories SET last_accessed = CURRENT_TIMESTAMP WHERE id = ?",
            (repo_id,),
        )
        conn.commit()
    finally:
        conn.close()


def delete_repository(repo_id: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM repositories WHERE id = ?", (repo_id,))
        conn.commit()
    finally:
        conn.close()
