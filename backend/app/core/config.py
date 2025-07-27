import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    DATABASE_URL: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    RESET_TOKEN_EXPIRE_MINUTES: int
    RAW_CORS_ORIGINS: str = Field("", alias="CORS_ORIGINS")
    OPENAI_API_KEY: str

    @property
    def CORS_ORIGINS(self):
        return [u.strip() for u in self.RAW_CORS_ORIGINS.split(",") if u.strip()]
    
    model_config = SettingsConfigDict(
        env_file = f".env.{os.getenv('APP_ENV', 'development')}",
        env_file_encoding="utf-8"
    )


settings = Settings()
