from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models import Membership, Family
from app.schemas.membership import (
    MembershipOut, MembershipUpdate, MembershipDelete,
    MembershipTokenRequest, MemebershipTokenResponse,
    MembershipJoinRequest, MembershipJoinResponse,
)
from app.core.jwt import (
    create_family_invite_token,
    verify_family_invite_token
)


# Generate invitation
def generate_invitation_token(
    db: Session,
    request: MembershipTokenRequest,
    user_id: int
) -> MemebershipTokenResponse:
    invite_token = create_family_invite_token(
        data={
            "from_user_id": user_id,
            "family_id": request.family_id,
            "role": request.token_role
        },
        expires_delta=60 * 24 * 3
    )
    return MemebershipTokenResponse(token=invite_token)


# Join the family
def join_with_invitation_token(
    db: Session,
    request: MembershipJoinRequest,
    user_id: int
) -> MembershipJoinResponse:
    payload = verify_family_invite_token(request.token)
    family_id = payload.get("family_id")
    role = payload.get("role")

    # TODO: Update to active
    family = db.query(Family).filter(Family.id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    
    exists = db.query(Membership).filter(
        Membership.user_id == user_id,
        Membership.family_id == family_id
    ).first()
    if exists:
        raise HTTPException(status_code=400, detail="User already a member of this family")

    new_membership = Membership(
        user_id=user_id,
        family_id=family_id,
        role=role
    )
    db.add(new_membership)
    db.commit()
    return new_membership


# Update membership
def update_membership(
    db: Session,
    request: MembershipUpdate
) -> MembershipOut:
    db_membership = db.query(Membership).filter(
        Membership.user_id == request.user_id,
        Membership.family_id == request.family_id
    ).first()
    if not db_membership:
        raise HTTPException(status_code=404, detail="Membership not found")
    db_membership.role = request.role
    db.commit()
    db.refresh(db_membership)
    return db_membership


# Delete membership
def delete_membership(
    db: Session,
    request: MembershipDelete
) -> MembershipOut:
    db_membership = db.query(Membership).filter(
        Membership.user_id == request.user_id,
        Membership.family_id == request.family_id
    ).first()
    if not db_membership:
        raise HTTPException(status_code=404, detail="Membership not found")
    db.delete(db_membership)
    db.commit()
    return db_membership


def create_membership(
    db: Session, 
    user_id: int,
    family_id: int, 
    role: str
) -> Membership:
    existing = db.query(Membership).filter(
        Membership.user_id == user_id,
        Membership.family_id == family_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Membership already exists")
    db_membership = Membership(
        user_id=user_id,
        family_id=family_id,
        role=role
    )
    db.add(db_membership)
    db.commit()
    db.refresh(db_membership)
    return db_membership


# def get_membership(db: Session, user_id: int, family_id: int):
#     return db.query(Membership).filter(
#         Membership.user_id == user_id,
#         Membership.family_id == family_id
#     ).first()


# def get_all_memberships(db: Session):
#     return db.query(Membership).all()


# def update_membership(db: Session, user_id: int, family_id: int, membership_update: MembershipUpdate):
#     db_membership = get_membership(db, user_id, family_id)
#     if not db_membership:
#         raise HTTPException(status_code=404, detail="Membership not found")
#     for key, value in membership_update.dict(exclude_unset=True).items():
#         setattr(db_membership, key, value)
#     db.commit()
#     db.refresh(db_membership)
#     return db_membership


# def delete_membership(db: Session, user_id: int, family_id: int):
#     db_membership = get_membership(db, user_id, family_id)
#     if not db_membership:
#         raise HTTPException(status_code=404, detail="Membership not found")
#     db.delete(db_membership)
#     db.commit()
#     return {"msg": "Membership deleted"}
