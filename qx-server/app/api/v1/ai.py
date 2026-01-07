from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.conversation import Conversation, Message, MessageRole
from app.schemas.ai import ChatRequest, ChatResponse, ConversationResponse, MessageResponse
from app.api.deps import get_current_user

router = APIRouter()

def mock_ai_response(message: str) -> str:
    return f"这是一个模拟的AI回复。您说：{message}。在实际部署中，这里会调用真实的AI服务。"

@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == UserRole.CUSTOMER and current_user.profile_id != request.profile_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    conversation = None
    if request.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == request.conversation_id
        ).first()
    
    if not conversation:
        conversation = Conversation(
            id=str(uuid.uuid4()),
            profile_id=request.profile_id
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    user_message = Message(
        id=str(uuid.uuid4()),
        conversation_id=conversation.id,
        role=MessageRole.user,
        content=request.message
    )
    db.add(user_message)
    db.commit()
    
    ai_content = mock_ai_response(request.message)
    
    ai_message = Message(
        id=str(uuid.uuid4()),
        conversation_id=conversation.id,
        role=MessageRole.assistant,
        content=ai_content
    )
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    
    return ChatResponse(
        message=MessageResponse.from_orm(ai_message),
        conversation_id=conversation.id
    )

@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(
    profile_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == UserRole.CUSTOMER and current_user.profile_id != profile_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    conversations = db.query(Conversation).filter(
        Conversation.profile_id == profile_id
    ).all()
    
    result = []
    for conv in conversations:
        messages = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(Message.created_at).all()
        
        result.append(ConversationResponse(
            id=conv.id,
            profile_id=conv.profile_id,
            messages=[MessageResponse.from_orm(m) for m in messages],
            created_at=conv.created_at,
            updated_at=conv.updated_at
        ))
    
    return result

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if current_user.role == UserRole.CUSTOMER and current_user.profile_id != conversation.profile_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at).all()
    
    return ConversationResponse(
        id=conversation.id,
        profile_id=conversation.profile_id,
        messages=[MessageResponse.from_orm(m) for m in messages],
        created_at=conversation.created_at,
        updated_at=conversation.updated_at
    )
