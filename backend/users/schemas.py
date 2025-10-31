from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TasteProfileBase(BaseModel):
    likes: List[str] = []
    dislikes: List[str] = []
    dietary_preferences: List[str] = []
    allergies: List[str] = []
    spice_level: int = 2
    oil_preference: str = "moderate"
    cooking_time_preference: Optional[int] = None

class TasteProfileUpdate(BaseModel):
    likes: Optional[List[str]] = None
    dislikes: Optional[List[str]] = None
    dietary_preferences: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    spice_level: Optional[int] = None
    oil_preference: Optional[str] = None
    cooking_time_preference: Optional[int] = None

class TasteProfileResponse(TasteProfileBase):
    user_id: int
    updated_at: datetime

class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    preferred_language: str
    created_at: datetime
    taste_profile: Optional[TasteProfileResponse] = None
    
    class Config:
        from_attributes = True