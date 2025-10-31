from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from db.main import get_session
from auth.service import get_current_user
from db.models import User, UserTasteProfile
from sqlmodel import select
from users.schemas import UserProfileResponse, TasteProfileUpdate, TasteProfileResponse
from users.service import get_user_profile, update_taste_profile

router = APIRouter()

@router.get("/profile",response_model=UserProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    user = await get_user_profile(session, current_user.id)
    return user

@router.get("/taste-profile", response_model=TasteProfileResponse)
async def get_taste_profile(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(UserTasteProfile).where(UserTasteProfile.user_id == current_user.id)
    )
    taste_profile = result.scalar_one_or_none()
    
    if not taste_profile:
        raise HTTPException(status_code=404, detail="Taste profile not found")
    
    return taste_profile

@router.put("/taste-profile", response_model=TasteProfileResponse)
async def update_user_taste_profile(
    profile_data: TasteProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    taste_profile = await update_taste_profile(session, current_user.id, profile_data)
    return taste_profile