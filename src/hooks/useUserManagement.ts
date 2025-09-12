import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
  last_sign_in: string | null;
  wallets_count: number;
  avatar_url: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 'admin-user-id',
    email: 'pastendro@gmail.com',
    full_name: 'Admin User',
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString(),
    last_sign_in: new Date().toISOString(),
    wallets_count: 0,
    avatar_url: ''
  }
];

export function useUserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!user) return;
    
    console.log('Mock useUserManagement: Using mock data');
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const updateUser = async (userId: string, updates: Partial<User>) => {
    console.log('Mock updateUser:', userId, updates);
    // Mock update - just return success
    return { data: null, error: null };
  };

  const deleteUser = async (userId: string) => {
    console.log('Mock deleteUser:', userId);
    // Mock delete - just return success
    return { data: null, error: null };
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser
  };
}