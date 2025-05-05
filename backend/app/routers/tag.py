from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.core.access_control import check_user_in_family, check_user_can_edit_tag
from app.models import User, Tag
from app.schemas.tag import TagOut, TagCreate, TagUpdate
from app.crud import tag as tag_crud


router = APIRouter(prefix="/families/{family_id}/tags", 
                   tags=["tags (per family)"])


@router.get("/", 
            response_model=List[TagOut],
            response_model_by_alias=True)
def get_family_tags(
    family_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    return tag_crud.get_family_tags(db, family_id)


@router.post("/", response_model=TagOut, response_model_by_alias=True)
def create_new_tag(
    family_id: int,
    request: TagCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    request.family_id = family_id
    return tag_crud.create_tag(db, request)


@router.put("/{tag_id}", response_model=TagOut, response_model_by_alias=True)
def modify_tag(
    family_id: int,
    tag_id: int, 
    request: TagUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_tag(db, current_user.id, tag_id)
    return tag_crud.update_tag(db, tag_id, request)


@router.delete("/{tag_id}", response_model=TagOut, response_model_by_alias=True)
def remove_tag(
    family_id: int,
    tag_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_can_edit_tag(db, current_user.id, tag_id)
    return tag_crud.delete_tag(db, tag_id)
