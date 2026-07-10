import pytest
from fastapi.testclient import TestClient
from settings import get_settings

# Bypass strict Redis/DB startup checks for unit test execution
settings = get_settings()
settings.enforce_strict_auth = False

from main import app
from services.auth_service import encode_token
from services.db_service import init_db, get_db, create_user

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    settings.enforce_strict_auth = False
    init_db()
    conn = get_db()
    cursor = conn.cursor()
    try:
        # Clear tables
        cursor.execute("DELETE FROM users")
        cursor.execute("DELETE FROM repositories")
        cursor.execute("DELETE FROM graph_nodes")
        cursor.execute("DELETE FROM audit_logs")
        conn.commit()

        # Seed test user
        create_user(
            "u-analytics-test", "analytics-test@codepilot.ai", "Analytics Tester", ""
        )

        # Seed test repository
        cursor.execute(
            "INSERT INTO repositories (id, repository_name, repository_path, last_accessed, files_indexed, chunks_indexed) VALUES (%s, %s, %s, %s, %s, %s)",
            (
                "repo-analytics-test",
                "analytics-test-repo",
                "repos/analytics-test-repo",
                "2026-07-10 13:42:50",
                12,
                85,
            ),
        )

        # Seed test graph nodes
        cursor.execute(
            "INSERT INTO graph_nodes (id, repo_id, type, name, path) VALUES (%s, %s, %s, %s, %s)",
            (
                "node1",
                "repo-analytics-test",
                "class",
                "AnalyticsService",
                "services/analytics.py",
            ),
        )
        cursor.execute(
            "INSERT INTO graph_nodes (id, repo_id, type, name, path) VALUES (%s, %s, %s, %s, %s)",
            (
                "node2",
                "repo-analytics-test",
                "function",
                "get_metrics",
                "services/analytics.py",
            ),
        )

        # Seed test audit log
        cursor.execute(
            "INSERT INTO audit_logs (id, user_id, action, project_id, timestamp) VALUES (%s, %s, %s, %s, %s)",
            (
                "log1",
                "u-analytics-test",
                "index_repo",
                "repo-analytics-test",
                "2026-07-10 13:42:50",
            ),
        )
        conn.commit()
    finally:
        conn.close()


def test_token_usage_endpoints():
    token = encode_token("u-analytics-test", "analytics-test@codepilot.ai")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/analytics/tokens", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 14

    first = data[0]
    assert "date" in first
    assert "input_tokens" in first
    assert "output_tokens" in first
    assert "requests" in first
    assert isinstance(first["input_tokens"], int)
    assert isinstance(first["output_tokens"], int)
    assert isinstance(first["requests"], int)


def test_codebase_analytics_endpoints():
    token = encode_token("u-analytics-test", "analytics-test@codepilot.ai")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/analytics/codebase", headers=headers)
    assert response.status_code == 200
    data = response.json()

    assert data["total_files"] == 12
    assert data["total_chunks"] == 85
    assert data["symbols"]["classes"] == 1
    assert data["symbols"]["functions"] == 1
    assert isinstance(data["file_ratios"], list)
    assert "health_score" in data["metrics"]
    assert "security_index" in data["metrics"]


def test_workspace_activity_endpoints():
    token = encode_token("u-analytics-test", "analytics-test@codepilot.ai")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/analytics/activity", headers=headers)
    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 90

    # Check that at least one date has the seeded event count
    found_event = False
    for day in data:
        if day["count"] > 0:
            found_event = True
            assert day["count"] == 1

    assert found_event is True
