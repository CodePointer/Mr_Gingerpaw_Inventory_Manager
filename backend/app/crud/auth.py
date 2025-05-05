from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import User
from app.core.security import (
    hash_password, verify_password,
    hash_security_answer, verify_security_answer
)
from app.core.jwt import (
    create_access_token, 
    create_reset_token, verify_reset_token
)
from app.crud.user import get_user_by_email, create_user
from app.schemas.auth import (
    RegisterRequest, LoginRequest, TokenResponse,
    ResetQuestionRequest, ResetQuestionResponse,
    VerifyAnswerRequest, ResetTokenResponse,
    ResetPasswordRequest
)
from app.schemas.user import UserCreate


def register_user(db: Session, request: RegisterRequest) -> User:
    """
    Register a new user in the database.
    """
    db_user = db.query(User).filter_by(email=request.email).first()
    if db_user:
        if db_user.is_active:
            raise HTTPException(status_code=400, detail="Email already registered")
        else:
            # Revive
            db_user.revive()
            # Set rest
            db_user.username = request.username
            db_user.phone_number = request.phone_number
            db_user.password_hash = hash_password(db_user.password)
            db_user.notes = request.notes
            db_user.security_question = request.security_question
            db_user.security_answer_hash = hash_security_answer(request.security_answer)
        db.commit()
        db.refresh(db_user)
    else:
        user_create = UserCreate(
            username=request.username,
            email=request.email,
            phone_number=request.phone_number,
            password=request.password,
            notes=request.notes,
            security_question=request.security_question,
            security_answer=request.security_answer
        )
        db_user = create_user(db, user_create)
    return db_user


def authenticate_user(db: Session, request: LoginRequest) -> Optional[TokenResponse]:
    """
    Authenticate a user and return a token response if successful.
    """
    user = get_user_by_email(db, email=request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_access_token(data={"sub": user.email})
    return TokenResponse(access_token=token, token_type="bearer")


def get_reset_question(db: Session, request: ResetQuestionRequest) -> ResetQuestionResponse:
    """
    Reset the user's security question and answer.
    """
    db_user = get_user_by_email(db, email=request.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return security question
    return ResetQuestionResponse(security_question=db_user.security_question)


def verify_user_security_answer(db: Session, request: VerifyAnswerRequest) -> ResetTokenResponse:
    """
    Verify the user's security answer.
    """
    db_user = get_user_by_email(db, email=request.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_security_answer(request.security_answer, db_user.security_answer_hash):
        raise HTTPException(status_code=400, detail="Incorrect answer")
    
    # Create reset token
    token = create_reset_token(data={"sub": db_user.email})
    return ResetTokenResponse(token=token)


def reset_password(db: Session, request: ResetPasswordRequest) -> TokenResponse:
    """
    Reset the user's password.
    """
    email = verify_reset_token(request.token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db_user = get_user_by_email(db, email=email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_password = hash_password(request.new_password)
    setattr(db_user, "password_hash", hashed_password)
    db.commit()
    db.refresh(db_user)
    
    # Create new token
    token = create_access_token(data={"sub": db_user.email})
    return TokenResponse(access_token=token)
