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
    item_id: int = Field(..., alias="itemId")
    message: Optional[str] = None
    model_config = {
        "populate_by_name": True,
    }


class BulkResponseOut(BaseModel):
    success: List[TransactionStatus]
    failed: List[TransactionStatus]

    def get_success_ids(self) -> List[int]:
        return [status.item_id for status in self.success]

