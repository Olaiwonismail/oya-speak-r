# app/services/firebase.py
from http.client import HTTPException
import firebase_admin
from firebase_admin import auth, credentials
from app.core.config import settings
from firebase_admin.exceptions import FirebaseError
def init_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # For production, use environment variable
        print('Initializing Firebase with credentials ')
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
    except ValueError:
        # Already initialized
        pass


def verify_token(token: str):
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except ValueError as e:
        # Invalid token format
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token format: {str(e)}"
        )
    except FirebaseError as e:
        # Firebase-specific errors
        raise HTTPException(
            status_code=401,
            detail=f"Firebase authentication error: {str(e)}"
        )
    except Exception as e:
        # Any other errors
        raise HTTPException(
            status_code=401,
            detail=f"Error verifying token: {str(e)}"
        )

def get_user_info(decoded_token: dict):
    """Extract user information from decoded token"""
    return {
        "firebase_uid": decoded_token.get("uid"),
        "email": decoded_token.get("email"),
        "name": decoded_token.get("name") or decoded_token.get("email", "").split("@")[0],
    }