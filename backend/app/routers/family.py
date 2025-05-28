from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.core.access_control import check_user_in_family
from app.models import Family, Item, Membership, Tag, User
from app.schemas.user import UserOut
from app.schemas.item import ItemOut, LocationOut
from app.schemas.tag import TagOut
from app.schemas.membership import MembershipOut
from app.schemas.family import FamilyCreate, FamilyOut, FamilyUpdate

from app.crud import family as family_crud


router = APIRouter(prefix="/families", tags=["families"])


@router.get("/{family_id}", 
            response_model=FamilyOut,
            response_model_by_alias=True)
def get_family_details(
    family_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    return family_crud.get_family_by_id(db, family_id)


# @router.get("/{family_id}/items", 
#             response_model=List[ItemOut],
#             response_model_by_alias=True)
# def get_family_items(
#     family_id: int, 
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     check_user_in_family(db, current_user.id, family_id)
#     return family_crud.get_family_items(db, family_id)


@router.get("/{family_id}/members", 
            response_model=List[UserOut],
            response_model_by_alias=True)
def get_family_members(
    family_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    return family_crud.get_family_members(db, family_id)


@router.get("/{family_id}/locations",
            response_model=List[LocationOut],
            response_model_by_alias=True)
def get_family_locations(
    family_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    return family_crud.get_family_locations(db, family_id)


@router.post("/", 
             response_model=FamilyOut,
             response_model_by_alias=True)
def create_family_from_me(
    family: FamilyCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return family_crud.create_family_from_user(db, family, current_user.id)


@router.put("/{family_id}", 
            response_model=FamilyOut,
            response_model_by_alias=True)
def update_family_from_me(
    family_id: int, 
    request: FamilyUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    return family_crud.update_family(db, family_id, request)


@router.delete("/{family_id}", 
               response_model=FamilyOut,
               response_model_by_alias=True)
def deactivate_family_from_me(
    family_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    return family_crud.deactivate_family_by_user(db, family_id, current_user.id)


# @router.post("/{family_id}/generate-invite")
# def generate_invite_token(
#     family_id: int, 
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     role: str = Query("adult")
# ):
#     check_user_in_family(db, current_user.id, family_id)
#     return family_crud.generate_family_invite(db, family_id, role)


# @router.post("/join", 
#              response_model=MembershipOut,
#              response_model_by_alias=True)
# def join_family(
#     token: str = Query(...), 
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     return family_crud.join_family_with_invite(db, token, current_user.id)


# @router.post("/", response_model=FamilyOut)
# def create_family_endpoint(family: FamilyCreate, db: Session = Depends(get_db)):
#     return create_family(db, family)

# @router.get("/", response_model=list[FamilyOut])
# def list_families(db: Session = Depends(get_db)):
#     return get_all_families(db)

