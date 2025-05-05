# -*- coding: utf-8 -*-

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, case
from fastapi import HTTPException
from datetime import datetime, timezone, timedelta
from typing import List

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
