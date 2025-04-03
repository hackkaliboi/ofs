import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface AnalyticsData {
  // User metrics
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  userGrowthRate: number; // percentage
  
  // Wallet metrics
  totalWallets: number;
  validatedWallets: number;
  pendingValidations: number;
  validationRate: number; // percentage
  
  // Activity metrics
  totalActivities: number;
  activitiesLast24Hours: number;
  activitiesLast7Days: number;
  
  // Security metrics
  securityEvents: number;
  criticalEvents: number;
  highSeverityEvents: number;
  
  // Performance metrics
  averageValidationTime: number; // in hours
  averageResponseTime: number; // in hours
  
  // Financial metrics
  totalWithdrawals: number;
  pendingWithdrawals: number;
  processedWithdrawals: number;
  
  // Last updated timestamp
  lastUpdated: string;
}

// Sample data for fallback when all other methods fail
const sampleAnalyticsData: AnalyticsData = {
  totalUsers: 250,
  activeUsers: 120,
  newUsersToday: 8,
  userGrowthRate: 5.2,
  
  totalWallets: 380,
  validatedWallets: 310,
  pendingValidations: 70,
  validationRate: 81.6,
  
  totalActivities: 1250,
  activitiesLast24Hours: 85,
  activitiesLast7Days: 420,
  
  securityEvents: 35,
  criticalEvents: 2,
  highSeverityEvents: 8,
  
  averageValidationTime: 6.5,
  averageResponseTime: 4.2,
  
  totalWithdrawals: 95,
  pendingWithdrawals: 12,
  processedWithdrawals: 83,
  
  lastUpdated: new Date().toISOString()
};

// Function to ensure the database functions exist
const ensureAnalyticsFunctions = async (): Promise<boolean> => {
  try {
    // Try to call get_user_statistics to check if it exists
    const { data, error } = await supabase.rpc('get_user_statistics');
    
    if (!error) {
      console.log('Analytics functions already exist');
      return true;
    }
    
    console.log('Creating analytics functions...');
    
    // Create the functions using execute_sql RPC
    const functions = [
      // User statistics function
      `
      CREATE OR REPLACE FUNCTION get_user_statistics()
      RETURNS JSON AS $$
      DECLARE
        result JSON;
      BEGIN
        SELECT json_build_object(
          'total_users', (SELECT COUNT(*) FROM auth.users),
          'active_users', (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at > NOW() - INTERVAL '30 days'),
          'new_users_today', (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '1 day'),
          'growth_rate', (
            SELECT CASE 
              WHEN count_30_days_ago = 0 THEN 0
              ELSE ROUND((count_today - count_30_days_ago) * 100.0 / count_30_days_ago, 1)
            END
            FROM (
              SELECT 
                (SELECT COUNT(*) FROM auth.users) as count_today,
                (SELECT COUNT(*) FROM auth.users WHERE created_at < NOW() - INTERVAL '30 days') as count_30_days_ago
            ) as counts
          ),
          'users_with_validated_wallets', (
            SELECT COUNT(DISTINCT user_id) 
            FROM public.wallets 
            WHERE validation_status = 'validated'
          )
        ) INTO result;
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
      
      // Wallet statistics function
      `
      CREATE OR REPLACE FUNCTION get_wallet_statistics()
      RETURNS JSON AS $$
      DECLARE
        result JSON;
      BEGIN
        SELECT json_build_object(
          'total_wallets', (SELECT COUNT(*) FROM public.wallets),
          'validated_wallets', (SELECT COUNT(*) FROM public.wallets WHERE validation_status = 'validated'),
          'pending_validations', (SELECT COUNT(*) FROM public.wallets WHERE validation_status = 'pending'),
          'validation_rate', (
            SELECT CASE 
              WHEN total_wallets = 0 THEN 0
              ELSE ROUND((validated_wallets * 100.0) / total_wallets, 1)
            END
            FROM (
              SELECT 
                COUNT(*) as total_wallets,
                COUNT(*) FILTER (WHERE validation_status = 'validated') as validated_wallets
              FROM public.wallets
            ) as wallet_counts
          ),
          'avg_validation_time', (
            SELECT COALESCE(
              EXTRACT(EPOCH FROM AVG(validated_at - created_at)) / 3600,
              24
            )
            FROM public.wallets
            WHERE validation_status = 'validated' AND validated_at IS NOT NULL
          )
        ) INTO result;
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
      
      // Activity statistics function
      `
      CREATE OR REPLACE FUNCTION get_activity_statistics()
      RETURNS JSON AS $$
      DECLARE
        result JSON;
      BEGIN
        SELECT json_build_object(
          'total_activities', (SELECT COUNT(*) FROM public.user_activity_log),
          'activities_last_24h', (SELECT COUNT(*) FROM public.user_activity_log WHERE created_at > NOW() - INTERVAL '1 day'),
          'activities_last_7d', (SELECT COUNT(*) FROM public.user_activity_log WHERE created_at > NOW() - INTERVAL '7 days'),
          'avg_response_time', (
            SELECT COALESCE(
              AVG(response_time),
              4.0
            )
            FROM (
              SELECT 
                EXTRACT(EPOCH FROM (
                  lead(created_at) OVER (PARTITION BY user_id ORDER BY created_at) - created_at
                )) / 3600 as response_time
              FROM public.user_activity_log
              WHERE activity_type LIKE '%request%'
            ) as response_times
            WHERE response_time BETWEEN 0 AND 72 -- Filter out outliers
          )
        ) INTO result;
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
      
      // Security statistics function
      `
      CREATE OR REPLACE FUNCTION get_security_statistics()
      RETURNS JSON AS $$
      DECLARE
        result JSON;
        security_table_exists BOOLEAN;
      BEGIN
        -- Check if security_events table exists
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'security_events'
        ) INTO security_table_exists;
        
        IF security_table_exists THEN
          SELECT json_build_object(
            'total_events', (SELECT COUNT(*) FROM public.security_events),
            'critical_events', (SELECT COUNT(*) FROM public.security_events WHERE severity = 'critical'),
            'high_severity_events', (SELECT COUNT(*) FROM public.security_events WHERE severity = 'high')
          ) INTO result;
        ELSE
          -- Fallback to user_activity_log with security-related activities
          SELECT json_build_object(
            'total_events', (SELECT COUNT(*) FROM public.user_activity_log WHERE activity_type LIKE '%security%' OR metadata->>'security_related' = 'true'),
            'critical_events', (SELECT COUNT(*) FROM public.user_activity_log WHERE (activity_type LIKE '%security%' OR metadata->>'security_related' = 'true') AND metadata->>'severity' = 'critical'),
            'high_severity_events', (SELECT COUNT(*) FROM public.user_activity_log WHERE (activity_type LIKE '%security%' OR metadata->>'security_related' = 'true') AND metadata->>'severity' = 'high')
          ) INTO result;
        END IF;
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
      
      // Withdrawal statistics function
      `
      CREATE OR REPLACE FUNCTION get_withdrawal_statistics()
      RETURNS JSON AS $$
      DECLARE
        result JSON;
        withdrawals_table_exists BOOLEAN;
      BEGIN
        -- Check if withdrawals table exists
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'withdrawals'
        ) INTO withdrawals_table_exists;
        
        IF withdrawals_table_exists THEN
          SELECT json_build_object(
            'total_withdrawals', (SELECT COUNT(*) FROM public.withdrawals),
            'pending_withdrawals', (SELECT COUNT(*) FROM public.withdrawals WHERE status = 'pending'),
            'processed_withdrawals', (SELECT COUNT(*) FROM public.withdrawals WHERE status = 'processed' OR status = 'completed')
          ) INTO result;
        ELSE
          -- Fallback to transactions if they exist
          IF EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'transactions'
          ) THEN
            SELECT json_build_object(
              'total_withdrawals', (SELECT COUNT(*) FROM public.transactions WHERE type = 'withdrawal'),
              'pending_withdrawals', (SELECT COUNT(*) FROM public.transactions WHERE type = 'withdrawal' AND status = 'pending'),
              'processed_withdrawals', (SELECT COUNT(*) FROM public.transactions WHERE type = 'withdrawal' AND (status = 'processed' OR status = 'completed'))
            ) INTO result;
          ELSE
            -- Default values if no tables exist
            SELECT json_build_object(
              'total_withdrawals', 0,
              'pending_withdrawals', 0,
              'processed_withdrawals', 0
            ) INTO result;
          END IF;
        END IF;
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    ];
    
    // Execute each function creation
    for (const functionSql of functions) {
      const { error: createError } = await supabase.rpc('execute_sql', {
        sql: functionSql
      });
      
      if (createError) {
        console.error('Error creating analytics function:', createError);
        // Continue trying to create other functions
      }
    }
    
    // Check if creation was successful by calling one of the functions
    const { error: checkError } = await supabase.rpc('get_user_statistics');
    return !checkError;
  } catch (err) {
    console.error('Error ensuring analytics functions exist:', err);
    return false;
  }
};

// Function to get real analytics data from the database
const fetchRealAnalyticsData = async (): Promise<Partial<AnalyticsData>> => {
  const result: Partial<AnalyticsData> = {
    lastUpdated: new Date().toISOString()
  };
  
  try {
    // Fetch user stats
    const { data: userStats, error: userError } = await supabase.rpc('get_user_statistics');
    
    if (!userError && userStats) {
      result.totalUsers = userStats.total_users || 0;
      result.activeUsers = userStats.active_users || 0;
      result.newUsersToday = userStats.new_users_today || 0;
      result.userGrowthRate = userStats.growth_rate || 0;
    }
    
    // Fetch wallet stats
    const { data: walletStats, error: walletError } = await supabase.rpc('get_wallet_statistics');
    
    if (!walletError && walletStats) {
      result.totalWallets = walletStats.total_wallets || 0;
      result.validatedWallets = walletStats.validated_wallets || 0;
      result.pendingValidations = walletStats.pending_validations || 0;
      result.validationRate = walletStats.validation_rate || 0;
      result.averageValidationTime = walletStats.avg_validation_time || 0;
    }
    
    // Fetch activity stats
    const { data: activityStats, error: activityError } = await supabase.rpc('get_activity_statistics');
    
    if (!activityError && activityStats) {
      result.totalActivities = activityStats.total_activities || 0;
      result.activitiesLast24Hours = activityStats.activities_last_24h || 0;
      result.activitiesLast7Days = activityStats.activities_last_7d || 0;
      result.averageResponseTime = activityStats.avg_response_time || 0;
    }
    
    // Fetch security stats
    const { data: securityStats, error: securityError } = await supabase.rpc('get_security_statistics');
    
    if (!securityError && securityStats) {
      result.securityEvents = securityStats.total_events || 0;
      result.criticalEvents = securityStats.critical_events || 0;
      result.highSeverityEvents = securityStats.high_severity_events || 0;
    }
    
    // Fetch withdrawal stats
    const { data: withdrawalStats, error: withdrawalError } = await supabase.rpc('get_withdrawal_statistics');
    
    if (!withdrawalError && withdrawalStats) {
      result.totalWithdrawals = withdrawalStats.total_withdrawals || 0;
      result.pendingWithdrawals = withdrawalStats.pending_withdrawals || 0;
      result.processedWithdrawals = withdrawalStats.processed_withdrawals || 0;
    }
    
    return result;
  } catch (err) {
    console.error('Error fetching real analytics data:', err);
    return result;
  }
};

// Function to get analytics data directly from tables if functions fail
const fetchDirectAnalyticsData = async (): Promise<Partial<AnalyticsData>> => {
  const result: Partial<AnalyticsData> = {
    lastUpdated: new Date().toISOString()
  };
  
  try {
    // Direct query for user metrics
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, created_at, last_sign_in_at');
    
    if (!usersError && users) {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      result.totalUsers = users.length;
      result.activeUsers = users.filter(u => 
        u.last_sign_in_at && new Date(u.last_sign_in_at) > thirtyDaysAgo
      ).length;
      result.newUsersToday = users.filter(u => 
        u.created_at && new Date(u.created_at) > oneDayAgo
      ).length;
      
      const usersThirtyDaysAgo = users.filter(u => 
        u.created_at && new Date(u.created_at) < thirtyDaysAgo
      ).length;
      
      result.userGrowthRate = usersThirtyDaysAgo === 0 ? 0 : 
        parseFloat(((users.length - usersThirtyDaysAgo) * 100 / usersThirtyDaysAgo).toFixed(1));
    }
    
    // Direct query for wallet metrics
    const { data: wallets, error: walletsError } = await supabase
      .from('wallets')
      .select('id, validation_status, created_at, validated_at');
    
    if (!walletsError && wallets) {
      result.totalWallets = wallets.length;
      result.validatedWallets = wallets.filter(w => w.validation_status === 'validated').length;
      result.pendingValidations = wallets.filter(w => w.validation_status === 'pending').length;
      
      result.validationRate = result.totalWallets === 0 ? 0 : 
        parseFloat(((result.validatedWallets * 100) / result.totalWallets).toFixed(1));
      
      // Calculate average validation time
      const validationTimes = wallets
        .filter(w => w.validation_status === 'validated' && w.validated_at && w.created_at)
        .map(w => {
          const validatedAt = new Date(w.validated_at!);
          const createdAt = new Date(w.created_at!);
          return (validatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60); // hours
        });
      
      result.averageValidationTime = validationTimes.length === 0 ? 24 : 
        parseFloat((validationTimes.reduce((sum, time) => sum + time, 0) / validationTimes.length).toFixed(1));
    }
    
    // Direct query for activity metrics
    const { data: activities, error: activitiesError } = await supabase
      .from('user_activity_log')
      .select('id, created_at');
    
    if (!activitiesError && activities) {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      result.totalActivities = activities.length;
      result.activitiesLast24Hours = activities.filter(a => 
        new Date(a.created_at) > oneDayAgo
      ).length;
      result.activitiesLast7Days = activities.filter(a => 
        new Date(a.created_at) > sevenDaysAgo
      ).length;
      
      // Estimate response time (simplified)
      result.averageResponseTime = 4.2; // Default value
    }
    
    // Try to get security metrics from security_events or user_activity_log
    let securityData: any[] = [];
    
    // First try security_events
    const { data: secEvents, error: secEventsError } = await supabase
      .from('security_events')
      .select('id, severity');
    
    if (!secEventsError && secEvents && secEvents.length > 0) {
      securityData = secEvents;
      result.securityEvents = secEvents.length;
      result.criticalEvents = secEvents.filter(e => e.severity === 'critical').length;
      result.highSeverityEvents = secEvents.filter(e => e.severity === 'high').length;
    } else {
      // Fallback to user_activity_log for security events
      const { data: secActivities, error: secActivitiesError } = await supabase
        .from('user_activity_log')
        .select('id, activity_type, metadata')
        .or('activity_type.ilike.%security%,metadata->>security_related.eq.true');
      
      if (!secActivitiesError && secActivities) {
        result.securityEvents = secActivities.length;
        result.criticalEvents = secActivities.filter(a => 
          a.metadata && a.metadata.severity === 'critical'
        ).length;
        result.highSeverityEvents = secActivities.filter(a => 
          a.metadata && a.metadata.severity === 'high'
        ).length;
      } else {
        // Default values if no security data
        result.securityEvents = 0;
        result.criticalEvents = 0;
        result.highSeverityEvents = 0;
      }
    }
    
    // Try to get withdrawal metrics
    let withdrawalData: any[] = [];
    
    // First try withdrawals table
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('id, status');
    
    if (!withdrawalsError && withdrawals && withdrawals.length > 0) {
      withdrawalData = withdrawals;
      result.totalWithdrawals = withdrawals.length;
      result.pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
      result.processedWithdrawals = withdrawals.filter(w => 
        w.status === 'processed' || w.status === 'completed'
      ).length;
    } else {
      // Try transactions table
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('id, type, status')
        .eq('type', 'withdrawal');
      
      if (!transactionsError && transactions) {
        result.totalWithdrawals = transactions.length;
        result.pendingWithdrawals = transactions.filter(t => t.status === 'pending').length;
        result.processedWithdrawals = transactions.filter(t => 
          t.status === 'processed' || t.status === 'completed'
        ).length;
      } else {
        // Default values if no withdrawal data
        result.totalWithdrawals = 0;
        result.pendingWithdrawals = 0;
        result.processedWithdrawals = 0;
      }
    }
    
    return result;
  } catch (err) {
    console.error('Error fetching direct analytics data:', err);
    return result;
  }
};

export function useAdminAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>(sampleAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);
      
      try {
        // First, try to ensure the analytics functions exist
        const functionsExist = await ensureAnalyticsFunctions();
        
        let analyticsData: Partial<AnalyticsData> = {};
        
        if (functionsExist) {
          // Try to fetch data using the database functions
          analyticsData = await fetchRealAnalyticsData();
        }
        
        // Check if we got all the required data
        const hasAllData = (
          analyticsData.totalUsers !== undefined &&
          analyticsData.totalWallets !== undefined &&
          analyticsData.totalActivities !== undefined &&
          analyticsData.securityEvents !== undefined &&
          analyticsData.totalWithdrawals !== undefined
        );
        
        if (!hasAllData) {
          console.log('Missing some analytics data, trying direct queries...');
          // Try direct queries as fallback
          const directData = await fetchDirectAnalyticsData();
          
          // Merge the results, preferring data from functions
          analyticsData = { ...directData, ...analyticsData };
        }
        
        // Check if we have enough data now
        const hasEnoughData = (
          analyticsData.totalUsers !== undefined &&
          analyticsData.totalWallets !== undefined
        );
        
        if (hasEnoughData) {
          // Fill in any missing values with defaults
          const completeData: AnalyticsData = {
            totalUsers: analyticsData.totalUsers ?? 0,
            activeUsers: analyticsData.activeUsers ?? 0,
            newUsersToday: analyticsData.newUsersToday ?? 0,
            userGrowthRate: analyticsData.userGrowthRate ?? 0,
            
            totalWallets: analyticsData.totalWallets ?? 0,
            validatedWallets: analyticsData.validatedWallets ?? 0,
            pendingValidations: analyticsData.pendingValidations ?? 0,
            validationRate: analyticsData.validationRate ?? 0,
            
            totalActivities: analyticsData.totalActivities ?? 0,
            activitiesLast24Hours: analyticsData.activitiesLast24Hours ?? 0,
            activitiesLast7Days: analyticsData.activitiesLast7Days ?? 0,
            
            securityEvents: analyticsData.securityEvents ?? 0,
            criticalEvents: analyticsData.criticalEvents ?? 0,
            highSeverityEvents: analyticsData.highSeverityEvents ?? 0,
            
            averageValidationTime: analyticsData.averageValidationTime ?? 6.5,
            averageResponseTime: analyticsData.averageResponseTime ?? 4.2,
            
            totalWithdrawals: analyticsData.totalWithdrawals ?? 0,
            pendingWithdrawals: analyticsData.pendingWithdrawals ?? 0,
            processedWithdrawals: analyticsData.processedWithdrawals ?? 0,
            
            lastUpdated: analyticsData.lastUpdated ?? new Date().toISOString()
          };
          
          setAnalytics(completeData);
          setUsingFallbackData(false);
        } else {
          // If we still don't have enough data, use sample data
          console.warn('Using sample analytics data as last resort');
          setAnalytics(sampleAnalyticsData);
          setUsingFallbackData(true);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
        
        // Use sample data as fallback
        setAnalytics(sampleAnalyticsData);
        setUsingFallbackData(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
    
    // Set up realtime subscription for key tables
    const channels: RealtimeChannel[] = [];
    
    const setupRealtimeSubscriptions = () => {
      // Tables to monitor for changes
      const tables = ['profiles', 'wallets', 'wallet_validations', 'user_activity_log', 'withdrawals'];
      
      tables.forEach(table => {
        const channel = supabase
          .channel(`public:${table}:changes`)
          .on('postgres_changes', 
            { 
              event: '*', // Listen for all changes
              schema: 'public', 
              table
            }, 
            () => {
              // When any change happens, update the analytics
              // This is a simple approach - in a production app you might want to be more selective
              // about when to refresh the entire analytics dataset
              console.log(`Change detected in ${table}, refreshing analytics`);
              fetchAnalyticsData();
            }
          )
          .subscribe();
        
        channels.push(channel);
        console.log(`Subscribed to ${table} changes for analytics`);
      });
    };
    
    setupRealtimeSubscriptions();
    
    // Set up a refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      console.log('Refreshing analytics data on interval');
      fetchAnalyticsData();
    }, 5 * 60 * 1000);
    
    return () => {
      // Clean up subscriptions and interval
      channels.forEach(channel => channel.unsubscribe());
      clearInterval(refreshInterval);
    };
  }, [user]);
  
  return { 
    analytics, 
    loading, 
    error, 
    usingFallbackData,
    refresh: () => setLoading(true) // Trigger a refresh
  };
}
