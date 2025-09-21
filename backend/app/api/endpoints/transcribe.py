# app/api/endpoints/transcribe.py
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from app.services.auth import get_current_user
from app.db.models import User
from app.core.config import settings
from spitch import Spitch

router = APIRouter()

# Initialize Spitch client with API key
client = Spitch(api_key=settings.SPITCH_API_KEY)

@router.post("/")
async def transcribe_audio(
    language: str = Form(...),
    audio_file: UploadFile = File(...),
    user: User = Depends(get_current_user)
):
    try:
        # Read audio file bytes
        audio_data = await audio_file.read()

        # Call Spitch API via SDK
        response = client.speech.transcribe(
            language=language,
            content=audio_data
        )

        return {
            "request_id": getattr(response, "request_id", None),
            "transcript": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
