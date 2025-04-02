import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ensureSecurityEventsTable, ensureUserActivityTable, createSampleData } from '@/lib/databaseHelpers';

export interface SecurityLog {
  id: string;
  user_id: string | null;
  event_type: string;
  description: string;
  ip_address: string | null;
  user_agent: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  metadata?: Record<string, any>;
  user_email?: string;
  user_name?: string;
}

// Sample data for fallback when the database query fails after all attempts
const sampleSecurityLogs: SecurityLog[] = [
  {
    id: 'sample-1',
    user_id: null,
    event_type: 'failed_login_attempt',
    description: 'Multiple failed login attempts detected',
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'medium',
    created_at: new Date().toISOString(),
    metadata: { attempts: 5, timeframe: '10 minutes' }
  },
  {
    id: 'sample-2',
    user_id: null,
    event_type: 'suspicious_ip_access',
    description: 'Access attempt from unusual location',
    ip_address: '203.0.113.1',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    severity: 'high',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    metadata: { location: 'Unknown', previous_location: 'United States' }
  },
  {
    id: 'sample-3',
    user_id: null,
    event_type: 'admin_login',
    description: 'Admin user logged in successfully',
    ip_address: '198.51.100.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'low',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    metadata: { admin_level: 'super_admin' }
  }
];

// Function to try fetching from user_activity_log as fallback
const fetchFromUserActivityLog = async (limit: number): Promise<SecurityLog[]> => {
  try {
    const { data, error } = await supabase
      .from('user_activity_log')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Transform activity logs to security logs format
    return data.map((log: any) => ({
      id: log.id,
      user_id: log.user_id,
      event_type: log.activity_type || 'user_activity',
      description: log.description,
      ip_address: log.metadata?.ip_address || null,
      user_agent: log.metadata?.user_agent || null,
      severity: getSeverityFromActivity(log.activity_type),
      created_at: log.created_at,
      metadata: log.metadata,
      user_email: log.profiles?.email || '',
      user_name: log.profiles?.full_name || '',
    }));
  } catch (err) {
    console.error('Error fetching from user_activity_log:', err);
    return [];
  }
};

// Helper to determine severity from activity type
const getSeverityFromActivity = (activityType: string): 'low' | 'medium' | 'high' | 'critical' => {
  if (!activityType) return 'low';
  
  if (activityType.includes('login_failed') || 
      activityType.includes('password_reset') ||
      activityType.includes('security_alert')) {
    return 'high';
  }
  
  if (activityType.includes('login') || 
      activityType.includes('password_change') ||
      activityType.includes('profile_update')) {
    return 'medium';
  }
  
  return 'low';
};

export function useSecurityLogs(limit = 20) {
  const { user } = useAuth();
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  // Fetch security logs
  useEffect(() => {
    if (!user) return;
    
    const fetchSecurityLogs = async () => {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);
      
      try {
        // First, try to ensure the security_events table exists
        const tableExists = await ensureSecurityEventsTable();
        
        // Create sample data if needed
        await createSampleData(user.id);
        
        if (tableExists) {
          // Try to fetch from security_events table
          const { data, error } = await supabase
            .from('security_events')
            .select('*, profiles(email, full_name)')
            .order('created_at', { ascending: false })
            .limit(limit);
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            // Transform data to include user_email and user_name
            const transformedData = data.map((log: any) => ({
              id: log.id,
              user_id: log.user_id,
              event_type: log.event_type,
              description: log.description,
              ip_address: log.ip_address,
              user_agent: log.user_agent,
              severity: log.severity as 'low' | 'medium' | 'high' | 'critical',
              created_at: log.created_at,
              metadata: log.metadata,
              user_email: log.profiles?.email || '',
              user_name: log.profiles?.full_name || '',
            }));
            
            setSecurityLogs(transformedData);
            return;
          }
        }
        
        // If we get here, either the table doesn't exist or it's empty
        // Try to fetch from user_activity_log as a fallback
        const activityTableExists = await ensureUserActivityTable();
        
        if (activityTableExists) {
          const activityLogs = await fetchFromUserActivityLog(limit);
          
          if (activityLogs.length > 0) {
            setSecurityLogs(activityLogs);
            setUsingFallbackData(true);
            return;
          }
        }
        
        // If all else fails, use sample data
        console.log('Using sample security logs data');
        setSecurityLogs(sampleSecurityLogs);
        setUsingFallbackData(true);
      } catch (err) {
        console.error('Error fetching security logs:', err);
        setError('Failed to load security logs');
        
        // Use sample data as final fallback
        setSecurityLogs(sampleSecurityLogs);
        setUsingFallbackData(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSecurityLogs();
    
    // Set up realtime subscription if the table exists
    let channel: RealtimeChannel | null = null;
    
    const setupRealtimeSubscription = async () => {
      try {
        const tableExists = await ensureSecurityEventsTable();
        
        if (tableExists) {
          channel = supabase
            .channel('public:security_events')
            .on('postgres_changes', 
              { 
                event: 'INSERT',
                schema: 'public', 
                table: 'security_events'
              }, 
              async (payload) => {
                console.log('Security event change received:', payload);
                
                try {
                  // Fetch the complete security event with user details
                  const { data, error } = await supabase
                    .from('security_events')
                    .select('*, profiles(email, full_name)')
                    .eq('id', payload.new.id)
                    .single();
                  
                  if (error) throw error;
                  
                  if (data) {
                    const eventData = data as any;
                    const newEvent: SecurityLog = {
                      id: eventData.id,
                      user_id: eventData.user_id,
                      event_type: eventData.event_type,
                      description: eventData.description,
                      ip_address: eventData.ip_address,
                      user_agent: eventData.user_agent,
                      severity: eventData.severity as 'low' | 'medium' | 'high' | 'critical',
                      created_at: eventData.created_at,
                      metadata: eventData.metadata,
                      user_email: eventData.profiles?.email || '',
                      user_name: eventData.profiles?.full_name || '',
                    };
                    
                    setSecurityLogs(prev => [newEvent, ...prev].slice(0, limit));
                    setUsingFallbackData(false);
                  }
                } catch (err) {
                  console.error('Error processing realtime security event update:', err);
                }
              }
            )
            .subscribe();
          
          console.log('Subscribed to security events channel');
        }
      } catch (err) {
        console.error('Error setting up realtime subscription:', err);
      }
    };
    
    setupRealtimeSubscription();
    
    return () => {
      if (channel) {
        console.log('Unsubscribing from security events channel');
        channel.unsubscribe();
      }
    };
  }, [user, limit]);
  
  return { securityLogs, loading, error, usingFallbackData };
}
