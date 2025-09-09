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

  // Original admin authentication logic
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
          } catch (e) {
            console.error('Error updating profile:', e);
          }
          
          setIsAdmin(true);
          setCheckingAdmin(false);
          return;
        }

        // Then check the profile from the context
        if (profile?.role === 'admin') {
          console.log('Admin access granted based on profile role');
          setIsAdmin(true);
          setCheckingAdmin(false);
          return;
        }

        // If we don't have a profile or it's not admin, check directly from the database
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setCheckingAdmin(false);
          return;
        }

        if (data?.role === 'admin') {
          console.log('Admin access granted based on database role');
          setIsAdmin(true);
        } else {
          console.log('Admin access denied - not an admin user');
        }
      } catch (error) {
        console.error('Unexpected error checking admin status:', error);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, profile]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
