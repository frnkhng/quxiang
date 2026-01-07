from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    SESSION_EXPIRE_DAYS: int = 30
    
    SMS_PROVIDER: str = "mock"
    SMS_API_KEY: Optional[str] = None
    
    UPLOAD_BUCKET: Optional[str] = None
    UPLOAD_REGION: Optional[str] = None
    
    AI_PROVIDER: str = "mock"
    AI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
