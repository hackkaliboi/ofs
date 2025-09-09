import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wallet, ArrowDownToLine, Shield, Clock, CheckCircle, XCircle, Loader2, Coins } from "lucide-react";
import { useWalletConnections } from "@/hooks/useWalletConnections";
import { useUserActivity } from "@/hooks/useUserActivity";
import { initializeDatabase } from "@/lib/databaseHelpers";
import TradingViewWidget from "@/components/dashboard/TradingViewWidget";
import CoinBalancesWidget from "@/components/dashboard/CoinBalancesWidget";
import ConnectWallet from "@/components/ConnectWallet";

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { walletConnections, loading: walletsLoading, stats: walletStats } = useWalletConnections();
  const { activities, loading: activitiesLoading } = useUserActivity();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Placeholder for withdrawal stats until we implement that hook
  const withdrawalStats = {
    total: 0,
    completed: 0,
    pending: 0,
  };
  
  const loading = authLoading || walletsLoading || activitiesLoading;

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    if (loading && user) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
        // Try to initialize the database if we hit the timeout
        if (user) {
          initializeDatabase(user.id).catch(err => {
            console.error("Failed to initialize database:", err);
          });
        }
      }, 5000); // 5 seconds timeout
      
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "wallet_added":
      case "wallet_connected":
        return <Wallet className="h-4 w-4" />;
      case "validation_submitted":
      case "validation_approved":
      case "kyc_submitted":
      case "kyc_approved":
        return <Shield className="h-4 w-4" />;
      case "withdrawal_requested":
      case "withdrawal_processed":
        return <ArrowDownToLine className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "validated":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
      case "failed":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
    
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      {loading && !loadingTimeout ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-medium">Loading your dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your data</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "User"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <ConnectWallet 
                variant="default" 
                size="default" 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              />
              <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10 hover:border-primary/40">
                <a href="/dashboard/withdrawals/new">
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Request Withdrawal
                </a>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
                <CardTitle className="text-xs sm:text-sm font-semibold text-primary">Total Wallets</CardTitle>
                <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-1.5 md:p-2.5">
                  <Wallet className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl font-bold text-foreground">{walletStats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {walletStats.validated} validated, {walletStats.pending} pending
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
                <CardTitle className="text-xs sm:text-sm font-semibold">Validated Wallets</CardTitle>
                <div className="rounded-full bg-primary/10 p-1.5 md:p-2.5">
                  <Shield className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl font-bold">{walletStats.validated}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {walletStats.validated}% of total wallets
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
                <CardTitle className="text-xs sm:text-sm font-semibold">Total Withdrawals</CardTitle>
                <div className="rounded-full bg-primary/10 p-1.5 md:p-2.5">
                  <ArrowDownToLine className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl font-bold">{withdrawalStats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {withdrawalStats.completed} completed, {withdrawalStats.pending} pending
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
                <CardTitle className="text-xs sm:text-sm font-semibold">KYC Status</CardTitle>
                <div className="rounded-full bg-primary/10 p-1.5 md:p-2.5">
                  <Shield className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg md:text-2xl font-bold">
                  {walletStats.kyc_approved ? "Approved" : walletStats.kyc_submitted ? "Submitted" : "Not Submitted"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {walletStats.kyc_approved 
                    ? "Your KYC is approved" 
                    : walletStats.kyc_submitted 
                      ? "KYC is under review" 
                      : "Submit your KYC documents"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Portfolio section removed */}

          {/* Coin Balances */}
          <div className="mb-4 md:mb-6">
            <CoinBalancesWidget />
          </div>
            
          {/* Market data section */}
          <div className="mb-6 md:mb-8">
            <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-base md:text-lg font-semibold">Market Overview</CardTitle>
                <CardDescription className="text-sm">Real-time cryptocurrency market data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] rounded-lg overflow-hidden">
                  <TradingViewWidget />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-7">
            {/* Connected Wallets */}
            <Card className="lg:col-span-3 border-primary/20 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-base md:text-lg font-semibold">Connected Wallets</CardTitle>
                <CardDescription className="text-sm">Your recently connected wallets</CardDescription>
              </CardHeader>
              <CardContent>
                {walletConnections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <Wallet className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No wallets connected</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your first wallet to get started
                    </p>
                    <ConnectWallet 
                      variant="default" 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                    />
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {walletConnections.slice(0, 5).map((wallet) => (
                        <div key={wallet.id} className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {wallet.wallet_address.substring(0, 6)}...
                              {wallet.wallet_address.substring(wallet.wallet_address.length - 4)}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>{wallet.chain_type || 'Ethereum'}</span>
                              <span className="mx-1">•</span>
                              <span>{formatDate(wallet.connected_at)}</span>
                            </div>
                          </div>
                          {getStatusBadge(
                            wallet.validated || wallet.validation_status === 'validated'
                              ? 'validated'
                              : wallet.validation_status || 'pending'
                          )}
                        </div>
                      ))}
                      {walletConnections.length > 5 && (
                        <Button variant="link" className="w-full" asChild>
                          <a href="/dashboard/wallets">View all wallets</a>
                        </Button>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="lg:col-span-4">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-base md:text-lg font-semibold">Recent Activity</CardTitle>
                <CardDescription className="text-sm">Your recent account activity</CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-1">No recent activity</h3>
                    <p className="text-sm text-muted-foreground">
                      Your recent account activity will appear here
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4">
                          <div className="mt-0.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {getActivityIcon(activity.activity_type)}
                            </div>
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{activity.description}</p>
                              {activity.metadata?.status && getStatusBadge(activity.metadata.status)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
