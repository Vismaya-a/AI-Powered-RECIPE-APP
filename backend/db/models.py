
from sqlmodel import SQLModel, Field, Relationship, Column, JSON
from typing import Optional, List, Dict, Any
from datetime import datetime
from sqlalchemy import DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    preferred_language: str = Field(default="en")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships with cascade delete
    saved_recipes: List["SavedRecipe"] = Relationship(
        back_populates="user",
        sa_relationship=relationship("SavedRecipe", cascade="all, delete-orphan")
    )
    leftover_transformations: List["LeftoverTransformation"] = Relationship(
        back_populates="user", 
        sa_relationship=relationship("LeftoverTransformation", cascade="all, delete-orphan")
    )
    taste_profile: Optional["UserTasteProfile"] = Relationship(
        back_populates="user",
        sa_relationship=relationship("UserTasteProfile", cascade="all, delete-orphan", uselist=False)
    )
    pantry_items: List["PantryItem"] = Relationship(
        back_populates="user",
        sa_relationship=relationship("PantryItem", cascade="all, delete-orphan")
    )
    leftover_ingredients: List["LeftoverIngredient"] = Relationship(
        back_populates="user",
        sa_relationship=relationship("LeftoverIngredient", cascade="all, delete-orphan")
    )

class UserTasteProfile(SQLModel, table=True):
    __tablename__ = "user_taste_profiles"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", unique=True)
    likes: List[str] = Field(default=[], sa_column=Column(JSON))
    dislikes: List[str] = Field(default=[], sa_column=Column(JSON))
    dietary_preferences: List[str] = Field(default=[], sa_column=Column(JSON))
    allergies: List[str] = Field(default=[], sa_column=Column(JSON))
    spice_level: int = Field(default=2)
    oil_preference: str = Field(default="moderate")
    cooking_time_preference: Optional[int] = None
    updated_at: Optional[datetime] = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    
    user: "User" = Relationship(back_populates="taste_profile")

class PantryItem(SQLModel, table=True):
    __tablename__ = "pantry_items"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    ingredient_name: str
    quantity: Optional[str] = None
    unit: Optional[str] = None
    expiry_date: Optional[datetime] = None
    category: Optional[str] = None
    created_at: Optional[datetime] = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    
    user: "User" = Relationship(back_populates="pantry_items")

class SavedRecipe(SQLModel, table=True):
    __tablename__ = "saved_recipes"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    recipe_title: str
    recipe_data: Dict[str, Any] = Field(sa_column=Column(JSON))
    ingredients: List[str] = Field(sa_column=Column(JSON))
    dietary_tags: List[str] = Field(default=[], sa_column=Column(JSON))
    cooking_time: Optional[str] = None
    difficulty_level: Optional[str] = None
    created_at: Optional[datetime] = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    
    user: "User" = Relationship(back_populates="saved_recipes")

class LeftoverIngredient(SQLModel, table=True):
    __tablename__ = "leftover_ingredients"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    ingredient_name: str
    quantity: Optional[str] = None
    state: str = Field(default="fresh")
    created_from_recipe: Optional[int] = None
    created_at: Optional[datetime] = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    
    user: "User" = Relationship(back_populates="leftover_ingredients")

class LeftoverTransformation(SQLModel, table=True):
    __tablename__ = "leftover_transformations"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    title: str
    description: str
    transformation_idea: str = Field(sa_column=Column(Text))
    used_leftovers: List[str] = Field(sa_column=Column(JSON))
    additional_ingredients: List[str] = Field(sa_column=Column(JSON))
    cooking_time: int
    difficulty: str
    language: str = Field(default="en")
    created_at: Optional[datetime] = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    
    user: "User" = Relationship(back_populates="leftover_transformations")