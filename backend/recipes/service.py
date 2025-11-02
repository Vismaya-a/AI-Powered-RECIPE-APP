import json
import google.generativeai as genai
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any,Optional

from db.models import SavedRecipe, User, UserTasteProfile, PantryItem
from recipes.schemas import RecipeGenerationRequest, PantrySuggestionRequest

class RecipeService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    async def generate_recipe(
        self, 
        request: RecipeGenerationRequest, 
        user: User,
        session: AsyncSession
    ) -> Dict[str, Any]:
        
        # Get user taste profile
        result = await session.execute(
            select(UserTasteProfile).where(UserTasteProfile.user_id == user.id)
        )
        taste_profile = result.scalar_one_or_none()
        
        # Build prompt
        prompt = self._build_recipe_prompt(request, taste_profile, request.language)
        
        try:
            response = self.model.generate_content(prompt)
            recipe_data = self._parse_recipe_response(response.text)
            return recipe_data
        except Exception as e:
            raise Exception(f"Error generating recipe: {str(e)}")
    

    async def generate_pantry_suggestions(
    self,
    request: PantrySuggestionRequest,
    user: User,
    session: AsyncSession
) -> List[Dict[str, Any]]:
    
    # Get user taste profile
        result = await session.execute(
            select(UserTasteProfile).where(UserTasteProfile.user_id == user.id)
        )
        taste_profile = result.scalar_one_or_none()  # Use scalar_one_or_none() instead of first()
        
        # Get pantry items using helper function
        pantry_items = await self.get_pantry_items(session, user.id)
        ingredient_names = [item.ingredient_name for item in pantry_items]
        
        if not ingredient_names:
            raise Exception("No ingredients found in pantry")
        
        # Build prompt with pantry ingredients
        prompt = self._build_pantry_prompt(ingredient_names, taste_profile, request.language)
        
        try:
            response = self.model.generate_content(prompt)
            recipes = self._parse_pantry_recipes_response(response.text)
            return recipes
        except Exception as e:
            raise Exception(f"Error generating pantry recipes: {str(e)}")
    def _build_recipe_prompt(
        self, 
        request: RecipeGenerationRequest, 
        taste_profile: UserTasteProfile,
        language: str
    ) -> str:
        
        prompt = f"""
        Generate a detailed recipe in {language} with the following requirements:
        
        Main ingredient/theme: {request.theme}
        
        User preferences:
        - Spice level: {taste_profile.spice_level if taste_profile else 2}/5
        - Oil preference: {taste_profile.oil_preference if taste_profile else 'moderate'}
        - Cooking time: {taste_profile.cooking_time_preference if taste_profile else 30} minutes preferred
        - Likes: {', '.join(taste_profile.likes) if taste_profile and taste_profile.likes else 'None specified'}
        - Dislikes: {', '.join(taste_profile.dislikes) if taste_profile and taste_profile.dislikes else 'None'}
        - Dietary: {', '.join(taste_profile.dietary_preferences) if taste_profile and taste_profile.dietary_preferences else 'None'}
        
        Please provide the recipe in this exact JSON format:
        {{
            "title": "Recipe Title",
            "description": "Brief description",
            "ingredients": [
                {{"name": "ingredient", "quantity": "amount", "unit": "unit"}}
            ],
            "instructions": ["step 1", "step 2", ...],
            "cooking_time": as provided in user preferences,
            "difficulty": "Easy/Medium/Hard",
            "servings": 4,
            "nutrition_info": {{
                "calories": "approx calories",
                "protein": "g",
                "carbs": "g",
                "fat": "g"
            }},
            "tags": ["tag1", "tag2", ...]
        }}
        """
        return prompt


    def _build_pantry_prompt(
    self, 
    ingredients: List[str], 
    taste_profile: UserTasteProfile,
    language: str
) -> str:
    
    # Handle None taste_profile safely
        spice_level = taste_profile.spice_level if taste_profile else 2
        oil_preference = taste_profile.oil_preference if taste_profile else 'moderate'
        dietary_preferences = ', '.join(taste_profile.dietary_preferences) if taste_profile and taste_profile.dietary_preferences else 'None'
        
        prompt = f"""
        Generate 3 complete recipes in {language} that can be made primarily with these pantry ingredients: {', '.join(ingredients)}
        
        Consider user preferences:
        - Spice level: {spice_level}/5
        - Oil preference: {oil_preference}
        - Dietary: {dietary_preferences}
        
        For each recipe, provide:
        1. Use as many pantry ingredients as possible
        2. List any missing ingredients needed
        3. Provide complete cooking instructions
        4. Include nutrition information
        
        Return in JSON format:
        {{
            "recipes": [
                {{
                    "title": "Recipe Title",
                    "description": "Brief description",
                    "ingredients": [
                        {{"name": "ingredient", "quantity": "amount", "unit": "unit"}}
                    ],
                    "instructions": ["step 1", "step 2", ...],
                    "cooking_time": "cooking time",
                    "difficulty": "Easy/Medium/Hard",
                    "servings": 4,
                    "nutrition_info": {{
                        "calories": "approx calories",
                        "protein": "g",
                        "carbs": "g",
                        "fat": "g"
                    }},
                    "tags": ["tag1", "tag2", ...],
                    "used_pantry_ingredients": ["pantry_ing1", "pantry_ing2"],
                    "missing_ingredients": ["missing1", "missing2"]
                }}
            ]
        }}
        """
        return prompt
    def _parse_recipe_response(self, response_text: str) -> Dict[str, Any]:
        try:
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            json_str = response_text[start:end]
            return json.loads(json_str)
        except Exception as e:
            raise Exception(f"Failed to parse recipe response: {str(e)}")

    def _parse_pantry_recipes_response(self, response_text: str) -> List[Dict[str, Any]]:
        try:
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            json_str = response_text[start:end]
            data = json.loads(json_str)
            return data.get("recipes", [])
        except Exception as e:
            raise Exception(f"Failed to parse pantry recipes response: {str(e)}")

    async def get_pantry_items(
        self,
        session: AsyncSession, 
        user_id: int
    ) -> List[PantryItem]:
        """Get user's pantry items"""
        result = await session.execute(
            select(PantryItem).where(PantryItem.user_id == user_id)
        )
        return result.scalars().all()

# Create global instance
recipe_service = RecipeService()

async def save_recipe(
    session: AsyncSession,
    user_id: int,
    recipe_data: Dict[str, Any]
) -> SavedRecipe:
    
    recipe = SavedRecipe(
        user_id=user_id,
        recipe_title=recipe_data.get("recipe_title"),
        recipe_data=recipe_data.get("recipe_data"),
        ingredients=recipe_data.get("ingredients", []),
        dietary_tags=recipe_data.get("dietary_tags", []),
        cooking_time=recipe_data.get("cooking_time"),
        difficulty_level=recipe_data.get("difficulty_level")
    )
    
    session.add(recipe)
    await session.commit()
    await session.refresh(recipe)
    return recipe

async def get_saved_recipes(
    session: AsyncSession,
    user_id: int
) -> List[SavedRecipe]:
    
    result = await session.execute(
        select(SavedRecipe)
        .where(SavedRecipe.user_id == user_id)
        .order_by(SavedRecipe.created_at.desc())
    )
    return result.scalars().all()

# Add these functions to your existing recipes/service.py

async def get_saved_recipe_by_id(session: AsyncSession, recipe_id: int, user_id: int) -> Optional[SavedRecipe]:
    """Get a single saved recipe by ID for a specific user"""
    try:
        result = await session.execute(
            select(SavedRecipe).where(
                SavedRecipe.id == recipe_id,
                SavedRecipe.user_id == user_id
            )
        )
        recipe = result.scalar_one_or_none()
        return recipe
    except Exception as e:
        #logger.error(f"Error getting saved recipe {recipe_id}: {str(e)}")
        raise

async def delete_saved_recipe(session: AsyncSession, recipe_id: int, user_id: int) -> bool:
    """Delete a saved recipe by ID for a specific user"""
    try:
        result = await session.execute(
            select(SavedRecipe).where(
                SavedRecipe.id == recipe_id,
                SavedRecipe.user_id == user_id
            )
        )
        recipe = result.scalar_one_or_none()
        
        if not recipe:
            return False
            
        await session.delete(recipe)
        await session.commit()
        return True
    except Exception as e:
        await session.rollback()
        logger.error(f"Error deleting saved recipe {recipe_id}: {str(e)}")
        raise