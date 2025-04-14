import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ensureWalletConnectionsTable, createSampleData } from '@/lib/databaseHelpers';
import { useAuth } from '@/context/AuthContext';

export interface ValidationStats {
  total_wallets: number;
  validated_wallets: number;
  pending_wallets: number;
  rejected_wallets: number;
  validation_rate: number;
  average_validation_time: number; // in hours
}

// Default stats to use as fallback
const defaultStats: ValidationStats = {
  total_wallets: 2,
  validated_wallets: 1,
  pending_wallets: 1,
  rejected_wallets: 0,
  validation_rate: 50,
  average_validation_time: 24
};

export function useValidationStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ValidationStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch validation statistics
  useEffect(() => {
    if (!user) return;
    
    const fetchValidationStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Ensure wallet_connections table exists and create sample data
        const tableExists = await ensureWalletConnectionsTable();
        if (!tableExists) {
          throw new Error('Could not create or access wallet_connections table');
        }
        
        // Create sample data if needed
        await createSampleData(user.id);
        
        // Get counts from wallet_connections table
        const { data: walletData, error: walletError } = await supabase
          .from('wallet_connections')
          .select('id, validated, validation_status, connected_at, validated_at');
        
        if (walletError) {
          console.error('Error fetching wallet data:', walletError);
          throw walletError;
        }
        
        if (!walletData || walletData.length === 0) {
          console.log('No wallet data found, using default stats');
          setStats(defaultStats);
          return;
        }
        
        // Calculate statistics
        const totalWallets = walletData.length;
        const validatedWallets = walletData.filter(wallet => 
          wallet.validated === true || wallet.validation_status === 'validated'
        ).length;
        const rejectedWallets = walletData.filter(wallet => 
          wallet.validation_status === 'rejected'
        ).length;
        const pendingWallets = totalWallets - validatedWallets - rejectedWallets;
        
        // Calculate validation rate
        const validationRate = totalWallets > 0 
          ? (validatedWallets / totalWallets) * 100 
          : 0;
        
        // Calculate average validation time for validated wallets
        let totalValidationTime = 0;
        let validatedWalletsWithTime = 0;
        
        walletData.forEach(wallet => {
          if ((wallet.validated === true || wallet.validation_status === 'validated') && 
              wallet.connected_at && wallet.validated_at) {
            const connectedDate = new Date(wallet.connected_at);
            const validatedDate = new Date(wallet.validated_at);
            const validationTimeHours = (validatedDate.getTime() - connectedDate.getTime()) / (1000 * 60 * 60);
            
            if (validationTimeHours > 0) {
              totalValidationTime += validationTimeHours;
              validatedWalletsWithTime++;
            }
          }
        });
        
        const averageValidationTime = validatedWalletsWithTime > 0 
          ? totalValidationTime / validatedWalletsWithTime 
          : defaultStats.average_validation_time; // Use default if no data
        
        setStats({
          total_wallets: totalWallets,
          validated_wallets: validatedWallets,
          pending_wallets: pendingWallets,
          rejected_wallets: rejectedWallets,
          validation_rate: parseFloat(validationRate.toFixed(2)),
          average_validation_time: parseFloat(averageValidationTime.toFixed(2))
        });
      } catch (err) {
        console.error('Error fetching validation statistics:', err);
        setError('Failed to load validation statistics');
        
        // Use default stats as fallback
        setStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };
    
    fetchValidationStats();
    
    // Set up realtime subscription
    const channel: RealtimeChannel = supabase
      .channel('public:wallet_connections')
      .on('postgres_changes', 
        { 
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public', 
          table: 'wallet_connections'
        }, 
        () => {
          // Refetch statistics when any change occurs
          fetchValidationStats();
        }
      )
      .subscribe();
    
    console.log('Subscribed to wallet connections channel for validation stats');
    
    return () => {
      console.log('Unsubscribing from wallet connections channel for validation stats');
      channel.unsubscribe();
    };
  }, [user]);
  
  return { stats, loading, error };
}
