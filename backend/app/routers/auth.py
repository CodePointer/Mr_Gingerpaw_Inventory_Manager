from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
import app.crud.auth as auth_crud
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest, TokenResponse,
    ResetQuestionRequest, ResetQuestionResponse,
    VerifyAnswerRequest, ResetTokenResponse,
    ResetPasswordRequest
)


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse, response_model_by_alias=True)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    auth_crud.register_user(db, request)
    return auth_crud.authenticate_user(db, LoginRequest(
        email=request.email,
        password=request.password
    ))


@router.post("/login", response_model=TokenResponse, response_model_by_alias=True)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    return auth_crud.authenticate_user(db, request)


@router.post("/reset-question", response_model=ResetQuestionResponse, response_model_by_alias=True)
def reset_question(request: ResetQuestionRequest, db: Session = Depends(get_db)):
    return auth_crud.get_reset_question(db, request)


@router.post("/verify-answer", response_model=ResetTokenResponse)
def verify_answer(request: VerifyAnswerRequest, db: Session = Depends(get_db)):
    return auth_crud.verify_user_security_answer(db, request)


@router.patch("/reset-password", response_model=TokenResponse)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    return auth_crud.reset_password(db, request)
