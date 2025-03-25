import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Shield, 
  Bell, 
  Settings as SettingsIcon, 
  Save, 
  Lock, 
  Mail, 
  AlertCircle,
  Smartphone,
  KeyRound,
  Wallet
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const UserSettings = () => {
  const [profileSettings, setProfileSettings] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Blockchain enthusiast and digital asset investor.",
    avatarUrl: ""
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotificationsEnabled: true,
    loginNotificationsEnabled: true,
    lastPasswordChange: "2023-01-15T10:30:00Z"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    transactionAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    newsletterSubscription: true
  });

  const [preferenceSettings, setPreferenceSettings] = useState({
    language: "en",
    currency: "USD",
    timezone: "UTC",
    theme: "light",
    compactView: false
  });

  const { toast } = useToast();

  const handleProfileChange = (field: string, value: string) => {
    setProfileSettings({
      ...profileSettings,
      [field]: value
    });
  };

  const handleSecurityChange = (field: string, value: boolean) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: value
    });
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value
    });
  };

  const handlePreferenceChange = (field: string, value: string | boolean) => {
    setPreferenceSettings({
      ...preferenceSettings,
      [field]: value
    });
  };

  const handleSaveSettings = (section: string) => {
    // In a real app, this would save to a database
    toast({
      title: "Settings Saved",
      description: `Your ${section} settings have been updated successfully.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileSettings.avatarUrl} alt={`${profileSettings.firstName} ${profileSettings.lastName}`} />
                    <AvatarFallback className="text-2xl">
                      {profileSettings.firstName.charAt(0)}{profileSettings.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={profileSettings.firstName} 
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={profileSettings.lastName} 
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileSettings.email} 
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={profileSettings.phone} 
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={profileSettings.bio} 
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      placeholder="Tell us about yourself"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('profile')}>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="changePassword">Password</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last changed: {formatDate(securitySettings.lastPasswordChange)}
                    </p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="flex items-center justify-between pt-4 pb-4 border-t">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="twoFactorEnabled" 
                      checked={securitySettings.twoFactorEnabled} 
                      onCheckedChange={(checked) => handleSecurityChange('twoFactorEnabled', checked)}
                    />
                    <span className="text-sm font-medium">
                      {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 pb-4 border-t">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="emailNotificationsEnabled">Email Security Alerts</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important security events
                    </p>
                  </div>
                  <Switch 
                    id="emailNotificationsEnabled" 
                    checked={securitySettings.emailNotificationsEnabled} 
                    onCheckedChange={(checked) => handleSecurityChange('emailNotificationsEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 pb-4 border-t">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="loginNotificationsEnabled">Login Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch 
                    id="loginNotificationsEnabled" 
                    checked={securitySettings.loginNotificationsEnabled} 
                    onCheckedChange={(checked) => handleSecurityChange('loginNotificationsEnabled', checked)}
                  />
                </div>
              </div>
              
              <Alert variant="default" className="bg-blue-50 mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Security Tip</AlertTitle>
                <AlertDescription>
                  We recommend enabling two-factor authentication for enhanced account security.
                </AlertDescription>
              </Alert>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Manage API Keys
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('security')}>
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
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="text-sm font-medium">Communication Channels</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={notificationSettings.emailNotifications} 
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your devices
                    </p>
                  </div>
                  <Switch 
                    id="pushNotifications" 
                    checked={notificationSettings.pushNotifications} 
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between pb-2 pt-6 border-b">
                  <h3 className="text-sm font-medium">Notification Types</h3>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="transactionAlerts">Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about deposits, withdrawals, and transfers
                    </p>
                  </div>
                  <Switch 
                    id="transactionAlerts" 
                    checked={notificationSettings.transactionAlerts} 
                    onCheckedChange={(checked) => handleNotificationChange('transactionAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="securityAlerts">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about security events and login attempts
                    </p>
                  </div>
                  <Switch 
                    id="securityAlerts" 
                    checked={notificationSettings.securityAlerts} 
                    onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between pb-2 pt-6 border-b">
                  <h3 className="text-sm font-medium">Marketing Communications</h3>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional offers and updates
                    </p>
                  </div>
                  <Switch 
                    id="marketingEmails" 
                    checked={notificationSettings.marketingEmails} 
                    onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletterSubscription">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive our weekly newsletter with industry updates
                    </p>
                  </div>
                  <Switch 
                    id="newsletterSubscription" 
                    checked={notificationSettings.newsletterSubscription} 
                    onCheckedChange={(checked) => handleNotificationChange('newsletterSubscription', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('notification')}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Preferences Settings */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                User Preferences
              </CardTitle>
              <CardDescription>
                Customize your experience on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={preferenceSettings.language} 
                    onValueChange={(value) => handlePreferenceChange('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Display Currency</Label>
                  <Select 
                    value={preferenceSettings.currency} 
                    onValueChange={(value) => handlePreferenceChange('currency', value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="BTC">BTC (₿)</SelectItem>
                      <SelectItem value="ETH">ETH (Ξ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={preferenceSettings.timezone} 
                    onValueChange={(value) => handlePreferenceChange('timezone', value)}
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
                
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={preferenceSettings.theme} 
                    onValueChange={(value) => handlePreferenceChange('theme', value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="compactView">Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Display more information with a compact layout
                  </p>
                </div>
                <Switch 
                  id="compactView" 
                  checked={preferenceSettings.compactView} 
                  onCheckedChange={(checked) => handlePreferenceChange('compactView', checked)}
                />
              </div>
              
              <div className="pt-6">
                <Button variant="outline" className="w-full">
                  <Wallet className="mr-2 h-4 w-4" />
                  Configure Default Wallet
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('preferences')}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
