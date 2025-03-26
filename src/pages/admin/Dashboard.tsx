import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getAllUsers, getSecurityLogs, getEnhancedSystemStats } from "@/lib/supabase";
import { NetworkStatus } from "@/components/admin/blockchain/network-status";
import { TokenPrices } from "@/components/admin/blockchain/token-prices";
import { SmartContractMonitor } from "@/components/admin/blockchain/smart-contract-monitor";
import { NetworkStats } from "@/components/admin/blockchain/network-stats";
import { AdminLoadingState } from "@/components/admin/loading-state";
import { AdminErrorState } from "@/components/admin/error-state";
import { useToast } from "@/components/ui/use-toast";
import {
  Activity,
  Users,
  Wallet,
  Shield,
  BarChart3,
  Clock,
  AlertCircle,
  RefreshCcw,
  Search,
  UserPlus,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Server,
  Database,
  Zap,
} from "lucide-react";

interface SecurityLog {
  id: string;
  user_id: string;
  event_type: string;
  ip_address: string;
  created_at: string;
  description: string;
}

interface EnhancedSystemStats {
  total_transactions: number;
  total_volume: number;
  active_wallets: number;
  system_health: 'good' | 'warning' | 'critical';
  uptime_percentage: number;
  blockchain_networks: any[];
  tokens: any[];
  smart_contracts: any[];
  active_networks: number;
}

interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalTransactions: number;
  transactionVolume: number;
  activeWallets: number;
  securityEvents: number;
  systemHealth: 'good' | 'warning' | 'critical';
  uptimePercentage: number;
  recentUsers: any[];
  securityLogs: SecurityLog[];
  userGrowth: number;
  transactionGrowth: number;
  blockchainNetworks: any[];
  tokens: any[];
  smartContracts: any[];
  activeNetworks: number;
}

const defaultData: AdminDashboardData = {
  totalUsers: 0,
  activeUsers: 0,
  newUsersToday: 0,
  totalTransactions: 0,
  transactionVolume: 0,
  activeWallets: 0,
  securityEvents: 0,
  systemHealth: 'good',
  uptimePercentage: 0,
  recentUsers: [],
  securityLogs: [],
  userGrowth: 0,
  transactionGrowth: 0,
  blockchainNetworks: [],
  tokens: [],
  smartContracts: [],
  activeNetworks: 0
};

// Generate sample data when real data is not available
const generateSampleData = (): AdminDashboardData => {
  return {
    totalUsers: 1250,
    activeUsers: 780,
    newUsersToday: 24,
    totalTransactions: 45678,
    transactionVolume: 2345678,
    activeWallets: 892,
    securityEvents: 12,
    systemHealth: 'good',
    uptimePercentage: 99.98,
    recentUsers: [],
    securityLogs: [],
    userGrowth: 12.5, // Sample growth rate
    transactionGrowth: 8.3, // Sample growth rate
    blockchainNetworks: [],
    tokens: [],
    smartContracts: [],
    activeNetworks: 3
  };
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>(defaultData);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [activeTab, setActiveTab] = useState("overview");
  const CACHE_DURATION = 60000; // 1 minute cache

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setLoadingError(null);
      
      // Fetch all users
      const { data: usersData, error: usersError } = await getAllUsers();
      
      if (usersError) {
        console.error("Error fetching users:", usersError);
        throw new Error("Failed to load user data");
      }
      
      // Fetch security logs
      const { data: logsData, error: logsError } = await getSecurityLogs();
      
      if (logsError) {
        console.error("Error fetching security logs:", logsError);
        toast({
          title: "Warning",
          description: "Failed to load security logs. Using fallback data.",
          variant: "destructive",
        });
      }

      // Fetch enhanced system stats with blockchain data
      const { data: enhancedStats, error: statsError } = await getEnhancedSystemStats();
      
      if (statsError) {
        console.error("Error fetching enhanced system stats:", statsError);
        throw new Error("Failed to load system stats");
      }
      
      // Calculate active users (users who logged in within the last 7 days)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const activeUsers = usersData?.filter(user => 
        user.last_login && new Date(user.last_login) > sevenDaysAgo
      ).length || 0;
      
      // Calculate new users today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newUsersToday = usersData?.filter(user => 
        user.created_at && new Date(user.created_at) > today
      ).length || 0;
      
      // Set dashboard data
      setDashboardData({
        totalUsers: usersData?.length || 0,
        activeUsers,
        newUsersToday,
        totalTransactions: enhancedStats?.total_transactions || 0,
        transactionVolume: enhancedStats?.total_volume || 0,
        activeWallets: enhancedStats?.active_wallets || 0,
        securityEvents: logsData?.length || 0,
        systemHealth: enhancedStats?.system_health || 'good',
        uptimePercentage: enhancedStats?.uptime_percentage || 99.9,
        recentUsers: usersData?.slice(0, 5) || [],
        securityLogs: logsData || [],
        userGrowth: 8.2, // Sample growth rate
        transactionGrowth: 12.5, // Sample growth rate
        blockchainNetworks: enhancedStats?.blockchain_networks || [],
        tokens: enhancedStats?.tokens || [],
        smartContracts: enhancedStats?.smart_contracts || [],
        activeNetworks: enhancedStats?.active_networks || 0
      });
      
      setLastFetchTime(Date.now());
      toast({
        title: "Dashboard Updated",
        description: "Admin dashboard data has been refreshed",
        variant: "default",
      });
    } catch (error) {
      console.error("Error loading admin dashboard data:", error);
      setLoadingError(error instanceof Error ? error.message : "An unknown error occurred");
      // Use sample data as fallback
      setDashboardData(generateSampleData());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set a loading timeout to prevent infinite loading
    const loadingTimeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Admin dashboard loading timeout triggered');
        setIsLoading(false);
        setLoadingError("Dashboard data loading timed out. Please try refreshing.");
        setDashboardData(generateSampleData());
      }
    }, 10000);

    const fetchData = async () => {
      // Check if we should use cached data
      const currentTime = Date.now();
      if (currentTime - lastFetchTime < CACHE_DURATION && dashboardData !== defaultData) {
        console.log('Using cached admin dashboard data');
        setIsLoading(false);
        return;
      }
      
      await fetchDashboardData();
    };

    fetchData();

    return () => {
      clearTimeout(loadingTimeoutId);
    };
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (loadingError) {
    return <AdminErrorState message={loadingError} onRetry={handleRefresh} />;
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-green-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email?.split('@')[0] || 'Admin'}. Here's what's happening today.
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={handleRefresh}
                className="gap-1.5"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center mt-2">
              <span className="flex items-center gap-1.5 text-sm">
                {getHealthIcon(dashboardData.systemHealth)}
                <span className={`font-medium ${getHealthColor(dashboardData.systemHealth)}`}>
                  System {dashboardData.systemHealth.charAt(0).toUpperCase() + dashboardData.systemHealth.slice(1)}
                </span>
              </span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {dashboardData.uptimePercentage}% Uptime
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.totalUsers)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className={`flex items-center ${dashboardData.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.userGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(dashboardData.userGrowth)}%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.activeWallets)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((dashboardData.activeWallets / dashboardData.totalUsers) * 100)}% of users
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
            <Activity className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.transactionVolume)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className={`flex items-center ${dashboardData.transactionGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.transactionGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(dashboardData.transactionGrowth)}%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.securityEvents)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Network Stats */}
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader>
              <CardTitle>Network Performance</CardTitle>
              <CardDescription>
                Real-time performance metrics for the OFS Ledger network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NetworkStats 
                stats={dashboardData.blockchainNetworks.map((network, index) => ({
                  id: index.toString(),
                  network_id: network.id || index.toString(),
                  timestamp: new Date().toISOString(),
                  block_height: network.block_height || 0,
                  gas_price: network.gas_price || 0,
                  transaction_count: dashboardData.totalTransactions / (dashboardData.blockchainNetworks.length || 1),
                  avg_block_time: 13.5
                }))}
                networkName="OFS Network"
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Recent Users and Security Logs */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Users */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>
                    New users who joined recently
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Add User</span>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {dashboardData.recentUsers.length > 0 ? (
                      dashboardData.recentUsers.map((user, index) => (
                        <div
                          key={user.id || index}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                              {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{user.full_name || user.email?.split('@')[0]}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Joined {formatDate(user.created_at)}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {user.role || 'user'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Users className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No recent users found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Security Logs */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Security Logs</CardTitle>
                  <CardDescription>
                    Recent security events and alerts
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Search className="h-3.5 w-3.5" />
                  <span>Search</span>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {dashboardData.securityLogs.length > 0 ? (
                      dashboardData.securityLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                              log.event_type.includes('warning') || log.event_type.includes('failed')
                                ? 'bg-amber-100 text-amber-600'
                                : log.event_type.includes('error') || log.event_type.includes('violation')
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              <Shield className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{log.event_type}</p>
                              <p className="text-xs text-muted-foreground">{log.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {formatDate(log.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Shield className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No security logs found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-4">
          {/* Network Status */}
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader>
              <CardTitle>Network Status</CardTitle>
              <CardDescription>
                Current status of blockchain networks, tokens, and smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NetworkStatus 
                networks={dashboardData.blockchainNetworks} 
                tokens={dashboardData.tokens}
                smartContracts={dashboardData.smartContracts}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Token Prices and Smart Contracts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Token Prices */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader>
                <CardTitle>Token Prices</CardTitle>
                <CardDescription>
                  Real-time cryptocurrency prices with market data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TokenPrices 
                  tokens={dashboardData.tokens}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            {/* Smart Contract Monitor */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader>
                <CardTitle>Smart Contract Monitor</CardTitle>
                <CardDescription>
                  Performance and usage of deployed smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SmartContractMonitor 
                  contracts={dashboardData.smartContracts}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>
                System security status and recent events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-medium">System Security</h3>
                        <div className={`mt-2 font-semibold ${getHealthColor(dashboardData.systemHealth)}`}>
                          {dashboardData.systemHealth.toUpperCase()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last checked: {new Date(lastFetchTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                          <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-medium">Security Events</h3>
                        <div className="mt-2 font-semibold">
                          {formatNumber(dashboardData.securityEvents)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last 24 hours
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                          <Clock className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-medium">System Uptime</h3>
                        <div className="mt-2 font-semibold">
                          {dashboardData.uptimePercentage}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last 30 days
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Security Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {dashboardData.securityLogs.length > 0 ? (
                          dashboardData.securityLogs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-center justify-between p-3 rounded-lg border border-border"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                  log.event_type.includes('warning') || log.event_type.includes('failed')
                                    ? 'bg-amber-100 text-amber-600'
                                    : log.event_type.includes('error') || log.event_type.includes('violation')
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-blue-100 text-blue-600'
                                }`}>
                                  <Shield className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{log.event_type}</p>
                                  <p className="text-xs text-muted-foreground">{log.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(log.created_at)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {log.ip_address}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Shield className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No security logs found</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
