# -*- coding=utf-8 -*-

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Session
from enum import Enum

from app.core.time_utils import get_now


Base = declarative_base()


class LogicalDeleteMixin:
    is_active = Column(Boolean, default=True)
    deleted_at = Column(DateTime, nullable=True)
    deleted_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    deleted_note = Column(String, nullable=True)

    @classmethod
    def active(cls, db: Session):
        return db.query(cls).filter(cls.is_active == True)
    
    @classmethod
    def inactive(cls, db: Session):
        return db.query(cls).filter(cls.is_active == False)

    def deactivate(self, deleted_by: int, note: str = None):
        if self.is_active:
            self.is_active = False
            self.deleted_at = get_now()
            self.deleted_by = deleted_by
            self.deleted_note = note

    def revive(self):
        self.is_active = True
        self.deleted_at = None
        self.deleted_by = None
        self.deleted_note = None


class CancelStatus(str, Enum):
    ACTIVE = "ACTIVE"
    CANCELLED = "CANCELLED"



class CancellableMixin:
    status = Column(SQLEnum(CancelStatus, name="cancel_status"), 
                    default=CancelStatus.ACTIVE)
    cancelled_at = Column(DateTime, nullable=True)
    cancel_reason = Column(String, nullable=True)

    @classmethod
    def active(cls, db: Session):
        return db.query(cls).filter(cls.status == CancelStatus.ACTIVE)
    
    @classmethod
    def inactive(cls, db: Session):
        return db.query(cls).filter(cls.status == CancelStatus.CANCELLED)

    def cancel(self, reason: str = None):
        if self.status != "CANCELLED":
            self.status = "CANCELLED"
            self.cancelled_at = get_now()
            self.cancel_reason = reason
    
    def revive(self):
        self.status = "ACTIVE"
        self.cancelled_at = None
        self.cancel_reason = None

