import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  User,
  Wallet,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Loader2,
  Mail,
  Calendar,
  Activity
} from "lucide-react";
import { User as UserType } from "@/hooks/useUserManagement";

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Fetch user's wallets
        const { data: walletData, error: walletError } = await supabase
          .from('wallet_connections')
          .select('*')
          .eq('user_id', userId);

        if (walletError) {
          console.error('Error fetching wallets:', walletError);
          // Continue with empty wallet data
        }

        // Fetch user's activities
        const { data: activityData, error: activityError } = await supabase
          .from('user_activity_log')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (activityError) {
          console.error('Error fetching activities:', activityError);
          // Continue with empty activity data
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
        const transformedUser: UserType = {
          id: profileData.id,
          email: profileData.email || '',
          full_name: profileData.full_name || '',
          role: adminData && adminData.length > 0 ? 'admin' : 'user',
          status,
          created_at: profileData.created_at || '',
          last_sign_in: profileData.last_sign_in,
          wallets_count: walletData ? walletData.length : 0,
          avatar_url: profileData.avatar_url || '',
        };

        setUserData(transformedUser);
        setWallets(walletData || []);
        setActivities(activityData || []);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, userId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Lock className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
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
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/users/${userId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Link>
          </Button>
          {userData.status === "suspended" ? (
            <Button variant="outline" size="sm">
              <Unlock className="h-4 w-4 mr-2" />
              Unsuspend
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              <Lock className="h-4 w-4 mr-2" />
              Suspend
            </Button>
          )}
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Basic user information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                {userData.avatar_url ? (
                  <AvatarImage src={userData.avatar_url} alt={userData.full_name} />
                ) : null}
                <AvatarFallback className="text-2xl">
                  {userData.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{userData.full_name}</h2>
              <p className="text-muted-foreground">{userData.email}</p>
              <div className="mt-2">
                {userData.role === "admin" ? (
                  <Badge variant="default" className="bg-purple-600">
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline">User</Badge>
                )}
                <span className="mx-2">•</span>
                {getStatusBadge(userData.status)}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="text-sm">{formatDate(userData.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Last Sign In</span>
                </div>
                <span className="text-sm">{userData.last_sign_in ? formatDate(userData.last_sign_in) : "Never"}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Wallets</span>
                </div>
                <span className="text-sm">{userData.wallets_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <Tabs defaultValue="wallets">
              <TabsList>
                <TabsTrigger value="wallets">
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallets
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="wallets" className="mt-0">
              {wallets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No wallets connected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <Card key={wallet.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{wallet.chain_type || "Ethereum"}</h3>
                            <p className="text-sm text-muted-foreground break-all">{wallet.wallet_address}</p>
                          </div>
                          <div>
                            {wallet.validated || wallet.validation_status === "validated" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Validated
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="activity" className="mt-0">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No activity recorded</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 py-3 border-b last:border-0">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(activity.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;
