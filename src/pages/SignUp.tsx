import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Shield, User, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!acceptTerms) {
      setError("You must accept the Terms of Service and Privacy Policy to create an account.");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setIsLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password);
      toast({
        title: "Success",
        description: "Account created successfully!",
        variant: "default"
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Sign up error:", error);
      setError(error.message || "Failed to create account. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "" };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthText = [
      "",
      "Weak",
      "Fair",
      "Good",
      "Strong",
      "Very Strong"
    ][strength];
    
    return { strength, text: strengthText };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          {/* Left side - Branding and benefits */}
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
            <div className="absolute inset-0 bg-primary" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Link to="/" className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">OFS</span>
                <span className="text-2xl font-bold text-white/70">LEDGER</span>
              </Link>
            </div>
            
            <div className="relative z-20 mt-auto">
              <h3 className="text-xl font-semibold mb-4">Why join OFS Ledger?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-white/80" />
                  <span>Secure validation of digital assets with blockchain technology</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-white/80" />
                  <span>Comprehensive dashboard to manage all your digital assets</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-white/80" />
                  <span>Connect multiple wallets and track their performance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-white/80" />
                  <span>Industry-leading security protocols to protect your data</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right side - Sign up form */}
          <div className="lg:p-8 w-full">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your details below to get started
                </p>
              </div>

              <Card className="border-none shadow-md">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Sign up</CardTitle>
                  <CardDescription>
                    Join OFS Ledger and start managing your digital assets
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
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 space-y-1">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className={`h-2 w-full rounded-full ${
                                      level <= passwordStrength.strength
                                        ? level <= 2
                                          ? "bg-red-500"
                                          : level <= 3
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                        : "bg-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs ml-2">{passwordStrength.text}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Use 8+ characters with a mix of letters, numbers & symbols
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 pt-2">
                      <Checkbox 
                        id="terms" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm leading-tight"
                      >
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Create Account</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Separator className="my-4" />
                  <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/sign-in" className="text-primary font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
