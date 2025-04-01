import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Withdrawal {
  id: string;
  user_id: string;
  wallet_id: string;
  amount: number;
  currency: string;
  status: string;
  requested_at: string;
  processed_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  transaction_hash?: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
  wallet_address?: string;
}

interface ProfileData {
  email?: string;
  full_name?: string;
}

interface WalletData {
  wallet_address: string;
  chain_type?: string;
}

export function useWithdrawals(isAdmin = false) {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processed: 0,
    rejected: 0,
    total_amount: 0,
    processed_today: 0,
    total_amount_today: 0
  });

  // Fetch withdrawals
  useEffect(() => {
    if (!user) return;
    
    const fetchWithdrawals = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For admin, fetch all withdrawals with user details
        // For regular users, fetch only their own withdrawals
        const query = isAdmin
          ? supabase
              .from('withdrawals')
              .select('*, profiles(email, full_name), wallet_connections(wallet_address, chain_type)')
              .order('requested_at', { ascending: false })
          : supabase
              .from('withdrawals')
              .select('*, wallet_connections(wallet_address, chain_type)')
              .eq('user_id', user.id)
              .order('requested_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform data to include user_email, user_name, and wallet_address
        const transformedData = data.map((withdrawal: any) => ({
          id: withdrawal.id,
          user_id: withdrawal.user_id,
          wallet_id: withdrawal.wallet_id,
          amount: withdrawal.amount,
          currency: withdrawal.currency,
          status: withdrawal.status,
          requested_at: withdrawal.requested_at,
          processed_at: withdrawal.processed_at,
          rejected_at: withdrawal.rejected_at,
          rejection_reason: withdrawal.rejection_reason,
          transaction_hash: withdrawal.transaction_hash,
          created_at: withdrawal.created_at,
          user_email: withdrawal.profiles?.email || '',
          user_name: withdrawal.profiles?.full_name || '',
          wallet_address: withdrawal.wallet_connections?.wallet_address || '',
        }));
        
        setWithdrawals(transformedData);
        
        // Calculate stats
        const pendingCount = transformedData.filter(w => w.status === 'pending').length;
        const processedCount = transformedData.filter(w => w.status === 'processed').length;
        const rejectedCount = transformedData.filter(w => w.status === 'rejected').length;
        
        const totalAmount = transformedData.reduce((sum, w) => sum + (parseFloat(w.amount.toString()) || 0), 0);
        
        // Calculate today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const processedToday = transformedData.filter(w => 
          w.status === 'processed' && 
          new Date(w.processed_at || '') >= today
        );
        
        const processedTodayCount = processedToday.length;
        const totalAmountToday = processedToday.reduce((sum, w) => sum + (parseFloat(w.amount.toString()) || 0), 0);
        
        setStats({
          total: transformedData.length,
          pending: pendingCount,
          processed: processedCount,
          rejected: rejectedCount,
          total_amount: totalAmount,
          processed_today: processedTodayCount,
          total_amount_today: totalAmountToday
        });
      } catch (err) {
        console.error('Error fetching withdrawals:', err);
        setError('Failed to load withdrawals');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWithdrawals();
    
    // Set up realtime subscription
    const channel: RealtimeChannel = supabase
      .channel('public:withdrawals')
      .on('postgres_changes', 
        { 
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public', 
          table: 'withdrawals',
          ...(isAdmin ? {} : { filter: `user_id=eq.${user.id}` }) // Filter for user's own withdrawals if not admin
        }, 
        async (payload) => {
          console.log('Withdrawal change received:', payload);
          
          try {
            // Handle different event types
            if (payload.eventType === 'INSERT') {
              // Fetch the complete withdrawal with user and wallet details
              const { data, error } = await supabase
                .from('withdrawals')
                .select(
                  isAdmin 
                    ? '*, profiles(email, full_name), wallet_connections(wallet_address, chain_type)' 
                    : '*, wallet_connections(wallet_address, chain_type)'
                )
                .eq('id', payload.new.id)
                .single();
              
              if (error) throw error;
              
              if (data) {
                const withdrawalData = data as any;
                const newWithdrawal: Withdrawal = {
                  id: withdrawalData.id,
                  user_id: withdrawalData.user_id,
                  wallet_id: withdrawalData.wallet_id,
                  amount: withdrawalData.amount,
                  currency: withdrawalData.currency,
                  status: withdrawalData.status,
                  requested_at: withdrawalData.requested_at,
                  processed_at: withdrawalData.processed_at,
                  rejected_at: withdrawalData.rejected_at,
                  rejection_reason: withdrawalData.rejection_reason,
                  transaction_hash: withdrawalData.transaction_hash,
                  created_at: withdrawalData.created_at,
                  user_email: withdrawalData.profiles?.email || '',
                  user_name: withdrawalData.profiles?.full_name || '',
                  wallet_address: withdrawalData.wallet_connections?.wallet_address || '',
                };
                
                setWithdrawals(prev => [newWithdrawal, ...prev]);
                
                // Update stats
                const amount = parseFloat(newWithdrawal.amount.toString()) || 0;
                
                setStats(prev => ({
                  ...prev,
                  total: prev.total + 1,
                  pending: newWithdrawal.status === 'pending' ? prev.pending + 1 : prev.pending,
                  processed: newWithdrawal.status === 'processed' ? prev.processed + 1 : prev.processed,
                  rejected: newWithdrawal.status === 'rejected' ? prev.rejected + 1 : prev.rejected,
                  total_amount: prev.total_amount + amount,
                  processed_today: newWithdrawal.status === 'processed' && isToday(newWithdrawal.processed_at) 
                    ? prev.processed_today + 1 
                    : prev.processed_today,
                  total_amount_today: newWithdrawal.status === 'processed' && isToday(newWithdrawal.processed_at) 
                    ? prev.total_amount_today + amount 
                    : prev.total_amount_today
                }));
              }
            } else if (payload.eventType === 'UPDATE') {
              // Update existing withdrawal
              setWithdrawals(prev => 
                prev.map(withdrawal => 
                  withdrawal.id === payload.new.id 
                    ? { 
                        ...withdrawal, 
                        status: payload.new.status,
                        processed_at: payload.new.processed_at,
                        rejected_at: payload.new.rejected_at,
                        rejection_reason: payload.new.rejection_reason,
                        transaction_hash: payload.new.transaction_hash
                      } 
                    : withdrawal
                )
              );
              
              // Update stats if status changed
              if (payload.old.status !== payload.new.status) {
                const amount = parseFloat(payload.new.amount) || 0;
                
                setStats(prev => {
                  // Decrement count for old status
                  const pendingCount = payload.old.status === 'pending' ? prev.pending - 1 : prev.pending;
                  const processedCount = payload.old.status === 'processed' ? prev.processed - 1 : prev.processed;
                  const rejectedCount = payload.old.status === 'rejected' ? prev.rejected - 1 : prev.rejected;
                  
                  // Increment count for new status
                  const newPendingCount = payload.new.status === 'pending' ? pendingCount + 1 : pendingCount;
                  const newProcessedCount = payload.new.status === 'processed' ? processedCount + 1 : processedCount;
                  const newRejectedCount = payload.new.status === 'rejected' ? rejectedCount + 1 : rejectedCount;
                  
                  // Update processed today count if applicable
                  let newProcessedToday = prev.processed_today;
                  let newTotalAmountToday = prev.total_amount_today;
                  
                  if (payload.new.status === 'processed' && isToday(payload.new.processed_at)) {
                    newProcessedToday += 1;
                    newTotalAmountToday += amount;
                  }
                  
                  return {
                    total: prev.total,
                    pending: newPendingCount,
                    processed: newProcessedCount,
                    rejected: newRejectedCount,
                    total_amount: prev.total_amount,
                    processed_today: newProcessedToday,
                    total_amount_today: newTotalAmountToday
                  };
                });
              }
            } else if (payload.eventType === 'DELETE') {
              // Remove deleted withdrawal
              setWithdrawals(prev => 
                prev.filter(withdrawal => withdrawal.id !== payload.old.id)
              );
              
              // Update stats
              const amount = parseFloat(payload.old.amount) || 0;
              
              setStats(prev => ({
                total: prev.total - 1,
                pending: payload.old.status === 'pending' ? prev.pending - 1 : prev.pending,
                processed: payload.old.status === 'processed' ? prev.processed - 1 : prev.processed,
                rejected: payload.old.status === 'rejected' ? prev.rejected - 1 : prev.rejected,
                total_amount: prev.total_amount - amount,
                processed_today: payload.old.status === 'processed' && isToday(payload.old.processed_at) 
                  ? prev.processed_today - 1 
                  : prev.processed_today,
                total_amount_today: payload.old.status === 'processed' && isToday(payload.old.processed_at) 
                  ? prev.total_amount_today - amount 
                  : prev.total_amount_today
              }));
            }
          } catch (err) {
            console.error('Error processing realtime withdrawal update:', err);
          }
        }
      )
      .subscribe();
    
    console.log('Subscribed to withdrawals channel');
    
    return () => {
      console.log('Unsubscribing from withdrawals channel');
      channel.unsubscribe();
    };
  }, [user, isAdmin]);
  
  // Helper function to check if a date is today
  const isToday = (dateString?: string): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Function to request a new withdrawal
  const requestWithdrawal = async (walletId: string, amount: number, currency: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .insert([
          {
            user_id: user.id,
            wallet_id: walletId,
            amount,
            currency,
            status: 'pending',
            requested_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Log activity
      await supabase
        .from('user_activity_log')
        .insert([
          {
            user_id: user.id,
            activity_type: 'withdrawal_requested',
            description: `Requested withdrawal of ${amount} ${currency}`,
            metadata: { 
              wallet_id: walletId, 
              amount, 
              currency 
            }
          }
        ]);
      
      return data;
    } catch (err) {
      console.error('Error requesting withdrawal:', err);
      return null;
    }
  };
  
  // Function to update a withdrawal (admin only)
  const updateWithdrawal = async (
    id: string, 
    status: string, 
    transactionHash?: string, 
    rejectionReason?: string
  ) => {
    if (!user) return null;
    
    try {
      const updateData: any = {
        status
      };
      
      if (status === 'processed') {
        updateData.processed_at = new Date().toISOString();
        if (transactionHash) updateData.transaction_hash = transactionHash;
      } else if (status === 'rejected') {
        updateData.rejected_at = new Date().toISOString();
        if (rejectionReason) updateData.rejection_reason = rejectionReason;
      }
      
      const { data, error } = await supabase
        .from('withdrawals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log activity
      await supabase
        .from('user_activity_log')
        .insert([
          {
            user_id: user.id,
            activity_type: `withdrawal_${status}`,
            description: `${status === 'processed' ? 'Processed' : 'Rejected'} withdrawal request`,
            metadata: { 
              withdrawal_id: id, 
              status, 
              user_id: data.user_id,
              transaction_hash: transactionHash,
              rejection_reason: rejectionReason
            }
          }
        ]);
      
      return data;
    } catch (err) {
      console.error('Error updating withdrawal:', err);
      return null;
    }
  };
  
  return { 
    withdrawals, 
    loading, 
    error, 
    stats, 
    requestWithdrawal,
    updateWithdrawal
  };
}
