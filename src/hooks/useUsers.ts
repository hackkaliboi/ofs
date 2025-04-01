import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

interface UserStats {
  total: number;
  active: number;
  new_today: number;
  with_wallets: number;
  with_kyc: number;
}

export const useUsers = (adminOnly = true) => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    new_today: 0,
    with_wallets: 0,
    with_kyc: 0
  });

  useEffect(() => {
    // Only fetch users if the current user is an admin or adminOnly is false
    if (adminOnly && !isAdmin) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch all users from the auth.users view or profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setUsers(data || []);
        
        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const newToday = data?.filter(u => {
          const createdAt = new Date(u.created_at);
          return createdAt >= today;
        }).length || 0;
        
        // Set stats
        setStats({
          total: data?.length || 0,
          active: data?.filter(u => u.last_sign_in_at).length || 0,
          new_today: newToday,
          with_wallets: 0, // Will be updated when we implement wallet connections
          with_kyc: 0 // Will be updated when we implement KYC verifications
        });
        
        // Set up real-time subscription
        const subscription = supabase
          .channel('public:profiles')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'profiles' 
            }, 
            (payload) => {
              // Handle different events
              if (payload.eventType === 'INSERT') {
                setUsers(prev => [payload.new as User, ...prev]);
                setStats(prev => ({
                  ...prev,
                  total: prev.total + 1,
                  new_today: isToday(payload.new.created_at) ? prev.new_today + 1 : prev.new_today
                }));
              } else if (payload.eventType === 'UPDATE') {
                setUsers(prev => prev.map(user => 
                  user.id === payload.new.id ? { ...user, ...payload.new } : user
                ));
              } else if (payload.eventType === 'DELETE') {
                setUsers(prev => prev.filter(user => user.id !== payload.old.id));
                setStats(prev => ({
                  ...prev,
                  total: prev.total - 1
                }));
              }
            }
          )
          .subscribe();
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentUser, isAdmin, adminOnly]);

  // Helper function to check if a date is today
  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return { users, loading, error, stats };
};
