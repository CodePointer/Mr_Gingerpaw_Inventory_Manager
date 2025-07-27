# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from .base import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    embedding = Column(Vector(1536), nullable=True)

    family = relationship("Family", back_populates="tags")
    items = relationship("Item", secondary="item_tags", back_populates="tags")

    __table_args__ = (
        UniqueConstraint("name", "family_id", name="_tag_uc_family_scope"),
    )

    def get_embedding_text(self) -> str:
        '''Get a string representation of the tag for embedding.'''
        return self.name.replace('\n', ' ').replace('\r', ' ')
