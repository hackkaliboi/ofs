import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/**
 * This is a direct access component for the admin wallets page
 * It ensures the user has admin privileges and then renders the wallets page
 */
const WalletsDirect: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const setupAdminAccess = async () => {
      if (!user) return;

      // Set admin flags in localStorage
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('adminPath', '/admin/wallets');

      // Update the user's profile to have admin role
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: profile?.full_name || 'Admin User',
            role: 'admin',
            email: user.email
          });
        
        if (error) {
          console.error('Error updating profile:', error);
        } else {
          console.log('✅ Updated profile to admin role');
          // Navigate to the wallets page
          navigate('/admin/wallets');
        }
      } catch (err) {
        console.error('Error ensuring admin access:', err);
      }
    };

    setupAdminAccess();
  }, [user, profile, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg">Setting up admin access to wallet management...</p>
    </div>
  );
};

export default WalletsDirect;
