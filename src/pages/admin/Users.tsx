import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCoinBalanceDialog } from "@/components/admin/AddCoinBalanceDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  UserPlus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Unlock, 
  UserCog,
  Search,
  Download,
  Loader2,
  Coins
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserManagement, User } from "@/hooks/useUserManagement";
import { useUserActions } from "@/hooks/useUserActions";
import { initializeDatabase } from "@/lib/databaseHelpers";
import { toast } from "@/components/ui/use-toast";

const UserManagement = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddBalanceDialog, setShowAddBalanceDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Use the hooks to fetch users and handle user actions
  const { users, loading, error, refetch } = useUserManagement();
  const { suspendUser, unsuspendUser, deleteUser, isProcessing } = useUserActions({
    onSuccess: refetch
  });
  
  // Set a timeout to prevent infinite loading
  useEffect(() => {
    if (loading && user) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
        // Try to initialize the database if we hit the timeout
        if (user) {
          initializeDatabase(user.id).catch(err => {
            console.error("Failed to initialize database:", err);
          });
        }
      }, 5000); // 5 seconds timeout
      
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  // Handle suspending a user
  const handleSuspendUser = async (userToSuspend: User) => {
    await suspendUser(userToSuspend);
  };
  
  // Handle unsuspending a user
  const handleUnsuspendUser = async (userToUnsuspend: User) => {
    await unsuspendUser(userToUnsuspend);
  };
  
  // Handle clicking the delete button
  const handleDeleteClick = (userToDelete: User) => {
    setSelectedUser(userToDelete);
    setShowDeleteDialog(true);
  };
  
  // Handle actual user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) {
      setShowDeleteDialog(false);
      return;
    }
    
    await deleteUser(selectedUser);
    setShowDeleteDialog(false);
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      user.email.toLowerCase().includes(query) ||
      user.full_name.toLowerCase().includes(query) ||
      user.id.includes(query);
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Lock className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-900 text-yellow-400 border-yellow-400/30">
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Admin
          </Badge>
        );
      case "user":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            User
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {role}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/users/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage all user accounts in the system
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-[150px]">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[150px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {loading && !loadingTimeout ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading user data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
              <p className="text-muted-foreground">Error loading users: {error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  if (user) {
                    initializeDatabase(user.id);
                  }
                }}
              >
                Retry
              </Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="min-w-[200px]">User</TableHead>
                    <TableHead className="hidden sm:table-cell">Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center hidden md:table-cell">Wallets</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Sign In</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={user.full_name} />
                          ) : null}
                          <AvatarFallback className={theme === "dark" ? "bg-secondary" : ""}>
                            {user.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="sm:hidden mt-1">
                          {user.role === "admin" ? (
                            <Badge variant="default" className="bg-yellow-600 text-xs">
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">User</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.role === "admin" ? (
                          <Badge variant="default" className="bg-yellow-600">
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-center hidden md:table-cell">{user.wallets_count}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDate(user.created_at)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.last_sign_in ? formatDate(user.last_sign_in) : "Never"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/users/${user.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedUser(user);
                              setShowAddBalanceDialog(true);
                            }}>
                              <Coins className="mr-2 h-4 w-4" />
                              Add Balance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "suspended" ? (
                              <DropdownMenuItem onClick={() => handleUnsuspendUser(user)}>
                                <Unlock className="mr-2 h-4 w-4" />
                                Unsuspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
                                <Lock className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteClick(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="flex items-center gap-3 py-4">
              <Avatar>
                <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.full_name} />
                <AvatarFallback>{getInitials(selectedUser.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedUser.full_name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Balance Dialog */}
      {selectedUser && (
        <AddCoinBalanceDialog
          isOpen={showAddBalanceDialog}
          onClose={() => setShowAddBalanceDialog(false)}
          userId={selectedUser.id}
          userEmail={selectedUser.email}
        />
      )}
    </div>
  );
};

export default UserManagement;
