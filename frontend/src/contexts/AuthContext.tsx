// import { createContext, useContext, useEffect, useState } from 'react';
// import { api } from '../utils/api';

// interface User {
//     id: number;
//     email: string;
//     username: string;
//     preferred_language: string;
// }

// interface LoginResponse {
//     access_token: string;
//     token_type: string;
//     user: User;
// }

// interface AuthContextType {
//     user: User | null;
//     login: (email: string, password: string) => Promise<void>;
//     register: (userData: User) => Promise<void>;
//     logout: () => Promise<void>;
//     isAuthenticated: boolean;
//     isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         initializeAuth();
//     }, []);

//     // const initializeAuth = async () => {
//     //     const token = localStorage.getItem('token');
//     //     const storedUser = localStorage.getItem('user');

//     //     if (token && storedUser) {
//     //         try {
//     //             const userData = JSON.parse(storedUser);
//     //             setUser(userData);

//     //             // Verify token is still valid
//     //             await api.getCurrentUser();
//     //         } catch (error) {
//     //             console.error('Auth initialization error:', error);
//     //             localStorage.removeItem('token');
//     //             localStorage.removeItem('user');
//     //             setUser(null);
//     //         }
//     //     }
//     //     setIsLoading(false);
//     // };
//     const initializeAuth = async () => {
//         const token = localStorage.getItem('token');
//         const storedUser = localStorage.getItem('user');

//         if (token && storedUser) {
//             try {
//                 const userData = JSON.parse(storedUser);
//                 setUser(userData);

//                 // Verify token is still valid by fetching user profile
//                 await api.getCurrentUser(); // This now calls /users/profile
//             } catch (error) {
//                 console.error('Auth initialization error:', error);
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 setUser(null);
//             }
//         }
//         setIsLoading(false);
//     };

//     const login = async (email: string, password: string) => {
//         try {
//             const data: LoginResponse = await api.login({ email, password });

//             localStorage.setItem('token', data.access_token);
//             localStorage.setItem('user', JSON.stringify(data.user));
//             setUser(data.user);
//         } catch (error: any) {
//             console.error('Login error:', error);
//             throw new Error(error.message || 'Login failed');
//         }
//     };

//     const register = async (userData: User) => {
//         try {
//             // After registration, we typically get the user data back
//             // and can automatically log them in or redirect to login
//             localStorage.setItem('user', JSON.stringify(userData));
//             setUser(userData);
//         } catch (error: any) {
//             console.error('Registration auth context error:', error);
//             throw new Error(error.message || 'Registration failed');
//         }
//     };

//     const logout = async () => {
//         try {
//             await api.logout();
//         } catch (error) {
//             console.error('Logout API error:', error);
//             // Continue with client-side logout even if API call fails
//         } finally {
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             setUser(null);
//         }
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 login,
//                 register,
//                 logout,
//                 isAuthenticated: !!user,
//                 isLoading,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

interface User {
    id: number;
    email: string;
    username: string;
    preferred_language: string;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
    // user is NOT included in the backend response
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);

                // Verify token is still valid by fetching user profile
                await api.getCurrentUser();
            } catch (error) {
                console.error('Auth initialization error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setIsLoading(false);
    };

    const login = async (email: string, password: string) => {
        try {
            const data: LoginResponse = await api.login({ email, password });

            // Store the token
            localStorage.setItem('token', data.access_token);

            // Fetch user data after successful login
            const userData = await api.getCurrentUser();
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed');
        }
    };

    const register = async (userData: User) => {
        try {
            // After registration, store the user data
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error: any) {
            console.error('Registration auth context error:', error);
            throw new Error(error.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout API error:', error);
            // Continue with client-side logout even if API call fails
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};