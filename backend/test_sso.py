"""
Tests for SSO / OIDC endpoints added to backend/api/auth.py.

Coverage:
  - GET /auth/sso/login  (sandbox mode, configured mode, unconfigured error)
  - GET /auth/sso/callback  (mock code, real code happy path, missing code error,
                             full OIDC provider mock via monkeypatch)
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from main import app
from settings import get_settings
from services.db_service import init_db

settings = get_settings()

# ---------------------------------------------------------------------------
# Shared test client
# ---------------------------------------------------------------------------
client = TestClient(app, follow_redirects=False)


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    """Ensure the in-memory / test DB is initialised before any test runs."""
    init_db()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _sandbox_settings():
    """Return patch values that enable sandbox and clear SSO credentials."""
    return {
        "allow_sandbox_login": True,
        "sso_client_id": "",
        "sso_client_secret": "",
        "sso_metadata_url": "",
        "sso_redirect_uri": "http://localhost:8000/auth/sso/callback",
        "llm_site_url": "http://localhost:3000",
    }


def _configured_settings():
    """Return patch values simulating a fully configured OIDC provider."""
    return {
        "allow_sandbox_login": False,
        "sso_client_id": "test-client-id",
        "sso_client_secret": "test-client-secret",
        "sso_metadata_url": "https://accounts.example.com",
        "sso_redirect_uri": "http://localhost:8000/auth/sso/callback",
        "llm_site_url": "http://localhost:3000",
    }


# ---------------------------------------------------------------------------
# /auth/sso/login
# ---------------------------------------------------------------------------


class TestSSOLogin:
    """Tests for GET /auth/sso/login."""

    def test_sandbox_redirects_to_mock_callback(self):
        """In sandbox mode with no SSO config, should redirect to the mock callback."""
        with patch.multiple(settings, **_sandbox_settings()):
            resp = client.get("/auth/sso/login")

        assert resp.status_code in (302, 307), (
            f"Expected redirect, got {resp.status_code}"
        )
        location = resp.headers.get("location", "")
        assert "sso/callback" in location, f"Expected callback URL, got: {location}"
        assert "mock-sso-code" in location, "Expected mock-sso-code in redirect URL"

    def test_configured_redirects_to_oidc_provider(self):
        """With SSO fully configured, should redirect to the OIDC authorization URL."""
        cfg = _configured_settings()
        with patch.multiple(settings, **cfg):
            resp = client.get("/auth/sso/login")

        assert resp.status_code in (302, 307), (
            f"Expected redirect, got {resp.status_code}"
        )
        location = resp.headers.get("location", "")
        assert "accounts.example.com" in location, (
            f"Expected OIDC provider URL, got: {location}"
        )
        assert "client_id=test-client-id" in location

    def test_no_sso_config_no_sandbox_returns_400(self):
        """Without SSO config and without sandbox mode, should return 400."""
        with patch.multiple(
            settings,
            allow_sandbox_login=False,
            sso_client_id="",
            sso_metadata_url="",
        ):
            resp = client.get("/auth/sso/login")

        assert resp.status_code == 400
        body = resp.json()["detail"].lower()
        assert "configured" in body or "credentials" in body


# ---------------------------------------------------------------------------
# /auth/sso/callback
# ---------------------------------------------------------------------------


class TestSSOCallback:
    """Tests for GET /auth/sso/callback."""

    # --- Sandbox / mock flow ---

    def test_mock_code_sandbox_issues_jwt(self):
        """Calling /sso/callback?code=mock-sso-code in sandbox mode should redirect with JWT."""
        with patch.multiple(settings, **_sandbox_settings()):
            resp = client.get("/auth/sso/callback?code=mock-sso-code")

        assert resp.status_code in (302, 307), (
            f"Expected redirect, got {resp.status_code}"
        )
        location = resp.headers.get("location", "")
        assert "token=" in location, f"Expected JWT in redirect, got: {location}"
        assert "refresh_token=" in location

    def test_mock_code_sandbox_redirect_to_frontend(self):
        """Sandbox callback redirect should point to the configured frontend URL."""
        with patch.multiple(settings, **_sandbox_settings()):
            resp = client.get("/auth/sso/callback?code=mock-sso-code")

        location = resp.headers.get("location", "")
        assert "localhost:3000" in location, f"Expected frontend URL, got: {location}"

    # --- Full OIDC provider flow (mocked via monkeypatch) ---

    def test_real_code_exchanges_and_issues_jwt(self, monkeypatch):
        """Simulate a real OIDC callback with mocked token and userinfo responses."""
        cfg = _configured_settings()

        mock_token_resp = MagicMock()
        mock_token_resp.raise_for_status = MagicMock()
        mock_token_resp.json.return_value = {"access_token": "oidc-access-token-xyz"}

        mock_userinfo_resp = MagicMock()
        mock_userinfo_resp.raise_for_status = MagicMock()
        mock_userinfo_resp.json.return_value = {
            "sub": "oidc-user-001",
            "email": "oidcuser@example.com",
            "name": "OIDC Test User",
            "picture": "https://example.com/avatar.png",
        }

        monkeypatch.setattr(
            "api.auth.requests.post", lambda url, data=None, **kw: mock_token_resp
        )
        monkeypatch.setattr(
            "api.auth.requests.get", lambda url, headers=None, **kw: mock_userinfo_resp
        )

        with patch.multiple(settings, **cfg):
            resp = client.get("/auth/sso/callback?code=real-auth-code")

        assert resp.status_code in (302, 307), (
            f"Expected redirect, got {resp.status_code}"
        )
        location = resp.headers.get("location", "")
        assert "token=" in location, f"Expected JWT token in redirect, got: {location}"
        assert "refresh_token=" in location

    def test_missing_code_param_returns_422(self):
        """Calling /sso/callback without ?code= should return 422 (FastAPI validation)."""
        resp = client.get("/auth/sso/callback")
        assert resp.status_code == 422

    def test_token_exchange_failure_returns_400(self, monkeypatch):
        """If the OIDC token endpoint raises, should return 400."""
        cfg = _configured_settings()

        def fail_post(url, data=None, **kw):
            raise Exception("Connection refused")

        monkeypatch.setattr("api.auth.requests.post", fail_post)

        with patch.multiple(settings, **cfg):
            resp = client.get("/auth/sso/callback?code=bad-code")

        assert resp.status_code == 400
        detail = resp.json()["detail"].lower()
        assert "exchange" in detail or "failed" in detail

    def test_userinfo_fetch_failure_returns_400(self, monkeypatch):
        """If /userinfo call fails after token exchange, should return 400."""
        cfg = _configured_settings()

        mock_token_resp = MagicMock()
        mock_token_resp.raise_for_status = MagicMock()
        mock_token_resp.json.return_value = {"access_token": "some-token"}

        def fail_get(url, headers=None, **kw):
            raise Exception("Userinfo endpoint timeout")

        monkeypatch.setattr(
            "api.auth.requests.post", lambda url, data=None, **kw: mock_token_resp
        )
        monkeypatch.setattr("api.auth.requests.get", fail_get)

        with patch.multiple(settings, **cfg):
            resp = client.get("/auth/sso/callback?code=some-code")

        assert resp.status_code == 400
        detail = resp.json()["detail"].lower()
        assert "profile" in detail or "failed" in detail

    def test_no_sso_config_real_code_returns_400(self):
        """If SSO is not configured and a non-mock code is submitted, return 400."""
        with patch.multiple(
            settings,
            allow_sandbox_login=False,
            sso_client_id="",
            sso_client_secret="",
            sso_metadata_url="",
        ):
            resp = client.get("/auth/sso/callback?code=some-real-code")

        assert resp.status_code == 400
