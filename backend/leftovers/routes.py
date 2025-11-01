from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from db.main import get_session
from auth.service import get_current_user
from db.models import User
from leftovers.schemas import (
    LeftoverIngredientBase,
    LeftoverIngredientResponse,
    LeftoverTransformRequest,
    TransformationSuggestion
)
from leftovers.service import (
    leftover_service,
    get_leftover_ingredients,
    add_leftover_ingredient,
    delete_leftover_ingredient
)

router = APIRouter()

@router.get("/ingredients", response_model=List[LeftoverIngredientResponse])
async def get_user_leftover_ingredients(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    leftovers = await get_leftover_ingredients(session, current_user.id)
    return leftovers

@router.post("/ingredients", response_model=LeftoverIngredientResponse)
async def add_new_leftover_ingredient(
    leftover_data: LeftoverIngredientBase,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    leftover = await add_leftover_ingredient(session, current_user.id, leftover_data)
    return leftover

# @router.post("/transform", response_model=List[TransformationSuggestion])
# async def transform_leftovers(
#     request: LeftoverTransformRequest,
#     current_user: User = Depends(get_current_user),
#     session: AsyncSession = Depends(get_session)
# ):
#     try:
#         transformations = await leftover_service.transform_leftovers(
#             request.leftover_ingredients,
#             request.language
#         )
#         return transformations
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
@router.post("/transform", response_model=List[TransformationSuggestion])
async def transform_leftovers(
    request: LeftoverTransformRequest,  # Remove this - we don't need user input
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    try:
        # Get leftover ingredients FROM DATABASE instead of request
        leftovers = await get_leftover_ingredients(session, current_user.id)
        
        # Extract just the ingredient names for the AI
        leftover_names = [f"{item.ingredient_name} ({item.quantity})" for item in leftovers]
        
        if not leftover_names:
            raise HTTPException(status_code=400, detail="No leftover ingredients found")
        
        transformations = await leftover_service.transform_leftovers(
            leftover_names,  # Use database leftovers
            request.language
        )
        return transformations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/ingredients/{leftover_id}")
async def delete_leftover_ingredient_by_id(
    leftover_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    success = await delete_leftover_ingredient(session, leftover_id, current_user.id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Leftover ingredient not found")
    
    return {"message": "Leftover ingredient deleted successfully"}