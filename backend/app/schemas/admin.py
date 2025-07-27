from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from app.schemas.item import ItemCreate
from app.schemas.transaction import TransactionCreate


class AdminToken(BaseModel):
    token: str = Field(..., description="Admin token for authentication")
    message: Optional[str] = Field(None, description="Optional message for admin token validation")
    model_config = {
        "populate_by_name": True,
    }


class TestResponse(BaseModel):
    message: str


class BulkResponseIdOut(BaseModel):
    info: Optional[str] = Field(None, description="Additional information about the operation")
    success: List[str] = Field(..., description="List of successfully processed item IDs")
    failed: List[str] = Field(..., description="List of item IDs that failed processing")
    model_config = {
        "populate_by_name": True,
    }


class QueryStructure(BaseModel):
    query_id: str = Field(..., description="Unique identifier for the query")
    query_text: List[str] = Field(..., description="The text of the query")


class BasicItemInfo(BaseModel):
    id: Optional[str] = Field(None, description="Temporary ID for the item, used in bulk operations")
    name: str = Field(..., description="Name of the item")
    unit: str = Field(..., description="Unit of the item")
    quantity: float = Field(..., description="Quantity of the item")
    location: Optional[str] = Field(None, description="Location of the item. If not provided, defaults to None")
    raw_input: str = Field(..., description="Raw input text for the item")

    def get_embedding_text(self) -> str:
        """Generate a text representation for embedding."""
        return f"{self.name}|||{self.unit}|||{self.quantity}|||{self.location or ''}"

class AIResponseItemInfo(BaseModel):
    items: List[BasicItemInfo] = Field(..., description="List of items returned by the AI response")


class AIItemActionSchema(BaseModel):
    entry_id: str = Field(None, description="ID of the item in user entry", alias="entryId")
    action: str = Field(..., description="Action to perform on the item (create or update)")
    existing_item_id: Optional[str] = Field(None, description="ID of the existing item to update", alias="existingItemId")
    quantity: Optional[float] = Field(..., description="Quantity involved in the action")


class AIResponseActionSet(BaseModel):
    actions: List[AIItemActionSchema] = Field(..., description="List of actions to perform on items")


class AIItemTaggingSchema(BaseModel):
    entry_id: str = Field(None, description="ID of the item in user entry", alias="entryId")
    tag_ids: List[str] = Field(..., description="List of tags to apply to the item", alias="tagIds")


class AIResponseTaggingSet(BaseModel):
    tagging: List[AIItemTaggingSchema] = Field(..., description="List of tagging actions to apply to items")


class DraftResponse(BaseModel):
    query_id: str = Field(..., description="ID of the query", alias="queryId")
    item_create: List[ItemCreate] = Field(..., description="List of items to create", alias="itemCreate")
    item_transaction: List[TransactionCreate] = Field(..., description="List of transactions to create", alias="itemTransaction")
    model_config = {
        "populate_by_name": True,
    }
