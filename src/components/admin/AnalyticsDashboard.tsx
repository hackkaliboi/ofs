import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Wallet, 
  ArrowDownToLine, 
  Shield, 
  Clock, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Zap
} from "lucide-react";
import { useRealAdminAnalytics } from "@/hooks/useRealAdminAnalytics";

// Simple trend indicator component
const TrendIndicator: React.FC<{ value: number, suffix?: string }> = ({ value, suffix = '%' }) => {
  if (value > 0) {
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <TrendingUp className="h-3 w-3 mr-1" />
        +{value.toFixed(1)}{suffix}
      </Badge>
    );
  } else if (value < 0) {
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <TrendingDown className="h-3 w-3 mr-1" />
        {value.toFixed(1)}{suffix}
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-gray-900 text-yellow-400 border-yellow-400/30">
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
}> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendSuffix = '%',
  color = 'primary'
}) => {
  return (
    <Card>
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

const AnalyticsDashboard: React.FC = () => {
  const { analytics, loading, error, usingFallbackData, refresh } = useRealAdminAnalytics();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time platform metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(refreshing || loading) ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <p className="text-xs text-muted-foreground">
            Last updated: {formatDate(analytics.lastUpdated)}
          </p>
        </div>
      </div>

      {usingFallbackData && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Limited Data Available</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Some analytics data may be estimated or limited as your platform grows.
            Analytics will become more accurate as users interact with the platform.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={analytics.totalUsers}
              description={`${analytics.activeUsers} active users`}
              icon={<Users className="h-4 w-4" />}
              trend={analytics.userGrowthRate}
            />
            
            <StatCard
              title="Total Wallets"
              value={analytics.totalWallets}
              description={`${analytics.validatedWallets} validated wallets`}
              icon={<Wallet className="h-4 w-4" />}
              trend={analytics.validationRate - 100}
            />
            
            <StatCard
              title="Recent Activity"
              value={analytics.activitiesLast24Hours}
              description={`${analytics.activitiesLast7Days} in last 7 days`}
              icon={<Activity className="h-4 w-4" />}
            />
            
            <StatCard
              title="Security Events"
              value={analytics.securityEvents}
              description={`${analytics.criticalEvents} critical events`}
              icon={<Shield className="h-4 w-4" />}
              color={analytics.criticalEvents > 0 ? 'red-500' : 'primary'}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder for charts - in a real implementation, these would be actual charts */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                  <p className="text-muted-foreground">User growth chart would appear here</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Growth rate: +{analytics.userGrowthRate.toFixed(1)}% in the last 30 days
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet Distribution</CardTitle>
                <CardDescription>By validation status</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm">Validated ({analytics.validatedWallets})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm">Pending ({analytics.pendingValidations})</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>System response times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Validation Time</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{analytics.averageValidationTime.toFixed(1)} hours</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (analytics.averageValidationTime / 24) * 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm">Avg. Response Time</span>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{analytics.averageResponseTime.toFixed(1)} hours</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (analytics.averageResponseTime / 12) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawals</CardTitle>
                <CardDescription>Withdrawal requests and processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Withdrawals</span>
                    <span className="font-medium">{analytics.totalWithdrawals}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending</span>
                    <Badge variant={analytics.pendingWithdrawals > 10 ? "destructive" : "outline"}>
                      {analytics.pendingWithdrawals}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processed</span>
                    <span className="font-medium">{analytics.processedWithdrawals}</span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-1">Processing Rate</div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ 
                          width: `${analytics.totalWithdrawals === 0 ? 0 : 
                            (analytics.processedWithdrawals / analytics.totalWithdrawals) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">0%</span>
                      <span className="text-xs text-muted-foreground">
                        {analytics.totalWithdrawals === 0 ? 0 : 
                          ((analytics.processedWithdrawals / analytics.totalWithdrawals) * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">100%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={analytics.totalUsers}
              description="All registered users"
              icon={<Users className="h-4 w-4" />}
              trend={analytics.userGrowthRate}
            />
            
            <StatCard
              title="Active Users"
              value={analytics.activeUsers}
              description="Users active in last 30 days"
              icon={<Users className="h-4 w-4" />}
              trend={analytics.activeUsers / analytics.totalUsers * 100 - 100}
            />
            
            <StatCard
              title="New Users Today"
              value={analytics.newUsersToday}
              description="Registered in last 24 hours"
              icon={<Users className="h-4 w-4" />}
            />
            
            <StatCard
              title="Growth Rate"
              value={`${analytics.userGrowthRate.toFixed(1)}%`}
              description="Last 30 days"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>

          {/* Placeholder for detailed user analytics */}
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>User distribution by region and activity</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                <p className="text-muted-foreground">User demographics chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Wallets"
              value={analytics.totalWallets}
              description="All connected wallets"
              icon={<Wallet className="h-4 w-4" />}
            />
            
            <StatCard
              title="Validated Wallets"
              value={analytics.validatedWallets}
              description="Successfully validated"
              icon={<Wallet className="h-4 w-4" />}
            />
            
            <StatCard
              title="Pending Validations"
              value={analytics.pendingValidations}
              description="Awaiting validation"
              icon={<Clock className="h-4 w-4" />}
              color={analytics.pendingValidations > 30 ? 'yellow-500' : 'primary'}
            />
            
            <StatCard
              title="Validation Rate"
              value={`${analytics.validationRate.toFixed(1)}%`}
              description={`Avg. ${analytics.averageValidationTime.toFixed(1)} hours to validate`}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>

          {/* Placeholder for wallet analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Distribution</CardTitle>
              <CardDescription>By type and validation status</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                <p className="text-muted-foreground">Wallet distribution chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Activities"
              value={analytics.totalActivities}
              description="All recorded activities"
              icon={<Activity className="h-4 w-4" />}
            />
            
            <StatCard
              title="Last 24 Hours"
              value={analytics.activitiesLast24Hours}
              description="Recent activities"
              icon={<Activity className="h-4 w-4" />}
            />
            
            <StatCard
              title="Last 7 Days"
              value={analytics.activitiesLast7Days}
              description="Weekly activity"
              icon={<Activity className="h-4 w-4" />}
            />
            
            <StatCard
              title="Response Time"
              value={`${analytics.averageResponseTime.toFixed(1)} hrs`}
              description="Average response time"
              icon={<Clock className="h-4 w-4" />}
            />
          </div>

          {/* Placeholder for activity analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Activity distribution over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                <p className="text-muted-foreground">Activity timeline chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Events"
              value={analytics.securityEvents}
              description="All security events"
              icon={<Shield className="h-4 w-4" />}
            />
            
            <StatCard
              title="Critical Events"
              value={analytics.criticalEvents}
              description="Highest severity"
              icon={<AlertTriangle className="h-4 w-4" />}
              color={analytics.criticalEvents > 0 ? 'red-500' : 'primary'}
            />
            
            <StatCard
              title="High Severity"
              value={analytics.highSeverityEvents}
              description="High severity events"
              icon={<AlertTriangle className="h-4 w-4" />}
              color={analytics.highSeverityEvents > 5 ? 'orange-500' : 'primary'}
            />
            
            <StatCard
              title="Security Rate"
              value={analytics.securityEvents === 0 ? '100%' : 
                `${(100 - (analytics.criticalEvents + analytics.highSeverityEvents) / 
                analytics.securityEvents * 100).toFixed(1)}%`}
              description="Platform security score"
              icon={<Shield className="h-4 w-4" />}
            />
          </div>

          {/* Placeholder for security analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Security Event Distribution</CardTitle>
              <CardDescription>By type and severity</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                <p className="text-muted-foreground">Security event distribution chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
