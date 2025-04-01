import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface UserStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  users_with_wallets: number;
  users_with_validated_wallets: number;
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>({
    total_users: 0,
    active_users: 0,
    new_users_today: 0,
    new_users_this_week: 0,
    users_with_wallets: 0,
    users_with_validated_wallets: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get total users count
        const { count: totalUsers, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        
        // Get active users (users who have logged in within the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: activeUsers, error: activeError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_sign_in', thirtyDaysAgo.toISOString());
        
        if (activeError) throw activeError;
        
        // Get new users today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count: newUsersToday, error: todayError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
        
        if (todayError) throw todayError;
        
        // Get new users this week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const { count: newUsersThisWeek, error: weekError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfWeek.toISOString());
        
        if (weekError) throw weekError;
        
        // Get users with wallets
        const { data: usersWithWallets, error: walletsError } = await supabase
          .from('wallet_connections')
          .select('user_id')
          .limit(1000); // Limit to prevent excessive data transfer
        
        if (walletsError) throw walletsError;
        
        // Count unique users with wallets
        const uniqueUsersWithWallets = new Set(usersWithWallets.map(w => w.user_id)).size;
        
        // Get users with validated wallets
        const { data: validatedWallets, error: validatedError } = await supabase
          .from('wallet_connections')
          .select('user_id')
          .or('validated.eq.true,validation_status.eq.validated')
          .limit(1000);
        
        if (validatedError) throw validatedError;
        
        // Count unique users with validated wallets
        const uniqueUsersWithValidatedWallets = new Set(validatedWallets.map(w => w.user_id)).size;
        
        setStats({
          total_users: totalUsers || 0,
          active_users: activeUsers || 0,
          new_users_today: newUsersToday || 0,
          new_users_this_week: newUsersThisWeek || 0,
          users_with_wallets: uniqueUsersWithWallets,
          users_with_validated_wallets: uniqueUsersWithValidatedWallets
        });
      } catch (err) {
        console.error('Error fetching user statistics:', err);
        setError('Failed to load user statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStats();
    
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
          // Refetch statistics when any change occurs
          fetchUserStats();
        }
      )
      .subscribe();
    
    // Set up realtime subscription for wallet connections
    const walletsChannel: RealtimeChannel = supabase
      .channel('public:wallet_connections')
      .on('postgres_changes', 
        { 
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public', 
          table: 'wallet_connections'
        }, 
        () => {
          // Refetch statistics when any change occurs
          fetchUserStats();
        }
      )
      .subscribe();
    
    console.log('Subscribed to profiles and wallet connections channels for user stats');
    
    return () => {
      console.log('Unsubscribing from profiles and wallet connections channels for user stats');
      profilesChannel.unsubscribe();
      walletsChannel.unsubscribe();
    };
  }, []);
  
  return { stats, loading, error };
}
