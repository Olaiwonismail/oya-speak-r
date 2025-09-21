# app/api/endpoints/attempts.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.auth import get_current_user, sign_in_with_email_and_password
from app.db.models import User, Attempt, LessonItem

router = APIRouter()

class AttemptRequest(BaseModel):
    lesson_item_id: int
    transcript: str
    score: float
    word_feedback: List[Dict[str, Any]]

@router.post("/")
async def store_attempt(
    request: AttemptRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try:
        # Create new attempt
        attempt = Attempt(
            user_id=user.id,
            lesson_item_id=request.lesson_item_id,
            transcript=request.transcript,
            score=request.score,
            word_feedback=request.word_feedback,
            created_at=datetime.utcnow()
        )
        
        db.add(attempt)
        
        # Update user XP and streak
        user.xp += int(request.score)  # Add score as XP
        
        # Update streak (simplified logic)
        today = datetime.utcnow().date()
        last_attempt_date = db.query(Attempt.created_at).filter(
            Attempt.user_id == user.id
        ).order_by(Attempt.created_at.desc()).first()
        
        if last_attempt_date:
            last_date = last_attempt_date[0].date()
            if (today - last_date).days == 1:
                user.streak += 1
            elif (today - last_date).days > 1:
                user.streak = 1
        else:
            user.streak = 1
            
        db.commit()
        
        return {
            "message": "Attempt stored successfully",
            "xp": user.xp,
            "streak": user.streak
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error storing attempt: {str(e)}")

@router.get("/")
async def get_user_attempts(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    attempts = db.query(Attempt).filter(
        Attempt.user_id == user.id
    ).order_by(
        Attempt.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return attempts

@router.post("/auth/signin")
async def sign_in(email: str, password: str):
    """
    Sign in with email and password (handled by backend)
    """
    try:
        auth_result = await sign_in_with_email_and_password(email, password)
        return auth_result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )
