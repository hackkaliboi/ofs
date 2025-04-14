import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * This component ensures admin access for specific users
 * It runs in the background and automatically grants admin privileges
 */
const AdminAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, refreshProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Persist admin session in localStorage
  useEffect(() => {
    const persistAdminSession = () => {
      // Check if we're in an admin route
      const isAdminRoute = location.pathname.startsWith('/admin');
      
      if (isAdminRoute) {
        // Save the current admin route to localStorage
        localStorage.setItem('lastAdminRoute', location.pathname);
      }
    };
    
    persistAdminSession();
  }, [location.pathname]);

  // Restore admin session on reload
  useEffect(() => {
    const restoreAdminSession = () => {
      // Check if we have a saved admin route and we're at the root dashboard
      const lastAdminRoute = localStorage.getItem('lastAdminRoute');
      const isAtDashboard = location.pathname === '/dashboard';
      
      if (lastAdminRoute && isAtDashboard && user) {
        // Redirect back to the last admin route
        navigate(lastAdminRoute);
      }
    };
    
    // Only run this once when the component mounts and user is available
    if (user) {
      restoreAdminSession();
    }
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    // Function to ensure admin access
    const ensureAdminAccess = async () => {
      if (!user) return;
      
      // Special case for pastendro@gmail.com
      if (user.email === 'pastendro@gmail.com') {
        console.log('Ensuring admin access for pastendro@gmail.com');
        
        // Check if profile exists and has admin role
        if (!profile || profile.role !== 'admin') {
          try {
            // Update profile in Supabase
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
              // Refresh the profile to get the updated role
              await refreshProfile();
            }
          } catch (error) {
            console.error('Error ensuring admin access:', error);
          }
        }
        
        // Set a local storage flag to bypass admin checks in components
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', user.email);
      }
    };
    
    ensureAdminAccess();
  }, [user, profile, refreshProfile]);
  
  return <>{children}</>;
};

export default AdminAccessProvider;
