// // types/api.ts

// export interface User {
//   id: number;
//   email: string;
//   username: string;
//   preferred_language: string;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface RegisterData {
//   username: string;
//   email: string;
//   password: string;
//   preferred_language: string;
// }

// export interface LoginResponse {
//   access_token: string;
//   token_type: string;
//   user: User;
// }

// export interface Recipe {
//   id?: string;
//   title: string;
//   description: string;
//   ingredients: RecipeIngredient[];
//   instructions: string[];
//   cooking_time: string;
//   difficulty: string;
//   tags: string[];
// }

// // export interface RecipeIngredient {
// //   name: string;
// //   amount?: string;
// //   unit?: string;
// // }

// // export interface RecipeGenerationRequest {
// //   ingredients: string;
// //   dietary_requirements?: string;
// //   cooking_time?: string;
// //   cuisine_type?: string;
// // }

// export interface PantrySuggestionRequest {
//   ingredients: string[];
//   dietary_preferences?: string[];
//   max_cooking_time?: number;
// }

// export interface SavedRecipe {
//   id: number;
//   recipe_title: string;
//   recipe_data: any;
//   ingredients: string[];
//   dietary_tags: string[];
//   cooking_time: string;
//   difficulty_level: string;
//   created_at: string;
// }

// // interface NutritionInfo {
// //   calories: string;
// //   protein: string;
// //   carbs: string;
// //   fat: string;
// // }

// // interface RecipeIngredient {
// //   name: string;
// //   quantity: string;
// //   unit: string;
// // }

// // interface RecipeGenerationRequest {
// //   theme: string;
// //   language: string;
// //   use_pantry?: boolean;
// // }

// // interface RecipeResponse {
// //   title: string;
// //   description: string;
// //   ingredients: RecipeIngredient[];
// //   instructions: string[];
// //   cooking_time: string;
// //   difficulty: string;
// //   nutrition_info: NutritionInfo;
// //   tags: string[];
// //   servings: number;
// // }

// // types/recipe.ts

// export interface NutritionInfo {
//   calories: string;
//   protein: string;
//   carbs: string;
//   fat: string;
// }

// export interface RecipeIngredient {
//   name: string;
//   quantity: string;
//   unit: string;
// }

// export interface Recipe {
//   id?: string;
//   title: string;
//   description: string;
//   ingredients: RecipeIngredient[];
//   instructions: string[];
//   cooking_time: string;
//   difficulty: string;
//   nutrition_info: NutritionInfo;
//   tags: string[];
//   servings: number;
//   created_at?: string;
// }

// export interface RecipeGenerationRequest {
//   theme: string;
//   language: string;
//   use_pantry?: boolean;
// }

// export interface RecipeResponse {
//   id?: string;
//   title: string;
//   description: string;
//   ingredients: RecipeIngredient[];
//   instructions: string[];
//   cooking_time: string;
//   difficulty: string;
//   nutrition_info: NutritionInfo;
//   tags: string[];
//   servings: number;
// }

// export interface SavedRecipe {
//   id: string;
//   recipe_title: string;
//   recipe_data: Recipe;
//   ingredients: string[];
//   dietary_tags: string[];
//   cooking_time: string;
//   difficulty_level: string;
//   created_at: string;
// }
// types/recipe.ts

// ===== USER & AUTH TYPES =====
export interface User {
  id: number;
  email: string;
  username: string;
  preferred_language: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  preferred_language: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ===== RECIPE TYPES =====
export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  cooking_time: string;
  difficulty: string;
  nutrition_info: NutritionInfo;
  tags: string[];
  servings: number;
  created_at?: string;
}

export interface RecipeGenerationRequest {
  theme: string;
  language: string;
  use_pantry?: boolean;
}

export interface RecipeResponse {
  id?: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  cooking_time: string;
  difficulty: string;
  nutrition_info: NutritionInfo;
  tags: string[];
  servings: number;
}

export interface SavedRecipe {
  id: string;
  recipe_title: string;
  recipe_data: Recipe;
  ingredients: string[];
  dietary_tags: string[];
  cooking_time: string;
  difficulty_level: string;
  created_at: string;
}

// ===== PANTRY TYPES =====
export interface PantrySuggestionRequest {
  ingredients: string[];
  dietary_preferences?: string[];
  max_cooking_time?: number;
}

export interface PantryItemCreate {
  ingredient_name: string;
  quantity: string;
  category?: string;
  expiry_date?: string;
}

export interface PantryItemResponse {
  id: number;
  ingredient_name: string;
  quantity: string;
  category?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PantryBulkUpdate {
  items: PantryItemCreate[];
}

export interface PantryRecipeResponse {
  id: number;
  title: string;
  description: string;
  matching_ingredients: string[];
  cooking_time: string;
  difficulty: string;
}

// ===== LEFTOVERS TYPES =====
// In your types file
export interface LeftoverIngredientBase {
  ingredient_name: string;
  quantity?: string;
  state: string;
}

export interface LeftoverIngredientResponse {
  id: number;
  ingredient_name: string;
  quantity: string;
  state: string;
}

export interface LeftoverTransformRequest {
  language: string;
}

export interface TransformationSuggestion {
  title: string;
  description: string;
  transformation_idea: string;
  used_leftovers: string[];
  additional_ingredients: string[];
  cooking_time: number;
  difficulty: string;
}

// ===== DASHBOARD & PROFILE TYPES =====
export interface DashboardStats {
  pantry_items_count: number;
  saved_recipes_count: number;
  recipes_generated_count: number;
  leftover_items_count: number;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  preferred_language: string;
}

export interface TasteProfileResponse {
  id: number;
  user_id: number;
  preferred_cuisines?: string[];
  dietary_restrictions?: string[];
  spice_tolerance?: number;
  favorite_ingredients?: string[];
  disliked_ingredients?: string[];
  cooking_skill_level?: string;
}

export interface TasteProfileUpdate {
  preferred_cuisines?: string[];
  dietary_restrictions?: string[];
  spice_tolerance?: number;
  favorite_ingredients?: string[];
  disliked_ingredients?: string[];
  cooking_skill_level?: string;
}
// types/recipe.ts

export interface SavedRecipe {
  id: string; // Frontend uses string, backend uses number - we'll convert
  recipe_title: string;
  recipe_data: Recipe;
  ingredients: string[];
  dietary_tags: string[];
  cooking_time: string;
  difficulty_level: string;
  created_at: string;
}

// Add this interface for backend response (if needed)
export interface SavedRecipeBackend {
  id: number;
  recipe_title: string;
  recipe_data: any; // or Recipe if it matches
  ingredients: string[];
  dietary_tags: string[];
  cooking_time: string;
  difficulty_level: string;
  created_at: string;
}
