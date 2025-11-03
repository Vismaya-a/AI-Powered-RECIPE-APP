// src/pages/LeftoversSaved.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    ArrowLeft,
    Eye,
    Trash2,
    Clock,
    ChefHat,
   Recycle,
    Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';

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

export default function LeftoversSaved() {
    const navigate = useNavigate();
    const [transformations, setTransformations] = useState<SavedTransformation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        loadSavedTransformations();
    }, []);

    const loadSavedTransformations = async () => {
        try {
            setIsLoading(true);
            const savedTransformations = await api.getSavedTransformations();
            setTransformations(savedTransformations);
        } catch (error: any) {
            console.error('Error loading saved transformations:', error);
            toast.error('Failed to load saved transformations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTransformation = async (id: number) => {
        setDeletingId(id);
        try {
            await api.deleteSavedTransformation(id);
            setTransformations(prev => prev.filter(item => item.id !== id));
            toast.success('Transformation deleted successfully');
        } catch (error: any) {
            console.error('Error deleting transformation:', error);
            toast.error('Failed to delete transformation');
        } finally {
            setDeletingId(null);
        }
    };

    const handleViewTransformation = (id: number) => {
        navigate(`/leftovers/saved/${id}`);
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
            day: 'numeric'
        });
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
                                Saved Transformation Ideas
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Your collection of creative leftover transformation ideas
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="hero"
                        onClick={() => navigate('/leftovers/transform')}
                        className="flex items-center gap-2"
                    >
                        <Sparkles className="h-4 w-4" />
                        Generate New Ideas
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                    <div className="h-4 bg-muted rounded w-2/3"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : transformations.length === 0 ? (
                    <Card className="text-center py-16 shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
                        <CardContent>
                            <Sparkles className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
                            <h3 className="text-2xl font-semibold mb-3">No Saved Transformations Yet</h3>
                            <p className="text-muted-foreground text-lg mb-6">
                                Start by generating some creative transformation ideas for your leftovers
                            </p>
                            <Button
                                onClick={() => navigate('/leftovers/transform')}
                                variant="hero"
                                size="lg"
                                className="flex items-center gap-2 mx-auto"
                            >
                                <Sparkles className="h-5 w-5" />
                                Generate Transformation Ideas
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {transformations.map((transformation) => (
                            <Card
                                key={transformation.id}
                                className="shadow-hover border-0 bg-gradient-to-br from-background to-muted/10 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                                onClick={() => handleViewTransformation(transformation.id)}
                            >
                                <CardHeader className="border-b bg-gradient-card rounded-t-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-2xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover:text-orange-600 transition-colors">
                                                {transformation.title}
                                            </CardTitle>
                                            <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                                                {transformation.description}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewTransformation(transformation.id);
                                                }}
                                                className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="View full transformation"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteTransformation(transformation.id);
                                                }}
                                                disabled={deletingId === transformation.id}
                                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-xl"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Meta Information */}
                                    <div className="flex flex-wrap items-center gap-4 mt-6">
                                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">
                                                {formatCookingTime(transformation.cooking_time)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-lg">
                                            <ChefHat className="h-4 w-4 text-secondary" />
                                            <Badge
                                                variant="outline"
                                                className={`border-2 font-medium ${getDifficultyColor(transformation.difficulty)}`}
                                            >
                                                {transformation.difficulty}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Saved on {formatDate(transformation.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Used Leftovers Preview */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <div className="flex items-center gap-2">
                                            <Recycle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-700">Uses:</span>
                                        </div>
                                        {transformation.used_leftovers.slice(0, 3).map((leftover, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="bg-green-100 text-green-800 border-green-200"
                                            >
                                                {leftover}
                                            </Badge>
                                        ))}
                                        {transformation.used_leftovers.length > 3 && (
                                            <Badge variant="outline" className="text-green-700">
                                                +{transformation.used_leftovers.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6">
                                    <div className="grid gap-6 lg:grid-cols-2">
                                        {/* Transformation Idea Preview */}
                                        <div className="lg:col-span-2">
                                            <h4 className="font-semibold text-lg text-foreground mb-3">Transformation Idea</h4>
                                            <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                                {transformation.transformation_idea}
                                            </p>
                                        </div>

                                        {/* Additional Ingredients Preview */}
                                        {transformation.additional_ingredients.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-lg text-foreground mb-2">Additional Ingredients</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {transformation.additional_ingredients.slice(0, 3).map((ingredient, idx) => (
                                                        <Badge
                                                            key={idx}
                                                            variant="outline"
                                                            className="bg-blue-100 text-blue-800 border-blue-200"
                                                        >
                                                            {ingredient}
                                                        </Badge>
                                                    ))}
                                                    {transformation.additional_ingredients.length > 3 && (
                                                        <Badge variant="outline" className="text-blue-700">
                                                            +{transformation.additional_ingredients.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
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