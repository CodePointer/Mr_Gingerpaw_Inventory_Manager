from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.schemas.item_transfer import ItemTransferRequest
from app.crud.transfer import transfer_items

router = APIRouter(prefix="/items", tags=["item transfer"])

@router.post("/transfer")
def transfer_items_endpoint(payload: ItemTransferRequest, db: Session = Depends(get_db)):
    return transfer_items(db, payload)
