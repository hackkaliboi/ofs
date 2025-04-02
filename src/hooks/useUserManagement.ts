import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

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

export function useUserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define fetchUsers as a callback so it can be used in both useEffect and returned
  const fetchUsers = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch all users from the profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch admin users to determine roles
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id');

      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        // Continue with empty admin list
      }

      // Create a set of admin user IDs for quick lookup
      const adminUserIds = new Set((adminUsers || []).map(admin => admin.user_id));

      // Fetch wallet connections to count for each user
      const { data: walletConnections, error: walletsError } = await supabase
        .from('wallet_connections')
        .select('user_id');

      if (walletsError) {
        console.error('Error fetching wallet connections:', walletsError);
        // Continue with empty wallet connections
      }

      // Count wallets per user
      const walletCounts: Record<string, number> = {};
      (walletConnections || []).forEach(wallet => {
        walletCounts[wallet.user_id] = (walletCounts[wallet.user_id] || 0) + 1;
      });

      // Transform profiles into users with role and wallet count
      const transformedUsers: User[] = (profiles || []).map(profile => ({
        id: profile.id,
        email: profile.email || '',
        full_name: profile.full_name || '',
        role: adminUserIds.has(profile.id) ? 'admin' : 'user',
        status: profile.status || 'active',
        created_at: profile.created_at || '',
        last_sign_in: profile.last_sign_in || null,
        wallets_count: walletCounts[profile.id] || 0,
        avatar_url: profile.avatar_url || '',
      }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch users
  useEffect(() => {
    if (!user) return;

    fetchUsers();

    // Set up realtime subscription for profiles
    const profilesChannel: RealtimeChannel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { 
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public', 
          table: 'profiles'
        }, 
        () => {
          // Refetch users when profiles change
          fetchUsers();
        }
      )
      .subscribe();
    
    // Set up realtime subscription for admin_users
    const adminChannel: RealtimeChannel = supabase
      .channel('public:admin_users')
      .on('postgres_changes', 
        { 
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public', 
          table: 'admin_users'
        }, 
        () => {
          // Refetch users when admin roles change
          fetchUsers();
        }
      )
      .subscribe();
    
    // Set up realtime subscription for wallet_connections
    const walletsChannel: RealtimeChannel = supabase
      .channel('public:wallet_connections')
      .on('postgres_changes', 
        { 
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public', 
          table: 'wallet_connections'
        }, 
        () => {
          // Refetch users when wallet connections change
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      profilesChannel.unsubscribe();
      adminChannel.unsubscribe();
      walletsChannel.unsubscribe();
    };
  }, [user, fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}
