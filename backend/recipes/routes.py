from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from db.main import get_session
from auth.service import get_current_user
from db.models import User, SavedRecipe
from recipes.schemas import (
    RecipeGenerationRequest, 
    RecipeResponse, 
    RecipeSave,
    SavedRecipeResponse,
    PantrySuggestionRequest,
    SuggestionResponse
)
from recipes.service import recipe_service, save_recipe, get_saved_recipes

router = APIRouter()

@router.post("/generate", response_model=RecipeResponse)
async def generate_recipe(
    request: RecipeGenerationRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    try:
        recipe = await recipe_service.generate_recipe(request, current_user, session)
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggest-from-pantry", response_model=List[SuggestionResponse])
async def suggest_from_pantry(
    request: PantrySuggestionRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    try:
        suggestions = await recipe_service.generate_pantry_suggestions(request, current_user, session)
        return suggestions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.post("/save", response_model=SavedRecipeResponse)
# async def save_user_recipe(
#     recipe_data: RecipeSave,
#     current_user: User = Depends(get_current_user),
#     session: AsyncSession = Depends(get_session)
# ):
#     recipe = await save_recipe(session, current_user.id, recipe_data.dict())
#     return recipe

@router.get("/saved", response_model=List[SavedRecipeResponse])
async def get_user_saved_recipes(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    recipes = await get_saved_recipes(session, current_user.id)
    return recipes
@router.post("/save-generated", response_model=SavedRecipeResponse)
async def save_generated_recipe(
    generated_recipe: RecipeResponse,  # Receive the generated recipe data
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Save a previously generated recipe that the user liked"""
    try:
        # Convert the generated recipe to save format
        save_data = {
            "recipe_title": generated_recipe.title,
            "recipe_data": generated_recipe.dict(),  # Save entire generated recipe
            "ingredients": [ingredient.name for ingredient in generated_recipe.ingredients],
            "dietary_tags": generated_recipe.tags,
            "cooking_time": generated_recipe.cooking_time,
            "difficulty_level": generated_recipe.difficulty
        }
        
        saved_recipe = await save_recipe(session, current_user.id, save_data)
        return saved_recipe
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))