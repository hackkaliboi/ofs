import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

/**
 * This component provides direct admin access without requiring login
 * It's a special page just for development and testing purposes
 */
const AdminAccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("Setting up admin access...");
  
  useEffect(() => {
    const setupAdminAccess = async () => {
      try {
        // 1. Sign in anonymously first
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: 'pastendro@gmail.com',
          password: 'Password123!' // Using the temporary password we set earlier
        });
        
        if (authError) {
          console.error("Auth error:", authError);
          setMessage("Authentication failed. Creating a new admin account...");
          
          // Try to create a new account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'pastendro@gmail.com',
            password: 'Password123!',
          });
          
          if (signUpError) {
            throw new Error(`Failed to create account: ${signUpError.message}`);
          }
          
          if (!signUpData.user) {
            throw new Error("Failed to create user account");
          }
          
          // Set the user as admin in the profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: signUpData.user.id,
              full_name: 'Admin User',
              role: 'admin',
              email: 'pastendro@gmail.com'
            });
          
          if (profileError) {
            console.error("Profile error:", profileError);
          }
          
          setMessage("Admin account created! Redirecting to admin dashboard...");
        } else if (authData.user) {
          // Successfully signed in, ensure the user has admin role
          setMessage("Signed in successfully. Setting admin privileges...");
          
          // Update the user's profile to have admin role
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              full_name: 'Admin User',
              role: 'admin',
              email: 'pastendro@gmail.com'
            });
          
          if (profileError) {
            console.error("Profile error:", profileError);
          }
          
          // Create a session variable to bypass admin checks
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminEmail', 'pastendro@gmail.com');
          
          setMessage("Admin access granted! Redirecting to dashboard...");
        }
        
        // Show success message
        toast({
          title: "Admin Access Granted",
          description: "You now have full admin privileges",
        });
        
        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
        
      } catch (error) {
        console.error("Error setting up admin access:", error);
        setMessage(`Error: ${error.message}`);
        
        toast({
          title: "Error",
          description: "Failed to set up admin access. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    setupAdminAccess();
  }, [navigate, toast]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <Shield className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Admin Access Setup</h1>
      <div className="flex items-center gap-2 mb-8">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
      <div className="text-sm text-center max-w-md text-muted-foreground">
        This page automatically sets up admin access and redirects you to the admin dashboard.
        <br />
        You won't need to use this page again once setup is complete.
      </div>
    </div>
  );
};

export default AdminAccess;
