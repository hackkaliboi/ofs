import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardLoadingState } from "@/components/dashboard/loading-state";
import { useNavigate } from "react-router-dom";
import { getWallets, getTransactions } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet,
  Send,
  Download,
  CreditCard,
  History,
  BarChart3,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";

// Types for dashboard data
interface Asset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  change: number;
  positive: boolean;
}

interface Transaction {
  id: string;
  type: string;
  asset: string;
  amount: number;
  value: number;
  time: string;
  status?: string;
}

interface DashboardData {
  balance: {
    total: number;
    change: number;
    positive: boolean;
  };
  chart: Array<{ time: string; value: number }>;
  assets: Asset[];
  recentTransactions: Transaction[];
}

// Default data for fallback
const defaultData: DashboardData = {
  balance: {
    total: 0,
    change: 0,
    positive: true,
  },
  chart: [
    { time: "00:00", value: 0 },
    { time: "04:00", value: 0 },
    { time: "08:00", value: 0 },
    { time: "12:00", value: 0 },
    { time: "16:00", value: 0 },
    { time: "20:00", value: 0 },
    { time: "24:00", value: 0 },
  ],
  assets: [],
  recentTransactions: [],
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>(defaultData);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate('/sign-in');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch wallets
        const { data: walletsData, error: walletsError } = await getWallets(user.id);
        
        if (walletsError) {
          console.error("Error fetching wallets:", walletsError);
          throw new Error("Failed to load wallet data");
        }
        
        setWallets(walletsData || []);
        
        // Calculate total balance
        const totalBalance = walletsData?.reduce((sum: number, wallet: any) => sum + (wallet.balance || 0), 0) || 0;
        
        // Fetch transactions if wallets exist
        let transactionsData: any[] = [];
        if (walletsData && walletsData.length > 0) {
          const walletIds = walletsData.map((wallet: any) => wallet.id);
          
          // For simplicity, we'll just fetch transactions for the first wallet
          const { data: txData, error: txError } = await getTransactions(walletIds[0]);
          
          if (txError) {
            console.error("Error fetching transactions:", txError);
          } else {
            transactionsData = txData || [];
            setTransactions(transactionsData);
          }
        }
        
        // Transform data for the dashboard
        const formattedTransactions = transactionsData.map((tx: any) => ({
          id: tx.id,
          type: tx.type || 'transfer',
          asset: tx.asset_symbol || 'UNKNOWN',
          amount: tx.amount || 0,
          value: tx.value || 0,
          time: new Date(tx.created_at).toLocaleString(),
          status: tx.status || 'completed',
        }));
        
        // Generate chart data (simplified for now)
        const chartData = generateChartData(totalBalance);
        
        // Format assets data
        const assetsData = walletsData?.map((wallet: any) => ({
          id: wallet.id,
          name: wallet.name || 'Wallet',
          symbol: wallet.currency || 'USD',
          amount: wallet.balance || 0,
          value: wallet.balance || 0,
          change: wallet.change || 0,
          positive: (wallet.change || 0) >= 0,
        })) || [];
        
        // Set dashboard data
        setDashboardData({
          balance: {
            total: totalBalance,
            change: calculateTotalChange(assetsData),
            positive: calculateTotalChange(assetsData) >= 0,
          },
          chart: chartData,
          assets: assetsData,
          recentTransactions: formattedTransactions.slice(0, 5),
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setLoadingError("Failed to load dashboard data. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, navigate]);

  // Generate sample chart data based on balance
  const generateChartData = (balance: number) => {
    const baseValue = balance * 0.95;
    return [
      { time: "00:00", value: baseValue + Math.random() * balance * 0.05 },
      { time: "04:00", value: baseValue + Math.random() * balance * 0.05 },
      { time: "08:00", value: baseValue + Math.random() * balance * 0.06 },
      { time: "12:00", value: baseValue + Math.random() * balance * 0.07 },
      { time: "16:00", value: baseValue + Math.random() * balance * 0.08 },
      { time: "20:00", value: baseValue + Math.random() * balance * 0.09 },
      { time: "24:00", value: balance },
    ];
  };

  // Calculate total change percentage
  const calculateTotalChange = (assets: Asset[]) => {
    if (assets.length === 0) return 0;
    const totalChange = assets.reduce((sum, asset) => sum + asset.change, 0);
    return parseFloat((totalChange / assets.length).toFixed(2));
  };

  // Handle loading error
  if (loadingError) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <div className="text-destructive text-xl mb-4">{loadingError}</div>
        <Button 
          onClick={() => {
            setIsLoading(true);
            setLoadingError(null);
            // Retry fetching data
            setTimeout(() => {
              if (user) {
                getWallets(user.id)
                  .then(({ data }) => {
                    setWallets(data || []);
                    setIsLoading(false);
                  })
                  .catch(() => {
                    setLoadingError("Failed to load wallet data. Please try again.");
                    setIsLoading(false);
                  });
              }
            }, 1000);
          }}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <DashboardLoadingState />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your portfolio and recent activity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">${dashboardData.balance.total.toLocaleString()}</div>
              <div className={`flex items-center ${dashboardData.balance.positive ? 'text-green-500' : 'text-red-500'}`}>
                {dashboardData.balance.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span className="text-sm ml-1">{dashboardData.balance.change}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallets.length}</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${dashboardData.balance.positive ? 'text-green-500' : 'text-red-500'}`}>
              {dashboardData.balance.positive ? '+' : ''}{dashboardData.balance.change}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Portfolio Value</CardTitle>
          <CardDescription>24-hour performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Assets and Transactions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Assets */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Your Assets</CardTitle>
            <CardDescription>Current holdings</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.assets.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {dashboardData.assets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">{asset.amount} {asset.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${asset.value.toLocaleString()}</div>
                        <div className={`text-sm ${asset.positive ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.positive ? '+' : ''}{asset.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No assets found</h3>
                <p className="text-sm text-muted-foreground mb-4">You don't have any assets in your portfolio yet.</p>
                <Button>Add Asset</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentTransactions.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {dashboardData.recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${tx.type === 'buy' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {tx.type === 'buy' ? (
                            <Download className={`h-5 w-5 ${tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}`} />
                          ) : (
                            <Send className={`h-5 w-5 ${tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}`} />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.asset}
                          </div>
                          <div className="text-sm text-muted-foreground">{tx.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${tx.value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{tx.amount} {tx.asset}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <History className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Your recent transactions will appear here.</p>
                <Button>Make Transaction</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button className="flex flex-col items-center justify-center h-24 space-y-2">
          <Send className="h-6 w-6" />
          <span>Send</span>
        </Button>
        <Button className="flex flex-col items-center justify-center h-24 space-y-2">
          <Download className="h-6 w-6" />
          <span>Receive</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
          <CreditCard className="h-6 w-6" />
          <span>Wallets</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
          <History className="h-6 w-6" />
          <span>History</span>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
