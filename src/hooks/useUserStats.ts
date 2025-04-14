import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ensureAdminUsersTable, createSampleData } from '@/lib/databaseHelpers';
import { useAuth } from '@/context/AuthContext';

export interface UserStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  users_with_wallets: number;
  users_with_validated_wallets: number;
}

// Default stats to use as fallback
const defaultStats: UserStats = {
  total_users: 1,
  active_users: 1,
  new_users_today: 0,
  new_users_this_week: 0,
  users_with_wallets: 0,
  users_with_validated_wallets: 0
};

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user statistics
  useEffect(() => {
    if (!user) return;
    
    const fetchUserStats = async () => {
      console.log('🔍 useUserStats: Starting to fetch user statistics');
      console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔍 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Ensuring admin table exists...');
        // Ensure admin table exists and create sample data
        try {
          await ensureAdminUsersTable();
          console.log('✅ Admin table check successful');
        } catch (adminTableError) {
          console.error('❌ Error ensuring admin table exists:', adminTableError);
          // Continue anyway to see if we can get user counts
        }
        
        try {
          console.log('🔍 Creating sample data...');
          await createSampleData(user.id);
          console.log('✅ Sample data creation successful');
        } catch (sampleDataError) {
          console.error('❌ Error creating sample data:', sampleDataError);
          // Continue anyway to see if we can get user counts
        }
        
        console.log('🔍 Fetching total users count...');
        // Try to get total users count
        const { count: totalUsers, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        console.log('📊 Total users count result:', { totalUsers, error: countError });
        
        if (countError) {
          console.error('❌ Error fetching total users:', countError);
          throw countError;
        }
        
        // Get active users (users who have logged in within the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: activeUsers, error: activeError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_sign_in', thirtyDaysAgo.toISOString());
        
        if (activeError) {
          console.error('Error fetching active users:', activeError);
          // Continue with default value for this stat
        }
        
        // Get new users today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count: newUsersToday, error: todayError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
        
        if (todayError) {
          console.error('Error fetching new users today:', todayError);
          // Continue with default value for this stat
        }
        
        // Get new users this week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const { count: newUsersThisWeek, error: weekError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfWeek.toISOString());
        
        if (weekError) {
          console.error('Error fetching new users this week:', weekError);
          // Continue with default value for this stat
        }
        
        // Try to get users with wallets
        let uniqueUsersWithWallets = 0;
        let uniqueUsersWithValidatedWallets = 0;
        
        try {
          const { data: usersWithWallets, error: walletsError } = await supabase
            .from('wallet_connections')
            .select('user_id')
            .limit(1000); // Limit to prevent excessive data transfer
          
          if (!walletsError && usersWithWallets) {
            // Count unique users with wallets
            uniqueUsersWithWallets = new Set(usersWithWallets.map(w => w.user_id)).size;
            
            // Get users with validated wallets
            const { data: validatedWallets, error: validatedError } = await supabase
              .from('wallet_connections')
              .select('user_id')
              .or('validated.eq.true,validation_status.eq.validated')
              .limit(1000);
            
            if (!validatedError && validatedWallets) {
              // Count unique users with validated wallets
              uniqueUsersWithValidatedWallets = new Set(validatedWallets.map(w => w.user_id)).size;
            }
          }
        } catch (walletErr) {
          console.error('Error fetching wallet statistics:', walletErr);
          // Continue with default values for these stats
        }
        
        // Update stats with all the values we were able to fetch
        setStats({
          total_users: totalUsers || defaultStats.total_users,
          active_users: activeUsers || totalUsers || defaultStats.active_users,
          new_users_today: newUsersToday || defaultStats.new_users_today,
          new_users_this_week: newUsersThisWeek || defaultStats.new_users_this_week,
          users_with_wallets: uniqueUsersWithWallets,
          users_with_validated_wallets: uniqueUsersWithValidatedWallets
        });
      } catch (err) {
        console.error('Error fetching user statistics:', err);
        setError('Failed to load user statistics');
        
        // Use default stats as fallback
        setStats(defaultStats);
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
  }, [user]);
  
  return { stats, loading, error };
}
