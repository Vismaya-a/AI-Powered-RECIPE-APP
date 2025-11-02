import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ChefHat, Package, Sparkles, UtensilsCrossed, RefreshCw, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import heroKitchen from '../assets/hero-kitchen.jpg';
import '../index.css';

interface DashboardStats {
    pantry_items_count: number;
    saved_recipes_count: number;
    recipes_generated_count: number;
    leftover_items_count: number;
}

const defaultStats: DashboardStats = {
    pantry_items_count: 0,
    saved_recipes_count: 0,
    recipes_generated_count: 0,
    leftover_items_count: 0
};

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>(defaultStats);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setError(null);
            setIsLoading(true);
            // console.log('🚀 Starting dashboard stats fetch...');

            // Test the API call directly
            const response = await fetch('/dashboard/stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // console.log('📡 Response status:', response.status);
            // console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const rawData = await response.text();
            // console.log('📡 Raw response:', rawData);

            let dashboardStats;
            try {
                dashboardStats = JSON.parse(rawData);
                // console.log('📡 Parsed data:', dashboardStats);
            } catch (parseError) {
                console.error('❌ JSON parse error:', parseError);
                throw new Error('Invalid JSON response from server');
            }

            // Validate the data structure
            if (dashboardStats && typeof dashboardStats === 'object') {
                const validatedStats = {
                    pantry_items_count: Number(dashboardStats.pantry_items_count) || 0,
                    saved_recipes_count: Number(dashboardStats.saved_recipes_count) || 0,
                    recipes_generated_count: Number(dashboardStats.recipes_generated_count) || 0,
                    leftover_items_count: Number(dashboardStats.leftover_items_count) || 0
                };

                // console.log('✅ Validated stats:', validatedStats);
                setStats(validatedStats);
            } else {
                console.error('❌ Invalid data structure:', dashboardStats);
                throw new Error('Invalid data structure received from server');
            }
        } catch (error: any) {
            console.error('❌ Failed to fetch dashboard stats:', error);
            setError(error.message || 'Failed to load dashboard statistics');
            setStats(defaultStats);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchDashboardStats();
    };

    const displayCount = (count: number): string => {
        if (isLoading) return '...';
        if (error) return '0';
        return count.toString();
    };

    const quickActions = [
        {
            title: 'Generate Recipe',
            description: 'Create AI-powered recipes from your ingredients',
            icon: Sparkles,
            href: '/generate-recipe',
            gradient: 'bg-gradient-hero',
        },
        {
            title: 'Manage Pantry',
            description: 'View and update your pantry items',
            icon: Package,
            href: '/pantry',
            gradient: 'bg-secondary',
        },
        {
            title: 'Use Leftovers',
            description: 'Transform leftovers into delicious meals',
            icon: UtensilsCrossed,
            href: '/leftovers',
            gradient: 'bg-accent',
        },
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden">
                <img
                    src={heroKitchen}
                    alt="Fresh ingredients on kitchen table"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
                <div className="relative container h-full flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Welcome back, {user?.username}! 👋
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Ready to create something delicious? Explore AI-powered recipes tailored to your pantry.
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="w-fit"
                            disabled={refreshing}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            {refreshing ? 'Refreshing...' : 'Refresh Stats'}
                        </Button>
                        {error && (
                            <div className="flex items-center gap-2 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="container py-12">
                <div className="grid gap-6 md:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.title} to={action.href}>
                                <Card className="h-full transition-all duration-300 hover:shadow-hover hover:-translate-y-1 cursor-pointer">
                                    <CardHeader>
                                        <div className={`w-12 h-12 rounded-xl ${action.gradient} flex items-center justify-center mb-4`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">{action.title}</CardTitle>
                                        <CardDescription className="text-base">{action.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="ghost" className="w-full">
                                            Get Started →
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Stats Section */}
                <div className="grid gap-6 md:grid-cols-4 mt-12">
                    <Card className="bg-gradient-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pantry Items</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold" data-testid="pantry-count">
                                {displayCount(stats.pantry_items_count)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Items in your pantry
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saved Recipes</CardTitle>
                            <ChefHat className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold" data-testid="recipes-count">
                                {displayCount(stats.saved_recipes_count)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Your favorite recipes
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recipes Generated</CardTitle>
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold" data-testid="generated-count">
                                {displayCount(stats.recipes_generated_count)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                AI recipes created
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Leftover Items</CardTitle>
                            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold" data-testid="leftovers-count">
                                {displayCount(stats.leftover_items_count)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ingredients to use up
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Debug Information - Always show in development */}
                {/* <div className="mt-8 p-4 bg-muted rounded-lg border">
                    <h3 className="font-semibold mb-2 text-lg">🔍 Debug Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Current Stats:</strong>
                            <pre className="mt-1 p-2 bg-background rounded text-xs">
                                {JSON.stringify(stats, null, 2)}
                            </pre>
                        </div>
                        <div>
                            <strong>State:</strong>
                            <div className="mt-1 space-y-1">
                                <div>Loading: <span className="font-mono">{isLoading.toString()}</span></div>
                                <div>Refreshing: <span className="font-mono">{refreshing.toString()}</span></div>
                                <div>Error: <span className="font-mono text-destructive">{error || 'None'}</span></div>
                                <div>User: <span className="font-mono">{user?.username || 'None'}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button onClick={() => console.log('Current stats:', stats)} variant="outline" size="sm">
                            Log Stats to Console
                        </Button>
                        <Button onClick={() => console.log('User token:', localStorage.getItem('token'))} variant="outline" size="sm">
                            Log Token
                        </Button>
                        <Button onClick={fetchDashboardStats} variant="outline" size="sm">
                            Test API Call
                        </Button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}