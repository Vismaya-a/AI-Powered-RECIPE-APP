from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from db.models import PantryItem
from pantry.schemas import PantryItemCreate

async def get_pantry_items(
    session: AsyncSession, 
    user_id: int
) -> List[PantryItem]:
    
    result = await session.execute(
        select(PantryItem).where(PantryItem.user_id == user_id)
    )
    return result.scalars().all()


async def add_pantry_item(
    session: AsyncSession,
    user_id: int,
    item_data: Dict[str, Any]
) -> PantryItem:
    
    # Convert timezone-aware datetime to naive datetime
    expiry_date = item_data.expiry_date
    if expiry_date and expiry_date.tzinfo is not None:
        expiry_date = expiry_date.replace(tzinfo=None)
    
    item = PantryItem(
        user_id=user_id,
        ingredient_name=item_data.ingredient_name,
        quantity=item_data.quantity,
        unit=item_data.unit,
        expiry_date=expiry_date,  # Use the converted datetime
        category=item_data.category
    )
    
    session.add(item)
    await session.commit()
    await session.refresh(item)
    return item

async def bulk_update_pantry(
    session: AsyncSession,
    user_id: int,
    items: List[PantryItemCreate]
) -> List[PantryItem]:
    
    # Clear existing items
    result = await session.execute(select(PantryItem).where(PantryItem.user_id == user_id))
    existing_items = result.scalars().all()
    
    for item in existing_items:
        await session.delete(item)
    
    # Add new items
    new_items = []
    for item_data in items:
        # Convert item_data to dictionary
        item_dict = item_data.dict()
        
        # Fix the timezone issue for expiry_date
        expiry_date = item_dict.get("expiry_date")
        if expiry_date and expiry_date.tzinfo is not None:
            item_dict["expiry_date"] = expiry_date.replace(tzinfo=None)
        
        item = PantryItem(user_id=user_id, **item_dict)
        session.add(item)
        new_items.append(item)
    
    await session.commit()
    
    # Refresh all new items
    for item in new_items:
        await session.refresh(item)
    
    return new_items
async def delete_pantry_item(
    session: AsyncSession,
    item_id: int,
    user_id: int
) -> bool:
    
    result = await session.execute(
        select(PantryItem).where(
            (PantryItem.id == item_id) & 
            (PantryItem.user_id == user_id)
        )
    )
    item = result.scalar_one_or_none()
    
    if not item:
        return False
    
    await session.delete(item)
    await session.commit()
    return True
async def bulk_add_pantry_items(
    session: AsyncSession,
    user_id: int,
    items: List[PantryItemCreate]
) -> List[PantryItem]:
    
    new_items = []
    
    for item_data in items:
        item_dict = item_data.dict()
        
        # Fix timezone-aware datetime
        expiry_date = item_dict.get("expiry_date")
        if expiry_date and expiry_date.tzinfo is not None:
            item_dict["expiry_date"] = expiry_date.replace(tzinfo=None)
        
        item = PantryItem(user_id=user_id, **item_dict)
        session.add(item)
        new_items.append(item)
    
    await session.commit()
    
    for item in new_items:
        await session.refresh(item)
    
    return new_items