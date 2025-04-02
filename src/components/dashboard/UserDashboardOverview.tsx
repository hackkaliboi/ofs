import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  ArrowUpDown, 
  Shield, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
  Activity,
  DollarSign,
  Landmark,
  Lock
} from "lucide-react";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Simple trend indicator component
const TrendIndicator: React.FC<{ value: number, suffix?: string }> = ({ value, suffix = '%' }) => {
  if (value > 0) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <TrendingUp className="h-3 w-3 mr-1" />
        +{value.toFixed(1)}{suffix}
      </Badge>
    );
  } else if (value < 0) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <TrendingDown className="h-3 w-3 mr-1" />
        {value.toFixed(1)}{suffix}
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        0{suffix}
      </Badge>
    );
  }
};

// Stat card component for consistent styling
const StatCard: React.FC<{
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  trend?: number;
  trendSuffix?: string;
  color?: string;
  onClick?: () => void;
}> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendSuffix = '%',
  color = 'primary',
  onClick
}) => {
  return (
    <Card 
      className={onClick ? 'cursor-pointer transition-all hover:shadow-md' : ''}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`text-${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend !== undefined && <TrendIndicator value={trend} suffix={trendSuffix} />}
        </div>
      </CardContent>
    </Card>
  );
};

// Custom Progress component that accepts indicator color
const ColoredProgress: React.FC<{
  value: number;
  className?: string;
  indicatorColor?: string;
}> = ({ value, className, indicatorColor = 'bg-primary' }) => {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className || ''}`}>
      <div 
        className={`h-full w-full flex-1 transition-all ${indicatorColor}`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
};

const UserDashboardOverview: React.FC = () => {
  const { dashboardData, loading, error, usingFallbackData, refresh } = useUserDashboard();
  const { user, profile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    refresh();
    // Add a minimum refresh time to prevent UI flashing
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get the appropriate color for the security score
  const getSecurityScoreColor = () => {
    if (dashboardData.securityScore >= 80) return 'bg-green-500';
    if (dashboardData.securityScore >= 60) return 'bg-blue-500';
    if (dashboardData.securityScore >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading your dashboard...</h2>
        <p className="text-muted-foreground">Please wait while we fetch your latest data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "User"}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your assets and activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <p className="text-xs text-muted-foreground">
            Last updated: {formatDate(dashboardData.lastUpdated)}
          </p>
        </div>
      </div>

      {usingFallbackData && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Using Sample Data</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Unable to load your real data. Displaying sample data instead.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Score Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Security Score</CardTitle>
              <CardDescription>Your account security status</CardDescription>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              <span className="text-lg font-bold">{dashboardData.securityScore}/100</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Security Level</span>
                <span className="text-sm font-medium">
                  {dashboardData.securityScore >= 80 ? 'Excellent' : 
                   dashboardData.securityScore >= 60 ? 'Good' : 
                   dashboardData.securityScore >= 40 ? 'Fair' : 'Poor'}
                </span>
              </div>
              <ColoredProgress 
                value={dashboardData.securityScore} 
                indicatorColor={getSecurityScoreColor()}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-full ${dashboardData.validatedWallets > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {dashboardData.validatedWallets > 0 ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                </div>
                <span className="text-sm">Validated Wallets</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-full bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span className="text-sm">2FA Enabled</span>
              </div>
            </div>
            
            {dashboardData.securityScore < 100 && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/dashboard/settings">
                  <Shield className="h-4 w-4 mr-2" />
                  Improve Security
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Wallets"
          value={dashboardData.totalWallets.toString()}
          description={`${dashboardData.validatedWallets} validated`}
          icon={<Wallet className="h-4 w-4" />}
          onClick={() => window.location.href = '/dashboard/wallets'}
        />
        
        <StatCard
          title="Total Assets"
          value={formatCurrency(dashboardData.totalValue)}
          description={`${dashboardData.totalAssets} different assets`}
          icon={<DollarSign className="h-4 w-4" />}
          trend={dashboardData.assetGrowth}
          onClick={() => window.location.href = '/dashboard/assets'}
        />
        
        <StatCard
          title="Transactions"
          value={dashboardData.totalTransactions.toString()}
          description={`${dashboardData.recentTransactions} in last 7 days`}
          icon={<ArrowUpDown className="h-4 w-4" />}
          onClick={() => window.location.href = '/dashboard/transactions'}
        />
        
        <StatCard
          title="Pending"
          value={dashboardData.pendingTransactions.toString()}
          description="Pending transactions"
          icon={<Clock className="h-4 w-4" />}
          color={dashboardData.pendingTransactions > 0 ? 'yellow-500' : 'primary'}
          onClick={() => window.location.href = '/dashboard/transactions?filter=pending'}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col h-auto py-4" asChild>
              <Link to="/dashboard/connect-wallet">
                <Wallet className="h-5 w-5 mb-2" />
                <span>Connect Wallet</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="flex flex-col h-auto py-4" asChild>
              <Link to="/dashboard/transactions/new">
                <ArrowUpDown className="h-5 w-5 mb-2" />
                <span>New Transaction</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="flex flex-col h-auto py-4" asChild>
              <Link to="/dashboard/assets">
                <BarChart3 className="h-5 w-5 mb-2" />
                <span>View Assets</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="flex flex-col h-auto py-4" asChild>
              <Link to="/dashboard/settings">
                <Lock className="h-5 w-5 mb-2" />
                <span>Security Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Validation Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-xs text-muted-foreground">{formatDate(dashboardData.lastLogin)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard/history">View All</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Landmark className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Activity Count</p>
                    <p className="text-xs text-muted-foreground">{dashboardData.activityCount} recorded activities</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Validation Status</CardTitle>
            <CardDescription>Status of your wallet validations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CheckCircle className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Validated Wallets</p>
                    <p className="text-xs text-muted-foreground">{dashboardData.validatedWallets} of {dashboardData.totalWallets} wallets</p>
                  </div>
                </div>
              </div>
              
              {dashboardData.pendingValidations > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-full mr-3">
                      <Clock className="h-4 w-4 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pending Validations</p>
                      <p className="text-xs text-muted-foreground">{dashboardData.pendingValidations} wallets awaiting validation</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard/wallets?filter=pending">View</Link>
                  </Button>
                </div>
              )}
              
              {dashboardData.pendingValidations === 0 && dashboardData.totalWallets > 0 && (
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CheckCircle className="h-4 w-4 text-green-700" />
                  </div>
                  <p className="text-sm">All wallets are validated</p>
                </div>
              )}
              
              {dashboardData.totalWallets === 0 && (
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Wallet className="h-4 w-4 text-blue-700" />
                  </div>
                  <p className="text-sm">No wallets connected yet</p>
                </div>
              )}
              
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/dashboard/connect-wallet">
                  <Wallet className="h-4 w-4 mr-2" />
                  {dashboardData.totalWallets === 0 ? 'Connect Your First Wallet' : 'Connect Another Wallet'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboardOverview;
