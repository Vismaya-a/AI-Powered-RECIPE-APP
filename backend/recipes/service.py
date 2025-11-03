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
    

    def _build_recipe_prompt(
        self, 
        request: RecipeGenerationRequest, 
        taste_profile: UserTasteProfile,
        language: str
    ) -> str:
        
        # Build exclusion lists
        allergies = taste_profile.allergies if taste_profile and taste_profile.allergies else []
        dislikes = taste_profile.dislikes if taste_profile and taste_profile.dislikes else []
        absolute_exclusions = list(set(allergies + dislikes))
        exclusions_text = ", ".join(absolute_exclusions) if absolute_exclusions else "None"
        
        prompt = f"""
        Generate a detailed recipe in {language} based on the user's request.
        
        REQUEST: "{request.theme}"
        
        USER PREFERENCES:
        - Likes: {', '.join(taste_profile.likes) if taste_profile and taste_profile.likes else 'None'}
        - Dislikes: {', '.join(taste_profile.dislikes) if taste_profile and taste_profile.dislikes else 'None'}
        - Allergies: {', '.join(taste_profile.allergies) if taste_profile and taste_profile.allergies else 'None'}
        - Dietary: {', '.join(taste_profile.dietary_preferences) if taste_profile and taste_profile.dietary_preferences else 'None'}
        - Spice: {taste_profile.spice_level if taste_profile else 2}/5
        - Oil: {taste_profile.oil_preference if taste_profile else 'moderate'}
        - Cooking time: {taste_profile.cooking_time_preference if taste_profile else 30} min preferred
        
        DECISION RULES:
        1. If the requested theme DOES NOT contain any disliked/allergic ingredients:
        - Create the EXACT recipe as requested
        - Modify only cooking style, spices, or proportions to match preferences
        
        2. If the requested theme CONTAINS disliked/allergic ingredients:
        - Create the CLOSEST POSSIBLE alternative that excludes problematic ingredients
        - Keep the same dish type and cooking style
        - Explain the substitution in the description
        
        3. NEVER include ingredients from the dislikes/allergies list
        
        Please provide the recipe in this exact JSON format:
        {{
            "title": "Recipe Title",
            "description": "Brief description explaining any substitutions made",
            "ingredients": [
                {{"name": "ingredient", "quantity": "amount", "unit": "unit"}}
            ],
            "instructions": ["step 1", "step 2", ...],
            "cooking_time": "appropriate time",
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
    
    # Filter out excluded ingredients
        allergies = taste_profile.allergies if taste_profile and taste_profile.allergies else []
        dislikes = taste_profile.dislikes if taste_profile and taste_profile.dislikes else []
        absolute_exclusions = list(set(allergies + dislikes))
        
        safe_ingredients = [
            ing for ing in ingredients 
            if ing.lower() not in [excl.lower() for excl in absolute_exclusions]
        ]
        
        prompt = f"""
        Generate 3 complete recipes in {language} using available ingredients while respecting user restrictions.
        
        AVAILABLE INGREDIENTS: {', '.join(safe_ingredients)}
        
        USER RESTRICTIONS:
        - Allergies: {', '.join(taste_profile.allergies) if taste_profile and taste_profile.allergies else 'None'}
        - Dislikes: {', '.join(taste_profile.dislikes) if taste_profile and taste_profile.dislikes else 'None'}
        - Dietary: {', '.join(taste_profile.dietary_preferences) if taste_profile and taste_profile.dietary_preferences else 'None'}
        - Likes: {', '.join(taste_profile.likes) if taste_profile and taste_profile.likes else 'None'}
        
        RULES:
        - Only use ingredients from the available list
        - Never include allergic or disliked ingredients
        - Prioritize recipes that incorporate user's liked ingredients
        - Adapt recipes to match dietary preferences
        
        Return in this exact JSON format:
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
        
        raise