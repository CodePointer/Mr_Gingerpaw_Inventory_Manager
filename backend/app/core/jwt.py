from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from jose import jwt 
from typing import Optional
import os
from app.core.config import settings


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if not expires_delta:
        expires_delta = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    to_encode.update({
        "exp": datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=expires_delta),
        "purpose": "access_token"
    })
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_access_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_email = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Invalid token: no user email")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid token")
    return user_email


def create_reset_token(data: dict, expires_delta: int = 10):
    to_encode = data.copy()
    to_encode.update({
        "exp": datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=expires_delta),
        "purpose": "reset_password"
    })
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_reset_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
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
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_family_invite_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
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
