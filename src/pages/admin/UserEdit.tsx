import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Save,
  Loader2,
  XCircle
} from "lucide-react";
import { User } from "@/hooks/useUserManagement";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema for validation
const formSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  status: z.enum(["active", "pending", "suspended", "inactive"]),
  is_admin: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const UserEdit = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      status: "active",
      is_admin: false,
    },
  });

  useEffect(() => {
    if (!user || !userId) return;

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', userId);

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          // Continue with empty admin data
        }

        // Determine user status
        let status = profileData.status || 'inactive';
        if (!status) {
          if (profileData.last_sign_in) {
            const lastSignIn = new Date(profileData.last_sign_in);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            if (lastSignIn >= thirtyDaysAgo) {
              status = 'active';
            }
          } else if (profileData.created_at) {
            const createdAt = new Date(profileData.created_at);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            if (createdAt >= sevenDaysAgo) {
              status = 'pending';
            }
          }
        }

        // Transform profile data to UserType
        const transformedUser: User = {
          id: profileData.id,
          email: profileData.email || '',
          full_name: profileData.full_name || '',
          role: adminData && adminData.length > 0 ? 'admin' : 'user',
          status,
          created_at: profileData.created_at || '',
          last_sign_in: profileData.last_sign_in,
          wallets_count: 0, // Not needed for the form
          avatar_url: profileData.avatar_url || '',
        };

        setUserData(transformedUser);

        // Set form values
        form.reset({
          full_name: transformedUser.full_name,
          email: transformedUser.email,
          status: transformedUser.status as any,
          is_admin: transformedUser.role === 'admin',
        });
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, userId, form]);

  const onSubmit = async (values: FormValues) => {
    if (!user || !userId) return;
    
    setSaving(true);
    try {
      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          email: values.email,
          status: values.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Handle admin status
      if (values.is_admin) {
        // Check if already admin
        const { data: existingAdmin } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', userId);

        // If not already admin, add to admin_users
        if (!existingAdmin || existingAdmin.length === 0) {
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert([{ user_id: userId }]);

          if (adminError) throw adminError;
        }
      } else {
        // Remove from admin_users if exists
        const { error: removeAdminError } = await supabase
          .from('admin_users')
          .delete()
          .eq('user_id', userId);

        if (removeAdminError) throw removeAdminError;
      }

      toast({
        title: "User Updated",
        description: "User information has been updated successfully.",
      });

      // Navigate back to user detail page
      navigate(`/admin/users/${userId}`);
    } catch (err) {
      console.error('Error updating user:', err);
      toast({
        title: "Error",
        description: "Failed to update user information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading user details...</h2>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-medium">Error Loading User</h2>
            <p className="text-muted-foreground mb-4">{error || "User not found"}</p>
            <Button onClick={() => navigate("/admin/users")}>
              Return to User List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>Update user information and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Controls the user's ability to access the platform.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <FormField
                control={form.control}
                name="is_admin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Admin Privileges</FormLabel>
                      <FormDescription>
                        Grant this user admin access to manage the platform.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={saving || !form.formState.isDirty}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserEdit;
