import jwt
import datetime
from settings import get_settings

settings = get_settings()


def encode_token(user_id: str, email: str) -> str:
    """Generate a JWT token for the user."""
    payload = {
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        "iat": datetime.datetime.utcnow(),
        "user_id": user_id,
        "email": email,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_token(token: str) -> dict:
    """Decode a JWT token. Raises jwt.ExpiredSignatureError or jwt.InvalidTokenError on validation failure."""
    return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])


def get_user_id_from_token(token: str) -> str | None:
    """Extract user_id from token, returning None on any validation failure."""
    try:
        payload = decode_token(token)
        return payload.get("user_id") if payload else None
    except Exception:
        return None

