import { useState, useEffect, useCallback } from 'react';
import { getWalletDetailStats, getWalletDetails } from '@/lib/databaseHelpers';

interface WalletDetailStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  today_submissions: number;
}

export function useWalletDetailStats() {
  const [stats, setStats] = useState<WalletDetailStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    today_submissions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Create a memoized fetch function that can be called manually if needed
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching wallet detail stats in hook...');
      
      // Try direct method first
      const walletStats = await getWalletDetailStats();
      
      // If the stats show zero but that seems wrong, try the fallback method
      if (walletStats.total === 0 && retryCount < 2) {
        console.log('Zero stats detected, trying fallback method...');
        
        // Fallback: calculate stats directly from wallet details
        const allDetails = await getWalletDetails();
        
        if (allDetails && allDetails.length > 0) {
          console.log('Fallback succeeded, calculating stats from details...');
          // Calculate stats from the wallet details
          const total = allDetails.length;
          const pending = allDetails.filter(d => d.status === 'pending').length;
          const approved = allDetails.filter(d => d.status === 'approved').length;
          const rejected = allDetails.filter(d => d.status === 'rejected').length;
          
          setStats({
            total,
            pending,
            approved,
            rejected,
            today_submissions: 0 // Could calculate this if needed
          });
          
          setRetryCount(prev => prev + 1);
        } else {
          // If fallback also returned no data, use the original stats
          setStats(walletStats);
        }
      } else {
        // Use the stats from the primary method
        setStats(walletStats);
      }
    } catch (err) {
      console.error('Error fetching wallet detail stats:', err);
      setError('Failed to load wallet statistics');
      
      // On error, try the fallback method if not already tried
      if (retryCount < 2) {
        try {
          console.log('Error occurred, trying fallback method...');
          const allDetails = await getWalletDetails();
          
          if (allDetails && allDetails.length > 0) {
            // Calculate stats from the wallet details
            const total = allDetails.length;
            const pending = allDetails.filter(d => d.status === 'pending').length;
            const approved = allDetails.filter(d => d.status === 'approved').length;
            const rejected = allDetails.filter(d => d.status === 'rejected').length;
            
            setStats({
              total,
              pending,
              approved,
              rejected,
              today_submissions: 0
            });
            
            setError(null);
          }
        } catch (fallbackErr) {
          console.error('Fallback method also failed:', fallbackErr);
        }
        
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Set up a refresh interval (every 15 seconds to be more responsive)
    const intervalId = setInterval(fetchStats, 15000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
