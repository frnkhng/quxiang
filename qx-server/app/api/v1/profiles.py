from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[ProfileResponse])
def list_profiles(
    store_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Profile)
    
    if current_user.role == UserRole.STAFF and current_user.store_id:
        query = query.filter(Profile.store_id == current_user.store_id)
    elif store_id:
        query = query.filter(Profile.store_id == store_id)
    
    if search:
        query = query.filter(
            (Profile.name.contains(search)) | (Profile.phone.contains(search))
        )
    
    profiles = query.all()
    return profiles

@router.get("/{profile_id}", response_model=ProfileResponse)
def get_profile(
    profile_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if current_user.role == UserRole.CUSTOMER and current_user.profile_id != profile_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if current_user.role == UserRole.STAFF and current_user.store_id != profile.store_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return profile

@router.post("", response_model=ProfileResponse)
def create_profile(
    profile_data: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.STAFF, UserRole.HQ]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    profile = Profile(
        id=str(uuid.uuid4()),
        **profile_data.dict()
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return profile

@router.put("/{profile_id}", response_model=ProfileResponse)
def update_profile(
    profile_id: str,
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if current_user.role == UserRole.CUSTOMER and current_user.profile_id != profile_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if current_user.role == UserRole.STAFF and current_user.store_id != profile.store_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    
    return profile

@router.delete("/{profile_id}")
def delete_profile(
    profile_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.HQ]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    db.delete(profile)
    db.commit()
    
    return {"success": True}
