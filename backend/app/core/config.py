import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Backend API"
    PORT: int = int(os.getenv("PORT", 8000))
    
    FIREBASE_CREDENTIALS_PATH: str = "firekeys.json"
    
    # Configuración de correos (SMTP)
    SMTP_HOST: str | None = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str | None = os.getenv("SMTP_USER")
    SMTP_PASSWORD: str | None = os.getenv("SMTP_PASSWORD")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@fastroute.mx")

    # Permite ignorar variables extras en el .env (como API_KEY, etc.)
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
