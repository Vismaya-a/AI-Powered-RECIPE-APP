from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    preferred_language: str = "en"

    # @validator('password')
    # def validate_password_length(cls, v):
    #     if len(v) < 6:
    #         raise ValueError('Password must be at least 6 characters')
    #     if len(v.encode('utf-8')) > 72:
    #         raise ValueError('Password must be less than 72 bytes when encoded')
    #     return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    preferred_language: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None