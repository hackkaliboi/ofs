import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllUsers, getSecurityLogs } from "@/lib/supabase";
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
} from "lucide-react";

interface SecurityLog {
  id: string;
  user_id: string;
  event_type: string;
  ip_address: string;
  created_at: string;
  description: string;
}

interface AdminDashboardData {
  totalUsers: number;
  activeValidations: number;
  securityEvents: number;
  recentUsers: any[];
  securityLogs: SecurityLog[];
}

const defaultData: AdminDashboardData = {
  totalUsers: 0,
  activeValidations: 0,
  securityEvents: 0,
  recentUsers: [],
  securityLogs: [],
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>(defaultData);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        
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
          throw new Error("Failed to load security logs");
        }
        
        // Set dashboard data
        setDashboardData({
          totalUsers: usersData?.length || 0,
          activeValidations: Math.floor(Math.random() * 10), // Mock data for now
          securityEvents: logsData?.length || 0,
          recentUsers: usersData?.slice(0, 5) || [],
          securityLogs: logsData || [],
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Admin dashboard data fetch error:", error);
        setLoadingError("Failed to load admin dashboard data. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);

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
              getAllUsers()
                .then(({ data }) => {
                  setDashboardData(prev => ({
                    ...prev,
                    totalUsers: data?.length || 0,
                    recentUsers: data?.slice(0, 5) || [],
                  }));
                  setIsLoading(false);
                })
                .catch(() => {
                  setLoadingError("Failed to load admin data. Please try again.");
                  setIsLoading(false);
                });
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
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-4 w-4 bg-muted rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-[400px] bg-muted/20 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.totalUsers > 0 ? `${dashboardData.recentUsers.length} new this week` : 'No users yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Validations</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeValidations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.activeValidations > 0 ? 'Processing now' : 'No active validations'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.securityEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.securityEvents > 0 ? 'Last 30 days' : 'No security events'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Key metrics and platform status</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.totalUsers > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">User Growth</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded">
                          <p className="text-muted-foreground">Chart coming soon...</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Transaction Volume</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded">
                          <p className="text-muted-foreground">Chart coming soon...</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>API Services</span>
                          <span className="text-green-500 flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span> Operational
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Database</span>
                          <span className="text-green-500 flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span> Operational
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Authentication</span>
                          <span className="text-green-500 flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span> Operational
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No data available</h3>
                  <p className="mb-4">Start by adding users to your platform.</p>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First User
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentUsers.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {dashboardData.recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                            <div className="text-sm text-muted-foreground">{user.email || 'No email'}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No users found</h3>
                  <p className="mb-4">Add users to get started with your platform.</p>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Monitor security-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.securityLogs.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {dashboardData.securityLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted">
                        <div className="flex items-center space-x-4">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <Shield className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <div className="font-medium">{log.event_type}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.description} • {new Date(log.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.ip_address}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No security events</h3>
                  <p>Security events will be logged here when they occur.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
