// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { Button } from '../components/ui/button';
// import { Input } from '../components/ui/input';
// import { Label } from '../components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
// import { toast } from 'sonner';
// import { ChefHat } from 'lucide-react';

// export default function Register() {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const { register } = useAuth();
//     const navigate = useNavigate();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);

//         try {
//             await register(username, email, password);
//             toast.success('Account created successfully!');
//             navigate('/dashboard');
//         } catch (error) {
//             toast.error('Registration failed');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
//             <Card className="w-full max-w-md shadow-hover">
//                 <CardHeader className="text-center">
//                     <div className="flex justify-center mb-4">
//                         <div className="rounded-full bg-gradient-hero p-3">
//                             <ChefHat className="h-8 w-8 text-primary-foreground" />
//                         </div>
//                     </div>
//                     <CardTitle className="text-2xl">Create Account</CardTitle>
//                     <CardDescription>Join RecipeAI and discover amazing recipes</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="username">Username</Label>
//                             <Input
//                                 id="username"
//                                 type="text"
//                                 placeholder="johndoe"
//                                 value={username}
//                                 onChange={(e:any) => setUsername(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="email">Email</Label>
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 placeholder="you@example.com"
//                                 value={email}
//                                 onChange={(e:any) => setEmail(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="password">Password</Label>
//                             <Input
//                                 id="password"
//                                 type="password"
//                                 placeholder="••••••••"
//                                 value={password}
//                                 onChange={(e:any) => setPassword(e.target.value)}
//                                 required
//                                 minLength={8}
//                             />
//                         </div>
//                         <Button type="submit" className="w-full" disabled={isLoading}>
//                             {isLoading ? 'Creating account...' : 'Create Account'}
//                         </Button>
//                     </form>
//                     <p className="mt-4 text-center text-sm text-muted-foreground">
//                         Already have an account?{' '}
//                         <Link to="/login" className="text-primary hover:underline font-medium">
//                             Sign in
//                         </Link>
//                     </p>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { ChefHat } from 'lucide-react';
import { api } from '../utils/api';
import type { RegisterData, User } from '../types/api';
interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    preferred_language: string;
}

interface UserResponse {
    id: number;
    username: string;
    email: string;
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
    const { register } = useAuth();
    const navigate = useNavigate();



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const userData: User = await api.register(formData);
    
    if (register) {
      await register(userData);
    }
    
    toast.success('Account created successfully!');
    navigate('/dashboard');
  } catch (error: any) {
    toast.error(error.message || 'Registration failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
    const handleInputChange = (field: keyof RegisterRequest) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({
                ...prev,
                [field]: e.target.value
            }));
        };

    return (
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
    );
}