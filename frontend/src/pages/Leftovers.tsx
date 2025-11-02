// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
// import { UtensilsCrossed } from 'lucide-react';

// export default function Leftovers() {
//     return (
//         <div className="container py-8">
//             <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-2">Transform Leftovers</h1>
//                 <p className="text-muted-foreground">Turn your leftover ingredients into new delicious meals</p>
//             </div>

//             <Card className="text-center py-12 max-w-2xl mx-auto">
//                 <CardContent>
//                     <UtensilsCrossed className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
//                     <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
//                     <p className="text-muted-foreground">
//                         This feature will help you discover creative ways to use your leftovers
//                     </p>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import {
    UtensilsCrossed,
    Plus,
    Trash2,
    Sparkles,
    Clock,
    ChefHat,
    Users
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';

interface LeftoverIngredient {
    id: number;
    ingredient_name: string;
    quantity: string;
    state: string;
}

interface TransformationSuggestion {
    title: string;
    description: string;
    transformation_idea: string;
    used_leftovers: string[];
    additional_ingredients: string[];
    cooking_time: number;
    difficulty: string;
}

export default function Leftovers() {
    const [leftovers, setLeftovers] = useState<LeftoverIngredient[]>([]);
    const [transformations, setTransformations] = useState<TransformationSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newLeftover, setNewLeftover] = useState({
        ingredient_name: '',
        quantity: '',
        state: 'fresh'
    });
    const [language, setLanguage] = useState('English');

    useEffect(() => {
        loadLeftovers();
    }, []);

    const loadLeftovers = async () => {
        try {
            setIsLoading(true);
            const leftoverIngredients = await api.getLeftoverIngredients();
            setLeftovers(leftoverIngredients);
        } catch (error: any) {
            console.error('Error loading leftovers:', error);
            toast.error('Failed to load leftover ingredients');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLeftover = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newLeftover.ingredient_name.trim()) {
            toast.error('Please enter an ingredient name');
            return;
        }

        setIsAdding(true);
        try {
            const addedLeftover = await api.addLeftoverIngredient({
                ingredient_name: newLeftover.ingredient_name.trim(),
                quantity: newLeftover.quantity.trim() || 'some',
                state: newLeftover.state
            });

            setLeftovers(prev => [...prev, addedLeftover]);
            setNewLeftover({ ingredient_name: '', quantity: '', state: 'fresh' });
            toast.success('Leftover ingredient added!');
        } catch (error: any) {
            console.error('Error adding leftover:', error);
            toast.error('Failed to add leftover ingredient');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteLeftover = async (id: number) => {
        try {
            await api.deleteLeftoverIngredient(id);
            setLeftovers(prev => prev.filter(item => item.id !== id));
            toast.success('Leftover ingredient removed');
        } catch (error: any) {
            console.error('Error deleting leftover:', error);
            toast.error('Failed to delete leftover ingredient');
        }
    };

    const handleTransformLeftovers = async () => {
        if (leftovers.length === 0) {
            toast.error('Please add some leftover ingredients first');
            return;
        }

        setIsTransforming(true);
        setTransformations([]);

        try {
            const suggestions = await api.transformLeftovers({
                language: language.trim() || 'English'
            });
            setTransformations(suggestions);
            toast.success('Found creative ways to use your leftovers!');
        } catch (error: any) {
            console.error('Error transforming leftovers:', error);
            toast.error(error.message || 'Failed to transform leftovers');
        } finally {
            setIsTransforming(false);
        }
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

    const formatCookingTime = (minutes: number) => {
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
    };

    return (
        <div className="container py-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        Transform Leftovers
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Turn your leftover ingredients into new delicious meals with AI magic
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left Side: Manage Leftovers */}
                    <div className="space-y-6">
                        {/* Add Leftover Form */}
                        <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-primary" />
                                    Add Leftover Ingredient
                                </CardTitle>
                                <CardDescription>
                                    Add ingredients you have leftover and want to use
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddLeftover} className="space-y-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="ingredient">Ingredient Name *</Label>
                                            <Input
                                                id="ingredient"
                                                placeholder="e.g., Cooked chicken, Rice, Vegetables..."
                                                value={newLeftover.ingredient_name}
                                                onChange={(e) => setNewLeftover(prev => ({
                                                    ...prev,
                                                    ingredient_name: e.target.value
                                                }))}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="quantity">Quantity</Label>
                                                <Input
                                                    id="quantity"
                                                    placeholder="e.g., 2 cups, 200g, some..."
                                                    value={newLeftover.quantity}
                                                    onChange={(e) => setNewLeftover(prev => ({
                                                        ...prev,
                                                        quantity: e.target.value
                                                    }))}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="state">State</Label>
                                                <select
                                                    id="state"
                                                    value={newLeftover.state}
                                                    onChange={(e) => setNewLeftover(prev => ({
                                                        ...prev,
                                                        state: e.target.value
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                                                >
                                                    <option value="fresh">Fresh</option>
                                                    <option value="cooked">Cooked</option>
                                                    <option value="frozen">Frozen</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="hero"
                                        className="w-full"
                                        disabled={isAdding}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {isAdding ? 'Adding...' : 'Add Leftover'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Current Leftovers List */}
                        <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                                    Your Leftover Ingredients
                                    <Badge variant="secondary" className="ml-2">
                                        {leftovers.length}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Ingredients available for transformation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 animate-pulse">
                                                <div className="w-3 h-3 rounded-full bg-muted"></div>
                                                <div className="h-4 bg-muted rounded w-32"></div>
                                                <div className="h-4 bg-muted rounded w-16 ml-auto"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : leftovers.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No leftover ingredients yet</p>
                                        <p className="text-sm">Add some ingredients to get started</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {leftovers.map((leftover) => (
                                            <div
                                                key={leftover.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                    <div>
                                                        <span className="font-medium">{leftover.ingredient_name}</span>
                                                        <span className="text-sm text-muted-foreground ml-2">
                                                            ({leftover.quantity})
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {leftover.state}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteLeftover(leftover.id)}
                                                    className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Transformations */}
                    <div className="space-y-6">
                        {/* Transform Button */}
                        <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    Transform Your Leftovers
                                </CardTitle>
                                <CardDescription>
                                    Let AI suggest creative recipes using your leftover ingredients
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="transform-language">Language for Suggestions</Label>
                                    <Input
                                        id="transform-language"
                                        type="text"
                                        placeholder="e.g., English, Spanish, French..."
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    />
                                </div>

                                <Button
                                    onClick={handleTransformLeftovers}
                                    variant="hero"
                                    size="lg"
                                    className="w-full"
                                    disabled={isTransforming || leftovers.length === 0}
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    {isTransforming ? '✨ Finding Ideas...' : '✨ Transform Leftovers'}
                                </Button>

                                {leftovers.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        Add some leftover ingredients first to transform them
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Loading State for Transformations */}
                        {isTransforming && (
                            <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20 animate-pulse">
                                <CardContent className="p-8 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                                            <Sparkles className="h-8 w-8 text-white animate-spin" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-semibold text-foreground">
                                                Cooking up ideas...
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Our AI is finding creative ways to use your leftovers
                                            </p>
                                        </div>
                                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Transformation Results */}
                        {transformations.length > 0 && !isTransforming && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-foreground">
                                    Transformation Ideas ({transformations.length})
                                </h3>

                                {transformations.map((transformation, index) => (
                                    <Card
                                        key={index}
                                        className="shadow-hover border-0 bg-gradient-to-br from-background to-muted/10 animate-in fade-in-50 duration-500"
                                    >
                                        <CardHeader>
                                            <CardTitle className="text-lg bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                                {transformation.title}
                                            </CardTitle>
                                            <CardDescription className="text-base leading-relaxed">
                                                {transformation.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Transformation Idea */}
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-2">Transformation Idea</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {transformation.transformation_idea}
                                                </p>
                                            </div>

                                            {/* Used Leftovers */}
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-2">Uses Your Leftovers</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {transformation.used_leftovers.map((leftover, idx) => (
                                                        <Badge
                                                            key={idx}
                                                            variant="secondary"
                                                            className="bg-green-100 text-green-800 border-green-200"
                                                        >
                                                            {leftover}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Additional Ingredients */}
                                            {transformation.additional_ingredients.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-2">Additional Ingredients Needed</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {transformation.additional_ingredients.map((ingredient, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                variant="outline"
                                                                className="bg-blue-100 text-blue-800 border-blue-200"
                                                            >
                                                                {ingredient}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recipe Meta */}
                                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-lg">
                                                    <Clock className="h-3 w-3 text-primary" />
                                                    <span className="text-xs font-medium">
                                                        {formatCookingTime(transformation.cooking_time)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-lg">
                                                    <ChefHat className="h-3 w-3 text-secondary" />
                                                    <Badge
                                                        variant="outline"
                                                        className={`border text-xs ${getDifficultyColor(transformation.difficulty)}`}
                                                    >
                                                        {transformation.difficulty}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* No Results State */}
                        {transformations.length === 0 && !isTransforming && leftovers.length > 0 && (
                            <Card className="text-center py-12 shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
                                <CardContent>
                                    <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Ready to Transform!</h3>
                                    <p className="text-muted-foreground">
                                        Click the button above to discover creative ways to use your {leftovers.length} leftover ingredients
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}