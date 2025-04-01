import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Wallet, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search,
  User,
  FileCheck,
  Loader2,
  Shield,
  Activity,
  ArrowRight
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUsers } from "@/hooks/useUsers";
import { useWalletConnections } from "@/hooks/useWalletConnections";
import { useKycVerifications } from "@/hooks/useKycVerifications";

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Use our real-time hooks
  const { users, loading: usersLoading, error: usersError, stats: userStats } = useUsers();
  const { 
    walletConnections, 
    loading: walletsLoading, 
    error: walletsError, 
    stats: walletStats 
  } = useWalletConnections();
  const { 
    kycVerifications, 
    loading: kycLoading, 
    error: kycError, 
    stats: kycStats 
  } = useKycVerifications();

  // Get pending KYC verifications
  const pendingKycVerifications = kycVerifications.filter(kyc => kyc.status === "pending");
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get user information by ID
  const getUserInfo = (userId) => {
    if (!users || !userId) return null;
    return users.find(u => u.id === userId);
  };

  // Loading state
  if (usersLoading || walletsLoading || kycLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading dashboard data...</h2>
        <p className="text-muted-foreground">Please wait while we fetch the latest information</p>
      </div>
    );
  }

  // Error state
  if (usersError || walletsError || kycError) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {userStats.total || 0}
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Connected Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {walletStats.total || 0}
              </div>
              <div className="p-2 rounded-full bg-purple-100">
                <Wallet className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {kycStats.pending || 0}
              </div>
              <div className="p-2 rounded-full bg-yellow-100">
                <Shield className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>
              Items requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingKycVerifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  There are no pending actions requiring your attention
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingKycVerifications.slice(0, 5).map((kyc) => {
                        const userInfo = getUserInfo(kyc.user_id);
                        return (
                          <TableRow key={kyc.id}>
                            <TableCell>
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
                                <Shield className="h-3 w-3 mr-1" />
                                KYC
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {userInfo ? userInfo.email : kyc.user_id}
                            </TableCell>
                            <TableCell>{formatDate(kyc.submitted_at)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to="/admin/kyc">
                                  Review
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {pendingKycVerifications.length > 5 && (
                  <div className="flex justify-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin/kyc">
                        View All ({pendingKycVerifications.length})
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>KYC Verification Stats</CardTitle>
            <CardDescription>
              Overview of identity verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 rounded-md border">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100 mr-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Approved</p>
                      <p className="text-sm text-muted-foreground">Verified identities</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{kycStats.approved || 0}</div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-md border">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-yellow-100 mr-4">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Pending</p>
                      <p className="text-sm text-muted-foreground">Awaiting review</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{kycStats.pending || 0}</div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-md border">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-red-100 mr-4">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Rejected</p>
                      <p className="text-sm text-muted-foreground">Failed verification</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{kycStats.rejected || 0}</div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button asChild>
                  <Link to="/admin/kyc">
                    Manage KYC Verifications
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>
            Recently registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No users yet</h3>
              <p className="text-sm text-muted-foreground">
                There are no registered users on the platform
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Wallets</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.slice(0, 5).map((user) => {
                    const userWallets = walletConnections.filter(w => w.user_id === user.id);
                    const userKyc = kycVerifications.find(k => k.user_id === user.id);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>{userWallets.length}</TableCell>
                        <TableCell>
                          {userKyc ? (
                            userKyc.status === "approved" ? (
                              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : userKyc.status === "pending" ? (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Rejected
                              </Badge>
                            )
                          ) : (
                            <Badge variant="outline">
                              Not Submitted
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Wallet className="mr-2 h-4 w-4" />
                                View Wallets
                              </DropdownMenuItem>
                              {userKyc && (
                                <DropdownMenuItem asChild>
                                  <Link to="/admin/kyc">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Review KYC
                                  </Link>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
