from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    phone_number: Optional[str] = Field(None, alias="phoneNumber")
    password: str
    notes: Optional[str] = None
    security_question: str = Field(None, alias="securityQuestion")
    security_answer: str = Field(None, alias="securityAnswer")

    model_config = {
        "populate_by_name": True,
    }


# Deprecated.
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# class UserUpdate(BaseModel):
#     username: Optional[str] = None
#     email: Optional[EmailStr] = None
#     phone_number: Optional[str] = Field(None, alias="phoneNumber")
#     password: Optional[str] = None
#     notes: Optional[str] = None
#     security_question: Optional[str] = Field(None, alias="securityQuestion")
#     security_answer: Optional[str] = Field(None, alias="securityAnswer")

#     model_config = {
#         "from_attributes": True,
#         "populate_by_name": True,
#     }

class UserUpdateBasic(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, alias="phoneNumber")
    notes: Optional[str] = None

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


class UserUpdatePassword(BaseModel):
    old_password: str = Field(None, alias="oldPassword")
    new_password: str = Field(None, alias="newPassword")

    model_config = {
        "populate_by_name": True
    }


class UserUpdateResetQuestion(BaseModel):
    password: str
    security_question: Optional[str] = Field(None, alias="securityQuestion")
    security_answer: Optional[str] = Field(None, alias="securityAnswer")

    model_config = {
        "populate_by_name": True
    }



class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone_number: Optional[str] = Field(None, alias="phoneNumber")
    security_question: Optional[str] = Field(None, alias="securityQuestion")
    notes: Optional[str] = None
    role: Optional[str] = None

    is_active: bool = Field(True, alias="isActive")

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


class UserDelete(BaseModel):
    reason: Optional[str]
    confirmed: bool
