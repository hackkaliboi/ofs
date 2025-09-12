import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

/**
 * Unified Sign In Page
 * 
 * Both users and admins login through this single page.
 * After successful authentication, users are automatically
 * redirected to the appropriate dashboard based on their role:
 * 
 * - Admins (role: 'admin') → /admin dashboard
 * - Regular users (role: 'user') → /dashboard
 * 
 * The role is determined from the user's profile in the database.
 * Admin access is granted to 'pastendro@gmail.com' by default.
 */

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signIn, loading: authLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Get the intended destination from location state or determine based on role
  const from = location.state?.from?.pathname;

  // Check if user is already logged in and redirect appropriately
  useEffect(() => {
    // Only redirect if we have user, profile, auth is not loading, and we haven't redirected yet
    if (user && profile && !authLoading && !hasRedirected) {
      console.log('User authenticated, preparing redirect...')
      console.log('User:', user.email, 'Role:', profile.role, 'IsAdmin:', isAdmin)

      // Determine redirect destination based on user role
      let redirectPath = from || (isAdmin ? '/admin' : '/dashboard')

      console.log(`Redirecting ${isAdmin ? 'admin' : 'user'} to: ${redirectPath}`)

      // Mark that we're redirecting to prevent multiple redirects
      setHasRedirected(true)
      setIsLoading(false)

      // Redirect with a small delay to ensure state is fully updated
      setTimeout(() => {
        navigate(redirectPath, { replace: true })
      }, 100)
    }
  }, [user, profile, isAdmin, authLoading, navigate, from, hasRedirected])

  // If auth is still loading, show loading state
  if (authLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading || hasRedirected) return // Prevent multiple submissions

    setIsLoading(true)
    setError("")
    setHasRedirected(false) // Reset redirect flag for new sign in

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log('Starting sign in for:', email)

    try {
      const { data, error } = await signIn(email, password)
      
      if (error) {
        throw new Error(error.message || 'Sign in failed')
      }

      console.log('Sign in successful, auth context will handle redirect')

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      })

      // The redirect will be handled by the useEffect hook above
      // after the user and profile state are updated by the auth context

    } catch (error: any) {
      console.error('Sign in error:', error)
      setError(error.message || "Failed to sign in")
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in",
      })
      setIsLoading(false)
      setHasRedirected(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-background">
        <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          {/* Left side - Branding and testimonial */}
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
            <div className="absolute inset-0 bg-primary" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Link to="/" className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">SolmintX</span>
              </Link>
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  "SolmintX has revolutionized how we manage and validate our digital assets.
                  The transparency and security it provides are unmatched."
                </p>
                <footer className="text-sm">Sofia Davis, Digital Asset Manager</footer>
              </blockquote>
            </div>
          </div>

          {/* Right side - Sign in form */}
          <div className="lg:p-8 w-full">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to access your account
                </p>
                <p className="text-xs text-muted-foreground">
                  sign in here - you'll be redirected to the appropriate dashboard
                </p>
              </div>

              <Card className="border-none shadow-md">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Sign in</CardTitle>
                  <CardDescription>
                    Access your SolmintX account to manage your digital assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>

                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Sign In</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Separator className="my-4" />
                  <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-primary font-medium hover:underline">
                      Create an account
                    </Link>
                  </p>
                </CardFooter>
              </Card>

              <p className="text-center text-sm text-muted-foreground mt-4">
                By signing in, you agree to our{" "}
                <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}