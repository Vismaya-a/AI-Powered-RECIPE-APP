import json
import google.generativeai as genai
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

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
        taste_profile = result.first()
        
        # Build prompt
        prompt = self._build_pantry_prompt(request.ingredients, taste_profile, request.language)
        
        try:
            response = self.model.generate_content(prompt)
            suggestions = self._parse_suggestions_response(response.text)
            return suggestions
        except Exception as e:
            raise Exception(f"Error generating suggestions: {str(e)}")
    
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
#     def _build_recipe_prompt(
#     self, 
#     request: RecipeGenerationRequest, 
#     taste_profile: UserTasteProfile,
#     language: str
# ) -> str:
    
#         prompt = f"""
#         LANGUAGE REQUIREMENT: YOU MUST RESPOND COMPLETELY IN {language.upper()} LANGUAGE.
#         DO NOT USE ANY OTHER LANGUAGE. EVERY SINGLE WORD, TITLE, DESCRIPTION, INGREDIENT NAME, INSTRUCTION, AND TAG MUST BE WRITTEN IN {language}.
        
#         Generate a detailed recipe with the following requirements:
        
#         Theme: {request.theme}
#         Language: {language}
#         Use pantry: {request.use_pantry}
        
#         User preferences:
#         - Spice level: {taste_profile.spice_level if taste_profile else 2}/5
#         - Oil preference: {taste_profile.oil_preference if taste_profile else 'moderate'}
#         - Cooking time: {taste_profile.cooking_time_preference if taste_profile else 30} minutes
#         - Likes: {', '.join(taste_profile.likes) if taste_profile and taste_profile.likes else 'None'}
#         - Dislikes: {', '.join(taste_profile.dislikes) if taste_profile and taste_profile.dislikes else 'None'}
#         - Dietary: {', '.join(taste_profile.dietary_preferences) if taste_profile and taste_profile.dietary_preferences else 'None'}
#         - Allergies: {', '.join(taste_profile.allergies) if taste_profile and taste_profile.allergies else 'None'}
        
#         FORMAT REQUIREMENTS:
#         - All content must be in {language}
#         - Use local ingredient names in {language}
#         - Use local measurement units appropriate for {language}
#         - Use cooking terms familiar in {language}-speaking regions
        
#         JSON Response Format (all fields in {language}):
#         {{
#             "title": "Recipe title in {language}",
#             "description": "Description in {language}",
#             "ingredients": [
#                 {{"name": "ingredient in {language}", "quantity": "amount", "unit": "unit in {language}"}}
#             ],
#             "instructions": ["step in {language}", "step in {language}"],
#             "cooking_time": as provided in user preferences,
#             "difficulty": "difficulty level in {language}",
#             "servings": 4,
#             "nutrition_info": {{
#                 "calories": "approx",
#                 "protein": "g",
#                 "carbs": "g", 
#                 "fat": "g"
#             }},
#             "tags": ["tag in {language}"]
#         }}
        
#         FINAL REMINDER: RESPOND ONLY IN {language.upper()}.
#         """
#         return prompt
    
    def _build_pantry_prompt(
        self, 
        ingredients: List[str], 
        taste_profile: UserTasteProfile,
        language: str
    ) -> str:
        
        prompt = f"""
        Suggest 3 recipes in {language} that can be made with these ingredients: {', '.join(ingredients)}
        
        Consider user preferences:
        - Spice level: {taste_profile.spice_level if taste_profile else 2}/5
        - Oil preference: {taste_profile.oil_preference if taste_profile else 'moderate'}
        - Dietary: {', '.join(taste_profile.dietary_preferences) if taste_profile and taste_profile.dietary_preferences else 'None'}
        
        Return in JSON format:
        {{
            "suggestions": [
                {{
                    "title": "Recipe 1",
                    "description": "Brief description",
                    "used_ingredients": ["ing1", "ing2"],
                    "missing_ingredients": ["missing1", "missing2"],
                    "cooking_time": 30,
                    "difficulty": "Easy"
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
    
    def _parse_suggestions_response(self, response_text: str) -> List[Dict[str, Any]]:
        try:
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            json_str = response_text[start:end]
            data = json.loads(json_str)
            return data.get("suggestions", [])
        except Exception as e:
            raise Exception(f"Failed to parse suggestions response: {str(e)}")

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