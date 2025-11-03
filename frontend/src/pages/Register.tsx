
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { ChefHat } from 'lucide-react';
import TasteProfileModal from '../components/TasteProfileModal';

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    preferred_language: string;
}

export default function Register() {
    const [formData, setFormData] = useState<RegisterRequest>({
        username: '',
        email: '',
        password: '',
        preferred_language: 'en',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showTasteProfile, setShowTasteProfile] = useState(false);
    const { register, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Register form submitted');

            // This now registers AND logs in automatically
            await register(formData);

            // Check authentication status
            const token = localStorage.getItem('token');
            console.log('After registration - Token:', token);
            console.log('After registration - Auth status:', isAuthenticated);
            console.log('After registration - User:', user);

            toast.success('Account created successfully!');

            // Show taste profile modal after successful registration & login
            setShowTasteProfile(true);

        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTasteProfileSave = () => {
        console.log('Taste profile saved, navigating to dashboard');
        setShowTasteProfile(false);
        navigate('/dashboard');
    };

    const handleTasteProfileSkip = () => {
        console.log('Taste profile skipped, navigating to dashboard');
        setShowTasteProfile(false);
        navigate('/dashboard');
    };

    const handleInputChange = (field: keyof RegisterRequest) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({
                ...prev,
                [field]: e.target.value
            }));
        };

    return (
        <>
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-hover">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-gradient-hero p-3">
                                <ChefHat className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Create Account</CardTitle>
                        <CardDescription>Join RecipeAI and discover amazing recipes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleInputChange('username')}
                                    required
                                    minLength={3}
                                    maxLength={50}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Password must be at least 8 characters long
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Preferred Language</Label>
                                <Input
                                    id="language"
                                    type="text"
                                    placeholder="en"
                                    value={formData.preferred_language}
                                    onChange={handleInputChange('preferred_language')}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter language code (e.g., en, es, fr, de, it)
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Taste Profile Modal */}
            {showTasteProfile && (
                <TasteProfileModal
                    isOpen={showTasteProfile}
                    onClose={handleTasteProfileSkip}
                    onSave={handleTasteProfileSave}
                    isFirstTime={true}
                />
            )}
        </>
    );
}