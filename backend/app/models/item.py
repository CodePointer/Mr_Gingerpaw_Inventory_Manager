# -*- coding: utf-8 -*-

from sqlalchemy import (
    Column, Integer, String, 
    ForeignKey, Float, UniqueConstraint, DateTime,
    func
)
from sqlalchemy.orm import Session, relationship
from pgvector.sqlalchemy import Vector
from .base import Base, LogicalDeleteMixin

class Item(Base, LogicalDeleteMixin):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    unit = Column(String, nullable=False, default='pcs')
    quantity = Column(Float, nullable=False, default=0.0)
    location = Column(String, nullable=True)
    family_id = Column(Integer, ForeignKey('families.id'), nullable=False)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    check_interval_days = Column(Integer, nullable=True)
    last_checked_date = Column(DateTime, nullable=True)
    restock_threshold = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    raw_input = Column(String, nullable=True)
    embedding = Column(Vector(1536), nullable=True)

    family = relationship('Family', back_populates='items')
    owner = relationship('User', back_populates='items', foreign_keys=[owner_id])
    transactions = relationship('Transaction', back_populates='item')
    tags = relationship('Tag', secondary='item_tags', back_populates='items')

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
    
    def get_embedding_text(self) -> str:
        '''Get a string representation of the item for embedding.'''
        tag_names = ','.join([tag.name for tag in self.tags])
        value_list = [
            self.name,
            self.unit,
            self.location,
            self.notes if self.notes else 'None',
            'None' if tag_names == '' else tag_names
        ]
        text = '|||'.join(value_list)
        return text.replace('\n', ' ').replace('\r', ' ')


def get_unique_locations(db: Session, family_id: int):
    return (
        Item.active(db)
        .filter(Item.family_id == family_id)
        .with_entities(Item.location, func.count(Item.id))
        .group_by(Item.location)
        .all()
    )
