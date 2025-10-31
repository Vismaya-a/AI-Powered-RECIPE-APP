from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LeftoverIngredientBase(BaseModel):
    ingredient_name: str
    quantity: Optional[str] = None
    state: str = "fresh"

class LeftoverIngredientCreate(LeftoverIngredientBase):
    created_from_recipe: Optional[int] = None

class LeftoverIngredientResponse(LeftoverIngredientBase):
    id: int
    user_id: int
    created_from_recipe: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class LeftoverTransformRequest(BaseModel):
    leftover_ingredients: List[str]
    language: str = "en"

class TransformationSuggestion(BaseModel):
    title: str
    description: str
    transformation_idea: str
    used_leftovers: List[str]
    additional_ingredients: List[str]
    cooking_time: int
    difficulty: str