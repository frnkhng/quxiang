from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid
import random

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_session_token
from app.models.user import User, UserRole
from app.models.profile import Profile
from app.models.otp import OTP
from app.schemas.user import LoginRequest, OTPRequest, OTPVerifyRequest, UserResponse
from app.api.deps import get_current_user, get_optional_user

router = APIRouter()

@router.post("/login")
def login(
    request: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    session_token = create_session_token({"sub": user.id})
    response.set_cookie(
        key="session",
        value=session_token,
        httponly=True,
        max_age=30 * 24 * 60 * 60,
        samesite="lax"
    )
    
    return UserResponse.from_orm(user)

@router.post("/otp/request")
def request_otp(
    request: OTPRequest,
    db: Session = Depends(get_db)
):
    code = str(random.randint(100000, 999999))
    
    otp = OTP(
        id=str(uuid.uuid4()),
        phone=request.phone,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.add(otp)
    db.commit()
    
    print(f"OTP for {request.phone}: {code}")
    
    return {"success": True, "message": "OTP sent"}

@router.post("/otp/verify")
def verify_otp(
    request: OTPVerifyRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    otp = db.query(OTP).filter(
        OTP.phone == request.phone,
        OTP.code == request.code,
        OTP.verified == False,
        OTP.expires_at > datetime.utcnow()
    ).first()
    
    if not otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    otp.verified = True
    db.commit()
    
    user = db.query(User).filter(User.phone == request.phone).first()
    
    if not user:
        profile = db.query(Profile).filter(Profile.phone == request.phone).first()
        
        if not profile and request.store_id:
            profile = Profile(
                id=str(uuid.uuid4()),
                name=f"Customer {request.phone[-4:]}",
                phone=request.phone,
                store_id=request.store_id
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
        
        user = User(
            id=str(uuid.uuid4()),
            role=UserRole.CUSTOMER,
            phone=request.phone,
            profile_id=profile.id if profile else None,
            store_id=request.store_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    session_token = create_session_token({"sub": user.id})
    response.set_cookie(
        key="session",
        value=session_token,
        httponly=True,
        max_age=30 * 24 * 60 * 60,
        samesite="lax"
    )
    
    return UserResponse.from_orm(user)

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm(current_user)

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="session")
    return {"success": True}
