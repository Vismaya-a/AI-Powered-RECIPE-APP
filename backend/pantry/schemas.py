from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PantryItemBase(BaseModel):
    ingredient_name: str
    quantity: Optional[str] = None
    unit: Optional[str] = None
    expiry_date: Optional[datetime] = None
    category: Optional[str] = None

class PantryItemCreate(PantryItemBase):
    pass

class PantryItemResponse(PantryItemBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class PantryBulkUpdate(BaseModel):
    items: List[PantryItemCreate]