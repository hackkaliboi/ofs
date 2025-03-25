import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  Save, 
  Globe, 
  Mail, 
  BellRing, 
  Database, 
  Cloud,
  Palette,
  Moon,
  Sun,
  RefreshCw,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "OFS Ledger",
    siteDescription: "A secure digital asset management platform",
    contactEmail: "admin@ofsledger.com",
    supportEmail: "support@ofsledger.com",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    maintenanceMode: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@ofsledger.com",
    smtpPassword: "••••••••••••",
    fromEmail: "no-reply@ofsledger.com",
    fromName: "OFS Ledger",
    enableEmailNotifications: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newUserNotification: true,
    loginAttemptNotification: true,
    transactionNotification: true,
    securityAlertNotification: true,
    maintenanceNotification: false,
    emailDigest: "daily"
  });

  const [backupSettings, setBackupSettings] = useState({
    automaticBackups: true,
    backupFrequency: "daily",
    backupRetention: "30",
    backupStorage: "cloud",
    lastBackup: "2023-06-15T14:30:00Z"
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    accentColor: "blue",
    enableDarkMode: true,
    compactMode: false,
    showHelpTips: true
  });

  const handleGeneralSettingsChange = (field: string, value: string | boolean) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value
    });
  };

  const handleEmailSettingsChange = (field: string, value: string | boolean) => {
    setEmailSettings({
      ...emailSettings,
      [field]: value
    });
  };

  const handleNotificationSettingsChange = (field: string, value: string | boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value
    });
  };

  const handleBackupSettingsChange = (field: string, value: string | boolean) => {
    setBackupSettings({
      ...backupSettings,
      [field]: value
    });
  };

  const handleAppearanceSettingsChange = (field: string, value: string | boolean) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [field]: value
    });
  };

  const handleSaveSettings = () => {
    // In a real implementation, this would save to a database
    console.log("Saving settings:", {
      generalSettings,
      emailSettings,
      notificationSettings,
      backupSettings,
      appearanceSettings
    });
    
    // Show success message (in a real app)
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide settings for the platform
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Data</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Configure basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={generalSettings.siteName} 
                    onChange={(e) => handleGeneralSettingsChange('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email" 
                    value={generalSettings.contactEmail} 
                    onChange={(e) => handleGeneralSettingsChange('contactEmail', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea 
                  id="siteDescription" 
                  value={generalSettings.siteDescription} 
                  onChange={(e) => handleGeneralSettingsChange('siteDescription', e.target.value)}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input 
                    id="supportEmail" 
                    type="email" 
                    value={generalSettings.supportEmail} 
                    onChange={(e) => handleGeneralSettingsChange('supportEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={generalSettings.timezone} 
                    onValueChange={(value) => handleGeneralSettingsChange('timezone', value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select 
                    value={generalSettings.dateFormat} 
                    onValueChange={(value) => handleGeneralSettingsChange('dateFormat', value)}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch 
                    id="maintenanceMode" 
                    checked={generalSettings.maintenanceMode} 
                    onCheckedChange={(checked) => handleGeneralSettingsChange('maintenanceMode', checked)}
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>
              </div>
              
              {generalSettings.maintenanceMode && (
                <Alert variant="default" className="bg-yellow-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Maintenance Mode Enabled</AlertTitle>
                  <AlertDescription>
                    When enabled, only administrators will be able to access the platform. All other users will see a maintenance page.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>Configure email server settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 pb-4">
                <Switch 
                  id="enableEmailNotifications" 
                  checked={emailSettings.enableEmailNotifications} 
                  onCheckedChange={(checked) => handleEmailSettingsChange('enableEmailNotifications', checked)}
                />
                <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input 
                    id="smtpServer" 
                    value={emailSettings.smtpServer} 
                    onChange={(e) => handleEmailSettingsChange('smtpServer', e.target.value)}
                    disabled={!emailSettings.enableEmailNotifications}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input 
                    id="smtpPort" 
                    value={emailSettings.smtpPort} 
                    onChange={(e) => handleEmailSettingsChange('smtpPort', e.target.value)}
                    disabled={!emailSettings.enableEmailNotifications}
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input 
                    id="smtpUsername" 
                    value={emailSettings.smtpUsername} 
                    onChange={(e) => handleEmailSettingsChange('smtpUsername', e.target.value)}
                    disabled={!emailSettings.enableEmailNotifications}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input 
                    id="smtpPassword" 
                    type="password" 
                    value={emailSettings.smtpPassword} 
                    onChange={(e) => handleEmailSettingsChange('smtpPassword', e.target.value)}
                    disabled={!emailSettings.enableEmailNotifications}
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input 
                    id="fromEmail" 
                    type="email" 
                    value={emailSettings.fromEmail} 
                    onChange={(e) => handleEmailSettingsChange('fromEmail', e.target.value)}
                    disabled={!emailSettings.enableEmailNotifications}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input 
                    id="fromName" 
                    value={emailSettings.fromName} 
                    onChange={(e) => handleEmailSettingsChange('fromName', e.target.value)}
                    disabled={!emailSettings.enableEmailNotifications}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" disabled={!emailSettings.enableEmailNotifications}>
                  Send Test Email
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellRing className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure when and how notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="newUserNotification">New User Registration</Label>
                <Switch 
                  id="newUserNotification" 
                  checked={notificationSettings.newUserNotification} 
                  onCheckedChange={(checked) => handleNotificationSettingsChange('newUserNotification', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="loginAttemptNotification">Failed Login Attempts</Label>
                <Switch 
                  id="loginAttemptNotification" 
                  checked={notificationSettings.loginAttemptNotification} 
                  onCheckedChange={(checked) => handleNotificationSettingsChange('loginAttemptNotification', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="transactionNotification">Large Transactions</Label>
                <Switch 
                  id="transactionNotification" 
                  checked={notificationSettings.transactionNotification} 
                  onCheckedChange={(checked) => handleNotificationSettingsChange('transactionNotification', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="securityAlertNotification">Security Alerts</Label>
                <Switch 
                  id="securityAlertNotification" 
                  checked={notificationSettings.securityAlertNotification} 
                  onCheckedChange={(checked) => handleNotificationSettingsChange('securityAlertNotification', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="maintenanceNotification">Maintenance Updates</Label>
                <Switch 
                  id="maintenanceNotification" 
                  checked={notificationSettings.maintenanceNotification} 
                  onCheckedChange={(checked) => handleNotificationSettingsChange('maintenanceNotification', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailDigest">Email Digest Frequency</Label>
                <Select 
                  value={notificationSettings.emailDigest} 
                  onValueChange={(value) => handleNotificationSettingsChange('emailDigest', value)}
                >
                  <SelectTrigger id="emailDigest">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Backup & Data Management
              </CardTitle>
              <CardDescription>Configure database backup settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 pb-4">
                <Switch 
                  id="automaticBackups" 
                  checked={backupSettings.automaticBackups} 
                  onCheckedChange={(checked) => handleBackupSettingsChange('automaticBackups', checked)}
                />
                <Label htmlFor="automaticBackups">Enable Automatic Backups</Label>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select 
                    value={backupSettings.backupFrequency} 
                    onValueChange={(value) => handleBackupSettingsChange('backupFrequency', value)}
                    disabled={!backupSettings.automaticBackups}
                  >
                    <SelectTrigger id="backupFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Retention Period (days)</Label>
                  <Input 
                    id="backupRetention" 
                    value={backupSettings.backupRetention} 
                    onChange={(e) => handleBackupSettingsChange('backupRetention', e.target.value)}
                    disabled={!backupSettings.automaticBackups}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backupStorage">Backup Storage Location</Label>
                <Select 
                  value={backupSettings.backupStorage} 
                  onValueChange={(value) => handleBackupSettingsChange('backupStorage', value)}
                  disabled={!backupSettings.automaticBackups}
                >
                  <SelectTrigger id="backupStorage">
                    <SelectValue placeholder="Select storage location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="both">Both Local & Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Backup:</span>
                  <span className="text-sm font-medium">
                    {backupSettings.lastBackup 
                      ? new Date(backupSettings.lastBackup).toLocaleString() 
                      : "Never"}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" disabled={!backupSettings.automaticBackups}>
                    <Cloud className="mr-2 h-4 w-4" />
                    Backup Now
                  </Button>
                  <Button variant="outline" disabled={!backupSettings.automaticBackups}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restore from Backup
                  </Button>
                  <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize the look and feel of the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Default Theme</Label>
                <div className="flex items-center space-x-2">
                  <Select 
                    value={appearanceSettings.theme} 
                    onValueChange={(value) => handleAppearanceSettingsChange('theme', value)}
                  >
                    <SelectTrigger id="theme" className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="mr-2 h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="mr-2 h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <Select 
                  value={appearanceSettings.accentColor} 
                  onValueChange={(value) => handleAppearanceSettingsChange('accentColor', value)}
                >
                  <SelectTrigger id="accentColor" className="w-[180px]">
                    <SelectValue placeholder="Select accent color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between space-x-2 pt-4">
                <Label htmlFor="enableDarkMode">Enable Dark Mode Toggle</Label>
                <Switch 
                  id="enableDarkMode" 
                  checked={appearanceSettings.enableDarkMode} 
                  onCheckedChange={(checked) => handleAppearanceSettingsChange('enableDarkMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="compactMode">Compact Mode</Label>
                <Switch 
                  id="compactMode" 
                  checked={appearanceSettings.compactMode} 
                  onCheckedChange={(checked) => handleAppearanceSettingsChange('compactMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="showHelpTips">Show Help Tips</Label>
                <Switch 
                  id="showHelpTips" 
                  checked={appearanceSettings.showHelpTips} 
                  onCheckedChange={(checked) => handleAppearanceSettingsChange('showHelpTips', checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
