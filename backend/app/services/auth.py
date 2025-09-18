# app/services/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.db.database import get_db
from app.db.models import User
from app.core.firebase import verify_token
from sqlalchemy.orm import Session
from firebase_admin import auth
security = HTTPBearer()


def verify_token(token: str):
    try:
        return auth.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    decoded_token = verify_token(credentials.credentials)
    firebase_uid = decoded_token["uid"]

    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user:
        user = User(
            firebase_uid=firebase_uid,
            email=decoded_token.get("email"),
            name=decoded_token.get("name", decoded_token.get("email")),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user

# async def get_user_by_email_throuh
import httpx
from app.core.config import settings
async def sign_in_with_email_and_password(email: str, password: str):
    """
    Authenticate a user with email and password using Firebase REST API
    """
    try:
        # Firebase REST API endpoint for email/password sign-in
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={'AIzaSyAIQXGPyWv9pftQnX5wUoogyVyEsLoWacI'}"
        
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            
            if response.status_code != 200:
                error_data = response.json()
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=error_data.get("error", {}).get("message", "Authentication failed")
                )
            
            data = response.json()
            return {
                "id_token": data.get("idToken"),
                "refresh_token": data.get("refreshToken"),
                "expires_in": data.get("expiresIn"),
                "user_id": data.get("localId"),
                "email": data.get("email")
            }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )