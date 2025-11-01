import json
import google.generativeai as genai
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from db.models import LeftoverIngredient
from leftovers.schemas import LeftoverIngredientBase

class LeftoverService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    async def transform_leftovers(
        self,
        leftover_ingredients: List[str],
        language: str = "en"
    ) -> List[Dict[str, Any]]:
        
        prompt = self._build_transformation_prompt(leftover_ingredients, language)
        
        try:
            response = self.model.generate_content(prompt)
            transformations = self._parse_transformation_response(response.text)
            return transformations
        except Exception as e:
            raise Exception(f"Error generating transformation ideas: {str(e)}")
    
    def _build_transformation_prompt(self, ingredients: List[str], language: str) -> str:
        prompt = f"""
        Suggest 3 creative recipe transformations in {language} that can turn these leftover ingredients into new delicious meals: {', '.join(ingredients)}
        
        Focus on:
        - Creative ways to reuse leftovers
        - Reducing food waste
        - Making completely new dishes from leftovers
        
        Return in JSON format:
        {{
            "transformations": [
                {{
                    "title": "Transformed Recipe Name",
                    "description": "Brief description",
                    "transformation_idea": "Creative idea for transformation including recipe with steps",
                    "used_leftovers": ["leftover1", "leftover2"],
                    "additional_ingredients": ["ing1", "ing2"],
                    "cooking_time": 20,
                    "difficulty": "Easy"
                }}
            ]
        }}
        """
        return prompt
    
    def _parse_transformation_response(self, response_text: str) -> List[Dict[str, Any]]:
        try:
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            json_str = response_text[start:end]
            data = json.loads(json_str)
            return data.get("transformations", [])
        except Exception as e:
            raise Exception(f"Failed to parse transformation response: {str(e)}")

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