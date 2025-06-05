from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import User, Membership, Family  # Import Membership and Family models
from app.schemas.user import (
    UserCreate, UserUpdateBasic, 
    UserUpdatePassword, UserUpdateResetQuestion,
    UserDelete
)
from app.core.security import (
    hash_password, verify_password,
    hash_security_answer, verify_security_answer
)
from app.core.time_utils import get_now
from passlib.context import CryptContext


#
# [C]reater
#
def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    hashed_answer = None
    if user.security_answer:
        hashed_answer = hash_security_answer(user.security_answer)
    
    db_user = User(
        username=user.username,
        email=user.email,
        phone_number=user.phone_number,
        password_hash=hashed_password,
        notes=user.notes,
        security_question=user.security_question,
        security_answer_hash=hashed_answer
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#
# [R]eader
#
def get_user_by_email(db: Session, email: str):
    return User.active(db).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User:
    return User.active(db).filter(User.id == user_id).first()

def get_all_users(db: Session):
    return User.active(db).all()

def get_user_memberships(db: Session, user_id: int) -> List[Membership]:
    memberships = db.query(Membership).filter(Membership.user_id == user_id).all()
    filtered_memberships = [x for x in memberships if Family.active(db).filter(Family.id == x.family_id).first() is not None]
    return filtered_memberships

def get_user_families(db: Session, user_id: int) -> List[Family]:
    memberships = get_user_memberships(db, user_id)
    families_with_roles = [
        {
            "id": membership.family.id,
            "name": membership.family.name,
            "notes": membership.family.notes,
            "role": membership.role
        }
        for membership in memberships
    ]
    return families_with_roles

# Deprecated - use get_user_by_id instead.
def get_user(db: Session, user_id: int):
    return User.active(db).filter(User.id == user_id).first()


#
# [U]pdate
#
def update_user_basic(db: Session, user_id: int, update_block: UserUpdateBasic):
    db_user = User.active(db).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in update_block.model_dump(exclude_unset=True).items():
        if key == "password":
            value = hash_password(value)
            setattr(db_user, "password_hash", value)
        elif key == "security_answer":
            value = hash_security_answer(value)
            setattr(db_user, "security_answer_hash", value)
        else:
            setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_password(db: Session, user_id: int, update_block: UserUpdatePassword):
    db_user = User.active(db).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(update_block.old_password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    db_user.password_hash = hash_password(update_block.new_password)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_reset_question(db: Session, user_id: int, update_block: UserUpdateResetQuestion):
    db_user = User.active(db).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(update_block.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    db_user.security_question = update_block.security_question
    db_user.security_answer_hash = hash_security_answer(update_block.security_answer)
    db.commit()
    db.refresh(db_user)
    return db_user


#
# [D]elete
#
def deactivate_user(db: Session, user_id: int, block: UserDelete):
    db_user = User.active(db).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.deactivate(deleted_by=user_id, note=block.reason)
    db.commit()
    db.refresh(db_user)
    return db_user


# Deprecated - use get_user_families instead.
def get_user_family(db: Session, user_id: int):
    memberships = db.query(Membership).filter(Membership.user_id == user_id).all()
    if not memberships:
        raise HTTPException(status_code=404, detail="No families found for the user")
    
    families_with_roles = [
        {
            "id": membership.family.id,
            "name": membership.family.name,
            "notes": membership.family.notes,
            "role": membership.role
        }
        for membership in memberships
    ]

    return families_with_roles
