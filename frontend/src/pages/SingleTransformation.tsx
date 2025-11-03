// src/pages/SingleTransformation.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    ArrowLeft,
    Clock,
    ChefHat,
   Recycle,
    Sparkles,
    Trash2,
    Calendar,
    Languages
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';

interface SavedTransformation {
    id: number;
    title: string;
    description: string;
    transformation_idea: string;
    used_leftovers: string[];
    additional_ingredients: string[];
    cooking_time: number;
    difficulty: string;
    language: string;
    created_at: string;
}

export default function SingleTransformation() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [transformation, setTransformation] = useState<SavedTransformation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (id) {
            loadTransformation();
        }
    }, [id]);

    const loadTransformation = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                throw new Error('Invalid transformation ID');
            }

            const transformationData = await api.getSavedTransformationById(numericId);
            setTransformation(transformationData);
        } catch (error: any) {
            console.error('Error loading transformation:', error);
            toast.error('Failed to load transformation');
            navigate('/leftovers/saved');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTransformation = async () => {
        if (!transformation) return;

        setIsDeleting(true);
        try {
            await api.deleteSavedTransformation(transformation.id);
            toast.success('Transformation deleted successfully');
            navigate('/leftovers/saved');
        } catch (error: any) {
            console.error('Error deleting transformation:', error);
            toast.error('Failed to delete transformation');
        } finally {
            setIsDeleting(false);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTransformationIdea = (idea: string) => {
        // Split by numbers, periods, or bullet points
        const steps = idea.split(/(?:\d+\.|\n\s*[-•]|\n\s*(?=[A-Z]))/).filter(step => step.trim().length > 0);

        if (steps.length <= 1) {
            return <p className="text-lg leading-relaxed text-gray-700">{idea}</p>;
        }

        return (
            <ol className="space-y-4">
                {steps.map((step, index) => (
                    <li key={index} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                            {index + 1}
                        </span>
                        <span className="pt-1 text-lg leading-relaxed text-gray-700 flex-1">{step.trim()}</span>
                    </li>
                ))}
            </ol>
        );
    };

    if (isLoading) {
        return (
            <div className="container py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="outline" onClick={() => navigate('/leftovers/saved')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Saved Ideas
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

    if (!transformation) {
        return (
            <div className="container py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">Transformation Not Found</h1>
                    <Button onClick={() => navigate('/leftovers/saved')}>
                        Back to Saved Transformations
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
                        <Button variant="outline" onClick={() => navigate('/leftovers/saved')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Saved Ideas
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                Transformation Idea
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Detailed view of your creative leftover transformation
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDeleteTransformation}
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Main Transformation Card */}
                <Card className="shadow-hover border-0 bg-gradient-to-br from-background to-orange-50/30 mb-8">
                    <CardHeader className="bg-gradient-to-r from-orange-500/5 to-red-500/5 border-b rounded-t-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                                    {transformation.title}
                                </CardTitle>
                                <CardDescription className="text-xl text-gray-700 leading-relaxed">
                                    {transformation.description}
                                </CardDescription>
                            </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 mt-6">
                            <div className="flex items-center gap-2 bg-primary/10 px-4 py-3 rounded-lg">
                                <Clock className="h-5 w-5 text-primary" />
                                <div>
                                    <div className="font-bold text-lg text-gray-900">
                                        {formatCookingTime(transformation.cooking_time)}
                                    </div>
                                    <div className="text-sm text-gray-600">Cooking Time</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/10 px-4 py-3 rounded-lg">
                                <ChefHat className="h-5 w-5 text-secondary" />
                                <div>
                                    <Badge
                                        className={`text-lg px-4 py-2 ${getDifficultyColor(transformation.difficulty)}`}
                                    >
                                        {transformation.difficulty}
                                    </Badge>
                                    <div className="text-sm text-gray-600 mt-1">Difficulty</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-100 px-4 py-3 rounded-lg">
                                <Languages className="h-5 w-5 text-blue-600" />
                                <div>
                                    <div className="font-bold text-lg text-blue-900">
                                        {transformation.language}
                                    </div>
                                    <div className="text-sm text-blue-700">Language</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-lg">
                                <Calendar className="h-5 w-5 text-gray-600" />
                                <div>
                                    <div className="font-bold text-lg text-gray-900">
                                        {formatDate(transformation.created_at)}
                                    </div>
                                    <div className="text-sm text-gray-600">Saved On</div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-8 space-y-8">
                        {/* Transformation Steps */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-orange-500" />
                                Transformation Steps
                            </h2>
                            <div className="prose prose-lg max-w-none">
                                {formatTransformationIdea(transformation.transformation_idea)}
                            </div>
                        </div>

                        {/* Ingredients Section */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Used Leftovers */}
                            <Card className="bg-green-50 border-green-200">
                                <CardHeader className="bg-green-100 border-b border-green-200 rounded-t-lg">
                                    <CardTitle className="flex items-center gap-3 text-xl text-green-900">
                                        <Recycle className="h-5 w-5 text-green-600" />
                                        Uses Your Leftovers
                                    </CardTitle>
                                    <CardDescription className="text-green-700">
                                        These are the leftover ingredients you'll be transforming
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        {transformation.used_leftovers.map((leftover, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-green-300 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                                                <span className="text-lg font-medium text-green-900">
                                                    {leftover}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Ingredients */}
                            {transformation.additional_ingredients.length > 0 && (
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardHeader className="bg-blue-100 border-b border-blue-200 rounded-t-lg">
                                        <CardTitle className="flex items-center gap-3 text-xl text-blue-900">
                                            <Sparkles className="h-5 w-5 text-blue-600" />
                                            Additional Ingredients
                                        </CardTitle>
                                        <CardDescription className="text-blue-700">
                                            These ingredients will complete your transformation
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-3">
                                            {transformation.additional_ingredients.map((ingredient, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-300 shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                                                    <span className="text-lg font-medium text-blue-900">
                                                        {ingredient}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                            <CardHeader>
                                <CardTitle className="text-xl text-orange-900">
                                    Ready to Cook?
                                </CardTitle>
                                <CardDescription className="text-orange-700">
                                    Start transforming your leftovers into this delicious creation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        variant="hero"
                                        size="lg"
                                        className="flex items-center gap-2"
                                        onClick={() => window.print()}
                                    >
                                        <Sparkles className="h-5 w-5" />
                                        Print Recipe
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex items-center gap-2"
                                        onClick={() => navigate('/leftovers/transform')}
                                    >
                                        <Recycle className="h-5 w-5" />
                                        Generate More Ideas
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex items-center gap-2"
                                        onClick={() => navigate('/leftovers/manage')}
                                    >
                                        <ChefHat className="h-5 w-5" />
                                        Add More Leftovers
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}