import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// This component protects routes that should only be accessible by admin users
const AdminRoute: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Persist admin session
  useEffect(() => {
    if (user && location.pathname.startsWith('/admin')) {
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('adminPath', location.pathname);
    }
  }, [user, location.pathname]);

  // Check if the current user is an admin directly from Supabase
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }

      try {
        // First check if the email is pastendro@gmail.com (hardcoded admin)
        if (user.email === 'pastendro@gmail.com') {
          console.log('Admin access granted to pastendro@gmail.com');
          
          // Force update the profile to have admin role
          try {
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                full_name: 'Admin User',
                role: 'admin',
                email: user.email
              });
            
            if (error) {
              console.error('Error updating profile:', error);
            } else {
              console.log('✅ Updated profile to admin role');
            }
          } catch (err) {
            console.error('Error ensuring admin access:', err);
          }
          
          setIsAdmin(true);
          localStorage.setItem('isAdmin', 'true');
          setCheckingAdmin(false);
          return;
        }

        // Check if we have a saved admin session
        const adminSession = localStorage.getItem('adminSession');
        if (adminSession === 'true') {
          setIsAdmin(true);
          setCheckingAdmin(false);
          return;
        }

        // Otherwise check the profile in the database
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else if (data && data.role === 'admin') {
          setIsAdmin(true);
          localStorage.setItem('isAdmin', 'true');
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Unexpected error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Show loading state while checking authentication
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If not authenticated or not an admin, redirect to admin login
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated and is admin, render the protected route
  return <Outlet />;
};

export default AdminRoute;
