// src/pages/LeftoversManage.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
    Plus,
    Trash2,
    ArrowLeft,
    Sparkles,
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

export default function LeftoversManage() {
    const navigate = useNavigate();
    const [leftovers, setLeftovers] = useState<LeftoverIngredient[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newLeftover, setNewLeftover] = useState({
        ingredient_name: '',
        quantity: '',
        state: 'fresh'
    });

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

    return (
        <div className="container py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => navigate('/leftovers')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Leftovers
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                Manage Leftover Ingredients
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Add and manage ingredients you want to transform
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="hero"
                        onClick={() => navigate('/leftovers/transform')}
                        className="flex items-center gap-2"
                    >
                        <Sparkles className="h-4 w-4" />
                        Generate Ideas
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Add Leftover Form */}
                    <div>
                        <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20 h-fit">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <Plus className="h-6 w-6 text-primary" />
                                    Add New Leftover
                                </CardTitle>
                                <CardDescription className="text-lg">
                                    Add ingredients you have leftover and want to use creatively
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddLeftover} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <Label htmlFor="ingredient" className="text-base font-semibold">
                                                Ingredient Name *
                                            </Label>
                                            <Input
                                                id="ingredient"
                                                placeholder="e.g., Cooked chicken, Rice, Vegetables..."
                                                value={newLeftover.ingredient_name}
                                                onChange={(e) => setNewLeftover(prev => ({
                                                    ...prev,
                                                    ingredient_name: e.target.value
                                                }))}
                                                className="text-lg py-3"
                                                required
                                            />
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label htmlFor="quantity" className="text-base font-semibold">
                                                    Quantity
                                                </Label>
                                                <Input
                                                    id="quantity"
                                                    placeholder="e.g., 2 cups, 200g, some..."
                                                    value={newLeftover.quantity}
                                                    onChange={(e) => setNewLeftover(prev => ({
                                                        ...prev,
                                                        quantity: e.target.value
                                                    }))}
                                                    className="text-lg py-3"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="state" className="text-base font-semibold">
                                                    State
                                                </Label>
                                                <select
                                                    id="state"
                                                    value={newLeftover.state}
                                                    onChange={(e) => setNewLeftover(prev => ({
                                                        ...prev,
                                                        state: e.target.value
                                                    }))}
                                                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background"
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
                                        size="lg"
                                        className="w-full h-12 text-lg font-semibold"
                                        disabled={isAdding}
                                    >
                                        <Plus className="mr-2 h-5 w-5" />
                                        {isAdding ? 'Adding...' : 'Add Leftover Ingredient'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Current Leftovers List */}
                    <div>
                        <Card className="shadow-soft border-0 bg-gradient-to-br from-background to-muted/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <Recycle className="h-6 w-6 text-primary" />
                                    Your Leftover Ingredients
                                    <Badge variant="secondary" className="ml-2 text-lg">
                                        {leftovers.length}
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="text-lg">
                                    Ingredients available for transformation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 animate-pulse">
                                                <div className="w-4 h-4 rounded-full bg-muted"></div>
                                                <div className="h-6 bg-muted rounded w-48"></div>
                                                <div className="h-6 bg-muted rounded w-20 ml-auto"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : leftovers.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Recycle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-xl mb-2">No leftover ingredients yet</p>
                                        <p className="text-lg">Add some ingredients to get started with transformations</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {leftovers.map((leftover) => (
                                            <div
                                                key={leftover.id}
                                                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                                                    <div>
                                                        <span className="font-semibold text-lg text-green-900 block">
                                                            {leftover.ingredient_name}
                                                        </span>
                                                        <span className="text-base text-green-700">
                                                            {leftover.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="text-base bg-white text-green-800 border-green-300 px-3 py-1">
                                                        {leftover.state}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteLeftover(leftover.id)}
                                                        className="h-10 w-10 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}