## app\core\access_control.py

```python
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Tuple
from app.models import Membership, Tag, Item, Transaction
from app.schemas.item import BulkResponseOut, ItemStatus


def check_user_in_family(db: Session, user_id: int, family_id: int) -> bool:
    """
    Check if a user is a member of a specific family.
    """
    membership = db.query(Membership).filter(
        Membership.user_id == user_id,
        Membership.family_id == family_id
    ).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: not a member of this family"
        )
    
    return membership


def check_user_can_edit_tag(db: Session, user_id: int, tag_id: int) -> Tag:
    """
    Check if a user has access to a specific tag.
    """
    tag = db.query(Tag).filter_by(id=tag_id).first()
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )
    
    membership = db.query(Membership).filter_by(
        user_id=user_id,
        family_id=tag.family_id
    ).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: not a member of this tag"
        )
    
    return tag


def check_user_can_edit_item(db: Session, user_id: int, item_id: int) -> None:
    """
    Check if a user has access to a specific item.
    """
    item = Item.active(db).filter_by(id=item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return check_user_in_family(db, user_id=user_id, family_id=item.family_id)


def check_user_can_edit_items(
    db: Session, user_id: int, item_ids: List[int]
) -> BulkResponseOut:
    response = BulkResponseOut(success=[], failed=[])
    for item_id in item_ids:
        try:
            check_user_can_edit_item(db, user_id, item_id)
        except HTTPException as e:
            response.failed.append(ItemStatus(id=item_id,
                                              status=e.detail,
                                              code=e.status_code))
        else:
            response.success.append(ItemStatus(id=item_id))
    return response


def check_user_can_edit_tran(
    db: Session, user_id: int, tx_id: int
) -> Transaction:
    db_tran = Transaction.active(db).filter_by(id=tx_id).first()
    if not db_tran:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    if db_tran.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User id didn't match"
        )
    return db_tran
```

## app\core\jwt.py

```python
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from jose import jwt 
from typing import Optional
import os


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if not expires_delta:
        expires_delta = ACCESS_TOKEN_EXPIRE_MINUTES
    to_encode.update({
        "exp": datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=expires_delta),
        "purpose": "access_token"
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_reset_token(data: dict, expires_delta: int = 10):
    to_encode = data.copy()
    to_encode.update({
        "exp": datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=expires_delta),
        "purpose": "reset_password"
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_reset_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("purpose") != "reset_password":
            return None
        email = payload.get("sub")
        return email
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None


def create_family_invite_token(data: dict, expires_delta: int = 60 * 24 * 3):
    to_encode = data.copy()
    to_encode.update({
        "exp": datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=expires_delta),
        "purpose": "family_invite"
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_family_invite_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("purpose") != "family_invite":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token: not a family invite token"
            )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None
```

## app\core\security.py

```python
# -*- coding: utf-8 -*-


from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_security_answer(answer: str) -> str:
    return pwd_context.hash(answer)


def verify_security_answer(plain_answer: str, hashed_answer: str) -> bool:
    return pwd_context.verify(plain_answer, hashed_answer)
```

## app\core\time_utils.py

```python
from datetime import datetime, timezone, timedelta


def get_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)
```

## app\core\utils.py

```python
# -*- coding = utf-8 -*-

from typing import List, Optional


def parse_tags(tags: Optional[str]) -> Optional[List[int]]:
    if tags is None or tags.strip == "":
        return None
    return [int(tag) for tag in tags.split(",") if tag.strip().isdigit()]
```

## app\crud\auth.py

```python
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
```

## app\crud\family.py

```python
from typing import List
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Family, Item, Membership, Tag, User
from app.schemas.family import FamilyCreate, FamilyUpdate
from app.schemas.user import UserOut
from app.schemas.item import LocationOut
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


def get_family_locations(db: Session, family_id: int) -> List[LocationOut]:
    sub_query = (
        Item.active(db)
        .filter(Item.family_id == family_id)
        .with_entities(Item.location, func.count(Item.id))
        .group_by(Item.location)
        .all()
    )
    res = [LocationOut(location_name=loc, item_count=cnt) for loc, cnt in sub_query]
    return res


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
```

## app\crud\item.py

```python
# -*- coding: utf-8 -*-

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, case
from fastapi import HTTPException
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from app.models import Item, Membership, Tag, Transaction
from app.schemas.item import (
    ItemCreate, ItemUpdate,
    BulkResponseOut, ItemStatus
)
from app.crud.tag import get_tags_by_ids
from app.core.time_utils import get_now



# Aggregate
def add_item_quantity(db: Session, item: Item) -> int:
    res = Transaction.sum_quantity_by_item_ids(db, [item.id])
    item.quantity = res[item.id]
    return item


def add_items_quantity(db: Session, items: List[Item]) -> List[Item]:
    item_ids = [item.id for item in items]
    res = Transaction.sum_quantity_by_item_ids(db, item_ids)
    for item in items:
        item.quantity = res.get(item.id, 0.0)
    return items


#
# [C]reate
#
def create_item(db: Session, request: ItemCreate) -> Item:
    db_item = Item.find_by_unique(
        db=db,
        name=request.name,
        unit=request.unit,
        location=request.location,
        family_id=request.family_id,
        owner_id=request.owner_id,
        is_active=None
    )
    if db_item:
        if db_item.is_active:
            raise HTTPException(status_code=409, detail="Item already exists")
        else:
            # Revive
            db_item.revive()
            # Set rest
            db_item.quantity = 0.0
            db_item.notes = request.notes
            db_item.raw_input = request.raw_input
            db_item.check_interval_days = request.check_interval_days
            if request.tags:
                db_item.tags = get_tags_by_ids(db, request.tags)
            db.commit()
            db.refresh(db_item)
    else:
        db_item = Item(**request.model_dump(exclude={"tags"}))
        if request.tags:
            db_item.tags = get_tags_by_ids(db, request.tags)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)

    return db_item


#
# [R]ead
#
def get_item_by_id(db: Session, item_id: int) -> Item:
    db_item = Item.active(db).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item = add_item_quantity(db, db_item)
    return db_item


def get_items(
    db: Session, 
    family_id: int,
    tag_ids: Optional[List[int]] = None, 
    location: Optional[str] = None
) -> List[Item]:
    query = Item.active(db).filter_by(family_id=family_id)

    if tag_ids:
        query = query.filter(Item.tags.any(Item.id.in_(tag_ids)))
    
    if location:
        query = query.filter_by(location=location)
    
    return add_items_quantity(db, query.all())


def get_items_by_tags(db: Session, family_id: int, tag_ids: List[int]) -> List[Item]:
    db_items = (
        Item.active(db)
        .join(Item.tags)
        .filter(Item.family_id == family_id, Tag.id.in_(tag_ids))
        .distinct()
        .all()
    )
    db_items = add_items_quantity(db, db_items)
    return db_items


def get_items_by_family(db: Session, family_id: int) -> List[Item]:
    db_items = Item.active(db).filter(Item.family_id == family_id).all()
    if not db_items:
        raise HTTPException(status_code=404, detail="No items found for this family")
    db_items = add_items_quantity(db, db_items)
    return db_items


def get_items_needing_check(db: Session, family_id: int) -> List[Item]:
    # family_ids = [m.family_id for m in db.query(Membership).filter_by(user_id=user_id).all()]

    raw_items = Item.active(db).filter(
        Item.family_id == family_id,
        Item.check_interval_days.isnot(None)
    ).all()

    db_items = []
    for item in raw_items:
        if item.last_checked_date is None:
            db_items.append(item)
        else:
            delta = timedelta(days=item.check_interval_days)
            if item.last_checked_date + delta < get_now():
                db_items.append(item)
    db_items = add_items_quantity(db, db_items)
    return db_items


def get_items_needing_restock(db: Session, family_id: int) -> List[Item]:
    raw_items = Item.active(db).filter(
        Item.family_id == family_id,
        Item.restock_threshold.isnot(None) and Item.restock_threshold > 0.0
    ).all()
    raw_items = add_item_quantity(db, raw_items)
    db_items = [item for item in raw_items if item.quantity <= item.restock_threshold]
    return db_items


# def get_items_by_user(db: Session, user_id: int):
#     db_items = db.query(Item).filter(Item.owner_id == user_id).all()
#     if not db_items:
#         raise HTTPException(status_code=404, detail="No items found for this user")
#     return db_items


# def get_items(db: Session):
#     return db.query(Item).all()


#
# [U]pdate
#
def mark_item_checked(db: Session, item_id: int, checked: bool) -> Item:
    db_item = Item.active(db).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.last_checked_date = get_now() if checked else None
    db.commit()
    db.refresh(db_item)
    return db_item


def mark_items_checked(
    db: Session, 
    item_ids: List[int], 
    checked: bool
) -> BulkResponseOut:
    response = BulkResponseOut(success=[], failed=[])
    for item_id in item_ids:
        try:
            mark_item_checked(db, item_id, checked)
        except HTTPException as e:
            response.failed.append(ItemStatus(status=e.detail,
                                              code=e.status_code,
                                              id=item_id))
        else:
            response.success.append(ItemStatus(id=item_id))
    return response


def update_item(db: Session, item_id: int, request: ItemUpdate):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    if request.notes is not None:
        db_item.notes = request.notes
    if request.check_interval_days is not None:
        db_item.check_interval_days = request.check_interval_days
    if request.tags is not None:
        tags = db.query(Tag).filter(Tag.id.in_(request.tags)).all()
        db_item.tags = tags

    db.commit()
    db.refresh(db_item)
    return db_item


def add_tags_to_items(
    db: Session,
    item_ids: List[int],
    tag_ids: List[int]
) -> BulkResponseOut:
    response = BulkResponseOut(success=[], failed=[])
    for item_id in item_ids:
        db_item = Item.active(db).filter(Item.id == item_id).first()
        if not db_item:
            response.failed.append(ItemStatus(status="Item not found",
                                              code=404,
                                              id=item_id))
        else:
            db_item.tags = get_tags_by_ids(db, tag_ids)
            db.commit()
            db.refresh(db_item)
            response.success.append(ItemStatus(id=item_id))
    return response


#
# [D]elete
#
def remove_item(db: Session, item_id: int, user_id: int, note: str) -> Item:
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.deactivate(deleted_by=user_id, note=note)
    db.commit()
    return db_item



# def get_items_by_tags(db: Session, user_id: int, tag_names: list[str]):
#     # Get family
#     family_ids = [m.family_id for m in db.query(Membership).filter_by(user_id=user_id).all()]

#     if not tag_names:
#         return db.query(Item).filter(Item.family_id.in_(family_ids)).all()

#     # Get tag id
#     tags = db.query(Tag).filter(Tag.name.in_(tag_names)).all()
#     tag_ids = [t.id for t in tags]

#     if not tag_ids:
#         return []

#     # OR mod
#     return (
#         db.query(Item)
#         .join(Item.tags)
#         .filter(Item.family_id.in_(family_ids))
#         .filter(Tag.id.in_(tag_ids))
#         .distinct()
#         .all()
#     )
```

## app\crud\membership.py

```python
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
```

## app\crud\tag.py

```python
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Optional
from app.models import Tag, Family
from app.schemas.tag import TagCreate, TagUpdate


#
# [C]reate
#
def create_tag(db: Session, tag_in: TagCreate):
    existing = db.query(Tag).filter_by(name=tag_in.name).first()
    if existing:
        return existing  # Or raise 409
    tag = Tag(
        name=tag_in.name,
        family_id=tag_in.family_id,
    )
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


#
# [R]ead
#
def get_tag_by_id(db: Session, tag_id: int) -> Optional[Tag]:
    tag = db.query(Tag).filter_by(id=tag_id).first()
    return tag

def get_tags_by_ids(db: Session, tag_ids: List[int]) -> List[Tag]:
    return db.query(Tag).filter(Tag.id.in_(tag_ids)).all()

def get_family_tags(db: Session, family_id: int) -> List[Tag]:
    family = Family.active(db).filter(Family.id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family.tags

#
# [U]pdate
#
def update_tag(db: Session, tag_id: int, tag_up: TagUpdate):
    tag = get_tag_by_id(db, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    tag.name = tag_up.name
    db.commit()
    db.refresh(tag)
    return tag

#
# [D]elete
#
def delete_tag(db: Session, tag_id: int):
    tag = db.query(Tag).filter_by(id=tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    for item in tag.items:
        item.tags.remove(tag)
    
    db.delete(tag)
    db.commit()
    return tag
```

## app\crud\transaction.py

```python
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from app.models import Transaction, Item
from app.schemas.transaction import (
    TransactionCreate, TransactionUpdate,
)
from app.crud.item import mark_item_checked
from app.core.time_utils import get_now


# def get_all_transactions(db: Session):
#     return db.query(Transaction).all()


def create_transaction(db: Session, tx: TransactionCreate):
    db_tx = Transaction(**tx.model_dump())
    db.add(db_tx)
    # # Only change if status is CONFIRMED
    # if tx.status == "CONFIRMED":
    #     db_item = db.query(Item).filter(Item.id == tx.item_id).first()
    #     if not db_item:
    #         raise HTTPException(status_code=404, detail="Item not found")
    #     if tx.change_type == "ADD":
    #         db_item.quantity += tx.quantity
    #     elif tx.change_type == "REMOVE":
    #         db_item.quantity -= tx.quantity
    db.commit()
    db.refresh(db_tx)
    mark_item_checked(db, db_tx.item_id, checked=True)
    return db_tx


def create_batch_transaction(db, request, user_id):
    return [create_transaction(db, tx) for tx in request]  # TODO: Change it into batch one?


def get_transaction_by_id(db: Session, tx_id: int):
    return Transaction.active(db).filter_by(id=tx_id).first()


def update_transaction(db: Session, tx_id: int, request: TransactionUpdate):
    db_tx = get_transaction_by_id(db, tx_id)
    if not db_tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for key, value in request.model_dump(exclude_unset=True).items():
        setattr(db_tx, key, value)

    db.commit()
    db.refresh(db_tx)
    return db_tx


def cancel_transaction(db: Session, tx_id: int, reason: str):
    db_tx = get_transaction_by_id(db, tx_id)
    if not db_tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db_tx.cancel(reason=reason)
    db.commit()
    db.refresh(db_tx)

    return db_tx


# def confirm_transaction(db: Session, tx_id: int):
#     db_tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
#     if not db_tx:
#         raise HTTPException(status_code=404, detail="Transaction not found")

#     if db_tx.status != "DRAFT":
#         raise HTTPException(status_code=400, detail="Only DRAFT transactions can be confirmed")

#     db_item = db.query(Item).filter(Item.id == db_tx.item_id).first()
#     if not db_item:
#         raise HTTPException(status_code=404, detail="Item not found")

#     if db_tx.change_type == "ADD":
#         db_item.quantity += db_tx.quantity
#     elif db_tx.change_type == "REMOVE":
#         db_item.quantity -= db_tx.quantity

#     db_tx.status = "CONFIRMED"
#     db.commit()
#     db.refresh(db_tx)
#     return db_tx

# def cancel_transaction(db: Session, tx_id: int):
#     db_tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
#     if not db_tx:
#         raise HTTPException(status_code=404, detail="Transaction not found")

#     if db_tx.status != "DRAFT":
#         raise HTTPException(status_code=400, detail="Only DRAFT transactions can be cancelled")

#     db_tx.status = "CANCELLED"
#     db.commit()
#     db.refresh(db_tx)
#     return db_tx
```

## app\crud\transfer.py

```python
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Item, Transaction, Membership

from app.schemas.item_transfer import ItemTransferRequest

def transfer_items(db: Session, transfer: ItemTransferRequest):
    user_id = transfer.user_id
    from_family = transfer.from_family_id
    to_family = transfer.to_family_id

    # Check if user belongs to both families
    for fam_id in [from_family, to_family]:
        member = db.query(Membership).filter_by(user_id=user_id, family_id=fam_id).first()
        if not member:
            raise HTTPException(status_code=403, detail=f"User {user_id} is not a member of family {fam_id}")

    for entry in transfer.items:
        item = db.query(Item).filter_by(id=entry.item_id, family_id=from_family).first()
        if not item:
            raise HTTPException(status_code=404, detail=f"Item {entry.item_id} not found in source family")

        if item.quantity < entry.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough quantity in item {item.name}")

        # Remove from original family
        item.quantity -= entry.quantity

        # Try to find the same item
        dest_item = db.query(Item).filter_by(
            name=item.name,
            unit=item.unit,
            location=entry.location,
            category=item.category,
            family_id=to_family
        ).first()

        if dest_item:
            dest_item.quantity += entry.quantity
        else:
            # Add new item
            dest_item = Item(
                name=item.name,
                unit=item.unit,
                quantity=entry.quantity,
                location=entry.location,
                family_id=to_family,
                owner_id=user_id,
                category=item.category,
                notes=item.notes,
                raw_input=item.raw_input
            )
            db.add(dest_item)
            db.flush()

        # transaction（REMOVE）
        db.add(Transaction(
            item_id=item.id,
            user_id=user_id,
            family_id=from_family,
            change_type="REMOVE",
            quantity=entry.quantity,
            unit=item.unit,
            location=item.location,
            notes=f"Transferred to family {to_family}: {transfer.notes}",
            status="CONFIRMED"
        ))

        # transaction（ADD）
        db.add(Transaction(
            item_id=dest_item.id,
            user_id=user_id,
            family_id=to_family,
            change_type="ADD",
            quantity=entry.quantity,
            unit=item.unit,
            location=entry.location,
            notes=f"Transferred from family {from_family}: {transfer.notes}",
        ))

        db.commit()
        return {"msg": "Transfer completed"}
```

## app\crud\user.py

```python
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
    return db.query(Membership).filter(Membership.user_id == user_id).all()

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
```

## app\crud\__init__.py

## app\dependencies\auth.py

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
import os

from app.models import User
from app.dependencies.db import get_db


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Token 中缺失用户信息")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Token invalid or outdated")

    user = db.query(User).filter(User.email == user_email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not exists")

    return user
```

## app\dependencies\db.py

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base
import os


DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## app\dependencies\__init__.py

## app\main.py

```python
from dotenv import load_dotenv
import os

load_dotenv()


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    user, family, item, transaction, 
    membership, transfer, tag, auth,
    location
)
from app.dependencies.db import engine
from app.models import Base


app = FastAPI(title="GPT 家庭库存管理系统 API")

# Base.metadata.create_all(bind=engine)  # 可选：开发阶段自动建表

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(family.router)
app.include_router(item.router)
app.include_router(transaction.router)
app.include_router(membership.router)
app.include_router(transfer.router)
app.include_router(tag.router)
app.include_router(auth.router)
app.include_router(location.router)


@app.get("/ping")
def ping():
    return {"msg": "pong"}
```

## app\models\association.py

```python
# -*- encoding: utf-8 -*-

from sqlalchemy import Table, Column, ForeignKey
from .base import Base


item_tags = Table(
    "item_tags",
    Base.metadata,
    Column("item_id", ForeignKey("items.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)
```

## app\models\base.py

```python
# -*- coding=utf-8 -*-

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Session
from enum import Enum

from app.core.time_utils import get_now


Base = declarative_base()


class LogicalDeleteMixin:
    is_active = Column(Boolean, default=True)
    deleted_at = Column(DateTime, nullable=True)
    deleted_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    deleted_note = Column(String, nullable=True)

    @classmethod
    def active(cls, db: Session):
        return db.query(cls).filter(cls.is_active == True)
    
    @classmethod
    def inactive(cls, db: Session):
        return db.query(cls).filter(cls.is_active == False)

    def deactivate(self, deleted_by: int, note: str = None):
        if self.is_active:
            self.is_active = False
            self.deleted_at = get_now()
            self.deleted_by = deleted_by
            self.deleted_note = note

    def revive(self):
        self.is_active = True
        self.deleted_at = None
        self.deleted_by = None
        self.deleted_note = None


class CancelStatus(str, Enum):
    ACTIVE = "ACTIVE"
    CANCELLED = "CANCELLED"



class CancellableMixin:
    status = Column(SQLEnum(CancelStatus, name="cancel_status"), 
                    default=CancelStatus.ACTIVE)
    cancelled_at = Column(DateTime, nullable=True)
    cancel_reason = Column(String, nullable=True)

    @classmethod
    def active(cls, db: Session):
        return db.query(cls).filter(cls.status == CancelStatus.ACTIVE)
    
    @classmethod
    def inactive(cls, db: Session):
        return db.query(cls).filter(cls.status == CancelStatus.CANCELLED)

    def cancel(self, reason: str = None):
        if self.status != "CANCELLED":
            self.status = "CANCELLED"
            self.cancelled_at = get_now()
            self.cancel_reason = reason
    
    def revive(self):
        self.status = "ACTIVE"
        self.cancelled_at = None
        self.cancel_reason = None
```

## app\models\family.py

```python
# -*- coding = utf-8 -*-

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base, LogicalDeleteMixin


class Family(Base, LogicalDeleteMixin):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    notes = Column(String, nullable=True)

    memberships = relationship("Membership", back_populates="family", cascade="all, delete-orphan")
    items = relationship("Item", back_populates="family")
    # transactions = relationship("Transaction", back_populates="family")
    tags = relationship("Tag", back_populates="family")
```

## app\models\item.py

```python
# -*- coding: utf-8 -*-

from sqlalchemy import (
    Column, Integer, String, 
    ForeignKey, Float, UniqueConstraint, DateTime,
    func
)
from sqlalchemy.orm import Session, relationship
from .base import Base, LogicalDeleteMixin

class Item(Base, LogicalDeleteMixin):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    unit = Column(String, nullable=False, default='pcs')
    quantity = Column(Float, nullable=False, default=0.0)
    location = Column(String, nullable=True)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    check_interval_days = Column(Integer, nullable=True)
    last_checked_date = Column(DateTime, nullable=True)
    restock_threshold = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    raw_input = Column(String, nullable=True)

    __table_args__ = (
        UniqueConstraint("name", "unit", "location", "family_id", "owner_id", name="_item_uc"),
    )

    family = relationship("Family", back_populates="items")
    owner = relationship("User", back_populates="items", foreign_keys=[owner_id])
    transactions = relationship("Transaction", back_populates="item")
    tags = relationship("Tag", secondary="item_tags", back_populates="items")

    @classmethod
    def find_by_unique(cls, 
                       db: Session,
                       name: String,
                       unit: String,
                       location: String,
                       family_id: Integer,
                       owner_id: Integer,
                       is_active: bool = None):
        if is_active == True:
            query = cls.active(db)
        elif is_active == False:
            query = cls.inactive(db)
        else:
            query = db.query(cls)
        return query.filter_by(
            name=name,
            unit=unit,
            location=location,
            family_id=family_id,
            owner_id=owner_id
        ).first()
        

def get_unique_locations(db: Session, family_id: int):
    return (
        Item.active(db)
        .filter(Item.family_id == family_id)
        .with_entities(Item.location, func.count(Item.id))
        .group_by(Item.location)
        .all()
    )
```

## app\models\membership.py

```python
# -*- coding: utf-8 -*-


from sqlalchemy import Column, Integer, ForeignKey, String, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from .base import Base

class Membership(Base):
    __tablename__ = "memberships"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    role = Column(String, nullable=False)  # "adult" / "child"

    __table_args__ = (
        PrimaryKeyConstraint('user_id', 'family_id'),
    )

    user = relationship("User", back_populates="memberships")
    family = relationship("Family", back_populates="memberships")
```

## app\models\tag.py

```python
# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .base import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)

    family = relationship("Family", back_populates="tags")
    items = relationship("Item", secondary="item_tags", back_populates="tags")

    __table_args__ = (
        UniqueConstraint("name", "family_id", name="_tag_uc_family_scope"),
    )
```

## app\models\transaction.py

```python
# -*- coding: utf-8 -*-

from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy import func, case
from typing import List

from .base import Base, CancellableMixin
from app.core.time_utils import get_now

class Transaction(Base, CancellableMixin):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    change_type = Column(String, nullable=False)  # "ADD" / "REMOVE"
    quantity = Column(Float, nullable=False)
    # unit = Column(String, nullable=False)
    # location = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    raw_input = Column(String, nullable=True)
    timestamp = Column(DateTime, default=get_now())
    # status = Column(String, default="CONFIRMED")

    item = relationship("Item", back_populates="transactions")
    user = relationship("User", back_populates="transactions")
    # family = relationship("Family", back_populates="transactions")

    @classmethod
    def sum_quantity_by_item_ids(cls, db: Session, item_ids: List[int]):
        results = (
            cls.active(db).filter(
                cls.item_id.in_(item_ids)
            ).with_entities(
                cls.item_id,
                func.sum(
                    case(
                        (cls.change_type == "ADD", cls.quantity),
                        (cls.change_type == "REMOVE", -cls.quantity),
                        else_=0.0
                    )
                ).label("current_quantity")
            )
        ).group_by(cls.item_id).all()
        return {item_id: qty or 0.0 for item_id, qty in results}
```

## app\models\user.py

```python
# -*- coding = utf-8 -*-

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from .base import Base, LogicalDeleteMixin


class User(Base, LogicalDeleteMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=True)
    phone_number = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    security_question = Column(String, nullable=True)
    security_answer_hash = Column(String, nullable=True)

    memberships = relationship("Membership", back_populates="user", cascade="all, delete-orphan")
    items = relationship("Item", back_populates="owner", foreign_keys="[Item.owner_id]")
    transactions = relationship("Transaction", back_populates="user")
```

## app\models\__init__.py

```python
# -*- coding=utf-8 -*-

from .base import Base
from .user import User
from .family import Family
from .membership import Membership
from .item import Item
from .transaction import Transaction
from .tag import Tag
from .association import item_tags

__all__ = [
    "Base", "User", "Family",
    "Membership", "Item", "Transaction"
    "Tag", "item_tags"
]
```

## app\routers\admin_user.py

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, UserOut, UserUpdate
from app.core.security import verify_password
from app.core.jwt import create_access_token
from app.crud.user import (
    create_user, get_user_by_email, get_all_users, get_user, update_user, 
    delete_user, get_user_family
)
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models import User
from app.schemas.family import FamilyOut

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email already registered")
    return create_user(db, user)

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):  # TODO: UserLogin
    db_user = get_user_by_email(db, email=user.email)
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid credentials")
    
    token = create_access_token(data={"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return get_all_users(db)

@router.get("/{user_id}", response_model=UserOut)
def get_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserOut)
def update_user_endpoint(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    return update_user(db, user_id, user)

@router.delete("/{user_id}")
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    return delete_user(db, user_id)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/me/families", response_model=list[FamilyOut])
def get_families_for_user(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    families = get_user_family(db, current_user.id)
    return families
```

## app\routers\auth.py

```python
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
```

## app\routers\family.py

```python
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
```

## app\routers\item.py

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.core.access_control import (
    check_user_in_family, check_user_can_edit_item,
    check_user_can_edit_items
)
from app.core.utils import parse_tags
from app.models import User
from app.schemas.item import (
    ItemCreate, ItemOut, ItemUpdate,
    ItemList, BulkResponseOut
)
from app.schemas.tag import TagAssignRequest
from app.crud import item as item_crud


router = APIRouter(prefix="/families/{family_id}/items", 
                   tags=["items (per family)"])


# Create new item
@router.post("/", 
             response_model=ItemOut,
             response_model_by_alias=True)
def create_item_endpoint(
    family_id: int,
    item: ItemCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    item.family_id = family_id
    return item_crud.create_item(db, item)


# Find item with tags
@router.get("/", 
            response_model=list[ItemOut],
            response_model_by_alias=True)
def get_items_by_tags(
    family_id: int,
    tags: Optional[List[int]] = Query(None), # Depends(parse_tags),
    location: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if tags == [""]:
        tags = None
    check_user_in_family(db, user_id=current_user.id, family_id=family_id)
    return item_crud.get_items(db, family_id, tags, location)


# Find item needing check
@router.get("/check-needed",
            response_model=list[ItemOut],
            response_model_by_alias=True)
def get_items_needing_check(
    family_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, user_id=current_user.id, family_id=family_id)
    return item_crud.get_items_needing_check(db, family_id=family_id)


# Set item to checked.
@router.patch("/{item_id}/check", 
              response_model=ItemOut,
              response_model_by_alias=True)
def update_last_check(
    family_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_item(db, user_id=current_user.id, item_id=item_id)
    return item_crud.mark_item_checked(db, item_id=item_id, checked=True)


# Set items to checked.
@router.patch("/bulk-check",
              response_model=BulkResponseOut,
              response_model_by_alias=True)
def mark_items_checked(
    family_id: int,
    item_ids: ItemList,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    response = check_user_can_edit_items(db, current_user.id, item_ids.item_list)
    approved_item_ids = [x.id for x in response.success]

    process_response = item_crud.mark_items_checked(db, approved_item_ids, checked=True)
    process_response.failed.extend(response.failed)
    return process_response


# Find item needing restock
@router.get("/restock-needed",
            response_model=list[ItemOut],
            response_model_by_alias=True)
def get_items_needing_check(
    family_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, user_id=current_user.id, family_id=family_id)
    return item_crud.get_items_needing_restock(db, family_id=family_id)


# Set items to add tag
@router.patch("/bulk-add-tags",
              response_model=BulkResponseOut,
              response_model_by_alias=True)
def add_tags_to_item(
    family_id: int,
    item_ids: ItemList,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # TODO: Check tags
    response = check_user_can_edit_items(db, current_user.id, item_ids.item_list)
    approved_item_ids = [x.id for x in response.success]

    process_response = item_crud.mark_items_checked(db, approved_item_ids, checked=True)
    process_response.failed.extend(response.failed)
    return item_crud.add_tags_to_items(db, item_ids.item_list, item_ids.tag_list)


# Update item info
@router.put("/{item_id}", 
            response_model=ItemOut,
            response_model_by_alias=True)
def update_item(
    family_id: int,
    item_id: int,
    request: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_item(db, user_id=current_user.id, item_id=item_id)
    return item_crud.update_item(db, item_id=item_id, request=request)


# Delete item
@router.delete("/{item_id}",
               response_model=ItemOut,
               response_model_by_alias=True)
def remove_item(
    family_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_item(db, user_id=current_user.id, item_id=item_id)
    return item_crud.remove_item(db, item_id, current_user.id, note="User deleted")


# @router.post("/", response_model=ItemOut)
# def create_item_endpoint(item: ItemCreate, db: Session = Depends(get_db)):
#     return funcs.create_item(db, item)



# @router.put("/{item_id}", response_model=ItemOut)
# def update_item_endpoint(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
#     return funcs.update_item(db, item_id, item)


# @router.delete("/{item_id}")
# def delete_item_endpoint(item_id: int, db: Session = Depends(get_db)):
#     return funcs.delete_item(db, item_id)


# @router.get("/", response_model=List[ItemOut])
# def list_items(
#     tags: Optional[List[str]] = Query(None, description="Filter by tag names"),
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     return funcs.get_items_by_tags(db, user_id=current_user.id, tag_names=tags or [])
```

## app\routers\location.py

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.models.item import get_unique_locations
from app.models import Item

router = APIRouter(prefix="/families/{fid}/locations", tags=["Locations"])

# @router.get("/", summary="获取家庭下所有唯一 location")
# def list_locations(fid: int, db: Session = Depends(get_db)):
#     locations = get_unique_locations(db, family_id=fid)
#     return [{"location": loc, "itemCount": count} for loc, count in locations]

# @router.get("/items", summary="按 location 筛选物品")
# def list_items_by_location(fid: int, location: str, db: Session = Depends(get_db)):
#     items = db.query(Item).filter(Item.family_id == fid, Item.location == location).all()
#     return items
```

## app\routers\membership.py

```python
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
```

## app\routers\tag.py

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.core.access_control import check_user_in_family, check_user_can_edit_tag
from app.models import User, Tag
from app.schemas.tag import TagOut, TagCreate, TagUpdate
from app.crud import tag as tag_crud


router = APIRouter(prefix="/families/{family_id}/tags", 
                   tags=["tags (per family)"])


@router.get("/", 
            response_model=List[TagOut],
            response_model_by_alias=True)
def get_family_tags(
    family_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    return tag_crud.get_family_tags(db, family_id)


@router.post("/", response_model=TagOut, response_model_by_alias=True)
def create_new_tag(
    family_id: int,
    request: TagCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    request.family_id = family_id
    return tag_crud.create_tag(db, request)


@router.put("/{tag_id}", response_model=TagOut, response_model_by_alias=True)
def modify_tag(
    family_id: int,
    tag_id: int, 
    request: TagUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_tag(db, current_user.id, tag_id)
    return tag_crud.update_tag(db, tag_id, request)


@router.delete("/{tag_id}", response_model=TagOut, response_model_by_alias=True)
def remove_tag(
    family_id: int,
    tag_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_tag(db, current_user.id, tag_id)
    return tag_crud.delete_tag(db, tag_id)
```

## app\routers\transaction.py

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.core.access_control import (
    check_user_can_edit_item,
    check_user_can_edit_items,
    check_user_can_edit_tran
)
from app.models import User
from app.schemas.transaction import (
    TransactionCreate, TransactionOut, TransactionUpdate,
    BulkResponseOut, TransactionStatus
)
from app.crud import transaction as tran_crud


router = APIRouter(prefix="/families/{family_id}/transactions", 
                   tags=["transactions (per family)"])


@router.post("/", 
             response_model=TransactionOut,
             response_model_by_alias=True)
def create_transaction(
    family_id: int,
    request: TransactionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # User should only create transaction for himself
    print("Enter here.")
    request.user_id = current_user.id
    check_user_can_edit_item(db, current_user.id, request.item_id)
    return tran_crud.create_transaction(db, request)


@router.post("/batch", 
             response_model=List[TransactionOut],
             response_model_by_alias=True)
def create_transaction(
    family_id: int,
    request: List[TransactionCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # User should only create transaction for himself
    for tran_create in request:
        tran_create.user_id = current_user.id
        check_user_can_edit_item(db, current_user.id, tran_create.item_id)

    return tran_crud.create_batch_transaction(db, request, current_user.id)


# @router.get("/", response_model=list[TransactionOut])
# def list_transactions(db: Session = Depends(get_db)):
#     return get_all_transactions(db)

@router.get("/{tx_id}", 
            response_model=TransactionOut,
            response_model_by_alias=True)
def get_transaction(
    family_id: int,
    tx_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_tran(db, current_user.id, tx_id)
    return tran_crud.get_transaction_by_id(db, tx_id)


@router.put("/{tx_id}", 
            response_model=TransactionOut,
            response_model_by_alias=True)
def update_transaction(
    family_id: int,
    tx_id: int, 
    request: TransactionUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_tran(db, current_user.id, tx_id)
    return tran_crud.update_transaction(db, tx_id, request)


@router.delete("/{tx_id}",
               response_model=TransactionOut,
               response_model_by_alias=True)
def cancel_transaction(
    family_id: int,
    tx_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_tran(db, current_user.id, tx_id)
    return tran_crud.cancel_transaction(db, tx_id, "User cancel")
```

## app\routers\transfer.py

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.schemas.item_transfer import ItemTransferRequest
from app.crud.transfer import transfer_items

router = APIRouter(prefix="/items", tags=["item transfer"])

@router.post("/transfer")
def transfer_items_endpoint(payload: ItemTransferRequest, db: Session = Depends(get_db)):
    return transfer_items(db, payload)
```

## app\routers\user.py

```python
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
```

## app\routers\__init__.py

## app\schemas\auth.py

```python
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
```

## app\schemas\family.py

```python
from pydantic import BaseModel, Field
from typing import Optional


class FamilyCreate(BaseModel):
    name: str
    notes: Optional[str] = None


class FamilyUpdate(BaseModel):
    name: Optional[str] = None
    notes: Optional[str] = None


class FamilyOut(FamilyCreate):
    id: int
    name: str
    notes: Optional[str] = None
    role: Optional[str] = None

    is_active: bool = Field(True, alias="isActive")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }
```

## app\schemas\item.py

```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.schemas.tag import TagOut


class ItemCreate(BaseModel):
    name: str
    unit: Optional[str] = "pcs"
    quantity: Optional[float] = 1.0
    location: Optional[str] = None
    family_id: Optional[int] = Field(None, alias="familyId")
    owner_id: Optional[int] = None
    notes: Optional[str] = None
    raw_input: Optional[str] = None
    check_interval_days: Optional[int] = None
    restock_threshold: Optional[float] = Field(None, alias="restockThreshold")
    tags: Optional[List[int]] = []  # Tag IDs
    model_config = {
        "populate_by_name": True,
    }


class ItemUpdate(BaseModel):
    notes: Optional[str] = None  # OK
    check_interval_days: Optional[int] = Field(None, alias="checkIntervalDays")
    restock_threshold: Optional[float] = Field(None, alias="restockThreshold")
    tags: Optional[List[int]] = []  # Tag IDs
    model_config = {
        "populate_by_name": True,
    }

# class ItemTagUpdate(BaseModel):
#     tags: List[int] = Field(..., alias="tags")  # List of tag IDs to assign to the item
#     model_config = {
#         "populate_by_name": True,
#     }


class ItemOut(BaseModel):
    id: int
    name: str
    unit: str
    quantity: float
    location: Optional[str]
    family_id: int = Field(..., alias="familyId")
    owner_id: Optional[int] = Field(..., alias="ownerId")
    notes: Optional[str] = None
    raw_input: Optional[str] = Field(..., alias="rawInput")
    check_interval_days: Optional[int] = Field(None, alias="checkIntervalDays")
    last_checked_date: Optional[datetime] = Field(None, alias="lastCheckedDate")
    restock_threshold: Optional[float] = Field(None, alias="restockThreshold")
    tags: List[TagOut] = None

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


class ItemList(BaseModel):
    item_list: List[str] = Field(..., alias="itemList")
    tag_list: Optional[List[int]] = Field(None, alias="tagList")
    model_config = {
        "populate_by_name": True,
    }


class LocationOut(BaseModel):
    location_name: str = Field(..., alias="locationName")
    item_count: Optional[int] = Field(..., alias="itemCount")
    model_config = {
        "populate_by_name": True,
    }


class ItemStatus(BaseModel):
    status: str = "success"
    code: int = 200
    id: int = Field(..., alias="itemId")
    model_config = {
        "populate_by_name": True,
    }


class BulkResponseOut(BaseModel):
    success: List[ItemStatus]
    failed: List[ItemStatus]
```

## app\schemas\item_transfer.py

```python
from pydantic import BaseModel
from typing import List


class TransferItem(BaseModel):
    item_id: int
    quantity: float
    location: str


class ItemTransferRequest(BaseModel):
    user_id: int
    from_family_id: int
    to_family_id: int
    items: List[TransferItem]
    notes: str
```

## app\schemas\membership.py

```python
from pydantic import BaseModel, Field
from typing import Optional



class MembershipBase(BaseModel):
    user_id: int = Field(..., alias="userId")
    family_id: int = Field(..., alias="familyId")
    role: str
    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }

class MembershipCreate(MembershipBase):
    pass

class MembershipUpdate(BaseModel):
    user_id: int = Field(..., alias="userId")
    family_id: int = Field(..., alias="familyId")
    role: str
    model_config = {
        "populate_by_name": True,
    }


class MembershipDelete(BaseModel):
    family_id: int = Field(..., alias="familyId")
    model_config = {
        "populate_by_name": True,
    }


class MembershipOut(MembershipBase):
    pass


class MembershipTokenRequest(BaseModel):
    family_id: int = Field(..., alias="familyId")
    token_role: str = Field(..., alias="tokenRole")
    model_config = {
        "populate_by_name": True
    }


class MemebershipTokenResponse(BaseModel):
    token: str


class MembershipJoinRequest(BaseModel):
    token: str


class MembershipJoinResponse(MembershipOut):
    pass
```

## app\schemas\tag.py

```python
from pydantic import BaseModel, Field
from typing import Optional, List


class TagCreate(BaseModel):
    name: str
    family_id: int = Field(None, alias="familyId")
    model_config = {
        "populate_by_name": True,
    }


class TagUpdate(BaseModel):
    name: Optional[str] = None


class TagOut(BaseModel):
    id: int
    name: str
    family_id: Optional[int] = Field(None, alias="familyId")

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


class TagAssignRequest(BaseModel):
    tag_ids: List[int]
```

## app\schemas\transaction.py

```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class TransactionCreate(BaseModel):
    item_id: int = Field(..., alias="itemId")
    user_id: Optional[int] = Field(alias="userId")
    # family_id: int
    change_type: str = Field("ADD", alias="changeType")
    quantity: float
    # unit: str
    # location: Optional[str] = None
    notes: Optional[str] = None
    raw_input: Optional[str] = Field(None, alias="rawInput")
    # status: Optional[str] = "CONFIRMED"
    model_config = {
        "populate_by_name": True,
    }


class TransactionUpdate(BaseModel):
    # location: Optional[str] = None
    notes: Optional[str] = None
    raw_input: Optional[str] = Field(None, alias="rawInput")


class TransactionOut(TransactionCreate):
    id: int
    timestamp: datetime

    model_config = {
        "from_attributes": True
    }


class TransactionStatus(BaseModel):
    status: str = "success"
    code: int = 200
    id: int


class BulkResponseOut(BaseModel):
    success: List[TransactionStatus]
    failed: List[TransactionStatus]
```

## app\schemas\user.py

```python
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
```

## app\schemas\__init__.py

## app\__init__.py

## migrations\env.py

```python
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
from app.models import Base
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

## migrations\versions\3bc756afeafb_remove_family_id_from_user.py

```python
"""remove family_id from user

Revision ID: 3bc756afeafb
Revises: d6cee5c5e618
Create Date: 2025-03-23 20:39:36.708977

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3bc756afeafb'
down_revision: Union[str, None] = 'd6cee5c5e618'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('users_family_id_fkey', 'users', type_='foreignkey')
    op.drop_column('users', 'family_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('family_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.create_foreign_key('users_family_id_fkey', 'users', 'families', ['family_id'], ['id'])
    # ### end Alembic commands ###
```

## migrations\versions\d6cee5c5e618_initial_migration.py

```python
"""initial migration

Revision ID: d6cee5c5e618
Revises: 
Create Date: 2025-03-23 20:16:53.258747

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd6cee5c5e618'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('families',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('notes', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_families_id'), 'families', ['id'], unique=False)
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('phone_number', sa.String(), nullable=True),
    sa.Column('password_hash', sa.String(), nullable=False),
    sa.Column('family_id', sa.Integer(), nullable=False),
    sa.Column('notes', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['family_id'], ['families.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_table('items',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('unit', sa.String(), nullable=False),
    sa.Column('quantity', sa.Float(), nullable=False),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('family_id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('category', sa.String(), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.Column('raw_input', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['family_id'], ['families.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name', 'unit', 'location', 'family_id', name='_item_uc')
    )
    op.create_index(op.f('ix_items_id'), 'items', ['id'], unique=False)
    op.create_table('memberships',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('family_id', sa.Integer(), nullable=False),
    sa.Column('role', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['family_id'], ['families.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'family_id')
    )
    op.create_table('transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('item_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('family_id', sa.Integer(), nullable=False),
    sa.Column('change_type', sa.String(), nullable=False),
    sa.Column('quantity', sa.Float(), nullable=False),
    sa.Column('unit', sa.String(), nullable=False),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.Column('raw_input', sa.String(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['family_id'], ['families.id'], ),
    sa.ForeignKeyConstraint(['item_id'], ['items.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_transactions_id'), 'transactions', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_transactions_id'), table_name='transactions')
    op.drop_table('transactions')
    op.drop_table('memberships')
    op.drop_index(op.f('ix_items_id'), table_name='items')
    op.drop_table('items')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_families_id'), table_name='families')
    op.drop_table('families')
    # ### end Alembic commands ###
```

## seed_data.py

```python
from dotenv import load_dotenv
import os
load_dotenv()

from sqlalchemy import text
from app.dependencies.db import engine, SessionLocal
from app.models import Base, User, Family, Membership, Item, Transaction, Tag
from app.core.security import hash_password, hash_security_answer
import logging
from datetime import datetime

# 🧹 静音 SQLAlchemy 日志
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

db = SessionLocal()

print("\n🚧 清空数据库...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("✅ 表结构已重建")

print("\n🔁 重置主键序列...")
with engine.connect() as conn:
    for table in ["users", "families", "memberships", "items", "transactions", "tags"]:
        try:
            conn.execute(text(f"ALTER SEQUENCE {table}_id_seq RESTART WITH 1;"))
        except Exception:
            pass
print("✅ 主键序列重置完成")

# 👤 用户
print("\n👤 插入测试用户...")
alice = User(
    username="alice",
    email="alice@example.com",
    password_hash=hash_password("password123"),
    phone_number="1234567890",
    notes="测试用户 Alice",
    security_question="你的猫叫什么？",
    security_answer_hash=hash_security_answer("大黄"),
)

bob = User(
    username="bob",
    email="bob@example.com",
    password_hash=hash_password("password123"),
    phone_number="0987654321",
    notes="测试用户 Bob",
    security_question="你的猫叫什么？",
    security_answer_hash=hash_security_answer("大黄"),
)

db.add_all([alice, bob])
db.commit()
db.refresh(alice)
db.refresh(bob)
print("✅ 添加用户完成")

# 🏠 家庭
print("\n🏠 创建共享家庭...")
family = Family(
    name="测试家庭",
    notes="Alice 和 Bob 的共享家庭"
)
db.add(family)
db.commit()
db.refresh(family)
print(f"✅ 家庭创建完成（ID: {family.id}）")

# 👥 绑定 Membership
print("\n🔗 添加成员到家庭...")
db.add_all([
    Membership(user_id=alice.id, family_id=family.id, role="adult"),
    Membership(user_id=bob.id, family_id=family.id, role="child")
])
db.commit()
print("✅ 成员绑定完成")

# 🏷️ 添加标签
print("\n🏷️ 添加标签...")
tag_food = Tag(name="主食", family_id=family.id)
tag_drink = Tag(name="饮品", family_id=family.id)
db.add_all([tag_food, tag_drink])
db.commit()
db.refresh(tag_food)
db.refresh(tag_drink)
print("✅ 标签添加完成")

# 📦 添加物品
print("\n📦 添加物品...")
rice = Item(
    name="大米",
    unit="袋",
    quantity=10,
    location="厨房",
    family_id=family.id,
    owner_id=alice.id,
    notes="5kg",
    check_interval_days=30,
    tags=[tag_food]
)

milk = Item(
    name="牛奶",
    unit="瓶",
    quantity=6,
    location="冰箱",
    family_id=family.id,
    owner_id=bob.id,
    notes="全脂",
    check_interval_days=7,
    tags=[tag_drink]
)

db.add_all([rice, milk])
db.commit()
db.refresh(rice)
db.refresh(milk)
print("✅ 物品添加完成")

# 📈 添加交易
print("\n📈 添加交易记录...")
tx1 = Transaction(
    item_id=rice.id,
    user_id=alice.id,
    change_type="ADD",
    quantity=2,
    raw_input="补充2袋大米"
)

tx2 = Transaction(
    item_id=milk.id,
    user_id=bob.id,
    change_type="ADD",
    quantity=3,
    raw_input="补充3瓶牛奶"
)

db.add_all([tx1, tx2])
db.commit()
print("✅ 交易记录添加完成")

print("\n🎉 seed 数据已全部添加完毕。")

db.close()
print("\n🌱 数据库初始化完成！准备好测试了 😄\n")
```

