from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlmodel import select

from db.main import get_session
from auth.service import get_current_user
from db.models import User,UserTasteProfile
from leftovers.schemas import (
    LeftoverIngredientBase,
    LeftoverIngredientResponse,
    LeftoverTransformRequest,
    TransformationSuggestion,
    SavedTransformationResponse,
    SaveTransformationRequest,
    
)
from leftovers.service import (
    leftover_service,
    get_leftover_ingredients,
    add_leftover_ingredient,
    delete_leftover_ingredient,
    save_transformation,
    get_saved_transformations,
    get_saved_transformation_by_id,
    delete_saved_transformation
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


@router.post("/transform", response_model=List[TransformationSuggestion])
async def transform_leftovers(
    request: LeftoverTransformRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # Get user taste profile
    result = await session.execute(
        select(UserTasteProfile).where(UserTasteProfile.user_id == current_user.id)
    )
    taste_profile = result.scalar_one_or_none()
    
    # Get leftover ingredients
    leftover_ingredients = await get_leftover_ingredients(session, current_user.id)
    ingredient_names = [item.ingredient_name for item in leftover_ingredients]
    
    if not ingredient_names:
        raise HTTPException(status_code=400, detail="No leftover ingredients found")
    
    # Pass taste_profile to the service
    transformations = await leftover_service.transform_leftovers(
        leftover_ingredients=ingredient_names,
        taste_profile=taste_profile,  # Add this line
        language=request.language
    )
    
    return transformations

@router.post("/save-transformation", response_model=SavedTransformationResponse)
async def save_transformation_idea(
    transformation_data: SaveTransformationRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    try:
        saved_transformation = await save_transformation(
            session, 
            current_user.id, 
            transformation_data
        )
        return saved_transformation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/saved-transformations", response_model=List[SavedTransformationResponse])
async def get_user_saved_transformations(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    transformations = await get_saved_transformations(session, current_user.id)
    return transformations

@router.get("/saved-transformations/{transformation_id}", response_model=SavedTransformationResponse)
async def get_saved_transformation(
    transformation_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    transformation = await get_saved_transformation_by_id(
        session, transformation_id, current_user.id
    )
    if not transformation:
        raise HTTPException(status_code=404, detail="Transformation not found")
    return transformation

@router.delete("/saved-transformations/{transformation_id}")
async def delete_saved_transformation(
    transformation_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    success = await delete_saved_transformation(
        session, transformation_id, current_user.id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Transformation not found")
    return {"message": "Transformation deleted successfully"}

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