from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Store(Base):
    __tablename__ = "stores"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(200), nullable=False)
    address = Column(String(500), nullable=True)
    phone = Column(String(20), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
