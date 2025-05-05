from pydantic import BaseModel, Field
from typing import Optional, List


class TagCreate(BaseModel):
    name: str
    family_id: int = Field(None, alias="familyId")
    model_config = {
        "populate_by_name": True,
    }


class TagUpdate(BaseModel):
    name: Optional[str] = None


class TagOut(BaseModel):
    id: int
    name: str
    family_id: Optional[int] = Field(None, alias="familyId")

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


class TagAssignRequest(BaseModel):
    tag_ids: List[int]
