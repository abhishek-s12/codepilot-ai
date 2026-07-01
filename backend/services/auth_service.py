import jwt
import datetime
from settings import get_settings

settings = get_settings()


def encode_token(user_id: str, email: str) -> str:
    """Generate a JWT token for the user."""
    payload = {
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
        "iat": datetime.datetime.utcnow(),
        "user_id": user_id,
        "email": email,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_token(token: str) -> dict | None:
    """Decode a JWT token."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        return payload
    except Exception:
        return None


def get_user_id_from_token(token: str) -> str | None:
    """Extract user_id from token."""
    payload = decode_token(token)
    return payload.get("user_id") if payload else None
