from pydantic import BaseModel, Field
from typing import Optional



class MembershipBase(BaseModel):
    user_id: int = Field(..., alias="userId")
    family_id: int = Field(..., alias="familyId")
    role: str
    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }

class MembershipCreate(MembershipBase):
    pass

class MembershipUpdate(BaseModel):
    user_id: int = Field(..., alias="userId")
    family_id: int = Field(..., alias="familyId")
    role: str
    model_config = {
        "populate_by_name": True,
    }


class MembershipDelete(BaseModel):
    family_id: int = Field(..., alias="familyId")
    model_config = {
        "populate_by_name": True,
    }


class MembershipOut(MembershipBase):
    pass


class MembershipTokenRequest(BaseModel):
    family_id: int = Field(..., alias="familyId")
    token_role: str = Field(..., alias="tokenRole")
    model_config = {
        "populate_by_name": True
    }


class MemebershipTokenResponse(BaseModel):
    token: str


class MembershipJoinRequest(BaseModel):
    token: str


class MembershipJoinResponse(MembershipOut):
    pass

