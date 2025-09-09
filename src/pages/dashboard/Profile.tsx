import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  Lock, 
  Key, 
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Profile = () => {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    country: profile?.country || "",
    bio: profile?.bio || "",
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    withdrawals: true,
    validations: true,
    security: true,
    marketing: false,
  });
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(profile?.two_factor_enabled || false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }));
  };
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be implemented with Supabase later
    console.log("Profile update:", formData);
  };
  
  const handleSecurityUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be implemented with Supabase later
    console.log("Security update:", { twoFactorEnabled });
  };
  
  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be implemented with Supabase later
    console.log("Notification update:", notifications);
  };
  
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || user?.email || "User"} />
                      <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            name="fullName"
                            placeholder="Your full name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Your email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-9"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed directly. Contact support for assistance.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="Your phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="country"
                            name="country"
                            placeholder="Your country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Your address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us a little about yourself"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleProfileUpdate}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View details about your account status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`rounded-lg p-4 border ${
                    theme === "dark" ? "bg-card" : "bg-gray-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Account Type</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.role === "admin" ? "Administrator" : "Standard User"}
                        </p>
                      </div>
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className={`rounded-lg p-4 border ${
                    theme === "dark" ? "bg-card" : "bg-gray-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Account Status</p>
                        <p className="text-sm text-muted-foreground">
                          Active
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                  
                  <div className={`rounded-lg p-4 border ${
                    theme === "dark" ? "bg-card" : "bg-gray-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Email Verification</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email_confirmed_at ? "Verified" : "Not Verified"}
                        </p>
                      </div>
                      {user?.email_confirmed_at ? (
                        <CheckCircle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className={`rounded-lg p-4 border ${
                    theme === "dark" ? "bg-card" : "bg-gray-900"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          {twoFactorEnabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                      {twoFactorEnabled ? (
                        <CheckCircle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }) : "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationUpdate} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={() => handleNotificationChange("email")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="browser-notifications">Browser Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="browser-notifications"
                        checked={notifications.browser}
                        onCheckedChange={() => handleNotificationChange("browser")}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="withdrawal-notifications">Withdrawal Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about withdrawal requests and status changes
                        </p>
                      </div>
                      <Switch
                        id="withdrawal-notifications"
                        checked={notifications.withdrawals}
                        onCheckedChange={() => handleNotificationChange("withdrawals")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="validation-notifications">Validation Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about wallet validation status changes
                        </p>
                      </div>
                      <Switch
                        id="validation-notifications"
                        checked={notifications.validations}
                        onCheckedChange={() => handleNotificationChange("validations")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="security-notifications">Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Important security notifications and alerts
                        </p>
                      </div>
                      <Switch
                        id="security-notifications"
                        checked={notifications.security}
                        onCheckedChange={() => handleNotificationChange("security")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-notifications">Marketing & Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          News, updates, and promotional information
                        </p>
                      </div>
                      <Switch
                        id="marketing-notifications"
                        checked={notifications.marketing}
                        onCheckedChange={() => handleNotificationChange("marketing")}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNotificationUpdate}>
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecurityUpdate} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Your current password"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Button variant="outline" className="w-full md:w-auto">
                        Change Password
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Two-Factor Authentication (2FA)</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account by requiring a verification code in addition to your password.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="two-factor"
                          checked={twoFactorEnabled}
                          onCheckedChange={setTwoFactorEnabled}
                        />
                        <Label htmlFor="two-factor" className="cursor-pointer">
                          {twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    
                    {!twoFactorEnabled && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Enhance Your Security</AlertTitle>
                        <AlertDescription>
                          We strongly recommend enabling two-factor authentication to protect your account from unauthorized access.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {twoFactorEnabled && (
                      <div className={`rounded-lg p-4 border ${
                        theme === "dark" ? "bg-card" : "bg-gray-900"
                      }`}>
                        <div className="flex items-center gap-3 mb-3">
                          <Key className="h-5 w-5 text-primary" />
                          <h4 className="font-medium">Recovery Codes</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Recovery codes can be used to access your account if you lose your two-factor authentication device.
                        </p>
                        <Button variant="outline" size="sm">
                          View Recovery Codes
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Session Management</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Manage your active sessions and sign out from other devices.
                    </p>
                    <Button variant="outline">
                      Manage Sessions
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSecurityUpdate}>
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Irreversible account actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-destructive p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
