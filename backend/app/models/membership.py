# -*- coding: utf-8 -*-


from sqlalchemy import Column, Integer, ForeignKey, String, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from .base import Base

class Membership(Base):
    __tablename__ = "memberships"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    role = Column(String, nullable=False)  # "adult" / "child"

    __table_args__ = (
        PrimaryKeyConstraint('user_id', 'family_id'),
    )

    user = relationship("User", back_populates="memberships")
    family = relationship("Family", back_populates="memberships")
