# preferences.py
from datetime import datetime

from fastapi.params import Depends
from fastapi import APIRouter
from sqlalchemy.orm import Session


from app.db.database import get_db
from app.db.models import User, UserPreferences
from app.services.auth import get_current_user


router = APIRouter()

@router.get("/")
async def get_user_preferences(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    preferences = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    if not preferences:
        # Create default preferences if they don't exist
        preferences = UserPreferences(user_id=user.id)
        db.add(preferences)
        db.commit()
        db.refresh(preferences)
    return preferences

@router.put("/")
async def update_user_preferences(
    preferences_update: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    preferences = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    if not preferences:
        preferences = UserPreferences(user_id=user.id)
        db.add(preferences)
    
    # Update preferences
    if "target_language" in preferences_update:
        preferences.target_language = preferences_update["target_language"]
    
    preferences.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(preferences)
    return preferences