from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.record import RecordType

class RecordBase(BaseModel):
    profile_id: str
    type: RecordType
    title: str
    content: str
    images: Optional[List[str]] = None

class RecordCreate(RecordBase):
    pass

class RecordUpdate(BaseModel):
    type: Optional[RecordType] = None
    title: Optional[str] = None
    content: Optional[str] = None
    images: Optional[List[str]] = None

class RecordResponse(RecordBase):
    id: str
    staff_id: str
    store_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
