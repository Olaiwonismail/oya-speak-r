# app/core/config.py
import os
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv() 

class Settings:
    def __init__(self):
        self.DATABASE_URL = os.getenv("_DATABASE_URL", "postgresql://user:password@localhost/dbname")
        self.SPITCH_API_KEY = os.getenv("SPITCH_API_KEY", "your_spitch_api_key")
        self.SPITCH_API_URL = os.getenv("SPITCH_API_URL", "https://api.spitch.app/v1/transcribe")
        self.FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-service-account.json")

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()