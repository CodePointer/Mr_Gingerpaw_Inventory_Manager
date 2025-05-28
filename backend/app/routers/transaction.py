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
from app.crud import item as item_crud


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
    response = tran_crud.create_transaction(db, request)
    item_crud.mark_item_checked(db, request.item_id, checked=True)
    return response


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

    response = tran_crud.create_batch_transaction(db, request, current_user.id)
    item_ids = [txn.item_id for txn in request]
    item_ids = list(set(item_ids))
    item_crud.mark_items_checked(db, item_ids, checked=True)
    return response


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
