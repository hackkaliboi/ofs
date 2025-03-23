
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, KeyRound, LogIn, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally validate and authenticate the user
    // For now, just show a success message and redirect
    
    toast.success("Signed in successfully", { 
      description: "Welcome back to OFSLEDGER"
    });
    
    // Redirect to home since Dashboard is removed
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-custodia-surface/50 to-white flex flex-col justify-center py-16">
        <div className="container-custom max-w-md mx-auto">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-custodia">Sign In</h1>
              <p className="mt-4 text-gray-600">Sign in to access your quantum financial interface</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe} 
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-custodia hover:underline">
                    Forgot password?
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-custodia hover:bg-custodia-light flex items-center justify-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-custodia hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignIn;
