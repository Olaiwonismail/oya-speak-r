from fastapi import HTTPException, UploadFile
import httpx
from backend.app.config import settings
from backend.app.services.scoring import normalize_text


LANGUAGE_MAPPING = {
    "yoruba": "yo",
    "igbo": "ig",
    "hausa": "ha",
    "english": "en"
}

async def transcribe_audio(audio_file: UploadFile, language: str):
    try:
        # Map our language code to Spitch language code
        spitch_language = LANGUAGE_MAPPING.get(language.lower())
        if not spitch_language:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported language: {language}"
            )
        
        # Forward audio to Spitch API
        async with httpx.AsyncClient() as client:
            files = {"audio": (audio_file.filename, await audio_file.read(), audio_file.content_type)}
            headers = {"Authorization": f"Bearer {settings.SPITCH_API_KEY}"}
            response = await client.post(
                f"{settings.SPITCH_API_URL}?language={spitch_language}",
                files=files,
                headers=headers
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Transcription failed")
            
            result = response.json()
            return {
                "transcript": result.get("transcript", ""),
                "confidence": result.get("confidence", 0),
                "normalized_text": normalize_text(result.get("transcript", ""))
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))