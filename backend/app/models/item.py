# -*- coding: utf-8 -*-


from sqlalchemy import Column, Integer, String, ForeignKey, Float, UniqueConstraint, DateTime
from sqlalchemy.orm import Session, relationship
from .base import Base, LogicalDeleteMixin

class Item(Base, LogicalDeleteMixin):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    unit = Column(String, nullable=False, default='pcs')
    quantity = Column(Float, nullable=False, default=0.0)
    location = Column(String, nullable=True)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    check_interval_days = Column(Integer, nullable=True)
    last_checked_date = Column(DateTime, nullable=True)
    notes = Column(String, nullable=True)
    raw_input = Column(String, nullable=True)

    __table_args__ = (
        UniqueConstraint("name", "unit", "location", "family_id", "owner_id", name="_item_uc"),
    )

    family = relationship("Family", back_populates="items")
    owner = relationship("User", back_populates="items", foreign_keys=[owner_id])
    transactions = relationship("Transaction", back_populates="item")
    tags = relationship("Tag", secondary="item_tags", back_populates="items")

    @classmethod
    def find_by_unique(cls, 
                       db: Session,
                       name: String,
                       unit: String,
                       location: String,
                       family_id: Integer,
                       owner_id: Integer,
                       is_active: bool = None):
        if is_active == True:
            query = cls.active(db)
        elif is_active == False:
            query = cls.inactive(db)
        else:
            query = db.query(cls)
        return query.filter_by(
            name=name,
            unit=unit,
            location=location,
            family_id=family_id,
            owner_id=owner_id
        ).first()
        

