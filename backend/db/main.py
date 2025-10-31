from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator

from config import settings

# Create async engine
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,  # Set to False in production
    future=True
)

# Create session factory
async_session_factory = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()

async def create_db_and_tables():
    async with async_engine.begin() as conn:
        # Create all tables
        from db.models import User, UserTasteProfile, PantryItem, SavedRecipe, LeftoverIngredient
        await conn.run_sync(SQLModel.metadata.create_all)