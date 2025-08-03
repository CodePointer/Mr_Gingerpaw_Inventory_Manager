from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from app.schemas.tag import TagOut


class ItemCreate(BaseModel):
    name: str
    id: Optional[str] = Field(None, alias="id")  # Temporary ID for bulk operations
    unit: Optional[str] = "pcs"
    quantity: Optional[float] = 1.0
    location: Optional[str] = None
    family_id: Optional[int] = Field(None, alias="familyId")
    owner_id: Optional[int] = None
    notes: Optional[str] = None
    raw_input: Optional[str] = Field(None, alias="rawInput")
    check_interval_days: Optional[int] = Field(None, alias="checkIntervalDays")
    restock_threshold: Optional[float] = Field(None, alias="restockThreshold")
    tag_ids: Optional[List[int]] = Field(None, alias="tagIds")  # Tag IDs
    model_config = {
        "populate_by_name": True,
    }


class ItemUpdate(BaseModel):
    id: int = Field(..., alias="id")  # ID of the item to update
    name: Optional[str] = None
    unit: Optional[str] = None
    location: Optional[str] = None
    family_id: int = Field(..., alias="familyId")
    owner_id: int = Field(..., alias="ownerId")
    notes: Optional[str] = None  # OK
    check_interval_days: Optional[int] = Field(None, alias="checkIntervalDays")
    restock_threshold: Optional[float] = Field(None, alias="restockThreshold")
    tag_ids: Optional[List[int]] = Field(None, alias="tagIds")  # Tag IDs
    model_config = {
        "populate_by_name": True,
    }
    
    @field_validator("id", mode="before")
    @classmethod
    def parse_id(cls, v: str) -> int:
        """Convert string ID to integer."""
        if v.isdigit():
            return int(v)
        raise ValueError("ID must be a valid integer string.")

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


class ItemDelete(BaseModel):
    id: int
    deleted_by: int = Field(..., alias="deletedBy")
    note: Optional[str] = None
    model_config = {
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
    item_id: str = Field(..., alias="itemId")
    message: Optional[str] = None
    model_config = {
        "populate_by_name": True,
    }


class BulkResponseOut(BaseModel):
    success: List[ItemStatus]
    failed: List[ItemStatus]

    def get_success_ids(self) -> List[str]:
        return [item.item_id for item in self.success]


class ItemAIInputs(BaseModel):
    query_id: str = Field(..., alias="queryId")
    query_type: str = Field(..., alias="queryType")
    queries: List[str] = Field(..., alias="queries")
    family_id: int = Field(..., alias="familyId")
    model_config = {
        "populate_by_name": True,
    }
