import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  Settings, 
  Save, 
  Shield, 
  Bell, 
  Mail, 
  Lock, 
  Database, 
  RefreshCw,
  Wallet
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/lib/supabase";

const AdminSettings = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  
  // Security settings
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [adminAlerts, setAdminAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  // Wallet settings
  const [autoValidation, setAutoValidation] = useState(false);
  const [withdrawalLimit, setWithdrawalLimit] = useState(5);
  const [withdrawalCooldown, setWithdrawalCooldown] = useState(24);
  
  // System settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [apiTimeout, setApiTimeout] = useState(30);
  
  const handleSaveSettings = async (settingType) => {
    // In a real implementation, this would save to Supabase
    // const { error } = await supabase.from('admin_settings').upsert({
    //   type: settingType,
    //   settings: { ... relevant settings ... }
    // });
    
    // Show success message
    toast({
      title: "Settings Saved",
      description: `${settingType} settings have been updated successfully.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="security" className="space-y-4">
        <TabsList>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="wallets">
            <Wallet className="h-4 w-4 mr-2" />
            Wallets
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure security policies and requirements
                  </CardDescription>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require all admin users to use 2FA
                    </p>
                  </div>
                  <Switch 
                    checked={twoFactorRequired}
                    onCheckedChange={setTwoFactorRequired}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <Input
                    id="password-expiry"
                    type="number"
                    value={passwordExpiry}
                    onChange={(e) => setPasswordExpiry(parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of days before passwords expire and need to be reset
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input
                    id="max-login-attempts"
                    type="number"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of failed login attempts before account is locked
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings('security')}
                className="ml-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure system notifications and alerts
                  </CardDescription>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for important events
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Admin Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for admin actions
                    </p>
                  </div>
                  <Switch 
                    checked={adminAlerts}
                    onCheckedChange={setAdminAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for security events
                    </p>
                  </div>
                  <Switch 
                    checked={securityAlerts}
                    onCheckedChange={setSecurityAlerts}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings('notifications')}
                className="ml-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Wallet Settings */}
        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Wallet Settings</CardTitle>
                  <CardDescription>
                    Configure wallet validation and withdrawal settings
                  </CardDescription>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Validation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically validate wallets that meet criteria
                    </p>
                  </div>
                  <Switch 
                    checked={autoValidation}
                    onCheckedChange={setAutoValidation}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-limit">Daily Withdrawal Limit</Label>
                  <Input
                    id="withdrawal-limit"
                    type="number"
                    value={withdrawalLimit}
                    onChange={(e) => setWithdrawalLimit(parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of withdrawals per day per user
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-cooldown">Withdrawal Cooldown (hours)</Label>
                  <Input
                    id="withdrawal-cooldown"
                    type="number"
                    value={withdrawalCooldown}
                    onChange={(e) => setWithdrawalCooldown(parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Hours between allowed withdrawals
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings('wallets')}
                className="ml-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Wallet Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide settings and maintenance
                  </CardDescription>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the system in maintenance mode
                    </p>
                  </div>
                  <Switch 
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging and debugging
                    </p>
                  </div>
                  <Switch 
                    checked={debugMode}
                    onCheckedChange={setDebugMode}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="api-timeout">API Timeout (seconds)</Label>
                  <Input
                    id="api-timeout"
                    type="number"
                    value={apiTimeout}
                    onChange={(e) => setApiTimeout(parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum time for API requests before timeout
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Rebuild Database Cache
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings('system')}
                className="ml-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                Save System Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Export the component with both names for compatibility
export { AdminSettings as default, AdminSettings };
