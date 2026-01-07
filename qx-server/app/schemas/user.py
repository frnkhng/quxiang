from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    role: UserRole
    username: Optional[str] = None
    phone: Optional[str] = None
    store_id: Optional[str] = None
    profile_id: Optional[str] = None

class UserCreate(UserBase):
    password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class OTPRequest(BaseModel):
    phone: str
    store_id: Optional[str] = None

class OTPVerifyRequest(BaseModel):
    phone: str
    code: str
    store_id: Optional[str] = None
