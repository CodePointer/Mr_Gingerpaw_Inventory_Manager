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
from app.schemas.transaction import TransactionCreate
from app.crud import item as item_crud
from app.crud import transaction as transaction_crud


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
    item_response = item_crud.create_item(db, item)

    if item.quantity != 0:
        transaction_crud.create_transaction(db, TransactionCreate(
            item_id=item_response.id,
            user_id=current_user.id,
            changeType="ADD" if item.quantity > 0 else "REMOVE",
            quantity=abs(item.quantity),
            notes="INIT",
            raw_input="INIT"
        ))

    return item_response


# Find item with tags
@router.get("/", 
            response_model=list[ItemOut],
            response_model_by_alias=True)
@router.get("", 
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
