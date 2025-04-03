import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowDownToLine, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search,
  User,
  Wallet,
  DollarSign
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/lib/supabase";

const WithdrawalManagement = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  
  // Stats for withdrawal requests
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    rejected: 0
  });
  
  // Sample data for reference only
  const sampleWithdrawals = [
    {
      id: "1",
      user_id: "1",
      user_name: "John Doe",
      user_email: "john.doe@example.com",
      wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
      amount: "1.25",
      currency: "ETH",
      status: "completed",
      created_at: "2025-03-15T10:30:00Z",
      completed_at: "2025-03-16T14:20:00Z",
      transaction_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    },
    {
      id: "2",
      user_id: "2",
      user_name: "Jane Smith",
      user_email: "jane.smith@example.com",
      wallet_address: "0x2345678901abcdef2345678901abcdef23456789",
      amount: "500",
      currency: "USDT",
      status: "pending",
      created_at: "2025-03-20T14:45:00Z",
    },
    {
      id: "3",
      user_id: "3",
      user_name: "Robert Johnson",
      user_email: "robert.johnson@example.com",
      wallet_address: "0x3456789012abcdef3456789012abcdef34567890",
      amount: "0.75",
      currency: "BTC",
      status: "rejected",
      created_at: "2025-03-18T09:15:00Z",
      rejection_reason: "Insufficient funds"
    },
  ];
  
  // Function to fetch withdrawal requests from Supabase
  const fetchWithdrawals = async () => {
    setLoading(true);
    
    try {
      // Fetch withdrawals with user information
      const { data, error } = await supabase
        .from('withdrawals')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process the data to match our component's expected format
      const processedData = data.map(item => ({
        ...item,
        user_name: item.profiles?.full_name || 'Unknown User',
        user_email: item.profiles?.email || 'No email',
        currency: item.token
      }));
      
      setWithdrawals(processedData || []);
      
      // Calculate stats
      if (data) {
        setStats({
          total: data.length,
          pending: data.filter(w => w.status === 'pending').length,
          completed: data.filter(w => w.status === 'completed').length,
          rejected: data.filter(w => w.status === 'rejected').length
        });
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWithdrawals();
  }, []);
  
  // Filter withdrawals based on search and status filter
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch = 
      withdrawal.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.wallet_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.amount.includes(searchQuery) ||
      withdrawal.currency.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Update withdrawal status
  const updateWithdrawalStatus = async (withdrawalId, newStatus) => {
    try {
      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      // Add completed_at if status is completed
      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString();
      }
      
      // Update the withdrawal in Supabase
      const { error } = await supabase
        .from('withdrawals')
        .update(updateData)
        .eq('id', withdrawalId);
      
      if (error) throw error;
      
      // Refresh the withdrawals list
      await fetchWithdrawals();
      
      // Show success message
      console.log(`Withdrawal ${withdrawalId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            <AlertTriangle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge>
            {status}
          </Badge>
        );
    }
  };
  
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
  
  // Truncate wallet address
  const truncateAddress = (address) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Withdrawal Management</h1>
          <p className="text-muted-foreground">
            Review and process user withdrawal requests
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All withdrawal requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Declined withdrawals</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Withdrawal Requests</CardTitle>
              <CardDescription>
                Manage user withdrawal requests
              </CardDescription>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <ArrowDownToLine className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or wallet address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Withdrawals Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                        <p className="text-muted-foreground">Loading withdrawal requests...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredWithdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <ArrowDownToLine className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No withdrawal requests found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{withdrawal.user_name}</div>
                            <div className="text-xs text-muted-foreground">{withdrawal.user_email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{withdrawal.amount} {withdrawal.currency}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-mono">{truncateAddress(withdrawal.wallet_address)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(withdrawal.status)}
                      </TableCell>
                      <TableCell>
                        {formatDate(withdrawal.created_at)}
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
                            <DropdownMenuItem>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {withdrawal.status !== "completed" && (
                              <DropdownMenuItem
                                onClick={() => updateWithdrawalStatus(withdrawal.id, "completed")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Mark as Completed
                              </DropdownMenuItem>
                            )}
                            {withdrawal.status !== "rejected" && (
                              <DropdownMenuItem
                                onClick={() => updateWithdrawalStatus(withdrawal.id, "rejected")}
                              >
                                <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                                Reject
                              </DropdownMenuItem>
                            )}
                            {withdrawal.status !== "pending" && (
                              <DropdownMenuItem
                                onClick={() => updateWithdrawalStatus(withdrawal.id, "pending")}
                              >
                                <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                                Mark as Pending
                              </DropdownMenuItem>
                            )}
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
      </Card>
    </div>
  );
};

// Export the component with both names for compatibility
export { WithdrawalManagement as default, WithdrawalManagement };
