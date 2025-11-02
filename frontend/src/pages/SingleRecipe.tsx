import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, Clock, ChefHat, Users, Utensils, ArrowLeft, Trash2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import type { SavedRecipe, RecipeIngredient } from '../types/api';

export default function SingleRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<SavedRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadRecipe();
    }
  }, [id]);

  const loadRecipe = async () => {
    try {
      setIsLoading(true);
      const savedRecipes = await api.getSavedRecipes();
      const foundRecipe = savedRecipes.find(r => r.id === id);
      
      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        toast.error('Recipe not found');
        navigate('/saved-recipes');
      }
    } catch (error: any) {
      console.error('Error loading recipe:', error);
      toast.error('Failed to load recipe');
      navigate('/saved-recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!recipe) return;

    setIsDeleting(true);
    try {
      await api.deleteSavedRecipe(recipe.id);
      toast.success('Recipe deleted successfully');
      navigate('/saved-recipes');
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShareRecipe = async () => {
    if (!recipe) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.recipe_title,
          text: recipe.recipe_data?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Recipe link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate('/saved-recipes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Saved Recipes
            </Button>
            <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
          <Button onClick={() => navigate('/saved-recipes')}>
            Back to Saved Recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/saved-recipes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Recipe Details
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShareRecipe}
              className="rounded-xl"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteRecipe}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Recipe Card */}
        <Card className="shadow-hover border-0 bg-gradient-to-br from-background to-muted/10">
          <CardHeader className="border-b bg-gradient-card rounded-t-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
                  {getRecipeTitle(recipe)}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                  {getRecipeDescription(recipe)}
                </CardDescription>
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

          <CardContent className="pt-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Ingredients Section */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-xl text-foreground">Ingredients</h3>
                  </div>
                  <div className="space-y-3">
                    {getRecipeIngredients(recipe).map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                        <span className="text-sm leading-relaxed">{formatIngredient(ingredient)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Nutrition Info */}
                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border">
                    <h4 className="font-semibold text-lg mb-3 text-foreground">Nutrition (per serving)</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 rounded bg-background">
                        <div className="font-bold text-primary">{getNutritionInfo(recipe).calories}</div>
                        <div className="text-muted-foreground">Calories</div>
                      </div>
                      <div className="text-center p-2 rounded bg-background">
                        <div className="font-bold text-secondary">{getNutritionInfo(recipe).protein}</div>
                        <div className="text-muted-foreground">Protein</div>
                      </div>
                      <div className="text-center p-2 rounded bg-background">
                        <div className="font-bold text-accent">{getNutritionInfo(recipe).carbs}</div>
                        <div className="text-muted-foreground">Carbs</div>
                      </div>
                      <div className="text-center p-2 rounded bg-background">
                        <div className="font-bold text-orange-500">{getNutritionInfo(recipe).fat}</div>
                        <div className="text-muted-foreground">Fat</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <ChefHat className="h-5 w-5 text-secondary" />
                  <h3 className="font-bold text-xl text-foreground">Instructions</h3>
                </div>
                <ol className="space-y-4">
                  {getRecipeInstructions(recipe).map((instruction, index) => (
                    <li
                      key={index}
                      className="flex gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-300 hover:shadow-sm"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm">
                        {index + 1}
                      </span>
                      <span className="pt-1 text-foreground leading-relaxed">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}