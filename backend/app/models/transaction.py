# -*- coding: utf-8 -*-

from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy import func, case
from typing import List

from .base import Base, CancellableMixin
from app.core.time_utils import get_now

class Transaction(Base, CancellableMixin):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    change_type = Column(String, nullable=False)  # "ADD" / "REMOVE"
    quantity = Column(Float, nullable=False)
    # unit = Column(String, nullable=False)
    # location = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    raw_input = Column(String, nullable=True)
    timestamp = Column(DateTime, default=get_now())
    # status = Column(String, default="CONFIRMED")

    item = relationship("Item", back_populates="transactions")
    user = relationship("User", back_populates="transactions")
    # family = relationship("Family", back_populates="transactions")

    @classmethod
    def sum_quantity_by_item_ids(cls, db: Session, item_ids: List[int]):
        results = (
            cls.active(db).filter(
                cls.item_id.in_(item_ids)
            ).with_entities(
                cls.item_id,
                func.sum(
                    case(
                        (cls.change_type == "ADD", cls.quantity),
                        (cls.change_type == "REMOVE", -cls.quantity),
                        else_=0.0
                    )
                ).label("current_quantity")
            )
        ).group_by(cls.item_id).all()
        return {item_id: qty or 0.0 for item_id, qty in results}
