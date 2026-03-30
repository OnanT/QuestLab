from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT/Auth
    SECRET_KEY: str = "your_super_secret_key_here_change_this_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # File uploads
    UPLOAD_PATH: str = "/app/uploads"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173"
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:5173"

    # Default Organization
    DEFAULT_ORGANIZATION_ID: int = 1
    DEFAULT_ORGANIZATION_NAME: str = "Quest Lab"

    # Mail Settings
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@questlab.onan.shop"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_FROM_NAME: str = "QuestLab"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins to list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Allow extra env vars without error


settings = Settings()
