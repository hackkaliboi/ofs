import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface UserStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  users_with_wallets: number;
  users_with_validated_wallets: number;
}

// Mock stats for demo purposes
const mockStats: UserStats = {
  total_users: 1,
  active_users: 1,
  new_users_today: 0,
  new_users_this_week: 0,
  users_with_wallets: 0,
  users_with_validated_wallets: 0
};

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(mockStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Mock implementation - no backend calls
    console.log('Mock useUserStats: Using mock data');
    setStats(mockStats);
    setLoading(false);
  }, [user]);

  return { stats, loading, error };
}