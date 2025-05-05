from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Optional
from app.models import Tag, Family
from app.schemas.tag import TagCreate, TagUpdate


#
# [C]reate
#
def create_tag(db: Session, tag_in: TagCreate):
    existing = db.query(Tag).filter_by(name=tag_in.name).first()
    if existing:
        return existing  # Or raise 409
    tag = Tag(
        name=tag_in.name,
        family_id=tag_in.family_id,
    )
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


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
