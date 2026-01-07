from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.record import Record
from app.schemas.record import RecordCreate, RecordUpdate, RecordResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[RecordResponse])
def list_records(
    profile_id: Optional[str] = Query(None),
    store_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Record)
    
    if current_user.role == UserRole.CUSTOMER:
        if not current_user.profile_id:
            return []
        query = query.filter(Record.profile_id == current_user.profile_id)
    elif current_user.role == UserRole.STAFF and current_user.store_id:
        query = query.filter(Record.store_id == current_user.store_id)
    
    if profile_id:
        query = query.filter(Record.profile_id == profile_id)
    
    if store_id:
        query = query.filter(Record.store_id == store_id)
    
    records = query.order_by(Record.created_at.desc()).all()
    return records

@router.get("/{record_id}", response_model=RecordResponse)
def get_record(
    record_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(Record).filter(Record.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    if current_user.role == UserRole.CUSTOMER and current_user.profile_id != record.profile_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if current_user.role == UserRole.STAFF and current_user.store_id != record.store_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return record

@router.post("", response_model=RecordResponse)
def create_record(
    record_data: RecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.STAFF, UserRole.HQ]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    record = Record(
        id=str(uuid.uuid4()),
        staff_id=current_user.id,
        store_id=current_user.store_id or "default",
        **record_data.dict()
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return record

@router.put("/{record_id}", response_model=RecordResponse)
def update_record(
    record_id: str,
    record_data: RecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.STAFF, UserRole.HQ]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    record = db.query(Record).filter(Record.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    if current_user.role == UserRole.STAFF and current_user.store_id != record.store_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    for key, value in record_data.dict(exclude_unset=True).items():
        setattr(record, key, value)
    
    db.commit()
    db.refresh(record)
    
    return record

@router.delete("/{record_id}")
def delete_record(
    record_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.HQ]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    record = db.query(Record).filter(Record.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    db.delete(record)
    db.commit()
    
    return {"success": True}
