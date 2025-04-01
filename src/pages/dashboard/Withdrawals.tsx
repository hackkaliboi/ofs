import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ArrowDownToLine, Plus, MoreVertical, ExternalLink, Eye, CheckCircle, Clock, AlertCircle, XCircle, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWithdrawals } from "@/hooks/useWithdrawals";

const Withdrawals = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Use our real-time withdrawals hook
  const { 
    withdrawals, 
    loading, 
    error, 
    stats,
    requestWithdrawal,
    updateWithdrawal
  } = useWithdrawals();

  // Filter withdrawals based on search query and active tab
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      (withdrawal.wallet_address || '').toLowerCase().includes(query) ||
      (withdrawal.amount?.toString() || '').toLowerCase().includes(query) ||
      (withdrawal.currency || '').toLowerCase().includes(query) ||
      withdrawal.status.toLowerCase().includes(query)
    );
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && withdrawal.status === "pending";
    if (activeTab === "completed") return matchesSearch && withdrawal.status === "processed";
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateAddress = (address: string) => {
    if (!address) return "N/A";
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatAmount = (amount: number, currency: string = 'ETH') => {
    return `${parseFloat(amount.toString()).toFixed(4)} ${currency}`;
  };

  // Handle withdrawal cancellation by updating status to "rejected"
  const handleCancelWithdrawal = async (withdrawalId: string) => {
    try {
      await updateWithdrawal(withdrawalId, "rejected", undefined, "Cancelled by user");
      // No need to update state manually as the real-time subscription will handle it
    } catch (error) {
      console.error("Error cancelling withdrawal:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading withdrawals...</h2>
        <p className="text-muted-foreground">Please wait while we fetch your withdrawal data</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load withdrawal data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Withdrawals</h1>
          <p className="text-muted-foreground">
            Manage your withdrawal requests
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/withdrawals/new">
            <Plus className="mr-2 h-4 w-4" />
            New Withdrawal
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {stats.processed}
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {stats.pending}
              </div>
              <div className="p-2 rounded-full bg-yellow-100">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {stats.rejected}
              </div>
              <div className="p-2 rounded-full bg-red-100">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>
                View and manage your withdrawal requests
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search withdrawals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 md:w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Withdrawals</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            {filteredWithdrawals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ArrowDownToLine className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No withdrawals found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery 
                    ? "No withdrawals match your search criteria" 
                    : activeTab !== "all" 
                      ? `You don't have any ${activeTab} withdrawals` 
                      : "You haven't made any withdrawal requests yet"}
                </p>
                {!searchQuery && (
                  <Button asChild size="sm">
                    <Link to="/dashboard/withdrawals/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Withdrawal
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium">
                          {truncateAddress(withdrawal.wallet_address || '')}
                        </TableCell>
                        <TableCell>
                          {formatAmount(withdrawal.amount, withdrawal.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                        <TableCell>{formatDate(withdrawal.requested_at)}</TableCell>
                        <TableCell>
                          {withdrawal.status === "processed" 
                            ? formatDate(withdrawal.processed_at) 
                            : withdrawal.status === "rejected" 
                              ? formatDate(withdrawal.rejected_at) 
                              : "Pending"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {withdrawal.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleCancelWithdrawal(withdrawal.id)}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Request
                                  </DropdownMenuItem>
                                </>
                              )}
                              {withdrawal.status === "processed" && withdrawal.transaction_hash && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <a 
                                      href={`https://etherscan.io/tx/${withdrawal.transaction_hash}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      View Transaction
                                    </a>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Withdrawals</CardTitle>
          <CardDescription>
            Learn about our withdrawal process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              Withdrawals are processed within 24-48 hours. Make sure your wallet address is correct before submitting a request.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h3 className="font-medium">Withdrawal Process</h3>
            <p className="text-sm text-muted-foreground">
              Our withdrawal process typically involves the following steps:
            </p>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Submit your withdrawal request with the desired amount and destination wallet</li>
              <li>Our team reviews your request (typically within 24 hours)</li>
              <li>Once approved, funds are transferred to your destination wallet</li>
              <li>You'll receive a confirmation with transaction details</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Withdrawal Fees</h3>
            <p className="text-sm text-muted-foreground">
              Withdrawal fees vary depending on the blockchain network and current gas prices:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Ethereum: Variable based on network congestion</li>
              <li>Polygon: Typically lower than Ethereum</li>
              <li>Solana: Very low fees</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Withdrawals;
