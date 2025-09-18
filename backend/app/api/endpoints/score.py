# app/api/endpoints/score.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.auth import get_current_user
from app.services.scoring import score_attempt
from app.db.models import User

router = APIRouter()

class ScoreRequest(BaseModel):
    target_text: str
    transcript: str
    confidence: float = 1.0

@router.post("/")
async def score_attempt_endpoint(
    request: ScoreRequest,
    user: User = Depends(get_current_user)
):
    try:
        result = score_attempt(
            request.target_text, 
            request.transcript, 
            request.confidence
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring error: {str(e)}")