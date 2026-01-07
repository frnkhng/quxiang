from sqlalchemy import Column, String, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    HQ = "HQ"
    STAFF = "STAFF"
    CUSTOMER = "CUSTOMER"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True)
    role = Column(Enum(UserRole), nullable=False)
    username = Column(String(100), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    phone = Column(String(20), unique=True, nullable=True)
    store_id = Column(String(36), ForeignKey("stores.id"), nullable=True)
    profile_id = Column(String(36), ForeignKey("profiles.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
