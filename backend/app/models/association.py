# -*- encoding: utf-8 -*-

from sqlalchemy import Table, Column, ForeignKey
from .base import Base


item_tags = Table(
    "item_tags",
    Base.metadata,
    Column("item_id", ForeignKey("items.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)
