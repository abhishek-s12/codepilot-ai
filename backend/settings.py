from functools import lru_cache
import json
from typing import Any

from pydantic import AliasChoices, Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors_origins(v: Any) -> list[str]:
    if isinstance(v, str):
        try:
            parsed = json.loads(v)
            if isinstance(parsed, list):
                return parsed
        except Exception:
            pass
        return [x.strip() for x in v.split(",") if x.strip()]
    return v


class Settings(BaseSettings):
    api_title: str = "CodePilot AI"
    api_version: str = "1.0.0"
    cors_origins: Any = Field(
        default=[
            "http://localhost:5173",
            "https://codepilot-ai-wine.vercel.app",
            "https://codepilot-backend-wx7u.onrender.com",
        ],
        validation_alias=AliasChoices("CORS_ORIGINS"),
    )
    llm_base_url: str = Field(
        default="https://openrouter.ai/api/v1",
        validation_alias=AliasChoices("LLM_BASE_URL", "OPENROUTER_BASE_URL"),
    )
    llm_api_key: str = Field(
        default="",
        validation_alias=AliasChoices("LLM_API_KEY", "OPENROUTER_API_KEY"),
    )
    llm_model: str = Field(
        default="openai/gpt-4o-mini",
        validation_alias=AliasChoices("LLM_MODEL", "OPENROUTER_MODEL"),
    )
    llm_app_name: str = Field(
        default="CodePilot AI",
        validation_alias=AliasChoices("LLM_APP_NAME", "OPENROUTER_APP_NAME"),
    )
    llm_site_url: str = Field(
        default="https://codepilot-ai-wine.vercel.app",
        validation_alias=AliasChoices("LLM_SITE_URL", "OPENROUTER_SITE_URL"),
    )
    jwt_secret: str = Field(
        default="codepilot_secret_key_12345",
        validation_alias=AliasChoices("JWT_SECRET"),
    )
    github_client_id: str = Field(
        default="",
        validation_alias=AliasChoices("GITHUB_CLIENT_ID"),
    )
    github_client_secret: str = Field(
        default="",
        validation_alias=AliasChoices("GITHUB_CLIENT_SECRET"),
    )
    google_client_id: str = Field(
        default="",
        validation_alias=AliasChoices("GOOGLE_CLIENT_ID"),
    )
    google_client_secret: str = Field(
        default="",
        validation_alias=AliasChoices("GOOGLE_CLIENT_SECRET"),
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @model_validator(mode="after")
    def validate_cors_origins(self) -> "Settings":
        self.cors_origins = parse_cors_origins(self.cors_origins)
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
