from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.schemas.tag import TagOut


class ItemCreate(BaseModel):
    name: str
    unit: Optional[str] = "pcs"
    quantity: Optional[float] = 1.0
    location: Optional[str] = None
    family_id: Optional[int] = None
    owner_id: Optional[int] = None
    notes: Optional[str] = None
    raw_input: Optional[str] = None
    check_interval_days: Optional[int] = None
    tags: Optional[List[int]] = []  # Tag IDs


class ItemUpdate(BaseModel):
    notes: Optional[str] = None  # OK
    check_interval_days: Optional[int] = None
    tags: Optional[List[int]] = []  # Tag IDs


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
