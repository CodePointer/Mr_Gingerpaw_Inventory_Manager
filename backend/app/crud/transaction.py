from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from app.models import Transaction, Item
from app.schemas.transaction import (
    TransactionCreate, TransactionUpdate,
)
from app.core.time_utils import get_now


# def get_all_transactions(db: Session):
#     return db.query(Transaction).all()


def create_transaction(db: Session, tx: TransactionCreate):
    db_tx = Transaction(**tx.model_dump())
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
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