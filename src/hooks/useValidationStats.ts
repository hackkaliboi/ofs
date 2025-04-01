import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface ValidationStats {
  total_wallets: number;
  validated_wallets: number;
  pending_wallets: number;
  rejected_wallets: number;
  validation_rate: number;
  average_validation_time: number; // in hours
}

export function useValidationStats() {
  const [stats, setStats] = useState<ValidationStats>({
    total_wallets: 0,
    validated_wallets: 0,
    pending_wallets: 0,
    rejected_wallets: 0,
    validation_rate: 0,
    average_validation_time: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch validation statistics
  useEffect(() => {
    const fetchValidationStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get counts from wallet_connections table
        const { data: walletData, error: walletError } = await supabase
          .from('wallet_connections')
          .select('id, validated, validation_status, connected_at, validated_at');
        
        if (walletError) throw walletError;
        
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
          : 0;
        
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
  }, []);
  
  return { stats, loading, error };
}
