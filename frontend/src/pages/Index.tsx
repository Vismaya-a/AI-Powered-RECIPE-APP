import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ChefHat, Sparkles, Package, Brain } from 'lucide-react';
import heroKitchen from '../assets/hero-kitchen.jpg';
import '../index.css'
const Index = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recipes',
      description: 'Generate unique recipes tailored to your available ingredients and preferences',
    },
    {
      icon: Package,
      title: 'Smart Pantry',
      description: 'Track your ingredients and get instant recipe suggestions based on what you have',
    },
    {
      icon: Sparkles,
      title: 'Leftover Magic',
      description: 'Transform leftovers into delicious new meals with AI recommendations',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <img
          src={heroKitchen}
          alt="Fresh ingredients"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="relative container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Recipe Discovery</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Kitchen Into a{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Culinary Adventure</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover personalized recipes based on your pantry, dietary preferences, and cooking style. Let AI be your personal chef.
            </p>
            <div className="flex gap-4">
              <Link to="/register">
                <Button variant="hero" size="lg" className="text-lg px-8">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Cook Smarter</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you reduce food waste and discover new favorite recipes
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="transition-all duration-300 hover:shadow-hover hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-20">
        <Card className="bg-gradient-hero text-primary-foreground shadow-hover">
          <CardContent className="text-center py-16 px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Culinary Journey?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of home cooks discovering new recipes every day
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="text-lg px-8">
                Create Free Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
