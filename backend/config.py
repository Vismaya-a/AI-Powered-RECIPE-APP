from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    DATABASE_URL:str
    GEMINI_API_KEY: str

    #JWT
    SECRET_KEY:str
    ALGORITHM:str="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES:int=30

    #CORS
    CORS_ORIGINS:list=["http://localhost:3000","http://127.0.0.1:3000"]

    class Config:
        env_file=".env"
        case_sensitive=True

settings = Settings()