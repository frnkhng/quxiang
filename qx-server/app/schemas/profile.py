from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from app.models.profile import Gender

class ProfileBase(BaseModel):
    name: str
    phone: str
    gender: Optional[Gender] = None
    birth_date: Optional[date] = None
    store_id: str

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[Gender] = None
    birth_date: Optional[date] = None

class ProfileResponse(ProfileBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
