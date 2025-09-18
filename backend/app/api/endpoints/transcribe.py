# app/api/endpoints/transcribe.py
import httpx
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from app.services.auth import get_current_user
from app.core.config import settings
from app.db.models import User

router = APIRouter()

@router.post("/")
async def transcribe_audio(
    language: str = Form(...),
    audio_file: UploadFile = File(...),
    user: User = Depends(get_current_user)
):
    try:
        # Read audio file
        audio_data = await audio_file.read()
        
        # Forward audio to Spitch API
        async with httpx.AsyncClient() as client:
            files = {"audio": (audio_file.filename, audio_data, audio_file.content_type)}
            headers = {"Authorization": f"Bearer {settings.SPITCH_API_KEY}"}
            
            response = await client.post(
                f"{settings.SPITCH_API_URL}?language={language}",
                files=files,
                headers=headers
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code, 
                    detail="Transcription failed"
                )
            
            result = response.json()
            return {
                "transcript": result.get("transcript", ""),
                "confidence": result.get("confidence", 0),
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))