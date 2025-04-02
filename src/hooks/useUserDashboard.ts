import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface UserDashboardData {
  // Wallet metrics
  totalWallets: number;
  validatedWallets: number;
  pendingValidations: number;
  
  // Asset metrics
  totalAssets: number;
  totalValue: number;
  assetGrowth: number; // percentage
  
  // Transaction metrics
  totalTransactions: number;
  pendingTransactions: number;
  recentTransactions: number; // last 7 days
  
  // Activity metrics
  lastLogin: string;
  activityCount: number;
  securityScore: number; // 0-100
  
  // Last updated timestamp
  lastUpdated: string;
}

// Sample data for fallback when all other methods fail
const sampleDashboardData: UserDashboardData = {
  totalWallets: 3,
  validatedWallets: 2,
  pendingValidations: 1,
  
  totalAssets: 5,
  totalValue: 2500,
  assetGrowth: 3.2,
  
  totalTransactions: 12,
  pendingTransactions: 1,
  recentTransactions: 4,
  
  lastLogin: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  activityCount: 25,
  securityScore: 85,
  
  lastUpdated: new Date().toISOString()
};

// Function to ensure necessary tables exist
const ensureUserTables = async (userId: string): Promise<boolean> => {
  try {
    // Check if wallets table exists
    const { data: walletCheck, error: walletError } = await supabase
      .from('wallets')
      .select('id')
      .limit(1);
    
    if (walletError) {
      console.log('Creating wallets table...');
      const { error: createWalletError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.wallets (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            wallet_address TEXT NOT NULL,
            wallet_type TEXT NOT NULL,
            chain_type TEXT NOT NULL,
            validation_status TEXT DEFAULT 'pending',
            validated_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
          
          ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view their own wallets"
            ON public.wallets FOR SELECT
            USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can insert their own wallets"
            ON public.wallets FOR INSERT
            WITH CHECK (auth.uid() = user_id);
            
          CREATE POLICY "Users can update their own wallets"
            ON public.wallets FOR UPDATE
            USING (auth.uid() = user_id);
        `
      });
      
      if (createWalletError) {
        console.error('Error creating wallets table:', createWalletError);
      }
    }
    
    // Check if assets table exists
    const { data: assetCheck, error: assetError } = await supabase
      .from('assets')
      .select('id')
      .limit(1);
    
    if (assetError) {
      console.log('Creating assets table...');
      const { error: createAssetError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.assets (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
            asset_name TEXT NOT NULL,
            asset_symbol TEXT NOT NULL,
            asset_type TEXT NOT NULL,
            current_value NUMERIC DEFAULT 0,
            growth_rate NUMERIC DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
          
          ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view their own assets"
            ON public.assets FOR SELECT
            USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can insert their own assets"
            ON public.assets FOR INSERT
            WITH CHECK (auth.uid() = user_id);
            
          CREATE POLICY "Users can update their own assets"
            ON public.assets FOR UPDATE
            USING (auth.uid() = user_id);
        `
      });
      
      if (createAssetError) {
        console.error('Error creating assets table:', createAssetError);
      }
    }
    
    // Check if transactions table exists
    const { data: txCheck, error: txError } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);
    
    if (txError) {
      console.log('Creating transactions table...');
      const { error: createTxError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.transactions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
            type TEXT NOT NULL,
            amount NUMERIC NOT NULL,
            status TEXT DEFAULT 'pending',
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
          
          ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view their own transactions"
            ON public.transactions FOR SELECT
            USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can insert their own transactions"
            ON public.transactions FOR INSERT
            WITH CHECK (auth.uid() = user_id);
        `
      });
      
      if (createTxError) {
        console.error('Error creating transactions table:', createTxError);
      }
    }
    
    // Create sample data if tables are empty
    await createSampleDataIfNeeded(userId);
    
    return true;
  } catch (err) {
    console.error('Error ensuring user tables exist:', err);
    return false;
  }
};

// Function to create sample data if needed
const createSampleDataIfNeeded = async (userId: string): Promise<void> => {
  try {
    // Check if user has any wallets
    const { data: wallets, error: walletError } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', userId);
    
    if (!walletError && (!wallets || wallets.length === 0)) {
      console.log('Creating sample wallet data for user...');
      
      // Create a sample wallet
      const { data: wallet, error: createError } = await supabase
        .from('wallets')
        .insert([
          {
            user_id: userId,
            wallet_address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            wallet_type: 'Ethereum',
            chain_type: 'Ethereum',
            validation_status: 'validated',
            validated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating sample wallet:', createError);
        return;
      }
      
      if (wallet) {
        // Create sample assets
        await supabase
          .from('assets')
          .insert([
            {
              user_id: userId,
              wallet_id: wallet.id,
              asset_name: 'Ethereum',
              asset_symbol: 'ETH',
              asset_type: 'cryptocurrency',
              current_value: 2000,
              growth_rate: 2.5
            },
            {
              user_id: userId,
              wallet_id: wallet.id,
              asset_name: 'Bitcoin',
              asset_symbol: 'BTC',
              asset_type: 'cryptocurrency',
              current_value: 5000,
              growth_rate: 1.2
            }
          ]);
        
        // Create sample transactions
        await supabase
          .from('transactions')
          .insert([
            {
              user_id: userId,
              wallet_id: wallet.id,
              type: 'deposit',
              amount: 1000,
              status: 'completed',
              description: 'Initial deposit'
            },
            {
              user_id: userId,
              wallet_id: wallet.id,
              type: 'withdrawal',
              amount: 200,
              status: 'pending',
              description: 'Withdrawal request'
            }
          ]);
      }
    }
  } catch (err) {
    console.error('Error creating sample data:', err);
  }
};

// Function to fetch user dashboard data directly from tables
const fetchDirectDashboardData = async (userId: string): Promise<Partial<UserDashboardData>> => {
  const result: Partial<UserDashboardData> = {
    lastUpdated: new Date().toISOString()
  };
  
  try {
    // Fetch wallet data
    const { data: wallets, error: walletsError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId);
    
    if (!walletsError && wallets) {
      result.totalWallets = wallets.length;
      result.validatedWallets = wallets.filter(w => w.validation_status === 'validated').length;
      result.pendingValidations = wallets.filter(w => w.validation_status === 'pending').length;
    }
    
    // Fetch asset data
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId);
    
    if (!assetsError && assets) {
      result.totalAssets = assets.length;
      result.totalValue = assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0);
      
      // Calculate average growth rate
      const totalGrowth = assets.reduce((sum, asset) => sum + (asset.growth_rate || 0), 0);
      result.assetGrowth = assets.length > 0 ? totalGrowth / assets.length : 0;
    }
    
    // Fetch transaction data
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);
    
    if (!transactionsError && transactions) {
      result.totalTransactions = transactions.length;
      result.pendingTransactions = transactions.filter(t => t.status === 'pending').length;
      
      // Count recent transactions (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result.recentTransactions = transactions.filter(t => 
        new Date(t.created_at) >= sevenDaysAgo
      ).length;
    }
    
    // Fetch activity data
    const { data: activities, error: activitiesError } = await supabase
      .from('user_activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!activitiesError && activities) {
      result.activityCount = activities.length;
      
      // Find last login
      const loginActivity = activities.find(a => 
        a.activity_type === 'user_login' || a.activity_type === 'login'
      );
      
      if (loginActivity) {
        result.lastLogin = loginActivity.created_at;
      } else if (activities.length > 0) {
        // If no login activity found, use the most recent activity
        result.lastLogin = activities[0].created_at;
      } else {
        result.lastLogin = new Date().toISOString();
      }
    }
    
    // Calculate security score
    const hasValidatedWallets = (result.validatedWallets || 0) > 0;
    const has2FA = true; // Placeholder - would come from user profile
    result.securityScore = (hasValidatedWallets ? 50 : 0) + (has2FA ? 50 : 0);
    
    return result;
  } catch (err) {
    console.error('Error fetching direct dashboard data:', err);
    return result;
  }
};

export function useUserDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData>(sampleDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);
      
      try {
        // Ensure necessary tables exist
        await ensureUserTables(user.id);
        
        // Fetch data directly from tables
        const userData = await fetchDirectDashboardData(user.id);
        
        // Check if we have enough data
        const hasEnoughData = (
          userData.totalWallets !== undefined &&
          userData.totalAssets !== undefined &&
          userData.totalTransactions !== undefined
        );
        
        if (hasEnoughData) {
          // Fill in any missing values with defaults
          const completeData: UserDashboardData = {
            totalWallets: userData.totalWallets ?? 0,
            validatedWallets: userData.validatedWallets ?? 0,
            pendingValidations: userData.pendingValidations ?? 0,
            
            totalAssets: userData.totalAssets ?? 0,
            totalValue: userData.totalValue ?? 0,
            assetGrowth: userData.assetGrowth ?? 0,
            
            totalTransactions: userData.totalTransactions ?? 0,
            pendingTransactions: userData.pendingTransactions ?? 0,
            recentTransactions: userData.recentTransactions ?? 0,
            
            lastLogin: userData.lastLogin ?? new Date().toISOString(),
            activityCount: userData.activityCount ?? 0,
            securityScore: userData.securityScore ?? 50,
            
            lastUpdated: userData.lastUpdated ?? new Date().toISOString()
          };
          
          setDashboardData(completeData);
          setUsingFallbackData(false);
        } else {
          // If we don't have enough data, use sample data
          console.warn('Using sample dashboard data as fallback');
          setDashboardData(sampleDashboardData);
          setUsingFallbackData(true);
        }
      } catch (err) {
        console.error('Error fetching user dashboard data:', err);
        setError('Failed to load dashboard data');
        
        // Use sample data as fallback
        setDashboardData(sampleDashboardData);
        setUsingFallbackData(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up realtime subscription for key tables
    const channels: RealtimeChannel[] = [];
    
    const setupRealtimeSubscriptions = () => {
      // Tables to monitor for changes
      const tables = ['wallets', 'transactions', 'assets', 'user_activity_log'];
      
      tables.forEach(table => {
        const channel = supabase
          .channel(`public:${table}:user`)
          .on('postgres_changes', 
            { 
              event: '*', // Listen for all changes
              schema: 'public', 
              table,
              filter: `user_id=eq.${user.id}` // Only listen for this user's data
            }, 
            () => {
              // When any change happens, update the dashboard data
              console.log(`Change detected in ${table}, refreshing dashboard data`);
              fetchDashboardData();
            }
          )
          .subscribe();
        
        channels.push(channel);
        console.log(`Subscribed to ${table} changes for user dashboard`);
      });
    };
    
    setupRealtimeSubscriptions();
    
    // Set up a refresh interval (every 2 minutes)
    const refreshInterval = setInterval(() => {
      console.log('Refreshing user dashboard data on interval');
      fetchDashboardData();
    }, 2 * 60 * 1000);
    
    return () => {
      // Clean up subscriptions and interval
      channels.forEach(channel => channel.unsubscribe());
      clearInterval(refreshInterval);
    };
  }, [user]);
  
  return { 
    dashboardData, 
    loading, 
    error, 
    usingFallbackData,
    refresh: () => setLoading(true) // Trigger a refresh
  };
}
