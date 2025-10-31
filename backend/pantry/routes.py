from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from db.main import get_session
from auth.service import get_current_user
from db.models import User
from pantry.schemas import (
    PantryItemCreate, 
    PantryItemResponse, 
    PantryBulkUpdate,
    
)
from pantry.service import (
    get_pantry_items, 
    add_pantry_item, 
    bulk_update_pantry,
    delete_pantry_item,
    bulk_add_pantry_items
)

router = APIRouter()

@router.get("/items", response_model=List[PantryItemResponse])
async def get_user_pantry_items(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    items = await get_pantry_items(session, current_user.id)
    return items

@router.post("/items", response_model=PantryItemResponse)
async def add_new_pantry_item(
    item_data: PantryItemCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    item = await add_pantry_item(session, current_user.id, item_data)
    return item

@router.put("/items/bulk", response_model=List[PantryItemResponse])
async def bulk_update_pantry_items(
    update_data: PantryBulkUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    items = await bulk_update_pantry(session, current_user.id, update_data.items)
    return items

@router.delete("/items/{item_id}")
async def delete_pantry_item_by_id(
    item_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    success = await delete_pantry_item(session, item_id, current_user.id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    
    return {"message": "Pantry item deleted successfully"}
@router.post("/items/bulk-add", response_model=List[PantryItemResponse])
async def bulk_add_pantry_items_route(
    add_data: PantryBulkUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    items = await bulk_add_pantry_items(session, current_user.id, add_data.items)
    return items