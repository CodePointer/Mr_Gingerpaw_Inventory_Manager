from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.core.access_control import check_user_can_edit_tags, check_user_in_family, check_user_can_edit_tag
from app.models import User, Tag
from app.schemas.tag import TagOut, TagCreate, TagUpdate, BulkTagResponseOut, TagStatus
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


@router.post("/bulk-create",
             response_model=BulkTagResponseOut,
             response_model_by_alias=True)
def create_tags(
    family_id: int,
    tags: List[TagCreate], 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_user_in_family(db, current_user.id, family_id)
    for tag in tags:
        tag.family_id = family_id
    return tag_crud.create_tags(db, tags)


@router.put("/bulk-update",
             response_model=BulkTagResponseOut,
             response_model_by_alias=True)
def update_tags(
    family_id: int,
    tags: List[TagUpdate], 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    response = check_user_can_edit_tags(db, 
                                        user_id=current_user.id, 
                                        tag_ids=[tag.id for tag in tags])
    approved_tags = [tag for tag in tags if str(tag.id) in response.get_success_ids()]
    process_response = tag_crud.update_tags(db, tags=approved_tags)
    process_response.failed.extend(response.failed)
    return process_response


@router.post("/bulk-delete",
             response_model=BulkTagResponseOut,
             response_model_by_alias=True)
def delete_tags(
    family_id: int,
    tag_ids: List[int], 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    response = check_user_can_edit_tags(db, 
                                        user_id=current_user.id,
                                        tag_ids=tag_ids)
    approved_tag_ids = [tag_id for tag_id in tag_ids if str(tag_id) in response.get_success_ids()]
    process_response = tag_crud.delete_tags(db, tag_ids=approved_tag_ids)
    process_response.failed.extend(response.failed)
    return process_response


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
