from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Optional
from app.models import Tag, Family
from app.schemas.tag import TagCreate, TagUpdate, BulkTagResponseOut, TagStatus


#
# [C]reate
#
def create_tag(db: Session, tag_in: TagCreate):
    existing = db.query(Tag).filter_by(name=tag_in.name).first()
    if existing:
        raise(HTTPException(status_code=409, detail="Tag already exists"))
    tag = Tag(
        name=tag_in.name,
        family_id=tag_in.family_id,
    )
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


def create_tags(db: Session, tags: List[TagCreate]):
    response = BulkTagResponseOut(success=[], failed=[])
    for tag_in in tags:
        response_tag = TagStatus(tagId=str(tag_in.id))
        try:
            create_tag(db, tag_in)
            response.success.append(response_tag)
        except HTTPException as e:
            response_tag.status = e.detail
            response_tag.code = e.status_code
            response.failed.append(response_tag)
    return response


#
# [R]ead
#
def get_tag_by_id(db: Session, tag_id: int) -> Optional[Tag]:
    tag = db.query(Tag).filter_by(id=tag_id).first()
    return tag

def get_tags_by_ids(db: Session, tag_ids: List[int]) -> List[Tag]:
    return db.query(Tag).filter(Tag.id.in_(tag_ids)).all()

def get_family_tags(db: Session, family_id: int) -> List[Tag]:
    family = Family.active(db).filter(Family.id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family.tags

#
# [U]pdate
#
def update_tag(db: Session, tag_id: int, tag_up: TagUpdate):
    tag = get_tag_by_id(db, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    tag.name = tag_up.name
    db.commit()
    db.refresh(tag)
    return tag


def update_tags(db: Session, tags: List[TagUpdate]) -> BulkTagResponseOut:
    response = BulkTagResponseOut(success=[], failed=[])
    for tag_up in tags:
        response_tag = TagStatus(tagId=str(tag_up.id))
        try:
            update_tag(db, tag_up.id, tag_up)
            response.success.append(response_tag)
        except HTTPException as e:
            response_tag.status = e.detail
            response_tag.code = e.status_code
            response.failed.append(response_tag)
    return response

#
# [D]elete
#
def delete_tag(db: Session, tag_id: int):
    tag = db.query(Tag).filter_by(id=tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    for item in tag.items:
        item.tags.remove(tag)
    
    db.delete(tag)
    db.commit()
    return tag


def delete_tags(db: Session, tag_ids: List[int]) -> BulkTagResponseOut:
    response = BulkTagResponseOut(success=[], failed=[])
    for tag_id in tag_ids:
        response_tag = TagStatus(tagId=str(tag_id))
        try:
            delete_tag(db, tag_id)
            response.success.append(response_tag)
        except HTTPException as e:
            response_tag.status = e.detail
            response_tag.code = e.status_code
            response.failed.append(response_tag)
    return response
