# from pydantic import BaseModel
# from typing import List, Optional, Dict, Any,Union
# from datetime import datetime

# class RecipeGenerationRequest(BaseModel):
#     theme: str
#     language: str 
#     use_pantry: bool = False

# class Ingredient(BaseModel):
#     name: str
#     quantity: str
#     unit: str

# class NutritionInfo(BaseModel):
#     calories: str
#     protein: str
#     carbs: str
#     fat: str

# class RecipeResponse(BaseModel):
#     title: str
#     description: str
#     ingredients: List[Ingredient]
#     instructions: List[str]
#     cooking_time:Optional[str]
#     difficulty: str
#     nutrition_info: NutritionInfo
#     tags: List[str]
#     servings: Optional[int] = 4

# class RecipeSave(BaseModel):
#     recipe_title: str
#     recipe_data: Dict[str, Any]
#     ingredients: List[str]
#     dietary_tags: List[str] = []
#     cooking_time: Optional[str] = None
#     difficulty_level: Optional[str] = None

# class SavedRecipeResponse(BaseModel):
#     id: int
#     recipe_title: str
#     recipe_data: Dict[str, Any]
#     ingredients: List[str]
#     dietary_tags: List[str]
#     cooking_time: Optional[str]
#     difficulty_level: Optional[str]
#     created_at: datetime
    
#     class Config:
#         from_attributes = True

# class PantrySuggestionRequest(BaseModel):
#     language: str 

# # class SuggestionResponse(BaseModel):
# #     title: str
# #     description: str
# #     used_ingredients: List[str]
# #     missing_ingredients: List[str]
# #     cooking_time: int
# #     difficulty: str
# class PantryRecipeResponse(BaseModel):
#     title: str
#     description: str
#     ingredients: List[Ingredient]  # Full ingredient details
#     instructions: List[str]        # Full instructions
#     cooking_time: str
#     difficulty: str
#     nutrition_info: NutritionInfo
#     tags: List[str]
#     servings: Optional[int] = 4
#     used_pantry_ingredients: List[str]  # Which pantry items were used
#     missing_ingredients: List[str]      
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class RecipeGenerationRequest(BaseModel):
    theme: str
    language: str 
    use_pantry: bool = False

class Ingredient(BaseModel):
    name: str
    quantity: str
    unit: str

class NutritionInfo(BaseModel):
    calories: str
    protein: str
    carbs: str
    fat: str

class RecipeResponse(BaseModel):
    title: str
    description: str
    ingredients: List[Ingredient]
    instructions: List[str]
    cooking_time: Optional[str]
    difficulty: str
    nutrition_info: NutritionInfo
    tags: List[str]
    servings: Optional[int] = 4

class RecipeSave(BaseModel):
    recipe_title: str
    recipe_data: Dict[str, Any]
    ingredients: List[str]
    dietary_tags: List[str] = []
    cooking_time: Optional[str] = None
    difficulty_level: Optional[str] = None

class SavedRecipeResponse(BaseModel):
    id: int
    recipe_title: str
    recipe_data: Dict[str, Any]
    ingredients: List[str]
    dietary_tags: List[str]
    cooking_time: Optional[str]
    difficulty_level: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class PantrySuggestionRequest(BaseModel):
    language: str 

class PantryRecipeResponse(BaseModel):
    title: str
    description: str
    ingredients: List[Ingredient]
    instructions: List[str]
    cooking_time: str
    difficulty: str
    nutrition_info: NutritionInfo
    tags: List[str]
    servings: Optional[int] = 4
    used_pantry_ingredients: List[str]
    missing_ingredients: List[str]