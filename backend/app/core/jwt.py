from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from jose import jwt 
from typing import Optional
import os


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if not expires_delta:
        expires_delta = ACCESS_TOKEN_EXPIRE_MINUTES
    to_encode.update({
        "exp": datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=expires_delta),
        "purpose": "access_token"
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_reset_token(data: dict, expires_delta: int = 10):
    to_encode = data.copy()
    to_encode.update({
        "exp": datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=expires_delta),
        "purpose": "reset_password"
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_reset_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("purpose") != "reset_password":
            return None
        email = payload.get("sub")
        return email
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None


def create_family_invite_token(data: dict, expires_delta: int = 60 * 24 * 3):
    to_encode = data.copy()
    to_encode.update({
        "exp": datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=expires_delta),
        "purpose": "family_invite"
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_family_invite_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("purpose") != "family_invite":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token: not a family invite token"
            )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None
