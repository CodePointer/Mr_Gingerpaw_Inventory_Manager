# -*- coding = utf-8 -*-

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base, LogicalDeleteMixin


class Family(Base, LogicalDeleteMixin):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    notes = Column(String, nullable=True)

    memberships = relationship("Membership", back_populates="family", cascade="all, delete-orphan")
    items = relationship("Item", back_populates="family")
    # transactions = relationship("Transaction", back_populates="family")
    tags = relationship("Tag", back_populates="family")
