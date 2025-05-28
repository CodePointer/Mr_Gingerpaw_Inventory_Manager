from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.models.item import get_unique_locations
from app.models import Item

router = APIRouter(prefix="/families/{fid}/locations", tags=["Locations"])

# @router.get("/", summary="获取家庭下所有唯一 location")
# def list_locations(fid: int, db: Session = Depends(get_db)):
#     locations = get_unique_locations(db, family_id=fid)
#     return [{"location": loc, "itemCount": count} for loc, count in locations]

# @router.get("/items", summary="按 location 筛选物品")
# def list_items_by_location(fid: int, location: str, db: Session = Depends(get_db)):
#     items = db.query(Item).filter(Item.family_id == fid, Item.location == location).all()
#     return items
