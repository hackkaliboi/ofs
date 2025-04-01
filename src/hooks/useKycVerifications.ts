import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface KycVerification {
  id: string;
  user_id: string;
  status: string;
  submitted_at: string;
  verified_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  document_type?: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
  metadata?: any;
  wallet_id?: string;
}

interface ProfileData {
  email?: string;
  full_name?: string;
}

export function useKycVerifications(isAdmin = false) {
  const { user } = useAuth();
  const [kycVerifications, setKycVerifications] = useState<KycVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Fetch KYC verifications
  useEffect(() => {
    if (!user) return;
    
    const fetchKycVerifications = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For admin, fetch all KYC verifications with user details
        // For regular users, fetch only their own KYC verifications
        const query = isAdmin
          ? supabase
              .from('kyc_verifications')
              .select('*, profiles(email, full_name)')
              .order('submitted_at', { ascending: false })
          : supabase
              .from('kyc_verifications')
              .select('*')
              .eq('user_id', user.id)
              .order('submitted_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform data to include user_email and user_name
        const transformedData = data.map((kyc: any) => ({
          id: kyc.id,
          user_id: kyc.user_id,
          status: kyc.status,
          submitted_at: kyc.submitted_at,
          verified_at: kyc.verified_at,
          rejected_at: kyc.rejected_at,
          rejection_reason: kyc.rejection_reason,
          document_type: kyc.document_type,
          created_at: kyc.created_at,
          user_email: kyc.profiles?.email || '',
          user_name: kyc.profiles?.full_name || '',
          metadata: kyc.metadata,
          wallet_id: kyc.wallet_id
        }));
        
        setKycVerifications(transformedData);
        
        // Calculate stats
        const pendingCount = transformedData.filter(kyc => kyc.status === 'pending').length;
        const approvedCount = transformedData.filter(kyc => kyc.status === 'approved').length;
        const rejectedCount = transformedData.filter(kyc => kyc.status === 'rejected').length;
        
        setStats({
          total: transformedData.length,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount
        });
      } catch (err) {
        console.error('Error fetching KYC verifications:', err);
        setError('Failed to load KYC verifications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchKycVerifications();
    
    // Set up realtime subscription
    const channel: RealtimeChannel = supabase
      .channel('public:kyc_verifications')
      .on('postgres_changes', 
        { 
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public', 
          table: 'kyc_verifications',
          ...(isAdmin ? {} : { filter: `user_id=eq.${user.id}` }) // Filter for user's own verifications if not admin
        }, 
        async (payload) => {
          console.log('KYC verification change received:', payload);
          
          try {
            // Handle different event types
            if (payload.eventType === 'INSERT') {
              // Fetch the complete KYC verification with user details
              const { data, error } = await supabase
                .from('kyc_verifications')
                .select(isAdmin ? '*, profiles(email, full_name)' : '*')
                .eq('id', payload.new.id)
                .single();
              
              if (error) throw error;
              
              if (data) {
                const kycData = data as any;
                const newKyc: KycVerification = {
                  id: kycData.id,
                  user_id: kycData.user_id,
                  status: kycData.status,
                  submitted_at: kycData.submitted_at,
                  verified_at: kycData.verified_at,
                  rejected_at: kycData.rejected_at,
                  rejection_reason: kycData.rejection_reason,
                  document_type: kycData.document_type,
                  created_at: kycData.created_at,
                  user_email: kycData.profiles?.email || '',
                  user_name: kycData.profiles?.full_name || '',
                  metadata: kycData.metadata,
                  wallet_id: kycData.wallet_id
                };
                
                setKycVerifications(prev => [newKyc, ...prev]);
                
                // Update stats
                setStats(prev => ({
                  ...prev,
                  total: prev.total + 1,
                  pending: newKyc.status === 'pending' ? prev.pending + 1 : prev.pending,
                  approved: newKyc.status === 'approved' ? prev.approved + 1 : prev.approved,
                  rejected: newKyc.status === 'rejected' ? prev.rejected + 1 : prev.rejected
                }));
              }
            } else if (payload.eventType === 'UPDATE') {
              // Update existing KYC verification
              setKycVerifications(prev => 
                prev.map(kyc => 
                  kyc.id === payload.new.id 
                    ? { 
                        ...kyc, 
                        status: payload.new.status,
                        verified_at: payload.new.verified_at,
                        rejected_at: payload.new.rejected_at,
                        rejection_reason: payload.new.rejection_reason
                      } 
                    : kyc
                )
              );
              
              // Update stats if status changed
              if (payload.old.status !== payload.new.status) {
                setStats(prev => {
                  // Decrement count for old status
                  const pendingCount = payload.old.status === 'pending' ? prev.pending - 1 : prev.pending;
                  const approvedCount = payload.old.status === 'approved' ? prev.approved - 1 : prev.approved;
                  const rejectedCount = payload.old.status === 'rejected' ? prev.rejected - 1 : prev.rejected;
                  
                  // Increment count for new status
                  const newPendingCount = payload.new.status === 'pending' ? pendingCount + 1 : pendingCount;
                  const newApprovedCount = payload.new.status === 'approved' ? approvedCount + 1 : approvedCount;
                  const newRejectedCount = payload.new.status === 'rejected' ? rejectedCount + 1 : rejectedCount;
                  
                  return {
                    total: prev.total,
                    pending: newPendingCount,
                    approved: newApprovedCount,
                    rejected: newRejectedCount
                  };
                });
              }
            } else if (payload.eventType === 'DELETE') {
              // Remove deleted KYC verification
              setKycVerifications(prev => 
                prev.filter(kyc => kyc.id !== payload.old.id)
              );
              
              // Update stats
              setStats(prev => ({
                total: prev.total - 1,
                pending: payload.old.status === 'pending' ? prev.pending - 1 : prev.pending,
                approved: payload.old.status === 'approved' ? prev.approved - 1 : prev.approved,
                rejected: payload.old.status === 'rejected' ? prev.rejected - 1 : prev.rejected
              }));
            }
          } catch (err) {
            console.error('Error processing realtime KYC verification update:', err);
          }
        }
      )
      .subscribe();
    
    console.log('Subscribed to KYC verifications channel');
    
    return () => {
      console.log('Unsubscribing from KYC verifications channel');
      channel.unsubscribe();
    };
  }, [user, isAdmin]);
  
  // Function to submit a new KYC verification
  const submitKycVerification = async (documentType: string, metadata: any = null, walletId: string = null) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .insert([
          {
            user_id: user.id,
            status: 'pending',
            submitted_at: new Date().toISOString(),
            document_type: documentType,
            metadata: metadata,
            wallet_id: walletId
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
            activity_type: 'kyc_submitted',
            description: `Submitted KYC verification with ${documentType}`,
            metadata: { document_type: documentType, wallet_id: walletId }
          }
        ]);
      
      return data;
    } catch (err) {
      console.error('Error submitting KYC verification:', err);
      return null;
    }
  };
  
  // Function to update a KYC verification (admin only)
  const updateKycVerification = async (id: string, status: string, rejectionReason?: string) => {
    if (!user) return null;
    
    try {
      const updateData: any = {
        status
      };
      
      if (status === 'approved') {
        updateData.verified_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejected_at = new Date().toISOString();
        updateData.rejection_reason = rejectionReason;
      }
      
      const { data, error } = await supabase
        .from('kyc_verifications')
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
            activity_type: `kyc_${status}`,
            description: `${status === 'approved' ? 'Approved' : 'Rejected'} KYC verification for user`,
            metadata: { 
              kyc_id: id, 
              status, 
              user_id: data.user_id,
              rejection_reason: rejectionReason
            }
          }
        ]);
      
      return data;
    } catch (err) {
      console.error('Error updating KYC verification:', err);
      return null;
    }
  };
  
  return { 
    kycVerifications, 
    loading, 
    error, 
    stats, 
    submitKycVerification,
    updateKycVerification
  };
}
