import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { User } from './useUserManagement';

interface UseUserActionsProps {
  onSuccess?: () => void;
}

export function useUserActions({ onSuccess }: UseUserActionsProps = {}) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle suspending a user
  const suspendUser = async (userToSuspend: User) => {
    setIsProcessing(true);
    try {
      // First check if the status column exists
      const { data: columnExists, error: checkError } = await supabase
        .rpc('check_column_exists', { 
          table_name: 'profiles', 
          column_name: 'status' 
        });
      
      // If column doesn't exist or we got an error, create it
      if (checkError || !columnExists) {
        await supabase.rpc('add_status_column_to_profiles');
      }
      
      // Update the user's status
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'suspended' })
        .eq('id', userToSuspend.id);
      
      if (error) throw error;
      
      toast({
        title: "User Suspended",
        description: `${userToSuspend.full_name} has been suspended.`,
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error suspending user:', err);
      toast({
        title: "Error",
        description: "Failed to suspend user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle unsuspending a user
  const unsuspendUser = async (userToUnsuspend: User) => {
    setIsProcessing(true);
    try {
      // First check if the status column exists
      const { data: columnExists, error: checkError } = await supabase
        .rpc('check_column_exists', { 
          table_name: 'profiles', 
          column_name: 'status' 
        });
      
      // If column doesn't exist or we got an error, create it
      if (checkError || !columnExists) {
        await supabase.rpc('add_status_column_to_profiles');
      }
      
      // Update the user's status
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', userToUnsuspend.id);
      
      if (error) throw error;
      
      toast({
        title: "User Activated",
        description: `${userToUnsuspend.full_name} has been activated.`,
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error activating user:', err);
      toast({
        title: "Error",
        description: "Failed to activate user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle deleting a user
  const deleteUser = async (userToDelete: User) => {
    setIsProcessing(true);
    try {
      // First check if the status column exists
      const { data: columnExists, error: checkError } = await supabase
        .rpc('check_column_exists', { 
          table_name: 'profiles', 
          column_name: 'status' 
        });
      
      // If column doesn't exist or we got an error, create it
      if (checkError || !columnExists) {
        await supabase.rpc('add_status_column_to_profiles');
      }
      
      // Update the user's status to 'deleted'
      // Note: In a production app, you'd want to actually delete the user from auth.users
      // but that requires admin privileges and is typically done via a secure server function
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'deleted' })
        .eq('id', userToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "User Deleted",
        description: `${userToDelete.full_name} has been marked as deleted.`,
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    suspendUser,
    unsuspendUser,
    deleteUser,
    isProcessing
  };
}
