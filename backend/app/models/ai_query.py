# -*- coding: utf-8 -*-

from sqlalchemy import (
    Column, Integer, String, JSON,
    ForeignKey, Float, UniqueConstraint, DateTime,
    func
)
from sqlalchemy.orm import Session, relationship
from pgvector.sqlalchemy import Vector
from .base import Base, LogicalDeleteMixin
from enum import Enum


class AIQueryStatus(str, Enum):
    PENDING = "PENDING"
    PARSING = "PARSING"
    MATCHING = "MATCHING"
    TAGGING = "TAGGING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class LLMQueryType(str, Enum):
    PARSING = "PARSING"
    MATCHING = "MATCHING"
    TAGGING = "TAGGING"
    UNKNOWN = "UNKNOWN"


class AIQuerySession(Base):
    __tablename__ = 'ai_query_sessions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    raw_input = Column(String, nullable=False)
    final_output = Column(JSON, nullable=True)

    status = Column(String, nullable=False, default=AIQueryStatus.PENDING)
    status_updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    llm_logs = relationship('LLMLogs', back_populates='session')


class LLMLogs(Base):
    __tablename__ = 'llm_logs'

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey('ai_query_sessions.id'), nullable=False)
    query_type = Column(LLMQueryType, nullable=False, default=LLMQueryType.UNKNOWN)
    content_user = Column(String, nullable=False)
    output_structure = Column(JSON, nullable=True)
    model_version = Column(String, nullable=False)
    token_usage = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    session = relationship('AIQuerySession', back_populates='llm_logs')
