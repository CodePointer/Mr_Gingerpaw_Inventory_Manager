from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models import User, Family
from app.core.access_control import check_user_in_family
from app.schemas.membership import (
    MembershipOut, MembershipUpdate, MembershipDelete,
    MembershipTokenRequest, MemebershipTokenResponse,
    MembershipJoinRequest, MembershipJoinResponse,
)
import app.crud.membership as member_crud


router = APIRouter(prefix="/memberships", tags=["memberships"])


# Generate invitation
@router.post("/invite", 
             response_model=MemebershipTokenResponse,
             response_model_by_alias=True)
def create_invitation_token(
    request: MembershipTokenRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_user_in_family(db, current_user.id, request.family_id)
    return member_crud.generate_invitation_token(db, request, current_user.id)


# Join the family
@router.post("/",
             response_model=MembershipJoinResponse,
             response_model_by_alias=True)
def join_with_token(
    request: MembershipJoinRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return member_crud.join_with_invitation_token(db, request, current_user.id)


# Update membership
@router.patch("/by-key",
              response_model=MembershipOut,
              response_model_by_alias=True)
def update_membership(
    request: MembershipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # TODO: Now user can change all membership in the family.
    check_user_in_family(db, current_user.id, request.family_id)
    return member_crud.update_membership(db, request)


# Delete membership
@router.delete("/by-key",
               response_model=MembershipOut,
               response_model_by_alias=True)
def delete_membership(
    request: MembershipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # TODO: Now user can change all membership in the family.
    check_user_in_family(db, current_user.id, request.family_id)
    return member_crud.delete_membership(db, request)


# join the family with invitation
# @router.post("/", response_model=MembershipOut)
# def create_membership_endpoint(membership: MembershipCreate, db: Session = Depends(get_db)):
#     return create_membership(db, membership)

# @router.get("/", response_model=list[MembershipOut])
# def list_memberships(db: Session = Depends(get_db)):
#     return get_all_memberships(db)

# @router.get("/{user_id}/{family_id}", response_model=MembershipOut)
# def get_membership_endpoint(user_id: int, family_id: int, db: Session = Depends(get_db)):
#     membership = get_membership(db, user_id, family_id)
#     if not membership:
#         raise HTTPException(status_code=404, detail="Membership not found")
#     return membership

# @router.put("/{user_id}/{family_id}", response_model=MembershipOut)
# def update_membership_endpoint(user_id: int, family_id: int, membership_update: MembershipUpdate, db: Session = Depends(get_db)):
#     return update_membership(db, user_id, family_id, membership_update)

# @router.delete("/{user_id}/{family_id}")
# def delete_membership_endpoint(user_id: int, family_id: int, db: Session = Depends(get_db)):
#     return delete_membership(db, user_id, family_id)
