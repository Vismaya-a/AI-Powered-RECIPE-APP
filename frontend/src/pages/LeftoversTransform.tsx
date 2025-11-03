// src/pages/LeftoversTransform.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
    Sparkles,
    Clock,
    ChefHat,
    Save,
    ArrowLeft,
    BookOpen,
    Recycle
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';

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

export default function LeftoversTransform() {
    const navigate = useNavigate();
    const [leftovers, setLeftovers] = useState<LeftoverIngredient[]>([]);
    const [transformations, setTransformations] = useState<TransformationSuggestion[]>([]);
    const [isTransforming, setIsTransforming] = useState(false);
    const [isSaving, setIsSaving] = useState<number | null>(null);
    const [language, setLanguage] = useState('English');

    useEffect(() => {
        loadLeftovers();
    }, []);

    const loadLeftovers = async () => {
        try {
            const leftoverIngredients = await api.getLeftoverIngredients();
            setLeftovers(leftoverIngredients);
        } catch (error: any) {
            console.error('Error loading leftovers:', error);
            toast.error('Failed to load leftover ingredients');
        }
    };

    const handleTransformLeftovers = async () => {
        if (leftovers.length === 0) {
            toast.error('Please add some leftover ingredients first');
            navigate('/leftovers/manage');
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

    const handleSaveTransformation = async (transformation: TransformationSuggestion, index: number) => {
        setIsSaving(index);
        try {
            await api.saveLeftoverTransformation({
                ...transformation,
                language: language.trim() || 'English'
            });
            toast.success('Transformation idea saved!');
        } catch (error: any) {
            console.error('Error saving transformation:', error);
            toast.error('Failed to save transformation idea');
        } finally {
            setIsSaving(null);
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

    const formatTransformationIdea = (idea: string) => {
        // Split by numbers, periods, or bullet points
        const steps = idea.split(/(?:\d+\.|\n\s*[-•]|\n\s*(?=[A-Z]))/).filter(step => step.trim().length > 0);

        if (steps.length <= 1) {
            return <p className="text-lg leading-relaxed">{idea}</p>;
        }

        return (
            <ol className="space-y-4 text-lg">
                {steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                            {index + 1}
                        </span>
                        <span className="pt-1 leading-relaxed flex-1">{step.trim()}</span>
                    </li>
                ))}
            </ol>
        );
    };

    return (
        <div className="container py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => navigate('/leftovers')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Leftovers
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                Transform Leftovers
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Generate creative recipes from your leftover ingredients
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/leftovers/saved')}
                        className="flex items-center gap-2"
                    >
                        <BookOpen className="h-4 w-4" />
                        View Saved Ideas
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Side - Controls & Leftovers List */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Transform Controls */}
                        <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    Generate Ideas
                                </CardTitle>
                                <CardDescription>
                                    Create transformation ideas from your leftover ingredients
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="transform-language" className="text-base font-semibold">
                                        Language
                                    </Label>
                                    <Input
                                        id="transform-language"
                                        type="text"
                                        placeholder="e.g., English, Spanish, French..."
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="text-lg py-3"
                                    />
                                </div>

                                <Button
                                    onClick={handleTransformLeftovers}
                                    variant="hero"
                                    size="lg"
                                    className="w-full h-12 text-lg font-semibold"
                                    disabled={isTransforming || leftovers.length === 0}
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    {isTransforming ? '✨ Generating Ideas...' : '✨ Generate Transformations'}
                                </Button>

                                {leftovers.length === 0 && (
                                    <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                                        <Recycle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                                        <p className="text-amber-800 font-medium">No leftover ingredients found</p>
                                        <Button
                                            onClick={() => navigate('/leftovers/manage')}
                                            variant="outline"
                                            className="mt-2"
                                        >
                                            Add Leftover Ingredients
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Available Leftovers */}
                        <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Recycle className="h-5 w-5 text-primary" />
                                    Available Leftovers
                                    <Badge variant="secondary" className="ml-2">
                                        {leftovers.length}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Ingredients that will be used for transformations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {leftovers.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <p>No ingredients available</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {leftovers.map((leftover) => (
                                            <div
                                                key={leftover.id}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                                            >
                                                <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <span className="font-semibold text-lg text-green-900">
                                                        {leftover.ingredient_name}
                                                    </span>
                                                    <span className="text-sm text-green-700 ml-2">
                                                        ({leftover.quantity})
                                                    </span>
                                                </div>
                                                <Badge variant="outline" className="bg-white text-green-800 border-green-300">
                                                    {leftover.state}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side - Results */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Loading State */}
                        {isTransforming && (
                            <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20 animate-pulse">
                                <CardContent className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                                            <Sparkles className="h-10 w-10 text-white animate-spin" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-semibold text-foreground">
                                                Cooking Up Creative Ideas...
                                            </h3>
                                            <p className="text-muted-foreground text-lg">
                                                Our AI chef is finding amazing ways to transform your leftovers
                                            </p>
                                        </div>
                                        <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Transformation Results */}
                        {transformations.length > 0 && !isTransforming && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-foreground mb-2">
                                        🎉 Found {transformations.length} Creative Ideas!
                                    </h2>
                                    <p className="text-muted-foreground text-lg">
                                        Choose your favorite transformation ideas below
                                    </p>
                                </div>

                                {transformations.map((transformation, index) => (
                                    <Card
                                        key={index}
                                        className="shadow-hover border-0 bg-gradient-to-br from-background to-orange-50/30 hover:shadow-xl transition-all duration-300"
                                    >
                                        <CardHeader className="bg-gradient-to-r from-orange-500/5 to-red-500/5 border-b rounded-t-lg">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                                                        {transformation.title}
                                                    </CardTitle>
                                                    <CardDescription className="text-lg text-gray-700 leading-relaxed">
                                                        {transformation.description}
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    variant="hero"
                                                    onClick={() => handleSaveTransformation(transformation, index)}
                                                    disabled={isSaving === index}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl"
                                                >
                                                    <Save className="h-4 w-4" />
                                                    {isSaving === index ? 'Saving...' : 'Save'}
                                                </Button>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-6 space-y-6">
                                            {/* Transformation Steps */}
                                            <div className="bg-white rounded-xl p-6 shadow-sm border">
                                                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                                    <ChefHat className="h-5 w-5 text-orange-500" />
                                                    Transformation Steps
                                                </h3>
                                                <div className="prose prose-lg max-w-none">
                                                    {formatTransformationIdea(transformation.transformation_idea)}
                                                </div>
                                            </div>

                                            {/* Ingredients Section */}
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {/* Used Leftovers */}
                                                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                                    <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                                                        <Recycle className="h-5 w-5 text-green-600" />
                                                        Uses Your Leftovers
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {transformation.used_leftovers.map((leftover, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-300 shadow-sm"
                                                            >
                                                                <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                                                                <span className="text-lg font-medium text-green-900">
                                                                    {leftover}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Additional Ingredients */}
                                                {transformation.additional_ingredients.length > 0 && (
                                                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                                        <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                                                            <Sparkles className="h-5 w-5 text-blue-600" />
                                                            Additional Ingredients
                                                        </h3>
                                                        <div className="space-y-3">
                                                            {transformation.additional_ingredients.map((ingredient, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-300 shadow-sm"
                                                                >
                                                                    <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                                                                    <span className="text-lg font-medium text-blue-900">
                                                                        {ingredient}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Recipe Meta */}
                                            <div className="flex flex-wrap items-center gap-4 bg-gray-50 rounded-xl p-4">
                                                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border">
                                                    <Clock className="h-5 w-5 text-orange-500" />
                                                    <div>
                                                        <div className="font-bold text-lg text-gray-900">
                                                            {formatCookingTime(transformation.cooking_time)}
                                                        </div>
                                                        <div className="text-sm text-gray-600">Cooking Time</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border">
                                                    <ChefHat className="h-5 w-5 text-orange-500" />
                                                    <div>
                                                        <Badge
                                                            className={`text-lg px-3 py-1 ${getDifficultyColor(transformation.difficulty)}`}
                                                        >
                                                            {transformation.difficulty}
                                                        </Badge>
                                                        <div className="text-sm text-gray-600 mt-1">Difficulty</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {transformations.length === 0 && !isTransforming && (
                            <Card className="text-center py-16 shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
                                <CardContent>
                                    <Sparkles className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
                                    <h3 className="text-2xl font-semibold mb-3">Ready to Transform!</h3>
                                    <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                                        Click the generate button to discover creative ways to use your {leftovers.length} leftover ingredients
                                    </p>
                                    <Button
                                        onClick={handleTransformLeftovers}
                                        variant="hero"
                                        size="lg"
                                        className="flex items-center gap-2 mx-auto"
                                        disabled={leftovers.length === 0}
                                    >
                                        <Sparkles className="h-5 w-5" />
                                        Generate Transformation Ideas
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}