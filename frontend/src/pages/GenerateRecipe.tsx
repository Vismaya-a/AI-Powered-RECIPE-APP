// import { useState } from 'react';
// import { Button } from '../components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
// import { Input } from '../components/ui/input';
// import { Label } from '../components/ui/label';
// import { Textarea } from '../components/ui/textarea';
// import { Badge } from '../components/ui/badge';
// import { Sparkles, Clock, ChefHat, Save, Users, Utensils, BookOpen } from 'lucide-react';
// import { toast } from 'sonner';
// import { api } from '../utils/api';
// import { useNavigate } from 'react-router-dom';

// interface NutritionInfo {
//   calories: string;
//   protein: string;
//   carbs: string;
//   fat: string;
// }

// interface RecipeIngredient {
//   name: string;
//   quantity: string;
//   unit: string;
// }

// interface Recipe {
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

// interface RecipeGenerationRequest {
//   theme: string;
//   language: string;
//   use_pantry?: boolean;
//   ingredients?: string[];
// }

// interface RecipeResponse {
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

// export default function GenerateRecipe() {
//   const navigate = useNavigate();
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [recipe, setRecipe] = useState<Recipe | null>(null);
//   const [theme, setTheme] = useState('');
//   const [language, setLanguage] = useState('English');
//   const [usePantry, setUsePantry] = useState(false);

//   const handleGenerate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!theme.trim()) {
//       toast.error('Please enter a recipe theme or main ingredient');
//       return;
//     }

//     setIsGenerating(true);
//     setRecipe(null); // Clear previous recipe

//     try {
//       const requestData: RecipeGenerationRequest = {
//         theme: theme.trim(),
//         language: language.trim() || 'English',
//         use_pantry: usePantry
//       };

//       const generatedRecipe = await api.generateRecipe(requestData);

//       // Convert RecipeResponse to Recipe
//       const recipeData: Recipe = {
//         id: generatedRecipe.id,
//         title: generatedRecipe.title,
//         description: generatedRecipe.description,
//         ingredients: generatedRecipe.ingredients,
//         instructions: generatedRecipe.instructions,
//         cooking_time: generatedRecipe.cooking_time,
//         difficulty: generatedRecipe.difficulty,
//         nutrition_info: generatedRecipe.nutrition_info,
//         tags: generatedRecipe.tags,
//         servings: generatedRecipe.servings
//       };

//       setRecipe(recipeData);
//       toast.success('Recipe generated successfully!');
//     } catch (error: any) {
//       console.error('Error generating recipe:', error);
//       toast.error(error.message || 'Failed to generate recipe. Please try again.');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSaveRecipe = async () => {
//     if (!recipe) return;

//     setIsSaving(true);
//     try {
//       await api.saveGeneratedRecipe(recipe);
//       toast.success('Recipe saved to your collection!');
//     } catch (error: any) {
//       console.error('Error saving recipe:', error);
//       toast.error('Failed to save recipe. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const formatIngredient = (ingredient: RecipeIngredient): string => {
//     return `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`;
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty.toLowerCase()) {
//       case 'easy':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'medium':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'hard':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   return (
//     <div className="container py-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div className="text-center flex-1">
//             <h1 className="text-3xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
//               AI Recipe Generator
//             </h1>
//             <p className="text-muted-foreground text-lg">
//               Create personalized recipes powered by AI magic
//             </p>
//           </div>
//           <Button
//             variant="outline"
//             onClick={() => navigate('/saved-recipes')}
//             className="flex items-center gap-2"
//           >
//             <BookOpen className="h-4 w-4" />
//             View Saved Recipes
//           </Button>
//         </div>

//         {/* Recipe Generation Form */}
//         <Card className="mb-8 shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
//           <CardHeader className="text-center pb-4">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-hero flex items-center justify-center">
//               <Sparkles className="h-8 w-8 text-white" />
//             </div>
//             <CardTitle className="text-2xl">Create Your Recipe</CardTitle>
//             <CardDescription className="text-base">
//               Tell us what you're craving and let AI work its magic
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleGenerate} className="space-y-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="theme" className="text-base font-semibold">
//                     What would you like to cook? *
//                   </Label>
//                   <Textarea
//                     id="theme"
//                     placeholder="e.g., Chicken curry, Vegetarian pasta, Chocolate cake, Quick breakfast..."
//                     value={theme}
//                     onChange={(e) => setTheme(e.target.value)}
//                     rows={3}
//                     className="resize-none text-lg"
//                     required
//                   />
//                   <p className="text-sm text-muted-foreground">
//                     Describe the main ingredient, cuisine type, or dish you're craving
//                   </p>
//                 </div>

//                 <div className="grid gap-6 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <Label htmlFor="language" className="text-base font-semibold">
//                       Language
//                     </Label>
//                     <Input
//                       id="language"
//                       type="text"
//                       placeholder="e.g., English, Spanish, French, Hindi..."
//                       value={language}
//                       onChange={(e) => setLanguage(e.target.value)}
//                       className="text-lg"
//                     />
//                     <p className="text-sm text-muted-foreground">
//                       Enter the language for the recipe (e.g., English, Spanish, French)
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-base font-semibold block">
//                       Use Pantry Ingredients
//                     </Label>
//                     <div className="flex items-center space-x-2 p-3 border rounded-lg bg-background">
//                       <input
//                         type="checkbox"
//                         id="usePantry"
//                         checked={usePantry}
//                         onChange={(e) => setUsePantry(e.target.checked)}
//                         className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//                       />
//                       <Label htmlFor="usePantry" className="text-sm cursor-pointer">
//                         Include ingredients from my pantry
//                       </Label>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 variant="hero"
//                 size="lg"
//                 className="w-full h-12 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
//                 disabled={isGenerating}
//               >
//                 <Sparkles className="mr-3 h-5 w-5" />
//                 {isGenerating ? '✨ Generating Your Recipe...' : '✨ Generate Recipe'}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Loading State */}
//         {isGenerating && (
//           <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20 animate-pulse">
//             <CardContent className="p-12 text-center">
//               <div className="flex flex-col items-center justify-center space-y-4">
//                 <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
//                   <Sparkles className="h-8 w-8 text-white animate-spin" />
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-semibold text-foreground">
//                     Cooking up your recipe...
//                   </h3>
//                   <p className="text-muted-foreground">
//                     Our AI chef is carefully crafting your perfect recipe
//                   </p>
//                 </div>
//                 <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
//                   <div className="h-full bg-gradient-hero animate-pulse"></div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Generated Recipe Display */}
//         {recipe && !isGenerating && (
//           <Card className="shadow-hover border-0 bg-gradient-to-br from-background to-muted/10 animate-in fade-in-50 duration-500">
//             <CardHeader className="border-b bg-gradient-card rounded-t-lg">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <CardTitle className="text-3xl font-bold mb-3 bg-gradient-hero bg-clip-text text-transparent">
//                     {recipe.title}
//                   </CardTitle>
//                   <CardDescription className="text-lg text-muted-foreground leading-relaxed">
//                     {recipe.description}
//                   </CardDescription>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="secondary"
//                     size="icon"
//                     onClick={handleSaveRecipe}
//                     disabled={isSaving}
//                     className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
//                   >
//                     <Save className="h-5 w-5" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => navigate('/saved-recipes')}
//                     className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
//                   >
//                     <BookOpen className="h-5 w-5" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Recipe Meta Information */}
//               <div className="flex flex-wrap items-center gap-4 mt-6">
//                 <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
//                   <Clock className="h-4 w-4 text-primary" />
//                   <span className="text-sm font-medium">{recipe.cooking_time}</span>
//                 </div>
//                 <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-lg">
//                   <ChefHat className="h-4 w-4 text-secondary" />
//                   <Badge
//                     variant="outline"
//                     className={`border-2 font-medium ${getDifficultyColor(recipe.difficulty)}`}
//                   >
//                     {recipe.difficulty}
//                   </Badge>
//                 </div>
//                 <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
//                   <Users className="h-4 w-4 text-accent" />
//                   <span className="text-sm font-medium">{recipe.servings} servings</span>
//                 </div>
//               </div>

//               {/* Tags */}
//               <div className="flex flex-wrap gap-2 mt-4">
//                 {recipe.tags.map((tag) => (
//                   <Badge
//                     key={tag}
//                     variant="secondary"
//                     className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
//                   >
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </CardHeader>

//             <CardContent className="pt-8">
//               <div className="grid gap-8 lg:grid-cols-3">
//                 {/* Ingredients Section */}
//                 <div className="lg:col-span-1">
//                   <div className="sticky top-8">
//                     <div className="flex items-center gap-2 mb-4">
//                       <Utensils className="h-5 w-5 text-primary" />
//                       <h3 className="font-bold text-xl text-foreground">Ingredients</h3>
//                     </div>
//                     <div className="space-y-3">
//                       {recipe.ingredients.map((ingredient, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
//                         >
//                           <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
//                           <span className="text-sm leading-relaxed">{formatIngredient(ingredient)}</span>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Nutrition Info */}
//                     <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border">
//                       <h4 className="font-semibold text-lg mb-3 text-foreground">Nutrition (per serving)</h4>
//                       <div className="grid grid-cols-2 gap-3 text-sm">
//                         <div className="text-center p-2 rounded bg-background">
//                           <div className="font-bold text-primary">{recipe.nutrition_info.calories}</div>
//                           <div className="text-muted-foreground">Calories</div>
//                         </div>
//                         <div className="text-center p-2 rounded bg-background">
//                           <div className="font-bold text-secondary">{recipe.nutrition_info.protein}</div>
//                           <div className="text-muted-foreground">Protein</div>
//                         </div>
//                         <div className="text-center p-2 rounded bg-background">
//                           <div className="font-bold text-accent">{recipe.nutrition_info.carbs}</div>
//                           <div className="text-muted-foreground">Carbs</div>
//                         </div>
//                         <div className="text-center p-2 rounded bg-background">
//                           <div className="font-bold text-orange-500">{recipe.nutrition_info.fat}</div>
//                           <div className="text-muted-foreground">Fat</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Instructions Section */}
//                 <div className="lg:col-span-2">
//                   <div className="flex items-center gap-2 mb-6">
//                     <ChefHat className="h-5 w-5 text-secondary" />
//                     <h3 className="font-bold text-xl text-foreground">Instructions</h3>
//                   </div>
//                   <ol className="space-y-4">
//                     {recipe.instructions.map((instruction, index) => (
//                       <li
//                         key={index}
//                         className="flex gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-300 hover:shadow-sm"
//                       >
//                         <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm">
//                           {index + 1}
//                         </span>
//                         <span className="pt-1 text-foreground leading-relaxed">{instruction}</span>
//                       </li>
//                     ))}
//                   </ol>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Sparkles, Clock, ChefHat, Save, Users, Utensils, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import type { Recipe, RecipeGenerationRequest, RecipeResponse ,RecipeIngredient} from '../types/api';

export default function GenerateRecipe() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [theme, setTheme] = useState('');
  const [language, setLanguage] = useState('English');
  const [usePantry, setUsePantry] = useState(false);

  // const handleGenerate = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!theme.trim()) {
  //     toast.error('Please enter a recipe theme or main ingredient');
  //     return;
  //   }

  //   setIsGenerating(true);
  //   setRecipe(null); // Clear previous recipe

  //   try {
  //     const requestData: RecipeGenerationRequest = {
  //       theme: theme.trim(),
  //       language: language.trim() || 'English',
  //       use_pantry: usePantry
  //     };

  //     const generatedRecipe: RecipeResponse = await api.generateRecipe(requestData);

  //     // Convert RecipeResponse to Recipe (they should be compatible now)
  //     const recipeData: Recipe = {
  //       id: generatedRecipe.id,
  //       title: generatedRecipe.title,
  //       description: generatedRecipe.description,
  //       ingredients: generatedRecipe.ingredients,
  //       instructions: generatedRecipe.instructions,
  //       cooking_time: generatedRecipe.cooking_time,
  //       difficulty: generatedRecipe.difficulty,
  //       nutrition_info: generatedRecipe.nutrition_info,
  //       tags: generatedRecipe.tags,
  //       servings: generatedRecipe.servings
  //     };

  //     setRecipe(recipeData);
  //     toast.success('Recipe generated successfully!');
  //   } catch (error: any) {
  //     console.error('Error generating recipe:', error);
  //     toast.error(error.message || 'Failed to generate recipe. Please try again.');
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!theme.trim()) {
      toast.error('Please enter a recipe theme or main ingredient');
      return;
    }

    setIsGenerating(true);
    setRecipe(null); // Clear previous recipe

    try {
      const requestData: RecipeGenerationRequest = {
        theme: theme.trim(),
        language: language.trim() || 'English',
        use_pantry: usePantry
      };

      const generatedRecipe: RecipeResponse = await api.generateRecipe(requestData);

      // Convert RecipeResponse to Recipe (they should be compatible now)
      const recipeData: Recipe = {
        id: generatedRecipe.id,
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        ingredients: generatedRecipe.ingredients,
        instructions: generatedRecipe.instructions,
        cooking_time: generatedRecipe.cooking_time,
        difficulty: generatedRecipe.difficulty,
        nutrition_info: generatedRecipe.nutrition_info,
        tags: generatedRecipe.tags,
        servings: generatedRecipe.servings
      };

      setRecipe(recipeData);
      toast.success('Recipe generated successfully!');
    } catch (error: any) {
      console.error('Error generating recipe:', error);
      toast.error(error.message || 'Failed to generate recipe. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  // const handleSaveRecipe = async () => {
  //   if (!recipe) return;

  //   setIsSaving(true);
  //   try {
  //     await api.saveGeneratedRecipe(recipe);
  //     toast.success('Recipe saved to your collection!');
  //   } catch (error: any) {
  //     console.error('Error saving recipe:', error);
  //     toast.error('Failed to save recipe. Please try again.');
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  const handleSaveRecipe = async () => {
    if (!recipe) return;

    setIsSaving(true);
    try {
      await api.saveGeneratedRecipe(recipe);
      toast.success('Recipe saved to your collection!');
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      toast.error('Failed to save recipe. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  // const formatIngredient = (ingredient: RecipeIngredient): string => {
  //   return `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`.trim();
  // };
  const formatIngredient = (ingredient: RecipeIngredient): string => {
    return `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`.trim();
  };


  // const getDifficultyColor = (difficulty: string) => {
  //   switch (difficulty.toLowerCase()) {
  //     case 'easy':
  //       return 'bg-green-100 text-green-800 border-green-200';
  //     case 'medium':
  //       return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  //     case 'hard':
  //       return 'bg-red-100 text-red-800 border-red-200';
  //     default:
  //       return 'bg-gray-100 text-gray-800 border-gray-200';
  //   }
  // };

  // ... rest of your component JSX remains the same
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

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
              AI Recipe Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Create personalized recipes powered by AI magic
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/saved-recipes')}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            View Saved Recipes
          </Button>
        </div>

        {/* Recipe Generation Form */}
        <Card className="mb-8 shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-hero flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Create Your Recipe</CardTitle>
            <CardDescription className="text-base">
              Tell us what you're craving and let AI work its magic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-base font-semibold">
                    What would you like to cook? *
                  </Label>
                  <Textarea
                    id="theme"
                    placeholder="e.g., Chicken curry, Vegetarian pasta, Chocolate cake, Quick breakfast..."
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    rows={3}
                    className="resize-none text-lg"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Describe the main ingredient, cuisine type, or dish you're craving
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-base font-semibold">
                      Language
                    </Label>
                    <Input
                      id="language"
                      type="text"
                      placeholder="e.g., English, Spanish, French, Hindi..."
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="text-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the language for the recipe (e.g., English, Spanish, French)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold block">
                      Use Pantry Ingredients
                    </Label>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-background">
                      <input
                        type="checkbox"
                        id="usePantry"
                        checked={usePantry}
                        onChange={(e) => setUsePantry(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="usePantry" className="text-sm cursor-pointer">
                        Include ingredients from my pantry
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full h-12 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
                disabled={isGenerating}
              >
                <Sparkles className="mr-3 h-5 w-5" />
                {isGenerating ? '✨ Generating Your Recipe...' : '✨ Generate Recipe'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isGenerating && (
          <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20 animate-pulse">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Cooking up your recipe...
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI chef is carefully crafting your perfect recipe
                  </p>
                </div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-hero animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Recipe Display */}
        {recipe && !isGenerating && (
          <Card className="shadow-hover border-0 bg-gradient-to-br from-background to-muted/10 animate-in fade-in-50 duration-500">
            <CardHeader className="border-b bg-gradient-card rounded-t-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold mb-3 bg-gradient-hero bg-clip-text text-transparent">
                    {recipe.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                    {recipe.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleSaveRecipe}
                    disabled={isSaving}
                    className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Save className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate('/saved-recipes')}
                    className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <BookOpen className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Recipe Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{recipe.cooking_time}</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-lg">
                  <ChefHat className="h-4 w-4 text-secondary" />
                  <Badge
                    variant="outline"
                    className={`border-2 font-medium ${getDifficultyColor(recipe.difficulty)}`}
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{recipe.servings} servings</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {recipe.tags.map((tag) => (
                  <Badge
                    key={tag}
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
                      {recipe.ingredients.map((ingredient, index) => (
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
                          <div className="font-bold text-primary">{recipe.nutrition_info.calories}</div>
                          <div className="text-muted-foreground">Calories</div>
                        </div>
                        <div className="text-center p-2 rounded bg-background">
                          <div className="font-bold text-secondary">{recipe.nutrition_info.protein}</div>
                          <div className="text-muted-foreground">Protein</div>
                        </div>
                        <div className="text-center p-2 rounded bg-background">
                          <div className="font-bold text-accent">{recipe.nutrition_info.carbs}</div>
                          <div className="text-muted-foreground">Carbs</div>
                        </div>
                        <div className="text-center p-2 rounded bg-background">
                          <div className="font-bold text-orange-500">{recipe.nutrition_info.fat}</div>
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
                    {recipe.instructions.map((instruction, index) => (
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
        )}
      </div>
    </div>
  );
}