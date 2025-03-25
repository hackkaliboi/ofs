import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  
  // Get the intended destination from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // Check if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      // If user is already authenticated, redirect to dashboard or intended destination
      const redirectTimer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, isLoading, navigate, from]);

  // If auth is still loading, show loading state
  if (authLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data: authData, error } = await signIn(email, password);
      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });

      // Redirect to dashboard or intended destination with a slight delay
      // to ensure auth state is properly updated
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">OFS</span>
            <span className="text-2xl font-bold text-white/70">LEDGER</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "OFS Ledger has revolutionized how we manage and validate our digital assets. 
              The transparency and security it provides are unmatched."
            </p>
            <footer className="text-sm">Sofia Davis, Digital Asset Manager</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <Link to="/sign-up" className="underline hover:text-primary">
              Don't have an account? Sign up
            </Link>
            <Link to="/forgot-password" className="underline hover:text-primary">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
