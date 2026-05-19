from typing import Optional, Dict, Any
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
import os

security = HTTPBearer()

# Initialize Firebase Admin if not already initialized
if not firebase_admin._apps:
    # Use application default credentials or set GOOGLE_APPLICATION_CREDENTIALS
    # For local dev without a service account JSON, we can just initialize without arguments
    # if using Firebase emulator, or if GOOGLE_APPLICATION_CREDENTIALS is set in env
    try:
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)
    except Exception:
        # Fallback to default init
        firebase_admin.initialize_app()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return {"user_id": decoded_token.get("uid"), "email": decoded_token.get("email")}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[Dict[str, Any]]:
    if credentials is None:
        return None

    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return {"user_id": decoded_token.get("uid"), "email": decoded_token.get("email")}
    except Exception:
        return None
