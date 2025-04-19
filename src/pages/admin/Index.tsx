import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Wallet, 
  ArrowDownToLine, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  UserPlus,
  AlertTriangle,
  BarChart3,
  Loader2,
  Settings,
  FileText,
  LayoutDashboard,
  CreditCard,
  RefreshCw,
  Coins,
  LogOut
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useWalletConnections } from "@/hooks/useWalletConnections";
import { useUserActivity } from "@/hooks/useUserActivity";
import { useUserStats } from "@/hooks/useUserStats";
import { useValidationStats } from "@/hooks/useValidationStats";
import { useWalletDetailStats } from "@/hooks/useWalletDetailStats";
import SecurityLogs from "@/components/admin/SecurityLogs";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
// CoinBalances component removed - now using inline dialog in Users.tsx
import { initializeDatabase } from "@/lib/databaseHelpers";

const AdminDashboard = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { walletConnections, stats: walletStats, loading: walletsLoading } = useWalletConnections(true);
  const { activities, loading: activitiesLoading } = useUserActivity(true, 20);
  const { stats: userStats, loading: userStatsLoading } = useUserStats();
  const { stats: validationStats, loading: validationStatsLoading } = useValidationStats();
  const { stats: walletDetailStats, loading: walletDetailStatsLoading, refetch: refetchWalletStats } = useWalletDetailStats();
  const [searchParams] = useSearchParams();
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  const loading = authLoading || walletsLoading || activitiesLoading || userStatsLoading || validationStatsLoading || walletDetailStatsLoading;

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

  // Placeholder for withdrawal stats until we implement that hook
  const withdrawalStats = {
    pending: 0,
    processed_today: 0,
    total_amount: "0 ETH"
  };

  // Compute pending actions based on real data
  const pendingActions = [
    {
      id: 1,
      type: "validation_review",
      details: `${walletDetailStats.pending} wallet submissions pending review`,
      action: "/admin/wallet-details",
      priority: walletDetailStats.pending > 30 ? "high" : walletDetailStats.pending > 10 ? "medium" : "low",
    },
    {
      id: 2,
      type: "withdrawal_approval",
      details: `${withdrawalStats.pending} withdrawal requests pending approval`,
      action: "/admin/withdrawals",
      priority: withdrawalStats.pending > 15 ? "high" : withdrawalStats.pending > 5 ? "medium" : "low",
    },
    {
      id: 3,
      type: "user_verification",
      details: `${userStats.total_users - userStats.users_with_validated_wallets} users pending wallet verification`,
      action: "/admin/users?filter=pending_verification",
      priority: (userStats.total_users - userStats.users_with_validated_wallets) > 20 ? "high" : "medium",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registered":
      case "user_updated":
      case "user_login":
        return <Users className="h-4 w-4" />;
      case "wallet_added":
      case "wallet_connected":
      case "wallet_created":
        return <Wallet className="h-4 w-4" />;
      case "validation_approved":
      case "validation_rejected":
      case "validation_submitted":
      case "kyc_submitted":
      case "kyc_approved":
        return <Shield className="h-4 w-4" />;
      case "withdrawal_processed":
      case "withdrawal_requested":
        return <ArrowDownToLine className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {priority}
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
      hour: "2-digit",
      minute: "2-digit",
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

  // Render the dashboard view
  const renderDashboardView = () => (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total_users}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.active_users} active, {userStats.new_users_today} new today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletDetailStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {walletDetailStats.approved} approved, {walletDetailStats.pending} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validation Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validationStats.validation_rate}%</div>
            <p className="text-xs text-muted-foreground">
              Avg. {validationStats.average_validation_time.toFixed(1)} hours to validate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingActions.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingActions.filter(a => a.priority === "high").length} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Activity Feed */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No recent activity</h3>
                <p className="text-sm text-muted-foreground">
                  Recent platform activity will appear here
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
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
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(activity.created_at)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {activity.user_email ? `User: ${activity.user_email}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingActions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  There are no pending actions requiring your attention
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {pendingActions.map((action) => (
                    <div key={action.id} className="flex flex-col space-y-3 rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {action.type.includes("validation") ? (
                            <Shield className="h-5 w-5 text-blue-500" />
                          ) : action.type.includes("withdrawal") ? (
                            <ArrowDownToLine className="h-5 w-5 text-green-500" />
                          ) : action.type.includes("user") ? (
                            <Users className="h-5 w-5 text-purple-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                          <h4 className="font-medium">{action.type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h4>
                        </div>
                        {getPriorityBadge(action.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">{action.details}</p>
                      <Button asChild variant="outline" size="sm">
                        <Link to={action.action}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Logs */}
      <SecurityLogs />

      {/* Wallet Submissions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Wallet Submissions</CardTitle>
          <CardDescription>
            Recent wallet details submitted by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                  <h3 className="text-2xl font-bold mt-1">{walletDetailStats.total}</h3>
                </div>
                <Wallet className="h-8 w-8 text-primary opacity-80" />
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending Review</p>
                  <h3 className="text-2xl font-bold mt-1 text-yellow-700">{walletDetailStats.pending}</h3>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-green-600">Approved</p>
                  <h3 className="text-2xl font-bold mt-1 text-green-700">{walletDetailStats.approved}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/wallet-details">
                <CreditCard className="mr-2 h-4 w-4" />
                View All
              </Link>
            </Button>
          </div>
          
          {walletDetailStats.total === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No Wallet Submissions</h3>
              <p className="text-sm text-muted-foreground">
                No wallet details have been submitted yet
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Wallet Details Available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {walletDetailStats.pending} submissions pending review
                </p>
                <Button asChild>
                  <Link to="/admin/wallet-details">
                    Review Wallet Submissions
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-6">
      {loading && !loadingTimeout ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-medium">Loading admin dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the latest data</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "Admin"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => {
                  toast({
                    title: "Refreshing dashboard data",
                    description: "Please wait while we fetch the latest data",
                  });
                  refetchWalletStats();
                }}
                variant="outline"
                disabled={walletDetailStatsLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${walletDetailStatsLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button asChild>
                <Link to="/admin/users/new">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/reports">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reports
                </Link>
              </Button>
              <Button 
                variant="destructive" 
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Dashboard View Selector */}
          <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
            {renderDashboardView()}
          </TabsContent>
            
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
            
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generate and view system reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-1">Reports Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    This feature is under development and will be available soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            
          {/* Coin Balances tab removed - now using inline dialog */}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
