from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LeftoverIngredientBase(BaseModel):
    ingredient_name: str
    quantity: Optional[str] = None
    state: str = "fresh"

class LeftoverIngredientResponse(LeftoverIngredientBase):
    id: int
    
    class Config:
        from_attributes = True

class LeftoverTransformRequest(BaseModel):
    language: str = "en"

class TransformationSuggestion(BaseModel):
    title: str
    description: str
    transformation_idea: str
    used_leftovers: List[str]
    additional_ingredients: List[str]
    cooking_time: int
    difficulty: str

class SavedTransformationResponse(BaseModel):
    id: int
    title: str
    description: str
    transformation_idea: str
    used_leftovers: List[str]
    additional_ingredients: List[str]
    cooking_time: int
    difficulty: str
    language: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class SaveTransformationRequest(BaseModel):
    title: str
    description: str
    transformation_idea: str
    used_leftovers: List[str]
    additional_ingredients: List[str]
    cooking_time: int
    difficulty: str
    language: str