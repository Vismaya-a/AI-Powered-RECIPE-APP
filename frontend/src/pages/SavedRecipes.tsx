
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, Clock, ChefHat, Users, Utensils, ArrowLeft, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import type { SavedRecipe, RecipeIngredient } from '../types/api';

export default function SavedRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      setIsLoading(true);
      const savedRecipes = await api.getSavedRecipes();
      setRecipes(savedRecipes);
    } catch (error: any) {
      console.error('Error loading saved recipes:', error);
      toast.error('Failed to load saved recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when deleting
    setDeletingId(recipeId);
    try {
      await api.deleteSavedRecipe(recipeId);
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      toast.success('Recipe deleted successfully');
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewRecipe = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const formatIngredient = (ingredient: RecipeIngredient): string => {
    return `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`.trim();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Safe data access helper functions
  const getRecipeTitle = (recipe: SavedRecipe): string => {
    return recipe.recipe_title || recipe.recipe_data?.title || 'Untitled Recipe';
  };

  const getRecipeDescription = (recipe: SavedRecipe): string => {
    return recipe.recipe_data?.description || 'No description available';
  };

  const getRecipeIngredients = (recipe: SavedRecipe): RecipeIngredient[] => {
    return recipe.recipe_data?.ingredients || [];
  };

  const getRecipeInstructions = (recipe: SavedRecipe): string[] => {
    return recipe.recipe_data?.instructions || [];
  };

  const getRecipeTags = (recipe: SavedRecipe): string[] => {
    return recipe.recipe_data?.tags || recipe.dietary_tags || [];
  };

  const getNutritionInfo = (recipe: SavedRecipe) => {
    return recipe.recipe_data?.nutrition_info || {
      calories: 'N/A',
      protein: 'N/A',
      carbs: 'N/A',
      fat: 'N/A'
    };
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate('/generate-recipe')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Generator
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              My Saved Recipes
            </h1>
          </div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/generate-recipe')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Generator
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                My Saved Recipes
              </h1>
              <p className="text-muted-foreground mt-2">
                {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
              </p>
            </div>
          </div>
          <Button
            variant="hero"
            onClick={() => navigate('/generate-recipe')}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Generate New Recipe
          </Button>
        </div>

        {recipes.length === 0 ? (
          <Card className="text-center py-12 shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No saved recipes yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by generating some amazing recipes with our AI chef!
              </p>
              <Button
                variant="hero"
                onClick={() => navigate('/generate-recipe')}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate Your First Recipe
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="shadow-hover border-0 bg-gradient-to-br from-background to-muted/10 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                onClick={() => handleViewRecipe(recipe.id)}
              >
                <CardHeader className="border-b bg-gradient-card rounded-t-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold mb-3 bg-gradient-hero bg-clip-text text-transparent group-hover:text-primary transition-colors">
                        {getRecipeTitle(recipe)}
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground leading-relaxed">
                        {getRecipeDescription(recipe)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRecipe(recipe.id);
                        }}
                        className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View full recipe"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                        disabled={deletingId === recipe.id}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Recipe Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{recipe.cooking_time || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-lg">
                      <ChefHat className="h-4 w-4 text-secondary" />
                      <Badge
                        variant="outline"
                        className={`border-2 font-medium ${getDifficultyColor(recipe.difficulty_level || 'medium')}`}
                      >
                        {recipe.difficulty_level || 'Medium'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
                      <Users className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">
                        {recipe.recipe_data?.servings || 'N/A'} servings
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">
                        Saved on {formatDate(recipe.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {getRecipeTags(recipe).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Ingredients Section */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-2 mb-4">
                        <Utensils className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg text-foreground">Ingredients</h3>
                      </div>
                      <div className="space-y-2">
                        {getRecipeIngredients(recipe).slice(0, 5).map((ingredient, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                            <span className="text-sm leading-relaxed">{formatIngredient(ingredient)}</span>
                          </div>
                        ))}
                        {getRecipeIngredients(recipe).length > 5 && (
                          <div className="text-center text-sm text-muted-foreground pt-2">
                            +{getRecipeIngredients(recipe).length - 5} more ingredients
                          </div>
                        )}
                      </div>

                      {/* Nutrition Info */}
                      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border">
                        <h4 className="font-semibold text-sm mb-2 text-foreground">Nutrition (per serving)</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center p-1 rounded bg-background">
                            <div className="font-bold text-primary">{getNutritionInfo(recipe).calories}</div>
                            <div className="text-muted-foreground">Calories</div>
                          </div>
                          <div className="text-center p-1 rounded bg-background">
                            <div className="font-bold text-secondary">{getNutritionInfo(recipe).protein}</div>
                            <div className="text-muted-foreground">Protein</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructions Preview */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-4">
                        <ChefHat className="h-5 w-5 text-secondary" />
                        <h3 className="font-bold text-lg text-foreground">Instructions</h3>
                      </div>
                      <ol className="space-y-2">
                        {getRecipeInstructions(recipe).slice(0, 3).map((instruction, index) => (
                          <li
                            key={index}
                            className="flex gap-3 p-2 rounded-lg bg-muted/20"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="text-sm text-foreground leading-relaxed">
                              {instruction.length > 100
                                ? `${instruction.substring(0, 100)}...`
                                : instruction
                              }
                            </span>
                          </li>
                        ))}
                        {getRecipeInstructions(recipe).length > 3 && (
                          <div className="text-center text-sm text-muted-foreground pt-2">
                            +{getRecipeInstructions(recipe).length - 3} more steps
                          </div>
                        )}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}