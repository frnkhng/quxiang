from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.conversation import MessageRole

class ChatRequest(BaseModel):
    profile_id: str
    message: str
    conversation_id: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    role: MessageRole
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    message: MessageResponse
    conversation_id: str

class ConversationResponse(BaseModel):
    id: str
    profile_id: str
    messages: List[MessageResponse]
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
