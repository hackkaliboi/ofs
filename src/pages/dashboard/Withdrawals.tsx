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
import { ArrowDownToLine, Plus, MoreVertical, ExternalLink, Eye, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const Withdrawals = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - will be replaced with Supabase data later
  const withdrawals = [
    {
      id: "1",
      wallet_name: "Main Ethereum Wallet",
      wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
      amount: "0.5 ETH",
      destination: "0xabcdef1234567890abcdef1234567890abcdef12",
      status: "completed",
      transaction_hash: "0x9876543210fedcba9876543210fedcba98765432",
      created_at: "2025-03-15T10:30:00Z",
      completed_at: "2025-03-15T14:45:00Z",
    },
    {
      id: "2",
      wallet_name: "Polygon Wallet",
      wallet_address: "0xabcdef1234567890abcdef1234567890abcdef12",
      amount: "100 MATIC",
      destination: "0x7890abcdef1234567890abcdef1234567890abcd",
      status: "pending",
      transaction_hash: null,
      created_at: "2025-03-20T09:15:00Z",
      completed_at: null,
    },
    {
      id: "3",
      wallet_name: "Solana Wallet",
      wallet_address: "8ZUfTVPNuSPdMFkZ7z3iWZQmMVNbQnqmqoDpMcX7RLbL",
      amount: "5 SOL",
      destination: "9ZUfTVPNuSPdMFkZ7z3iWZQmMVNbQnqmqoDpMcX7RLbM",
      status: "rejected",
      transaction_hash: null,
      created_at: "2025-03-18T11:20:00Z",
      completed_at: "2025-03-19T08:30:00Z",
    },
    {
      id: "4",
      wallet_name: "Main Ethereum Wallet",
      wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
      amount: "1.2 ETH",
      destination: "0x2345678901abcdef2345678901abcdef23456789",
      status: "processing",
      transaction_hash: "0xabcdef1234567890abcdef1234567890abcdef12",
      created_at: "2025-03-22T16:45:00Z",
      completed_at: null,
    },
  ];

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const query = searchQuery.toLowerCase();
    return (
      withdrawal.wallet_name.toLowerCase().includes(query) ||
      withdrawal.wallet_address.toLowerCase().includes(query) ||
      withdrawal.amount.toLowerCase().includes(query) ||
      withdrawal.destination.toLowerCase().includes(query) ||
      withdrawal.status.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
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
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

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

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>
                View and manage your withdrawal requests
              </CardDescription>
            </div>
            <div className="w-full md:w-auto">
              <Input
                placeholder="Search withdrawals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Withdrawals</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No withdrawals found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWithdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell className="font-medium">
                            {withdrawal.wallet_name}
                          </TableCell>
                          <TableCell>{withdrawal.amount}</TableCell>
                          <TableCell>{truncateAddress(withdrawal.destination)}</TableCell>
                          <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                          <TableCell>{formatDate(withdrawal.created_at)}</TableCell>
                          <TableCell>{formatDate(withdrawal.completed_at)}</TableCell>
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
                                  <Link to={`/dashboard/withdrawals/${withdrawal.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                  </Link>
                                </DropdownMenuItem>
                                {withdrawal.transaction_hash && (
                                  <DropdownMenuItem asChild>
                                    <a
                                      href={`https://etherscan.io/tx/${withdrawal.transaction_hash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      <span>View Transaction</span>
                                    </a>
                                  </DropdownMenuItem>
                                )}
                                {withdrawal.status === "pending" && (
                                  <DropdownMenuSeparator />
                                )}
                                {withdrawal.status === "pending" && (
                                  <DropdownMenuItem asChild>
                                    <Link to={`/dashboard/withdrawals/${withdrawal.id}/cancel`}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      <span>Cancel Request</span>
                                    </Link>
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
            </TabsContent>
            <TabsContent value="pending">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.filter(w => w.status === "pending" || w.status === "processing").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No pending withdrawals found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWithdrawals
                        .filter(w => w.status === "pending" || w.status === "processing")
                        .map((withdrawal) => (
                          <TableRow key={withdrawal.id}>
                            <TableCell className="font-medium">
                              {withdrawal.wallet_name}
                            </TableCell>
                            <TableCell>{withdrawal.amount}</TableCell>
                            <TableCell>{truncateAddress(withdrawal.destination)}</TableCell>
                            <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                            <TableCell>{formatDate(withdrawal.created_at)}</TableCell>
                            <TableCell>{formatDate(withdrawal.completed_at)}</TableCell>
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
                                    <Link to={`/dashboard/withdrawals/${withdrawal.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  {withdrawal.status === "pending" && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem asChild>
                                        <Link to={`/dashboard/withdrawals/${withdrawal.id}/cancel`}>
                                          <XCircle className="mr-2 h-4 w-4" />
                                          <span>Cancel Request</span>
                                        </Link>
                                      </DropdownMenuItem>
                                    </>
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
            </TabsContent>
            <TabsContent value="completed">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.filter(w => w.status === "completed" || w.status === "rejected").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No completed withdrawals found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWithdrawals
                        .filter(w => w.status === "completed" || w.status === "rejected")
                        .map((withdrawal) => (
                          <TableRow key={withdrawal.id}>
                            <TableCell className="font-medium">
                              {withdrawal.wallet_name}
                            </TableCell>
                            <TableCell>{withdrawal.amount}</TableCell>
                            <TableCell>{truncateAddress(withdrawal.destination)}</TableCell>
                            <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                            <TableCell>{formatDate(withdrawal.created_at)}</TableCell>
                            <TableCell>{formatDate(withdrawal.completed_at)}</TableCell>
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
                                    <Link to={`/dashboard/withdrawals/${withdrawal.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  {withdrawal.transaction_hash && (
                                    <DropdownMenuItem asChild>
                                      <a
                                        href={`https://etherscan.io/tx/${withdrawal.transaction_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        <span>View Transaction</span>
                                      </a>
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
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredWithdrawals.length} of {withdrawals.length} withdrawals
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Withdrawal Process
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Withdrawal Process</DialogTitle>
                <DialogDescription>
                  Learn how the withdrawal process works and what to expect
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <h4 className="text-sm font-medium">Withdrawal Steps:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Submit a withdrawal request from a validated wallet</li>
                  <li>Our team reviews the request (typically within 24 hours)</li>
                  <li>Once approved, the transaction is processed on the blockchain</li>
                  <li>Funds are sent to your specified destination address</li>
                  <li>Transaction is marked as completed with a verifiable transaction hash</li>
                </ol>
                <h4 className="text-sm font-medium">Important Notes:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Only validated wallets can request withdrawals</li>
                  <li>Processing times may vary based on blockchain network conditions</li>
                  <li>Network fees are deducted from the withdrawal amount</li>
                  <li>Minimum withdrawal amounts apply based on the blockchain</li>
                </ul>
              </div>
              <DialogFooter>
                <Button asChild>
                  <Link to="/dashboard/withdrawals/new">
                    New Withdrawal Request
                  </Link>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Withdrawals;
