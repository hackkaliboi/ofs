import React, { useState, useEffect } from "react";
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
  Wallet,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form validation schemas
const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface Profile {
  full_name: string;
  phone?: string;
  bio?: string;
  updated_at: string;
}

const UserSettings = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { toast } = useToast();

  const [profileSettings, setProfileSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: ""
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotificationsEnabled: true,
    loginNotificationsEnabled: true,
    lastPasswordChange: new Date().toISOString()
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

  // Password change form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load user profile data
  useEffect(() => {
    if (user && profile) {
      // Parse the full name into first and last name
      const nameParts = profile.full_name ? profile.full_name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setProfileSettings({
        firstName,
        lastName,
        email: user?.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatar_url || ''
      });

      // Load user settings
      fetchUserSettings();
    }
  }, [user, profile]);

  const fetchUserSettings = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Fetch user settings from the database
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      // Handle case where table doesn't exist or other errors
      if (error) {
        console.error('Error fetching user settings:', error);
        
        // If the error is related to the table not existing, we'll use default values
        // This allows the app to work even if the migration hasn't been run yet
        if (error.code === '42P01' || error.message?.includes("relation") || error.code === 'PGRST116') {
          console.log('Using default settings (table may not exist yet)');
          // Continue with default values already set in state
          toast({
            title: "Using Default Settings",
            description: "The settings database is not yet configured. Using default values instead.",
          });
        } else {
          toast({
            title: "Error Loading Settings",
            description: "There was a problem loading your settings. Using defaults instead.",
            variant: "destructive",
          });
        }
      } else if (data) {
        // If settings exist, update state
        // Update security settings
        setSecuritySettings({
          twoFactorEnabled: data.two_factor_enabled || false,
          emailNotificationsEnabled: data.email_notifications_enabled || true,
          loginNotificationsEnabled: data.login_notifications_enabled || true,
          lastPasswordChange: data.last_password_change || new Date().toISOString()
        });
        
        // Update notification settings
        setNotificationSettings({
          emailNotifications: data.email_notifications || true,
          pushNotifications: data.push_notifications || false,
          transactionAlerts: data.transaction_alerts || true,
          securityAlerts: data.security_alerts || true,
          marketingEmails: data.marketing_emails || false,
          newsletterSubscription: data.newsletter_subscription || true
        });
        
        // Update preference settings
        setPreferenceSettings({
          language: data.language || "en",
          currency: data.currency || "USD",
          timezone: data.timezone || "UTC",
          theme: data.theme || "light",
          compactView: data.compact_view || false
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching user settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Combine first and last name
      const fullName = `${profileSettings.firstName} ${profileSettings.lastName}`.trim();
      
      // Check if the profiles table has the required columns
      const { error: checkError } = await supabase
        .from('profiles')
        .select('phone, bio')
        .limit(1);
      
      let updateData: Partial<Profile> = {
        full_name: fullName,
        updated_at: new Date().toISOString()
      };
      
      // Only include these fields if they exist in the table
      if (!checkError || !checkError.message?.includes("column")) {
        updateData = {
          ...updateData,
          phone: profileSettings.phone,
          bio: profileSettings.bio
        };
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the profile in context
      const refreshSuccess = await refreshProfile();
      
      if (refreshSuccess) {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        });
      } else {
        // If refresh failed but update succeeded, still show success but with a warning
        toast({
          title: "Profile Updated",
          description: "Your profile was updated but you may need to refresh the page to see changes.",
          variant: "destructive", 
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (values: z.infer<typeof passwordSchema>) => {
    try {
      setIsLoading(true);
      
      // Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });
      
      if (error) {
        throw error;
      }
      
      // Update last password change timestamp
      if (user?.id) {
        const now = new Date().toISOString();
        
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            last_password_change: now,
            updated_at: now
          }, { onConflict: 'user_id' });
        
        setSecuritySettings({
          ...securitySettings,
          lastPasswordChange: now
        });
      }
      
      // Close dialog and reset form
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Password Change Failed",
        description: error.message || "There was a problem changing your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (section: string) => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // First check if user_settings table exists
      const { error: checkError } = await supabase
        .from('user_settings')
        .select('id')
        .limit(1);
      
      // If table doesn't exist, show message and return
      if (checkError && (checkError.code === '42P01' || checkError.message?.includes("relation"))) {
        toast({
          title: "Settings Not Available",
          description: "The settings database is not yet configured. Please run the database migrations first.",
          variant: "destructive",
        });
        return;
      }
      
      let settingsData = {};
      
      // Prepare data based on section
      switch (section) {
        case 'security':
          settingsData = {
            two_factor_enabled: securitySettings.twoFactorEnabled,
            email_notifications_enabled: securitySettings.emailNotificationsEnabled,
            login_notifications_enabled: securitySettings.loginNotificationsEnabled
          };
          break;
        case 'notification':
          settingsData = {
            email_notifications: notificationSettings.emailNotifications,
            push_notifications: notificationSettings.pushNotifications,
            transaction_alerts: notificationSettings.transactionAlerts,
            security_alerts: notificationSettings.securityAlerts,
            marketing_emails: notificationSettings.marketingEmails,
            newsletter_subscription: notificationSettings.newsletterSubscription
          };
          break;
        case 'preferences':
          settingsData = {
            language: preferenceSettings.language,
            currency: preferenceSettings.currency,
            timezone: preferenceSettings.timezone,
            theme: preferenceSettings.theme,
            compact_view: preferenceSettings.compactView
          };
          break;
      }
      
      // Add common fields
      settingsData = {
        ...settingsData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };
      
      // Update settings in Supabase
      const { error } = await supabase
        .from('user_settings')
        .upsert(settingsData, { onConflict: 'user_id' });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Settings Saved",
        description: `Your ${section} settings have been updated successfully.`,
      });
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      toast({
        title: "Save Failed",
        description: `There was a problem saving your ${section} settings. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (isLoading && !profile) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading your settings...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Password Change Dialog */}
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and a new password below.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsPasswordDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Change Password
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

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
                  <Button onClick={() => handleSaveProfile()} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </>
                    )}
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
                      <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                        Change Password
                      </Button>
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
                  <Button onClick={() => handleSaveSettings('security')} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Security Settings
                      </>
                    )}
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
                  <Button onClick={() => handleSaveSettings('notification')} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Settings
                      </>
                    )}
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
                  <Button onClick={() => handleSaveSettings('preferences')} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default UserSettings;
