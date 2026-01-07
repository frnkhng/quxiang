from pydantic import BaseModel

class PresignRequest(BaseModel):
    filename: str
    content_type: str

class PresignResponse(BaseModel):
    upload_url: str
    file_url: str
    key: str
