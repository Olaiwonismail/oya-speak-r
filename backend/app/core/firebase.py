# app/services/firebase.py
from http.client import HTTPException
import firebase_admin
import os
from firebase_admin import auth, credentials
from app.core.config import settings
from firebase_admin.exceptions import FirebaseError
def init_firebase():
    """Initialize Firebase Admin SDK using JSON content from an environment variable"""
    try:
        # Get the JSON string from the environment variable
        firebase_creds_json = os.environ.get('FIREBASE_CREDENTIALS_JSON')
        
        if not firebase_creds_json:
            raise ValueError("FIREBASE_CREDENTIALS_JSON environment variable not set")
        
        # Parse the JSON string into a dictionary
        cred_dict = json.loads(firebase_creds_json)
        
        # Create credentials from the dictionary
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        print('Firebase initialized successfully')
        
    except ValueError as e:
        if "The default Firebase app already exists" in str(e):
            # Already initialized, ignore the error
            pass
        else:
            # Re-raise other ValueErrors (like JSON parsing errors)
            raise


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
