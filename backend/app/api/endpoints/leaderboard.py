# app/api/endpoints/leaderboard.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from app.db.database import get_db
from app.services.auth import get_current_user
from app.db.models import User

router = APIRouter()

@router.get("/")
async def get_leaderboard(
    language: Optional[str] = Query(None, description="Filter by language (English,yoruba, igbo, hausa)"),
    limit: int = Query(10, ge=1, le=100, description="Number of top users to return"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try:
        # Base query
        query = db.query(User).order
    except:
        pass    
