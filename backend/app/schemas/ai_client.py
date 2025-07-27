from pydantic import BaseModel, Field
from typing import Optional, List, Tuple
from app.schemas.item import ItemCreate
from app.schemas.transaction import TransactionCreate


EmbeddedVector = Tuple[float, ...]


class ParseItemSchema(BaseModel):
    # id: Optional[str] = Field(None, description="Temporary ID for the item, used in bulk operations")
    name: str = Field(..., description="Name of the item")
    unit: str = Field(..., description="Unit of the item")
    quantity: float = Field(..., description="Quantity of the item")
    location: Optional[str] = Field(None, description="Location of the item. If not provided, defaults to None")
    raw_input: str = Field(..., description="Raw input text for the item")

class ParseItemSchemaList(BaseModel):
    response: List[ParseItemSchema] = Field(..., description="List of items parsed from the input text")


class ReconcileItemSchema(BaseModel):
    entry_id: str = Field(None, description="ID of the item in user entry", alias="entryId")
    action: str = Field(..., description="Action to perform on the item (create or update)")
    existing_item_id: Optional[str] = Field(None, description="ID of the existing item to update", alias="existingItemId")
    quantity: Optional[float] = Field(..., description="Quantity involved in the action")

class ReconcileItemSchemaList(BaseModel):
    response: List[ReconcileItemSchema] = Field(..., description="List of actions to perform on items")


class AssignTagsSchema(BaseModel):
    entry_id: str = Field(None, description="ID of the item in user entry", alias="entryId")
    tag_ids: List[str] = Field(..., description="List of tags to apply to the item", alias="tagIds")

class AssignTagsSchemaList(BaseModel):
    response: List[AssignTagsSchema] = Field(..., description="List of tags assigned to each item")
