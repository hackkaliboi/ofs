import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
  user_email?: string;
  user_name?: string;
}

interface ProfileData {
  email?: string;
  full_name?: string;
}

interface ActivityWithProfile {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
  profiles?: ProfileData;
}

export function useUserActivity(isAdmin = false, limit = 10) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user activities
  useEffect(() => {
    if (!user) return;
    
    const fetchUserActivities = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For admin, fetch all user activities with user details
        // For regular users, fetch only their own activities
        const query = isAdmin
          ? supabase
              .from('user_activity_log')
              .select('*, profiles(email, full_name)')
              .order('created_at', { ascending: false })
              .limit(limit)
          : supabase
              .from('user_activity_log')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(limit);
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform data to include user_email and user_name
        const transformedData = data.map((activity: any) => ({
          id: activity.id,
          user_id: activity.user_id,
          activity_type: activity.activity_type,
          description: activity.description,
          created_at: activity.created_at,
          metadata: activity.metadata,
          user_email: activity.profiles?.email || '',
          user_name: activity.profiles?.full_name || '',
        }));
        
        setActivities(transformedData);
      } catch (err) {
        console.error('Error fetching user activities:', err);
        setError('Failed to load user activities');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserActivities();
    
    // Set up realtime subscription
    const channel: RealtimeChannel = supabase
      .channel('public:user_activity_log')
      .on('postgres_changes', 
        { 
          event: 'INSERT', // Only listen for new activities
          schema: 'public', 
          table: 'user_activity_log',
          ...(isAdmin ? {} : { filter: `user_id=eq.${user.id}` }) // Filter for user's own activities if not admin
        }, 
        async (payload) => {
          console.log('User activity change received:', payload);
          
          try {
            // Fetch the complete activity with user details
            const { data, error } = await supabase
              .from('user_activity_log')
              .select(isAdmin ? '*, profiles(email, full_name)' : '*')
              .eq('id', payload.new.id)
              .single();
            
            if (error) throw error;
            
            if (data) {
              // Use type assertion with any to avoid TypeScript errors
              const activityData = data as any;
              const newActivity: UserActivity = {
                id: activityData.id,
                user_id: activityData.user_id,
                activity_type: activityData.activity_type,
                description: activityData.description,
                created_at: activityData.created_at,
                metadata: activityData.metadata,
                user_email: activityData.profiles?.email || '',
                user_name: activityData.profiles?.full_name || '',
              };
              
              // Add new activity to the beginning and maintain the limit
              setActivities(prev => [newActivity, ...prev].slice(0, limit));
            }
          } catch (err) {
            console.error('Error processing realtime activity update:', err);
          }
        }
      )
      .subscribe();
    
    console.log('Subscribed to user activity channel');
    
    return () => {
      console.log('Unsubscribing from user activity channel');
      channel.unsubscribe();
    };
  }, [user, isAdmin, limit]);
  
  // Function to log a new activity
  const logActivity = async (activityType: string, description: string, metadata?: Record<string, any>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('user_activity_log')
        .insert([
          {
            user_id: user.id,
            activity_type: activityType,
            description,
            metadata
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error logging user activity:', err);
      return null;
    }
  };
  
  return { activities, loading, error, logActivity };
}
