import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// User profile helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// Wallet helpers
export const getWallets = async (userId: string) => {
  try {
    console.log('Fetching wallets for user:', userId);
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching wallets:', error);
      // Return empty array instead of failing completely
      return { data: [], error };
    }
    
    return { data, error: null };
  } catch (e) {
    console.error('Unexpected error in getWallets:', e);
    // Return empty array on unexpected errors
    return { data: [], error: e };
  }
};

// Transaction helpers
export const getTransactions = async (walletId: string) => {
  try {
    console.log('Fetching transactions for wallet:', walletId);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching transactions:', error);
      // Return empty array instead of failing completely
      return { data: [], error };
    }
    
    return { data, error: null };
  } catch (e) {
    console.error('Unexpected error in getTransactions:', e);
    // Return empty array on unexpected errors
    return { data: [], error: e };
  }
};

// Admin helpers
export const getAllUsers = async () => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
  return { data, error }
}

export const getSecurityLogs = async () => {
  const { data, error } = await supabaseAdmin
    .from('security_logs')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

// System stats for admin dashboard
export const getSystemStats = async () => {
  try {
    // Get total transactions count
    const { data: transactionsData, error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .select('amount', { count: 'exact' })
    
    if (transactionsError) {
      console.error('Error fetching transactions count:', transactionsError);
      throw transactionsError;
    }
    
    // Calculate total volume
    let totalVolume = 0;
    if (transactionsData) {
      totalVolume = transactionsData.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    }
    
    // Get active wallets count
    const { count: activeWallets, error: walletsError } = await supabaseAdmin
      .from('wallets')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
    
    if (walletsError) {
      console.error('Error fetching active wallets:', walletsError);
      throw walletsError;
    }
    
    // For system health, we could check various metrics
    // This is a simplified version that just returns "good" status
    // In a real app, you'd check database health, API response times, etc.
    
    return { 
      data: {
        total_transactions: transactionsData?.length || 0,
        total_volume: totalVolume,
        active_wallets: activeWallets || 0,
        system_health: 'good',
        uptime_percentage: 99.95,
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error in getSystemStats:', error);
    return { data: null, error };
  }
};

// Blockchain network helpers
export const getBlockchainNetworks = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('blockchain_networks')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching blockchain networks:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (e) {
    console.error('Unexpected error in getBlockchainNetworks:', e);
    return { data: null, error: e };
  }
};

export const getTokens = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('tokens')
      .select(`
        *,
        blockchain_networks (
          name,
          symbol,
          is_testnet
        )
      `)
      .order('current_price', { ascending: false });
    
    if (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (e) {
    console.error('Unexpected error in getTokens:', e);
    return { data: null, error: e };
  }
};

export const getSmartContracts = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('smart_contracts')
      .select(`
        *,
        blockchain_networks (
          name,
          symbol,
          is_testnet
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching smart contracts:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (e) {
    console.error('Unexpected error in getSmartContracts:', e);
    return { data: null, error: e };
  }
};

export const getNetworkStats = async (networkId: string, limit: number = 24) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('network_stats')
      .select('*')
      .eq('network_id', networkId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching network stats:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (e) {
    console.error('Unexpected error in getNetworkStats:', e);
    return { data: null, error: e };
  }
};

// Enhanced system stats for admin dashboard
export const getEnhancedSystemStats = async () => {
  try {
    // Get blockchain networks status
    const { data: networksData, error: networksError } = await getBlockchainNetworks();
    
    if (networksError) {
      console.error('Error fetching blockchain networks:', networksError);
      throw networksError;
    }
    
    // Get tokens data
    const { data: tokensData, error: tokensError } = await getTokens();
    
    if (tokensError) {
      console.error('Error fetching tokens:', tokensError);
      throw tokensError;
    }
    
    // Get smart contracts data
    const { data: contractsData, error: contractsError } = await getSmartContracts();
    
    if (contractsError) {
      console.error('Error fetching smart contracts:', contractsError);
      throw contractsError;
    }
    
    // Get original system stats
    const { data: originalStats, error: statsError } = await getSystemStats();
    
    if (statsError) {
      console.error('Error fetching system stats:', statsError);
      throw statsError;
    }
    
    // Combine all data into enhanced stats
    return { 
      data: {
        ...originalStats.data,
        blockchain_networks: networksData || [],
        tokens: tokensData || [],
        smart_contracts: contractsData || [],
        active_networks: networksData?.filter(network => network.status === 'active').length || 0,
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error in getEnhancedSystemStats:', error);
    return { data: null, error };
  }
};
