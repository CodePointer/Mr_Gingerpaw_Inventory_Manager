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
