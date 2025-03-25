import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardLoadingState } from "@/components/dashboard/loading-state";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

// Mock data for the dashboard
const mockData = {
  balance: {
    total: 24680.35,
    change: 2.5,
    positive: true,
  },
  chart: [
    { time: "00:00", value: 23500 },
    { time: "04:00", value: 23400 },
    { time: "08:00", value: 23800 },
    { time: "12:00", value: 24100 },
    { time: "16:00", value: 24500 },
    { time: "20:00", value: 24680 },
    { time: "24:00", value: 24680 },
  ],
  assets: [
    {
      name: "Bitcoin",
      symbol: "BTC",
      amount: 0.45,
      value: 18750.25,
      change: 3.2,
      positive: true,
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      amount: 2.35,
      value: 4350.75,
      change: -1.5,
      positive: false,
    },
    {
      name: "Solana",
      symbol: "SOL",
      amount: 28.5,
      value: 1580.35,
      change: 5.8,
      positive: true,
    },
  ],
  recentTransactions: [
    {
      id: "tx1",
      type: "buy",
      asset: "BTC",
      amount: 0.05,
      value: 2050.25,
      time: "Today, 10:45 AM",
    },
    {
      id: "tx2",
      type: "sell",
      asset: "ETH",
      amount: 0.5,
      value: 950.50,
      time: "Yesterday, 2:30 PM",
    },
    {
      id: "tx3",
      type: "buy",
      asset: "SOL",
      amount: 10,
      value: 550.75,
      time: "Mar 24, 9:15 AM",
    },
    {
      id: "tx4",
      type: "sell",
      asset: "BTC",
      amount: 0.02,
      value: 820.10,
      time: "Mar 23, 11:30 AM",
    },
    {
      id: "tx5",
      type: "buy",
      asset: "ETH",
      amount: 1.2,
      value: 2250.30,
      time: "Mar 22, 4:45 PM",
    },
  ],
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate('/sign-in');
      return;
    }

    // Simulate loading data with timeout and error handling
    const timer = setTimeout(() => {
      try {
        // Simulate data fetching
        setIsLoading(false);
      } catch (error) {
        setLoadingError("Failed to load dashboard data. Please try again.");
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Handle loading error
  if (loadingError) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-destructive text-xl mb-4">{loadingError}</div>
        <Button 
          onClick={() => {
            setIsLoading(true);
            setLoadingError(null);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        >
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
              <div className="text-2xl font-bold">${mockData.balance.total.toLocaleString()}</div>
              <div className={`flex items-center ${mockData.balance.positive ? 'text-green-500' : 'text-red-500'}`}>
                {mockData.balance.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span className="text-sm ml-1">{mockData.balance.change}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <p className="text-xs text-muted-foreground">+12.3% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Across 3 chains</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Txns</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Processing now</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Chart and Assets */}
        <div className="col-span-4 space-y-6">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>24-hour value change</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Assets</CardTitle>
                <CardDescription>Manage your portfolio</CardDescription>
              </div>
              <Button variant="outline" size="icon" className="hover:bg-muted">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.assets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        {asset.symbol.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{asset.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {asset.amount} {asset.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${asset.value.toLocaleString()}</p>
                      <Badge variant={asset.positive ? "success" : "destructive"}>
                        {asset.positive ? "+" : "-"}
                        {Math.abs(asset.change)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side */}
        <div className="col-span-3 space-y-6">
          {/* Quick Actions */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="flex flex-col items-center justify-center h-24 space-y-2 hover:bg-primary/90">
                  <Send className="h-6 w-6" />
                  <span>Send</span>
                </Button>
                <Button className="flex flex-col items-center justify-center h-24 space-y-2 hover:bg-primary/90">
                  <Download className="h-6 w-6" />
                  <span>Receive</span>
                </Button>
                <Button className="flex flex-col items-center justify-center h-24 space-y-2" variant="outline">
                  <CreditCard className="h-6 w-6" />
                  <span>Buy</span>
                </Button>
                <Button className="flex flex-col items-center justify-center h-24 space-y-2" variant="outline">
                  <Activity className="h-6 w-6" />
                  <span>Trade</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {mockData.recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          tx.type === "buy" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}>
                          {tx.type === "buy" ? <Download className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{tx.type} {tx.asset}</p>
                          <p className="text-sm text-muted-foreground">{tx.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {tx.type === "buy" ? "+" : "-"}{tx.amount} {tx.asset}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${tx.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
