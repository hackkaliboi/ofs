import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Unlock, 
  UserCog,
  Search,
  Download
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserManagement = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Mock data - will be replaced with Supabase data later
  const users = [
    {
      id: "1",
      email: "john.doe@example.com",
      full_name: "John Doe",
      role: "user",
      status: "active",
      created_at: "2025-01-15T10:30:00Z",
      last_sign_in: "2025-03-26T14:45:00Z",
      wallets_count: 3,
      avatar_url: "",
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      full_name: "Jane Smith",
      role: "admin",
      status: "active",
      created_at: "2025-01-20T09:15:00Z",
      last_sign_in: "2025-03-27T08:30:00Z",
      wallets_count: 2,
      avatar_url: "",
    },
    {
      id: "3",
      email: "robert.johnson@example.com",
      full_name: "Robert Johnson",
      role: "user",
      status: "suspended",
      created_at: "2025-02-05T11:20:00Z",
      last_sign_in: "2025-03-10T16:45:00Z",
      wallets_count: 1,
      avatar_url: "",
    },
    {
      id: "4",
      email: "sarah.williams@example.com",
      full_name: "Sarah Williams",
      role: "user",
      status: "active",
      created_at: "2025-02-10T14:30:00Z",
      last_sign_in: "2025-03-25T09:15:00Z",
      wallets_count: 2,
      avatar_url: "",
    },
    {
      id: "5",
      email: "michael.brown@example.com",
      full_name: "Michael Brown",
      role: "user",
      status: "inactive",
      created_at: "2025-02-15T08:45:00Z",
      last_sign_in: "2025-03-01T10:30:00Z",
      wallets_count: 0,
      avatar_url: "",
    },
    {
      id: "6",
      email: "emily.davis@example.com",
      full_name: "Emily Davis",
      role: "admin",
      status: "active",
      created_at: "2025-02-20T13:15:00Z",
      last_sign_in: "2025-03-27T11:45:00Z",
      wallets_count: 1,
      avatar_url: "",
    },
    {
      id: "7",
      email: "david.miller@example.com",
      full_name: "David Miller",
      role: "user",
      status: "pending",
      created_at: "2025-03-01T09:30:00Z",
      last_sign_in: null,
      wallets_count: 0,
      avatar_url: "",
    },
    {
      id: "8",
      email: "olivia.wilson@example.com",
      full_name: "Olivia Wilson",
      role: "user",
      status: "active",
      created_at: "2025-03-05T15:45:00Z",
      last_sign_in: "2025-03-26T13:30:00Z",
      wallets_count: 1,
      avatar_url: "",
    },
  ];

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
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Admin
          </Badge>
        );
      case "user":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
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

  const handleDeleteUser = (userId: string) => {
    // This will be implemented with Supabase later
    console.log("Delete user:", userId);
    setShowDeleteDialog(false);
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
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage all user accounts in the system
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 md:w-[250px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Export users</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="space-y-2">
                <Label htmlFor="role-filter">Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger id="role-filter" className="w-full">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="w-full">
                    <SelectValue placeholder="Filter by status" />
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wallets</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url} alt={user.full_name} />
                            <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.wallets_count}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>{formatDate(user.last_sign_in)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/users/${user.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/users/${user.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit User</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/users/${user.id}/suspend`}>
                                  <Lock className="mr-2 h-4 w-4" />
                                  <span>Suspend User</span>
                                </Link>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/users/${user.id}/activate`}>
                                  <Unlock className="mr-2 h-4 w-4" />
                                  <span>Activate User</span>
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/users/${user.id}/impersonate`}>
                                <UserCog className="mr-2 h-4 w-4" />
                                <span>Impersonate</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete User</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </CardFooter>
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
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
