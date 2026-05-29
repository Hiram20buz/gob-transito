import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Backend API"
    PORT: int = int(os.getenv("PORT", 8000))
    
    FIREBASE_CREDENTIALS_PATH: str = "firekeys.json"
    FIREBASE_STORAGE_BUCKET: str | None = os.getenv("FIREBASE_STORAGE_BUCKET")
    
    # Cloudflare R2 / AWS S3 Config
    AWS_ACCESS_KEY_ID: str | None = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: str | None = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_SESSION_TOKEN: str | None = os.getenv("AWS_SESSION_TOKEN")
    BUCKET_URL: str | None = os.getenv("BUCKET_URL") # S3/R2 endpoint URL
    BUCKET_NAME: str = os.getenv("BUCKET_NAME", "gob-test")
    
    # Configuración de correos (SMTP)
    SMTP_HOST: str | None = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str | None = os.getenv("SMTP_USER")
    SMTP_PASSWORD: str | None = os.getenv("SMTP_PASSWORD")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@fastroute.mx")

    # Google Maps Platform (server key) — se usará en fases siguientes para
    # proxy de Directions / Places / Geocoding. Restringir por IP en Cloud Console.
    GOOGLE_MAPS_SERVER_API_KEY: str | None = None

    # Permite ignorar variables extras en el .env (como API_KEY, etc.)
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
