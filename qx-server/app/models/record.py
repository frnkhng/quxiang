from sqlalchemy import Column, String, Enum, Text, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class RecordType(str, enum.Enum):
    detection = "detection"
    service = "service"

class Record(Base):
    __tablename__ = "records"
    
    id = Column(String(36), primary_key=True)
    profile_id = Column(String(36), ForeignKey("profiles.id"), nullable=False, index=True)
    type = Column(Enum(RecordType), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    images = Column(JSON, nullable=True)
    staff_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    store_id = Column(String(36), ForeignKey("stores.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
