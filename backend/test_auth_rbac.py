import pytest
import jwt
import datetime
import time
from fastapi import HTTPException
from settings import get_settings
from services.auth_service import encode_token, decode_token, get_user_id_from_token
from services.db_service import init_db, get_db, create_user, create_repository
from services.auth_validation import (
    verify_repo_access,
    verify_repo_write_access,
    get_repo_for_file_path,
    verify_file_access,
)
from services.websocket_auth import verify_project_role, verify_project_membership

settings = get_settings()


@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    init_db()
    conn = get_db()
    cursor = conn.cursor()
    try:
        # Create test users
        cursor.execute("DELETE FROM project_members")
        cursor.execute("DELETE FROM comments")
        cursor.execute("DELETE FROM projects")
        cursor.execute("DELETE FROM repositories")
        cursor.execute("DELETE FROM organizations")
        cursor.execute("DELETE FROM users")
        conn.commit()

        # Seed users
        create_user("u-owner", "owner@test.com", "Project Owner", "")
        create_user("u-admin", "admin@test.com", "Project Admin", "")
        create_user("u-member", "member@test.com", "Project Member", "")
        create_user("u-viewer", "viewer@test.com", "Project Viewer", "")
        create_user("u-stranger", "stranger@test.com", "Stranger", "")

        # Seed repository (owned by u-owner)
        create_repository(
            repo_id="repo-auth-test",
            user_id="u-owner",
            name="auth-test-repo",
            path="repos/auth-test-repo",
            branch="main",
            status="active",
        )

        # Seed organization
        cursor.execute(
            "INSERT INTO organizations (id, name) VALUES (%s, %s)",
            ("org-test", "Test Organization"),
        )

        # Seed project
        cursor.execute(
            "INSERT INTO projects (id, org_id, repository_id, name) VALUES (%s, %s, %s, %s)",
            ("proj-auth-test", "org-test", "repo-auth-test", "Auth Test Project"),
        )

        # Seed project memberships
        cursor.execute(
            "INSERT INTO project_members (project_id, user_id, role) VALUES (%s, %s, %s)",
            ("proj-auth-test", "u-owner", "owner"),
        )
        cursor.execute(
            "INSERT INTO project_members (project_id, user_id, role) VALUES (%s, %s, %s)",
            ("proj-auth-test", "u-admin", "admin"),
        )
        cursor.execute(
            "INSERT INTO project_members (project_id, user_id, role) VALUES (%s, %s, %s)",
            ("proj-auth-test", "u-member", "member"),
        )
        cursor.execute(
            "INSERT INTO project_members (project_id, user_id, role) VALUES (%s, %s, %s)",
            ("proj-auth-test", "u-viewer", "viewer"),
        )
        conn.commit()
    finally:
        conn.close()


def test_token_encode_decode():
    """Verify that JWT encode and decode work correctly and validate exp claims."""
    token = encode_token("test-user", "test@user.com")
    payload = decode_token(token)
    assert payload["user_id"] == "test-user"
    assert payload["email"] == "test@user.com"


def test_token_expiry():
    """Verify that expired tokens raise jwt.ExpiredSignatureError."""
    # Generate token with negative expiry
    payload = {
        "exp": datetime.datetime.utcnow() - datetime.timedelta(seconds=10),
        "iat": datetime.datetime.utcnow() - datetime.timedelta(seconds=20),
        "user_id": "expired-user",
        "email": "expired@user.com",
    }
    expired_token = jwt.encode(payload, settings.jwt_secret, algorithm="HS256")
    
    with pytest.raises(jwt.ExpiredSignatureError):
        decode_token(expired_token)

    assert get_user_id_from_token(expired_token) is None


def test_sandbox_login_toggle():
    """Verify settings.allow_sandbox_login toggling logic (can check manually or simulated)."""
    orig_allow = settings.allow_sandbox_login
    try:
        # Simulate allow sandbox
        settings.allow_sandbox_login = True
        from services.websocket_auth import authenticate_ws_user
        assert authenticate_ws_user(None) == "mock-dev"

        # Simulate disable sandbox
        settings.allow_sandbox_login = False
        assert authenticate_ws_user(None) is None
    finally:
        settings.allow_sandbox_login = orig_allow


def test_repo_read_permissions():
    """Verify that verify_repo_access correctly allows owners and project members, and rejects strangers."""
    # 1. Owner has access
    repo = verify_repo_access("repo-auth-test", "u-owner")
    assert repo["id"] == "repo-auth-test"

    # 2. Project admin/member/viewer has access
    assert verify_repo_access("repo-auth-test", "u-admin")["id"] == "repo-auth-test"
    assert verify_repo_access("repo-auth-test", "u-member")["id"] == "repo-auth-test"
    assert verify_repo_access("repo-auth-test", "u-viewer")["id"] == "repo-auth-test"

    # 3. Stranger is rejected with 403
    with pytest.raises(HTTPException) as exc:
        verify_repo_access("repo-auth-test", "u-stranger")
    assert exc.value.status_code == 403


def test_repo_write_permissions():
    """Verify that verify_repo_write_access correctly rejects viewers and strangers, while allowing owner/members."""
    # 1. Owner and admin/member have write access
    assert verify_repo_write_access("repo-auth-test", "u-owner")["id"] == "repo-auth-test"
    assert verify_repo_write_access("repo-auth-test", "u-admin")["id"] == "repo-auth-test"
    assert verify_repo_write_access("repo-auth-test", "u-member")["id"] == "repo-auth-test"

    # 2. Viewer (read-only) is rejected with 403
    with pytest.raises(HTTPException) as exc:
        verify_repo_write_access("repo-auth-test", "u-viewer")
    assert exc.value.status_code == 403
    assert "read-only" in exc.value.detail

    # 3. Stranger is rejected with 403
    with pytest.raises(HTTPException) as exc:
        verify_repo_write_access("repo-auth-test", "u-stranger")
    assert exc.value.status_code == 403


def test_project_membership_and_role_checks():
    """Verify verify_project_membership and verify_project_role helpers."""
    assert verify_project_membership("u-member", "proj-auth-test") is True
    assert verify_project_membership("u-stranger", "proj-auth-test") is False

    assert verify_project_role("u-owner", "proj-auth-test", ["owner"]) is True
    assert verify_project_role("u-admin", "proj-auth-test", ["owner"]) is False
    assert verify_project_role("u-admin", "proj-auth-test", ["owner", "admin"]) is True
    assert verify_project_role("u-viewer", "proj-auth-test", ["viewer"]) is True


def test_file_access_permissions():
    """Verify verify_file_access matches repo boundaries."""
    # The seeded repository path is repos/auth-test-repo
    # Check that a file inside is correctly matched to repo-auth-test
    repo_id = get_repo_for_file_path("repos/auth-test-repo/src/main.py")
    assert repo_id == "repo-auth-test"

    # Verify u-member can read the file
    verify_file_access("repos/auth-test-repo/src/main.py", "u-member", write=False)

    # Verify u-viewer can read but NOT write
    verify_file_access("repos/auth-test-repo/src/main.py", "u-viewer", write=False)
    with pytest.raises(HTTPException) as exc:
        verify_file_access("repos/auth-test-repo/src/main.py", "u-viewer", write=True)
    assert exc.value.status_code == 403
