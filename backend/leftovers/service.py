import json
import google.generativeai as genai
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any,Optional

from db.models import LeftoverIngredient, LeftoverTransformation,UserTasteProfile
from leftovers.schemas import LeftoverIngredientBase, SaveTransformationRequest

class LeftoverService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')
 
    async def transform_leftovers(
    self,
    leftover_ingredients: List[str],
    taste_profile: UserTasteProfile = None,  # Add taste profile parameter
    language: str = "en"
) -> List[Dict[str, Any]]:
    
        prompt = self._build_transformation_prompt(leftover_ingredients, taste_profile, language)
        
        try:
            response = self.model.generate_content(prompt)
            transformations = self._parse_transformation_response(response.text)
            return transformations
        except Exception as e:
            raise Exception(f"Error generating transformation ideas: {str(e)}")

    def _build_transformation_prompt(self, ingredients: List[str], taste_profile: UserTasteProfile, language: str) -> str:
        
        # Handle None taste_profile safely
        spice_level = taste_profile.spice_level if taste_profile else 2
        oil_preference = taste_profile.oil_preference if taste_profile else 'moderate'
        dietary_preferences = ', '.join(taste_profile.dietary_preferences) if taste_profile and taste_profile.dietary_preferences else 'None'
        likes = ', '.join(taste_profile.likes) if taste_profile and taste_profile.likes else 'None'
        dislikes = ', '.join(taste_profile.dislikes) if taste_profile and taste_profile.dislikes else 'None'
        
        prompt = f"""
        Suggest 3 creative recipe transformations in {language} that can turn these leftover ingredients into new delicious meals: {', '.join(ingredients)}
        
        Consider user preferences:
        - Spice level: {spice_level}/5
        - Oil preference: {oil_preference}
        - Dietary preferences: {dietary_preferences}
        - Likes: {likes}
        - Dislikes: {dislikes}
        
        Focus on:
        - Creative ways to reuse leftovers while respecting user preferences
        - Reducing food waste
        - Making completely new dishes from leftovers that match user tastes
        
        For each transformation, provide:
        1. A creative recipe title
        2. Brief description
        3. Detailed transformation idea with cooking steps
        4. List of used leftover ingredients
        5. List of additional ingredients needed (consider user preferences)
        6. Cooking time in minutes
        7. Difficulty level (Easy/Medium/Hard)
        
        Return in this exact JSON format:
        {{
            "transformations": [
                {{
                    "title": "Creative Recipe Name",
                    "description": "Brief description of the transformed dish",
                    "transformation_idea": "Detailed step-by-step cooking instructions for transforming the leftovers",
                    "used_leftovers": ["leftover1", "leftover2"],
                    "additional_ingredients": ["ingredient1", "ingredient2"],
                    "cooking_time": 25,
                    "difficulty": "Easy"
                }}
            ]
        }}
        
        Make sure the response is valid JSON and contains exactly 3 transformations.
        Ensure all suggestions respect the user's dietary preferences and taste preferences.
        """
        return prompt
        
    def _parse_transformation_response(self, response_text: str) -> List[Dict[str, Any]]:
        try:
            # Clean the response text
            cleaned_text = response_text.strip()
            if '```json' in cleaned_text:
                cleaned_text = cleaned_text.split('```json')[1].split('```')[0]
            elif '```' in cleaned_text:
                cleaned_text = cleaned_text.split('```')[1]
            
            start = cleaned_text.find('{')
            end = cleaned_text.rfind('}') + 1
            json_str = cleaned_text[start:end]
            
            data = json.loads(json_str)
            transformations = data.get("transformations", [])
            
            # Validate we have exactly 3 transformations
            if len(transformations) != 3:
                raise Exception(f"Expected 3 transformations, got {len(transformations)}")
                
            return transformations
        except Exception as e:
            raise Exception(f"Failed to parse transformation response: {str(e)}\nResponse was: {response_text}")

# Create global instance
leftover_service = LeftoverService()

async def get_leftover_ingredients(
    session: AsyncSession, 
    user_id: int
) -> List[LeftoverIngredient]:
    
    result = await session.execute(
        select(LeftoverIngredient).where(LeftoverIngredient.user_id == user_id)
    )
    return result.scalars().all()

async def add_leftover_ingredient(
    session: AsyncSession,
    user_id: int,
    leftover_data: LeftoverIngredientBase
) -> LeftoverIngredient:
    
    leftover = LeftoverIngredient(
        user_id=user_id,
        **leftover_data.dict()
    )
    
    session.add(leftover)
    await session.commit()
    await session.refresh(leftover)
    return leftover

async def delete_leftover_ingredient(
    session: AsyncSession,
    leftover_id: int,
    user_id: int
) -> bool:
    
    result = await session.execute(
        select(LeftoverIngredient).where(
            (LeftoverIngredient.id == leftover_id) & 
            (LeftoverIngredient.user_id == user_id)
        )
    )
    leftover = result.scalar_one_or_none()
    
    if not leftover:
        return False
    
    await session.delete(leftover)
    await session.commit()
    return True

async def save_transformation(
    session: AsyncSession,
    user_id: int,
    transformation_data: SaveTransformationRequest
) -> LeftoverTransformation:
    
    transformation = LeftoverTransformation(
        user_id=user_id,
        **transformation_data.dict()
    )
    
    session.add(transformation)
    await session.commit()
    await session.refresh(transformation)
    return transformation

async def get_saved_transformations(
    session: AsyncSession,
    user_id: int
) -> List[LeftoverTransformation]:
    
    result = await session.execute(
        select(LeftoverTransformation)
        .where(LeftoverTransformation.user_id == user_id)
        .order_by(LeftoverTransformation.created_at.desc())
    )
    return result.scalars().all()

async def get_saved_transformation_by_id(
    session: AsyncSession,
    transformation_id: int,
    user_id: int
) -> Optional[LeftoverTransformation]:
    
    result = await session.execute(
        select(LeftoverTransformation).where(
            LeftoverTransformation.id == transformation_id,
            LeftoverTransformation.user_id == user_id
        )
    )
    return result.scalar_one_or_none()

async def delete_saved_transformation(
    session: AsyncSession,
    transformation_id: int,
    user_id: int
) -> bool:
    
    result = await session.execute(
        select(LeftoverTransformation).where(
            LeftoverTransformation.id == transformation_id,
            LeftoverTransformation.user_id == user_id
        )
    )
    transformation = result.scalar_one_or_none()
    
    if not transformation:
        return False
    
    await session.delete(transformation)
    await session.commit()
    return True