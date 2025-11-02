# # Add this to recipes/routes.py or create dashboard/routes.py
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlmodel import select, func
# from db.main import get_session
# from auth.service import get_current_user
# from db.models import User, PantryItem, SavedRecipe, LeftoverIngredient
# from recipes.service import recipe_service

# router = APIRouter()

# @router.get("/stats")
# async def get_dashboard_stats(
#     current_user: User = Depends(get_current_user),
#     session: AsyncSession = Depends(get_session)
# ):
#     try:
#         # Get pantry items count
#         pantry_result = await session.execute(
#             select(func.count(PantryItem.id)).where(PantryItem.user_id == current_user.id)
#         )
#         pantry_items_count = pantry_result.scalar() or 0

#         # Get saved recipes count
#         recipes_result = await session.execute(
#             select(func.count(SavedRecipe.id)).where(SavedRecipe.user_id == current_user.id)
#         )
#         saved_recipes_count = recipes_result.scalar() or 0

#         # Get leftover ingredients count
#         leftovers_result = await session.execute(
#             select(func.count(LeftoverIngredient.id)).where(LeftoverIngredient.user_id == current_user.id)
#         )
#         leftover_items_count = leftovers_result.scalar() or 0

#         # For recipes generated count, you might need to track this separately
#         # For now, we'll use saved recipes count or create a separate counter
#         recipes_generated_count = saved_recipes_count  # Adjust based on your logic

#         return {
#             "pantry_items_count": pantry_items_count,
#             "saved_recipes_count": saved_recipes_count,
#             "recipes_generated_count": recipes_generated_count,
#             "leftover_items_count": leftover_items_count
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
# dashboard/routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func
from db.main import get_session
from auth.service import get_current_user
from db.models import User, PantryItem, SavedRecipe, LeftoverIngredient

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    try:
        # Get pantry items count
        pantry_result = await session.execute(
            select(func.count(PantryItem.id)).where(PantryItem.user_id == current_user.id)
        )
        pantry_items_count = pantry_result.scalar() or 0

        # Get saved recipes count
        recipes_result = await session.execute(
            select(func.count(SavedRecipe.id)).where(SavedRecipe.user_id == current_user.id)
        )
        saved_recipes_count = recipes_result.scalar() or 0

        # Get leftover ingredients count
        leftovers_result = await session.execute(
            select(func.count(LeftoverIngredient.id)).where(LeftoverIngredient.user_id == current_user.id)
        )
        leftover_items_count = leftovers_result.scalar() or 0

        # For recipes generated count, we'll use saved recipes count for now
        # You might want to track this separately in the future
        recipes_generated_count = saved_recipes_count

        return {
            "pantry_items_count": pantry_items_count,
            "saved_recipes_count": saved_recipes_count,
            "recipes_generated_count": recipes_generated_count,
            "leftover_items_count": leftover_items_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))