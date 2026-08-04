from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MAIL_USERNAME: str
    MAIL_PASSWORD: SecretStr
    MAIL_FROM: str
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_PORT: int = 587
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    DATABASE_URL: str
    REDIS_URL: str

    GOOGLE_API_KEY: str
    GROQ_API_KEY: str
    NVIDIA_API_KEY: str
    DEEPSEEK_API_KEY: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # 👇 load from .env
    model_config = SettingsConfigDict(env_file=".env")


# 👇 singleton instance
settings = Settings()  # type: ignore
