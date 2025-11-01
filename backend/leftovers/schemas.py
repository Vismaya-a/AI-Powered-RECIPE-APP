from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LeftoverIngredientBase(BaseModel):
    ingredient_name: str
    quantity: Optional[str] = None
    state: str 



class LeftoverIngredientResponse(LeftoverIngredientBase):
    id: int
    
    class Config:
        from_attributes = True

class LeftoverTransformRequest(BaseModel):
    language: str 

class TransformationSuggestion(BaseModel):
    title: str
    description: str
    transformation_idea: str
    used_leftovers: List[str]
    additional_ingredients: List[str]
    cooking_time: int
    difficulty: str