

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from db.main import get_session
from auth.service import get_current_user
from db.models import User, SavedRecipe
from recipes.schemas import (
    RecipeGenerationRequest, 
    RecipeResponse, 
    SavedRecipeResponse,
    PantrySuggestionRequest,
    PantryRecipeResponse
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

@router.post("/suggest-from-pantry", response_model=List[PantryRecipeResponse])
async def suggest_from_pantry(
    request: PantrySuggestionRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    try:
        recipes = await recipe_service.generate_pantry_suggestions(
            request,
            current_user, 
            session
        )
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/saved", response_model=List[SavedRecipeResponse])
async def get_user_saved_recipes(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    recipes = await get_saved_recipes(session, current_user.id)
    return recipes

@router.post("/save-generated", response_model=SavedRecipeResponse)
async def save_generated_recipe(
    generated_recipe: RecipeResponse,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    try:
        save_data = {
            "recipe_title": generated_recipe.title,
            "recipe_data": generated_recipe.dict(),
            "ingredients": [ingredient.name for ingredient in generated_recipe.ingredients],
            "dietary_tags": generated_recipe.tags,
            "cooking_time": generated_recipe.cooking_time,
            "difficulty_level": generated_recipe.difficulty
        }
        
        saved_recipe = await save_recipe(session, current_user.id, save_data)
        return saved_recipe
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))