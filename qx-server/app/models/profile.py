from sqlalchemy import Column, String, Enum, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False, index=True)
    gender = Column(Enum(Gender), nullable=True)
    birth_date = Column(Date, nullable=True)
    store_id = Column(String(36), ForeignKey("stores.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
