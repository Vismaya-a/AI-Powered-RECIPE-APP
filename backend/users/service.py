
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from db.models import User, UserTasteProfile
from users.schemas import TasteProfileUpdate, TasteProfileCreate,UserProfileResponse,TasteProfileResponse


async def get_user_profile(session: AsyncSession, user_id: int) -> UserProfileResponse:
    # Get user with taste_profile eagerly loaded
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise ValueError("User not found")
    
    # Get taste profile separately to avoid async relationship issues
    taste_profile_result = await session.execute(
        select(UserTasteProfile).where(UserTasteProfile.user_id == user_id)
    )
    taste_profile = taste_profile_result.scalar_one_or_none()
    
    # Convert to response model
    taste_profile_response = None
    if taste_profile:
        taste_profile_response = TasteProfileResponse(
            id=taste_profile.id,
            user_id=taste_profile.user_id,
            likes=taste_profile.likes,
            dislikes=taste_profile.dislikes,
            dietary_preferences=taste_profile.dietary_preferences,
            allergies=taste_profile.allergies,
            spice_level=taste_profile.spice_level,
            oil_preference=taste_profile.oil_preference,
            cooking_time_preference=taste_profile.cooking_time_preference,
            updated_at=taste_profile.updated_at
        )
    
    return UserProfileResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        preferred_language=user.preferred_language,
        created_at=user.created_at,
        taste_profile=taste_profile_response
    )
async def create_taste_profile(
    session: AsyncSession, 
    user_id: int, 
    profile_data: TasteProfileCreate
) -> UserTasteProfile:
    
    taste_profile = UserTasteProfile(user_id=user_id, **profile_data.dict())
    session.add(taste_profile)
    await session.commit()
    await session.refresh(taste_profile)
    return taste_profile

async def update_taste_profile(
    session: AsyncSession, 
    user_id: int, 
    profile_data: TasteProfileUpdate
) -> UserTasteProfile:
    
    result = await session.execute(
        select(UserTasteProfile).where(UserTasteProfile.user_id == user_id)
    )
    taste_profile = result.scalar_one_or_none()
    
    if not taste_profile:
        raise ValueError("Taste profile not found")
    
    # Update existing taste profile
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(taste_profile, field, value)
    
    taste_profile.updated_at = datetime.utcnow()
    
    await session.commit()
    await session.refresh(taste_profile)
    return taste_profile

async def get_or_create_taste_profile(
    session: AsyncSession, 
    user_id: int
) -> UserTasteProfile:
    
    result = await session.execute(
        select(UserTasteProfile).where(UserTasteProfile.user_id == user_id)
    )
    taste_profile = result.scalar_one_or_none()
    
    if not taste_profile:
        # Create default taste profile
        taste_profile = UserTasteProfile(user_id=user_id)
        session.add(taste_profile)
        await session.commit()
        await session.refresh(taste_profile)
    
    return taste_profile