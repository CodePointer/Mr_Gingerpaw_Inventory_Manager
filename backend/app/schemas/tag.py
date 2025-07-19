from pydantic import BaseModel, Field
from typing import Optional, List


class TagCreate(BaseModel):
    name: str
    id: Optional[str] = Field(None, alias="id")  # Temporary ID for bulk operations
    family_id: Optional[int] = Field(None, alias="familyId")
    model_config = {
        "populate_by_name": True,
    }


class TagUpdate(BaseModel):
    id: int = Field(..., alias="id")  # ID of the tag to update
    name: Optional[str] = None
    family_id: Optional[int] = Field(None, alias="familyId")
    model_config = {
        "populate_by_name": True,
    }


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


class TagStatus(BaseModel):
    status: str = "success"
    code: int = 200
    tag_id: str = Field(..., alias="tagId")
    message: Optional[str] = None
    model_config = {
        "populate_by_name": True,
    }


class BulkTagResponseOut(BaseModel):
    success: List[TagStatus]
    failed: List[TagStatus]
    def get_success_ids(self) -> List[str]:
        return [status.tag_id for status in self.success]
