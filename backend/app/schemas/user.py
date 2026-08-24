from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "farmer"
    phone: Optional[str] = None
    farm_name: Optional[str] = None
    primary_crop: Optional[str] = "Wheat"
    state: Optional[str] = "Punjab"
    district: Optional[str] = "Ludhiana"
    latitude: Optional[float] = 30.9010
    longitude: Optional[float] = 75.8573

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
