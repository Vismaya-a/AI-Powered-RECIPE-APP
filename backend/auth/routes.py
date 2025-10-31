from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from sqlmodel import select
from db.main import get_session
from auth.schemas import UserCreate, UserLogin, UserResponse, Token
from auth.service import (
    get_password_hash, 
    authenticate_user, 
    create_access_token,
    get_current_user
)
from db.models import User, UserTasteProfile

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    # Check if user exists
    result = await session.execute(select(User).where(
        (User.email == user_data.email) | (User.username == user_data.username)
    ))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        preferred_language=user_data.preferred_language
    )
    
    session.add(user)
    await session.commit()
    await session.refresh(user)
    
    # Create default taste profile
    taste_profile = UserTasteProfile(user_id=user.id)
    session.add(taste_profile)
    await session.commit()
    
    return user

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, session: AsyncSession = Depends(get_session)):
    user = await authenticate_user(session, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}