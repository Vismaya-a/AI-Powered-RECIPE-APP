
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pantry from "./pages/Pantry";
import GenerateRecipe from "./pages/GenerateRecipe";
import Leftovers from "./pages/Leftovers";
import LeftoversTransform from "./pages/LeftoversTransform";
import LeftoversManage from "./pages/LeftoverManage";
import LeftoversSaved from "./pages/LeftoversSaved";
import NotFound from "./pages/NotFound";
import SavedRecipes from "./pages/SavedRecipes";
import SingleRecipe from "./pages/SingleRecipe";
import SingleTransformation from "./pages/SingleTransformation";
import "./App.css";
import './index.css'

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected routes - only accessible when authenticated */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pantry"
        element={
          <ProtectedRoute>
            <Pantry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-recipe"
        element={
          <ProtectedRoute>
            <GenerateRecipe />
          </ProtectedRoute>
        }
      />

      {/* Leftovers Routes */}
      <Route
        path="/leftovers"
        element={
          <ProtectedRoute>
            <Leftovers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leftovers/transform"
        element={
          <ProtectedRoute>
            <LeftoversTransform />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leftovers/manage"
        element={
          <ProtectedRoute>
            <LeftoversManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leftovers/saved"
        element={
          <ProtectedRoute>
            <LeftoversSaved />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leftovers/saved/:id"
        element={
          <ProtectedRoute>
            <SingleTransformation />
          </ProtectedRoute>
        }
      />

      {/* Recipe Routes */}
      <Route
        path="/saved-recipes"
        element={
          <ProtectedRoute>
            <SavedRecipes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipe/:id"
        element={
          <ProtectedRoute>
            <SingleRecipe />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to appropriate page based on auth status */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;