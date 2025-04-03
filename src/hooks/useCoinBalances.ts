import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface CoinBalance {
  coin_symbol: string;
  balance: number;
  last_updated: string;
  price?: number;
  change_24h?: number;
  value_usd?: number;
  icon?: string;
}

export interface CoinBalancesHook {
  balances: CoinBalance[];
  loading: boolean;
  error: string | null;
  refreshBalances: () => Promise<void>;
  totalValueUsd: number;
}

// Coin metadata including icons and default prices
const COIN_METADATA: Record<string, { name: string; icon: string; defaultPrice: number; defaultChange: number }> = {
  BTC: {
    name: 'Bitcoin',
    icon: '/blockchains/bitcoin.png',
    defaultPrice: 67500,
    defaultChange: 2.5
  },
  XRP: {
    name: 'XRP',
    icon: '/blockchains/xrp.png',
    defaultPrice: 0.62,
    defaultChange: -1.2
  },
  ETH: {
    name: 'Ethereum',
    icon: '/blockchains/ethereum.png',
    defaultPrice: 3200,
    defaultChange: 1.8
  },
  SOL: {
    name: 'Solana',
    icon: '/blockchains/solana.png',
    defaultPrice: 142,
    defaultChange: 4.3
  }
};

export const useCoinBalances = (): CoinBalancesHook => {
  const { user } = useAuth();
  const [balances, setBalances] = useState<CoinBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalValueUsd, setTotalValueUsd] = useState<number>(0);
  const [initialized, setInitialized] = useState<boolean>(false);

  const fetchBalances = async () => {
    // If no user is available, keep loading state until user is available
    if (!user) {
      console.log('No user found, waiting for authentication');
      setLoading(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch balances from Supabase
      const { data, error } = await supabase
        .from('coin_balances')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Enhance with price data and icons
      const enhancedBalances = data.map((balance: any) => {
        const metadata = COIN_METADATA[balance.coin_symbol] || {
          name: balance.coin_symbol,
          icon: '/placeholder-coin.svg',
          defaultPrice: 1,
          defaultChange: 0
        };

        // Add slight randomness to prices to simulate real-time changes
        const randomFactor = 1 + (Math.random() * 0.02 - 0.01); // ±1% variation
        const price = metadata.defaultPrice * randomFactor;
        const change24h = metadata.defaultChange + (Math.random() * 0.5 - 0.25); // ±0.25% variation

        return {
          ...balance,
          balance: parseFloat(balance.balance),
          price,
          change_24h: change24h,
          value_usd: parseFloat(balance.balance) * price,
          icon: metadata.icon
        };
      });

      setBalances(enhancedBalances);
      
      // Calculate total value
      const total = enhancedBalances.reduce((sum, coin) => sum + (coin.value_usd || 0), 0);
      setTotalValueUsd(total);
    } catch (err: any) {
      console.error('Error fetching coin balances:', err);
      setError(err.message || 'Failed to fetch coin balances');
      
      console.error('Error fetching coin balances, retrying in 3 seconds');
      // Retry after a short delay instead of using sample data
      setTimeout(() => {
        fetchBalances();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Only used for extreme fallback cases
  const useSampleData = () => {
    console.warn('FALLBACK: Using sample data as last resort');
    const sampleBalances = Object.entries(COIN_METADATA).map(([symbol, metadata]) => {
      const sampleBalance = 0; // Set to 0 to indicate these are not real balances
      const price = metadata.defaultPrice;
      return {
        coin_symbol: symbol,
        balance: sampleBalance,
        last_updated: new Date().toISOString(),
        price,
        change_24h: metadata.defaultChange,
        value_usd: sampleBalance * price,
        icon: metadata.icon
      };
    });
    
    setBalances(sampleBalances);
    setTotalValueUsd(0);
    setLoading(false);
    setInitialized(true);
    setError('Unable to connect to database. Please check your connection.');
  };

  useEffect(() => {
    // Always fetch when user changes
    fetchBalances();
    
    // Set up a refresh interval for real-time updates
    const intervalId = setInterval(() => {
      fetchBalances();
    }, 30000); // Refresh every 30 seconds
    
    // Set a timeout for fallback if data never loads
    const fallbackTimeout = setTimeout(() => {
      if (loading && balances.length === 0) {
        // As a last resort after 10 seconds, use sample data
        useSampleData();
      }
    }, 10000);
    
    return () => {
      clearInterval(intervalId);
      clearTimeout(fallbackTimeout);
    };
  }, [user]);

  return {
    balances,
    loading,
    error,
    refreshBalances: fetchBalances,
    totalValueUsd
  };
};
