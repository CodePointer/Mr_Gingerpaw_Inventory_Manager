from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models import User, Family, Membership
from app.schemas.user import (
    UserOut, UserUpdateBasic, UserUpdatePassword, UserUpdateResetQuestion,
    UserDelete
)
from app.schemas.family import FamilyOut
from app.schemas.membership import MembershipOut

from app.crud import user as user_crud


router = APIRouter(prefix="/users/me", tags=["users"])


@router.get("",
            response_model=UserOut, 
            response_model_by_alias=True)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/families", 
            response_model=List[FamilyOut],
            response_model_by_alias=True)
def get_my_families(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return user_crud.get_user_families(db, current_user.id)


@router.get("/memberships", 
            response_model=List[MembershipOut],
            response_model_by_alias=True)
def get_my_memberships(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return user_crud.get_user_memberships(db, current_user.id)


@router.put("/update", response_model=UserOut,
             response_model_by_alias=True)
def update_me_basic(
    user: UserUpdateBasic,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Update the current user's information
    return user_crud.update_user_basic(db, current_user.id, user)


@router.patch("/password", response_model=UserOut,
             response_model_by_alias=True)
def update_me_password(
    user: UserUpdatePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Update the current user's information
    return user_crud.update_user_password(db, current_user.id, user)


@router.put("/reset-question", response_model=UserOut,
            response_model_by_alias=True)
def update_me_reset_question(
    user: UserUpdateResetQuestion,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Update the current user's information
    return user_crud.update_user_reset_question(db, current_user.id, user)


@router.post("/deactivate", response_model=UserOut,
             response_model_by_alias=True)
def deactivate_me(
    block: UserDelete,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Update the current user's information
    return user_crud.deactivate_user(db, current_user.id, block)
