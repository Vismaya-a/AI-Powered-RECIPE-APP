from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import User, UserTasteProfile
from users.schemas import TasteProfileUpdate

async def get_user_profile(session: AsyncSession, user_id: int) -> dict:
    # Get user
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        return None
    
    # Get taste profile separately
    taste_result = await session.execute(
        select(UserTasteProfile).where(UserTasteProfile.user_id == user_id)
    )
    taste_profile = taste_result.scalar_one_or_none()
    
    # Convert to dictionary for Pydantic response
    user_dict = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "preferred_language": user.preferred_language,
        "created_at": user.created_at,
        "taste_profile": taste_profile.dict() if taste_profile else None
    }
    return user_dict

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
        # Create new taste profile if it doesn't exist
        taste_profile = UserTasteProfile(user_id=user_id, **profile_data.dict(exclude_unset=True))
        session.add(taste_profile)
    else:
        # Update existing taste profile
        for field, value in profile_data.dict(exclude_unset=True).items():
            setattr(taste_profile, field, value)
    
    await session.commit()
    await session.refresh(taste_profile)
    return taste_profile