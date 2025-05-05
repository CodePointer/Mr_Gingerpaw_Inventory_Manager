from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = Field(None, alias="phoneNumber")
    security_question: str = Field(..., alias="securityQuestion")
    security_answer: str = Field(..., alias="securityAnswer")
    notes: Optional[str] = None

    model_config = {
        "populate_by_name": True
    }


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str = Field(..., alias="accessToken")
    token_type: str = Field(default="bearer", alias="tokenType")

    model_config = {
        "populate_by_name": True
    }


class ResetQuestionRequest(BaseModel):
    email: EmailStr


class ResetQuestionResponse(BaseModel):
    security_question: str = Field(..., alias="securityQuestion")

    model_config = {
        "populate_by_name": True
    }


class VerifyAnswerRequest(BaseModel):
    email: EmailStr
    security_answer: str = Field(..., alias="securityAnswer")


class ResetTokenResponse(BaseModel):
    token: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., alias="newPassword")

    model_config = {
        "populate_by_name": True
    }
