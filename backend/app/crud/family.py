from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Family, Item, Membership, Tag, User
from app.schemas.family import FamilyCreate, FamilyUpdate
from app.schemas.user import UserOut
from app.core.jwt import create_family_invite_token, verify_family_invite_token
from app.crud.membership import create_membership


#
# [C]reater
#
def create_family_from_user(
    db: Session,
    request: FamilyCreate,
    user_id: int
):
    db_family = Family(name=request.name, notes=request.notes)
    db.add(db_family)
    db.commit()
    db.refresh(db_family)

    # Add user to family
    create_membership(db, user_id, db_family.id, role='adult')

    return db_family


#
# [R]eader
#
def get_family_by_id(db: Session, family_id: int) -> Family:
    return Family.active(db).filter(Family.id == family_id).first()


def get_family_items(db: Session, family_id: int) -> List[Item]:
    return Item.active(db).filter(Item.family_id == family_id).all()


def get_family_members(db: Session, family_id: int) -> List[UserOut]:
    membership = db.query(Membership).filter(Membership.family_id == family_id).all()
    members = [
        UserOut(
            id=member.user_id,
            username=member.user.username,
            email=member.user.email,
            phone_number=member.user.phone_number,
            role=member.role
        )
        for member in membership
    ]
    return members


def get_all_families(db: Session):
    return db.query(Family).all()


#
# [U]pdate
#
def update_family(
    db: Session, 
    family_id: int, 
    request: FamilyUpdate
):
    db_family = Family.active(db).filter(Family.id == family_id).first()
    if not db_family:
        raise HTTPException(status_code=404, detail="Family not found")
    for key, value in request.model_dump(exclude_unset=True).items():
        setattr(db_family, key, value)
    db.commit()
    db.refresh(db_family)
    return db_family


#
# [D]elete
#
def deactivate_family_by_user(
    db: Session,
    family_id: int,
    user_id: int
):
    db_family = Family.active(db).filter(Family.id == family_id).first()
    if not db_family:
        raise HTTPException(status_code=404, detail="Family not found")
    db_family.deactivate(deleted_by=user_id)
    db.commit()
    db.refresh(db_family)
    return db_family


# #
# # Invite
# #
# def generate_family_invite(db: Session, family_id: int, role: str):
#     invite_token = create_family_invite_token(
#         data={
#             "family_id": family_id,
#             "role": role
#         },
#         expires_delta=60 * 24 * 3
#     )
#     return {"invite_token": invite_token}


# def join_family_with_invite(db: Session, token: str, user_id: int):

#     payload = verify_family_invite_token(token)
#     family_id = payload.get("family_id")
#     role = payload.get("role")

#     family = db.query(Family).filter(Family.id == family_id).first()
#     if not family:
#         raise HTTPException(status_code=404, detail="Family not found")
    
#     exists = db.query(Membership).filter(
#         Membership.user_id == user_id,
#         Membership.family_id == family_id
#     ).first()
#     if exists:
#         raise HTTPException(status_code=400, detail="User already a member of this family")

#     new_membership = Membership(
#         user_id=user_id,
#         family_id=family_id,
#         role=role
#     )
#     db.add(new_membership)
#     db.commit()
#     return new_membership
