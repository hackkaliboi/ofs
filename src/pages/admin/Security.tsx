import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  Search, 
  RefreshCcw, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Lock,
  Key,
  FileText,
  Download,
  Filter,
  Settings,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  UserX,
  ShieldAlert,
  ShieldCheck,
  MoreHorizontal
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SecurityLog {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  details: string;
  created_at: string;
  status: 'new' | 'in_progress' | 'resolved' | 'dismissed';
}

const AdminSecurity = () => {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("logs");
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordPolicy: true,
    ipRestriction: false,
    auditLogging: true,
    sessionTimeout: true,
    failedLoginLockout: true,
  });

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const fetchSecurityLogs = async () => {
    try {
      setIsLoading(true);
      setLoadingError(null);
      
      // In a real implementation, this would fetch from a 'security_logs' table
      // For now, we'll use mock data since the table might not exist yet
      
      // Simulating API call
      setTimeout(() => {
        const mockLogs: SecurityLog[] = [
          {
            id: "1",
            event_type: "login_success",
            severity: "low",
            user_id: "user-123",
            user_email: "admin@example.com",
            ip_address: "192.168.1.1",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            details: "Successful login",
            created_at: "2023-06-15T14:30:00Z",
            status: "resolved"
          },
          {
            id: "2",
            event_type: "login_failed",
            severity: "medium",
            user_email: "user@example.com",
            ip_address: "192.168.1.2",
            user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            details: "Failed login attempt (3rd attempt)",
            created_at: "2023-06-15T14:35:00Z",
            status: "in_progress"
          },
          {
            id: "3",
            event_type: "password_changed",
            severity: "low",
            user_id: "user-456",
            user_email: "user2@example.com",
            ip_address: "192.168.1.3",
            user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
            details: "User changed password",
            created_at: "2023-06-15T15:00:00Z",
            status: "resolved"
          },
          {
            id: "4",
            event_type: "suspicious_activity",
            severity: "high",
            user_id: "user-789",
            user_email: "user3@example.com",
            ip_address: "203.0.113.1",
            user_agent: "Mozilla/5.0 (Linux; Android 11)",
            details: "Multiple login attempts from different locations",
            created_at: "2023-06-15T15:30:00Z",
            status: "new"
          },
          {
            id: "5",
            event_type: "account_locked",
            severity: "medium",
            user_id: "user-101",
            user_email: "user4@example.com",
            ip_address: "203.0.113.2",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            details: "Account locked due to multiple failed login attempts",
            created_at: "2023-06-15T16:00:00Z",
            status: "in_progress"
          },
          {
            id: "6",
            event_type: "permission_change",
            severity: "high",
            user_id: "user-202",
            user_email: "admin2@example.com",
            ip_address: "192.168.1.10",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            details: "Admin privileges granted to user",
            created_at: "2023-06-15T16:30:00Z",
            status: "new"
          },
          {
            id: "7",
            event_type: "data_export",
            severity: "medium",
            user_id: "user-303",
            user_email: "admin@example.com",
            ip_address: "192.168.1.1",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            details: "User data exported",
            created_at: "2023-06-15T17:00:00Z",
            status: "new"
          },
          {
            id: "8",
            event_type: "api_key_created",
            severity: "medium",
            user_id: "user-123",
            user_email: "developer@example.com",
            ip_address: "192.168.1.5",
            user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            details: "New API key created with full access",
            created_at: "2023-06-15T17:30:00Z",
            status: "new"
          },
          {
            id: "9",
            event_type: "unauthorized_access_attempt",
            severity: "critical",
            ip_address: "198.51.100.1",
            user_agent: "Unknown",
            details: "Attempted access to admin endpoints without authentication",
            created_at: "2023-06-15T18:00:00Z",
            status: "new"
          }
        ];
        
        setSecurityLogs(mockLogs);
        setIsLoading(false);
      }, 1000);
      
      // When you have the actual table, use this:
      // const { data, error } = await supabase.from('security_logs').select('*').order('created_at', { ascending: false });
      // if (error) throw error;
      // setSecurityLogs(data || []);
      
    } catch (error) {
      console.error("Error fetching security logs:", error);
      setLoadingError("Failed to load security logs. Please try again.");
      setIsLoading(false);
    }
  };

  const filteredLogs = securityLogs.filter(log => {
    // Filter by search query
    const matchesSearch = 
      (log.event_type && log.event_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.user_email && log.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.ip_address && log.ip_address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const updateSecuritySetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: !securitySettings[setting]
    });
  };

  // Handle loading error
  if (loadingError) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <div className="text-destructive text-xl mb-4">{loadingError}</div>
        <Button 
          onClick={() => fetchSecurityLogs()}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // Get counts for different severities
  const criticalCount = securityLogs.filter(log => log.severity === 'critical' && log.status !== 'resolved').length;
  const highCount = securityLogs.filter(log => log.severity === 'high' && log.status !== 'resolved').length;
  const mediumCount = securityLogs.filter(log => log.severity === 'medium' && log.status !== 'resolved').length;
  const lowCount = securityLogs.filter(log => log.severity === 'low' && log.status !== 'resolved').length;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Security Center</h1>
        <p className="text-muted-foreground">
          Monitor and manage platform security
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={criticalCount > 0 ? "border-red-500" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${criticalCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Unresolved critical security issues</p>
          </CardContent>
        </Card>
        <Card className={highCount > 0 ? "border-orange-500" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Alerts</CardTitle>
            <AlertCircle className={`h-4 w-4 ${highCount > 0 ? "text-orange-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highCount}</div>
            <p className="text-xs text-muted-foreground">Unresolved high priority issues</p>
          </CardContent>
        </Card>
        <Card className={mediumCount > 0 ? "border-yellow-500" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Alerts</CardTitle>
            <AlertCircle className={`h-4 w-4 ${mediumCount > 0 ? "text-yellow-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediumCount}</div>
            <p className="text-xs text-muted-foreground">Unresolved medium priority issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Alerts</CardTitle>
            <AlertCircle className={`h-4 w-4 ${lowCount > 0 ? "text-blue-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowCount}</div>
            <p className="text-xs text-muted-foreground">Unresolved low priority issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {(criticalCount > 0 || highCount > 0) && (
        <Alert variant={criticalCount > 0 ? "destructive" : "default"} className={criticalCount > 0 ? "bg-red-50" : "bg-orange-50"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{criticalCount > 0 ? "Critical Security Alerts" : "High Priority Alerts"}</AlertTitle>
          <AlertDescription>
            {criticalCount > 0 
              ? `You have ${criticalCount} unresolved critical security ${criticalCount === 1 ? 'issue' : 'issues'} that require immediate attention.`
              : `You have ${highCount} unresolved high priority ${highCount === 1 ? 'issue' : 'issues'} that require attention.`
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="logs" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        {/* Security Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Security Event Logs</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {securityLogs.length} security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search logs..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => fetchSecurityLogs()} disabled={isLoading}>
                    <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Logs
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-muted rounded"></div>
                          <div className="h-3 w-32 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="h-8 w-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredLogs.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-full 
                            ${log.severity === 'critical' ? 'bg-red-100' : 
                              log.severity === 'high' ? 'bg-orange-100' : 
                              log.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                            {log.event_type.includes('login') && (log.event_type.includes('failed') ? <LogIn className="h-5 w-5 text-red-600" /> : <LogIn className="h-5 w-5 text-green-600" />)}
                            {log.event_type.includes('password') && <Key className="h-5 w-5 text-blue-600" />}
                            {log.event_type.includes('suspicious') && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                            {log.event_type.includes('account_locked') && <Lock className="h-5 w-5 text-red-600" />}
                            {log.event_type.includes('permission') && <User className="h-5 w-5 text-purple-600" />}
                            {log.event_type.includes('data_export') && <Download className="h-5 w-5 text-blue-600" />}
                            {log.event_type.includes('api_key') && <Key className="h-5 w-5 text-yellow-600" />}
                            {log.event_type.includes('unauthorized') && <ShieldAlert className="h-5 w-5 text-red-600" />}
                          </div>
                          <div>
                            <div className="font-medium flex items-center">
                              {log.event_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              <Badge 
                                variant={
                                  log.severity === 'critical' ? 'destructive' : 
                                  log.severity === 'high' ? 'destructive' : 
                                  log.severity === 'medium' ? 'default' : 'outline'
                                }
                                className={`ml-2 
                                  ${log.severity === 'critical' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                                    log.severity === 'high' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' : 
                                    log.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                                    'bg-blue-100 text-blue-800 hover:bg-blue-100'}`}
                              >
                                {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">{log.details}</div>
                            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                              {log.user_email && (
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {log.user_email}
                                </span>
                              )}
                              {log.ip_address && (
                                <span className="flex items-center">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {log.ip_address}
                                </span>
                              )}
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(log.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <Badge 
                            variant={
                              log.status === 'new' ? 'default' : 
                              log.status === 'in_progress' ? 'default' : 
                              log.status === 'resolved' ? 'outline' : 'outline'
                            }
                            className={`
                              ${log.status === 'new' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                                log.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                                log.status === 'resolved' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                                'bg-slate-100 text-slate-800 hover:bg-slate-100'}`}
                          >
                            {log.status === 'new' && <AlertCircle className="mr-1 h-3 w-3" />}
                            {log.status === 'in_progress' && <Clock className="mr-1 h-3 w-3" />}
                            {log.status === 'resolved' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {log.status === 'dismissed' && <XCircle className="mr-1 h-3 w-3" />}
                            {log.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No security logs found</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {searchQuery 
                      ? `No security logs match your search "${searchQuery}". Try a different search term.` 
                      : "There are no security logs to display."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure platform security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="font-medium">Two-Factor Authentication</div>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                </div>
                <Switch 
                  checked={securitySettings.twoFactorAuth} 
                  onCheckedChange={() => updateSecuritySetting('twoFactorAuth')} 
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="font-medium">Strong Password Policy</div>
                  <p className="text-sm text-muted-foreground">Enforce complex passwords for all users</p>
                </div>
                <Switch 
                  checked={securitySettings.passwordPolicy} 
                  onCheckedChange={() => updateSecuritySetting('passwordPolicy')} 
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="font-medium">IP Address Restrictions</div>
                  <p className="text-sm text-muted-foreground">Limit admin access to specific IP ranges</p>
                </div>
                <Switch 
                  checked={securitySettings.ipRestriction} 
                  onCheckedChange={() => updateSecuritySetting('ipRestriction')} 
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="font-medium">Comprehensive Audit Logging</div>
                  <p className="text-sm text-muted-foreground">Log all security-related actions</p>
                </div>
                <Switch 
                  checked={securitySettings.auditLogging} 
                  onCheckedChange={() => updateSecuritySetting('auditLogging')} 
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="font-medium">Session Timeout</div>
                  <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                </div>
                <Switch 
                  checked={securitySettings.sessionTimeout} 
                  onCheckedChange={() => updateSecuritySetting('sessionTimeout')} 
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="font-medium">Failed Login Lockout</div>
                  <p className="text-sm text-muted-foreground">Lock accounts after multiple failed login attempts</p>
                </div>
                <Switch 
                  checked={securitySettings.failedLoginLockout} 
                  onCheckedChange={() => updateSecuritySetting('failedLoginLockout')} 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Notifications</CardTitle>
              <CardDescription>Configure who receives security alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <Input type="email" id="email" placeholder="security@example.com" />
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium text-sm">Alert Levels</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add Notification Recipient</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage user permissions and access</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
              <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Access Control Settings</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Detailed access control management will be available soon. This will allow you to set granular permissions for different user roles.
              </p>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configure Roles
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSecurity;
