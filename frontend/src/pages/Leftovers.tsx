
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Plus,
    BookOpen,
    Recycle,
    ArrowRight,
    ChefHat
} from 'lucide-react';

export default function Leftovers() {
    const features = [
        {
            title: 'Transform Leftovers',
            description: 'Generate creative recipe ideas using AI to transform your leftover ingredients',
            icon: Sparkles,
            href: '/leftovers/transform',
            gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
            action: 'Generate Ideas'
        },
        {
            title: 'Manage Ingredients',
            description: 'Add and organize your leftover ingredients for transformation',
            icon: Plus,
            href: '/leftovers/manage',
            gradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
            action: 'Add Ingredients'
        },
        {
            title: 'Saved Ideas',
            description: 'Browse your collection of saved transformation ideas',
            icon: BookOpen,
            href: '/leftovers/saved',
            gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            action: 'View Saved'
        }
    ];

    const stats = [
        {
            label: 'Reduce Food Waste',
            description: 'Turn leftovers into delicious new meals'
        },
        {
            label: 'Save Money',
            description: 'Use what you already have creatively'
        },
        {
            label: 'Quick Meals',
            description: 'Most transformations take under 30 minutes'
        },
        {
            label: 'AI-Powered',
            description: 'Get creative ideas tailored to your ingredients'
        }
    ];

    return (
        <div className="container py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        Transform Your Leftovers
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Turn leftover ingredients into creative, delicious meals with AI-powered transformation ideas.
                        Reduce food waste and discover new favorite dishes.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-8 md:grid-cols-3 mb-16">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Link key={feature.title} to={feature.href}>
                                <Card className="h-full transition-all duration-300 hover:shadow-hover hover:-translate-y-2 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/20">
                                    <CardHeader className="text-center">
                                        <div className={`w-16 h-16 rounded-2xl ${feature.gradient} flex items-center justify-center mx-auto mb-4`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <CardTitle className="text-xl mb-3">{feature.title}</CardTitle>
                                        <CardDescription className="text-base leading-relaxed">
                                            {feature.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="hero" className="w-full">
                                            {feature.action}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* How It Works */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid gap-8 md:grid-cols-4">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-lg font-bold text-primary">1</span>
                            </div>
                            <h3 className="font-semibold mb-2">Add Leftovers</h3>
                            <p className="text-muted-foreground text-sm">
                                Tell us what ingredients you have leftover
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-lg font-bold text-primary">2</span>
                            </div>
                            <h3 className="font-semibold mb-2">Generate Ideas</h3>
                            <p className="text-muted-foreground text-sm">
                                AI creates creative transformation recipes
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-lg font-bold text-primary">3</span>
                            </div>
                            <h3 className="font-semibold mb-2">Save & Cook</h3>
                            <p className="text-muted-foreground text-sm">
                                Save your favorite ideas and start cooking
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-lg font-bold text-primary">4</span>
                            </div>
                            <h3 className="font-semibold mb-2">Enjoy</h3>
                            <p className="text-muted-foreground text-sm">
                                Reduce waste and enjoy delicious new meals
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl flex items-center justify-center gap-2">
                            <Recycle className="h-6 w-6 text-orange-600" />
                            Why Transform Leftovers?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <ChefHat className="h-8 w-8 mx-auto mb-3 text-orange-500" />
                                    <h4 className="font-semibold text-lg mb-2">{stat.label}</h4>
                                    <p className="text-muted-foreground text-sm">{stat.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Start CTA */}
                <div className="text-center mt-12">
                    <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Begin by adding your leftover ingredients or jump straight into generating ideas
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/leftovers/manage">
                            <Button variant="hero" size="lg" className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add Leftover Ingredients
                            </Button>
                        </Link>
                        <Link to="/leftovers/transform">
                            <Button variant="outline" size="lg" className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                Generate Ideas Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}