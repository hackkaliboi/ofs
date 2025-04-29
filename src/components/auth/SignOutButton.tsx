import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({ 
  variant = 'default', 
  size = 'default',
  className = '',
  children
}: SignOutButtonProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await signOut();
      // Force navigation to home page
      navigate('/', { replace: true });
      // Force a page reload to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleSignOut}
    >
      {children || 'Sign out'}
    </Button>
  );
}

export default SignOutButton;
