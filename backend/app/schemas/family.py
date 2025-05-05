from pydantic import BaseModel, Field
from typing import Optional


class FamilyCreate(BaseModel):
    name: str
    notes: Optional[str] = None


class FamilyUpdate(BaseModel):
    name: Optional[str] = None
    notes: Optional[str] = None


class FamilyOut(FamilyCreate):
    id: int
    name: str
    notes: Optional[str] = None
    role: Optional[str] = None

    is_active: bool = Field(True, alias="isActive")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }
