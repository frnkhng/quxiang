from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User
from app.schemas.upload import PresignRequest, PresignResponse
from app.api.deps import get_current_user
import uuid

router = APIRouter()

@router.post("/presign", response_model=PresignResponse)
def get_presigned_url(
    request: PresignRequest,
    current_user: User = Depends(get_current_user)
):
    file_key = f"uploads/{current_user.id}/{uuid.uuid4()}/{request.filename}"
    
    upload_url = f"https://mock-upload.example.com/{file_key}"
    file_url = f"https://mock-cdn.example.com/{file_key}"
    
    return PresignResponse(
        upload_url=upload_url,
        file_url=file_url,
        key=file_key
    )
