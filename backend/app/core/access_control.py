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
