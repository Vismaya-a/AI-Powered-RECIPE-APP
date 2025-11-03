const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
  : "";

// Import all types from the unified file
import type {
  User,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  UserProfileResponse,
  TasteProfileResponse,
  TasteProfileUpdate,
  Recipe,
  RecipeGenerationRequest,
  RecipeResponse,
  SavedRecipe,
  PantryItemCreate,
  PantryItemResponse,
  PantryBulkUpdate,
  PantrySuggestionRequest,
  PantryRecipeResponse,
  LeftoverIngredientBase,
  LeftoverIngredientResponse,
  LeftoverTransformRequest,
  TransformationSuggestion,
  DashboardStats,
  SaveTransformationRequest,
  SavedTransformationResponse,
  LeftoverIngredient,
  TasteProfileBase,
  TasteProfileCreate,
} from "../types/api";

interface ApiErrorOptions {
  status?: number;
  details?: any;
}

class ApiError extends Error {
  public status?: number;
  public details?: any;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.details = options.details;
  }
}

// Generic request function with proper TypeScript typing
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  // Use Record<string, string> for headers to avoid TypeScript issues
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add any custom headers from options
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers[key] = value as string;
    });
  }

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle unauthorized access
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new ApiError("Authentication required", { status: 401 });
    }

    // Handle non-OK responses
    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = { detail: response.statusText };
      }
      throw new ApiError(errorDetails.detail || "Request failed", {
        status: response.status,
        details: errorDetails,
      });
    }

    // Handle empty responses (like 204 No Content)
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType?.includes("application/json")) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors (CORS, etc.)
    if (error instanceof TypeError) {
      throw new ApiError(
        "Network error: Unable to reach the server. Check if the backend is running and CORS is configured.",
        {
          details: error,
        }
      );
    }

    throw new ApiError("An unexpected error occurred", { details: error });
  }
}

export const api = {
  // ===== AUTH ENDPOINTS =====
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async register(userData: RegisterData): Promise<User> {
    return apiRequest<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async logout(): Promise<void> {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  },

  // ===== USER PROFILE ENDPOINTS =====
  // ===== USER PROFILE ENDPOINTS =====
  async getCurrentUser(): Promise<UserProfileResponse> {
    return apiRequest<UserProfileResponse>("/users/profile");
  },

  async getTasteProfile(): Promise<TasteProfileResponse> {
    return apiRequest<TasteProfileResponse>("/users/taste-profile");
  },

  async createTasteProfile(
    profileData: TasteProfileCreate
  ): Promise<TasteProfileResponse> {
    return apiRequest<TasteProfileResponse>("/users/taste-profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
  },

  async updateTasteProfile(
    profileData: TasteProfileUpdate
  ): Promise<TasteProfileResponse> {
    return apiRequest<TasteProfileResponse>("/users/taste-profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  async getOrCreateTasteProfile(): Promise<TasteProfileResponse> {
    return apiRequest<TasteProfileResponse>("/users/taste-profile/or-create");
  },
  // ===== RECIPE ENDPOINTS =====
  async generateRecipe(
    requestData: RecipeGenerationRequest
  ): Promise<RecipeResponse> {
    return apiRequest<RecipeResponse>("/recipes/generate", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },

  async saveGeneratedRecipe(recipeData: Recipe): Promise<{ id: string }> {
    return apiRequest<{ id: string }>("/recipes/save-generated", {
      method: "POST",
      body: JSON.stringify(recipeData),
    });
  },

  // async getSavedRecipes(): Promise<SavedRecipe[]> {
  //   return apiRequest<SavedRecipe[]>("/recipes/saved");
  // },

  // async deleteSavedRecipe(recipeId: string): Promise<void> {
  //   return apiRequest<void>(`/recipes/saved/${recipeId}`, {
  //     method: "DELETE",
  //   });
  // },

  // utils/api.ts

  // Update the getSavedRecipeById function
  async getSavedRecipeById(recipeId: string): Promise<SavedRecipe> {
    try {
      // Convert string ID to number for backend
      const numericId = parseInt(recipeId);
      if (isNaN(numericId)) {
        throw new Error("Invalid recipe ID");
      }

      const recipe = await apiRequest<SavedRecipe>(
        `/recipes/saved/${numericId}`
      );

      // Convert backend numeric ID to string for frontend consistency
      return {
        ...recipe,
        id: recipe.id.toString(),
      };
    } catch (error: any) {
      console.error(`Error fetching recipe ${recipeId}:`, error);
      throw new Error("Recipe not found");
    }
  },

  // Update the deleteSavedRecipe function
  async deleteSavedRecipe(recipeId: string): Promise<void> {
    try {
      // Convert string ID to number for backend
      const numericId = parseInt(recipeId);
      if (isNaN(numericId)) {
        throw new Error("Invalid recipe ID");
      }

      await apiRequest<void>(`/recipes/saved/${numericId}`, {
        method: "DELETE",
      });
    } catch (error: any) {
      console.error(`Error deleting recipe ${recipeId}:`, error);
      throw new Error("Failed to delete recipe");
    }
  },

  // Update getSavedRecipes to convert IDs to strings
  async getSavedRecipes(): Promise<SavedRecipe[]> {
    try {
      const recipes = await apiRequest<SavedRecipe[]>("/recipes/saved");

      // Convert backend numeric IDs to strings for frontend consistency
      return recipes.map((recipe) => ({
        ...recipe,
        id: recipe.id.toString(),
      }));
    } catch (error: any) {
      console.error("Error fetching saved recipes:", error);
      // Return empty array if endpoint doesn't exist yet
      return [];
    }
  },

  async suggestFromPantry(
    requestData: PantrySuggestionRequest
  ): Promise<PantryRecipeResponse[]> {
    return apiRequest<PantryRecipeResponse[]>("/recipes/suggest-from-pantry", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },

  // ===== PANTRY ENDPOINTS =====
  async getPantryItems(): Promise<PantryItemResponse[]> {
    return apiRequest<PantryItemResponse[]>("/pantry/items");
  },

  async addPantryItem(itemData: PantryItemCreate): Promise<PantryItemResponse> {
    return apiRequest<PantryItemResponse>("/kitchen/items", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  },

  async bulkUpdatePantryItems(
    updateData: PantryBulkUpdate
  ): Promise<PantryItemResponse[]> {
    return apiRequest<PantryItemResponse[]>("/kitchen/items/bulk", {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },

  async bulkAddPantryItems(
    addData: PantryBulkUpdate
  ): Promise<PantryItemResponse[]> {
    return apiRequest<PantryItemResponse[]>("/kitchen/items/bulk-add", {
      method: "POST",
      body: JSON.stringify(addData),
    });
  },

  async deletePantryItem(itemId: number): Promise<void> {
    return apiRequest<void>(`/kitchen/items/${itemId}`, {
      method: "DELETE",
    });
  },

  // ===== LEFTOVERS ENDPOINTS =====
  // ===== LEFTOVERS ENDPOINTS =====
  async getLeftoverIngredients(): Promise<LeftoverIngredient[]> {
    try {
      return await apiRequest<LeftoverIngredient[]>("/remainings/ingredients");
    } catch (error) {
      console.error("Error fetching leftover ingredients:", error);
      return [];
    }
  },

  async addLeftoverIngredient(
    leftoverData: LeftoverIngredientBase
  ): Promise<LeftoverIngredient> {
    return apiRequest<LeftoverIngredient>("/remainings/ingredients", {
      method: "POST",
      body: JSON.stringify(leftoverData),
    });
  },

  async transformLeftovers(
    request: LeftoverTransformRequest
  ): Promise<TransformationSuggestion[]> {
    return apiRequest<TransformationSuggestion[]>("/remainings/transform", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  async saveLeftoverTransformation(
    transformationData: SaveTransformationRequest
  ): Promise<SavedTransformationResponse> {
    return apiRequest<SavedTransformationResponse>(
      "/remainings/save-transformation",
      {
        method: "POST",
        body: JSON.stringify(transformationData),
      }
    );
  },

  async getSavedTransformations(): Promise<SavedTransformationResponse[]> {
    try {
      return await apiRequest<SavedTransformationResponse[]>(
        "/remainings/saved-transformations"
      );
    } catch (error) {
      console.error("Error fetching saved transformations:", error);
      return [];
    }
  },

  async getSavedTransformationById(
    transformationId: number
  ): Promise<SavedTransformationResponse> {
    return apiRequest<SavedTransformationResponse>(
      `/remainings/saved-transformations/${transformationId}`
    );
  },

  async deleteSavedTransformation(transformationId: number): Promise<void> {
    return apiRequest<void>(
      `/remainings/saved-transformations/${transformationId}`,
      {
        method: "DELETE",
      }
    );
  },

  async deleteLeftoverIngredient(leftoverId: number): Promise<void> {
    return apiRequest<void>(`/remainings/ingredients/${leftoverId}`, {
      method: "DELETE",
    });
  },
  // ===== DASHBOARD ENDPOINTS =====
  async getDashboardStats(): Promise<DashboardStats> {
    return apiRequest<DashboardStats>("/dboard/stats");
  },

  // ===== GENERIC METHODS =====
  async get<T>(endpoint: string): Promise<T> {
    return apiRequest<T>(endpoint, { method: "GET" });
  },

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete<T>(endpoint: string): Promise<T> {
    return apiRequest<T>(endpoint, { method: "DELETE" });
  },
};

// Export error class for external use
export { ApiError };
