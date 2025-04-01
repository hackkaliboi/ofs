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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, Plus, MoreVertical, Eye, CheckCircle, Clock, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Validate = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - will be replaced with Supabase data later
  const kycRequests = [
    {
      id: "1",
      wallet_name: "Main Ethereum Wallet",
      wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
      kyc_type: "ownership",
      status: "approved",
      submitted_at: "2025-02-20T10:30:00Z",
      completed_at: "2025-02-21T14:45:00Z",
      notes: "Ownership verified through signed message",
    },
    {
      id: "2",
      wallet_name: "Polygon Wallet",
      wallet_address: "0xabcdef1234567890abcdef1234567890abcdef12",
      kyc_type: "ownership",
      status: "approved",
      submitted_at: "2025-02-25T09:15:00Z",
      completed_at: "2025-02-26T11:30:00Z",
      notes: "Ownership verified through signed message",
    },
    {
      id: "3",
      wallet_name: "Solana Wallet",
      wallet_address: "8ZUfTVPNuSPdMFkZ7z3iWZQmMVNbQnqmqoDpMcX7RLbL",
      kyc_type: "ownership",
      status: "pending",
      submitted_at: "2025-03-10T11:20:00Z",
      completed_at: null,
      notes: "Awaiting verification",
    },
    {
      id: "4",
      wallet_name: "Bitcoin Wallet",
      wallet_address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      kyc_type: "ownership",
      status: "rejected",
      submitted_at: "2025-03-05T16:45:00Z",
      completed_at: "2025-03-06T09:30:00Z",
      notes: "Failed to provide valid signature",
    },
  ];

  const filteredKycRequests = kycRequests.filter((kyc) => {
    const query = searchQuery.toLowerCase();
    return (
      kyc.wallet_name.toLowerCase().includes(query) ||
      kyc.wallet_address.toLowerCase().includes(query) ||
      kyc.kyc_type.toLowerCase().includes(query) ||
      kyc.status.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
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
          <h1 className="text-2xl font-bold tracking-tight">KYC Center</h1>
          <p className="text-muted-foreground">
            Verify your identity and wallet ownership
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/kyc/new">
            <Plus className="mr-2 h-4 w-4" />
            New KYC Request
          </Link>
        </Button>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Why is KYC required?</AlertTitle>
        <AlertDescription>
          KYC (Know Your Customer) is required to ensure security and prevent unauthorized access. 
          Only validated wallets can request withdrawals and access certain platform features.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>KYC History</CardTitle>
              <CardDescription>
                Track the status of your KYC submissions
              </CardDescription>
            </div>
            <div className="w-full md:w-auto">
              <Input
                placeholder="Search KYC requests..."
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
              <TabsTrigger value="all">All KYC Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKycRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No KYC requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredKycRequests.map((kyc) => (
                        <TableRow key={kyc.id}>
                          <TableCell className="font-medium">
                            {kyc.wallet_name}
                          </TableCell>
                          <TableCell>{truncateAddress(kyc.wallet_address)}</TableCell>
                          <TableCell className="capitalize">{kyc.kyc_type}</TableCell>
                          <TableCell>{getStatusBadge(kyc.status)}</TableCell>
                          <TableCell>{formatDate(kyc.submitted_at)}</TableCell>
                          <TableCell>{formatDate(kyc.completed_at)}</TableCell>
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
                                  <Link to={`/dashboard/kyc/${kyc.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                  </Link>
                                </DropdownMenuItem>
                                {kyc.status === "rejected" && (
                                  <DropdownMenuItem asChild>
                                    <Link to={`/dashboard/kyc/new?wallet=${kyc.wallet_address}`}>
                                      <Shield className="mr-2 h-4 w-4" />
                                      <span>Try Again</span>
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                {kyc.status === "pending" && (
                                  <DropdownMenuItem asChild>
                                    <Link to={`/dashboard/kyc/${kyc.id}/cancel`}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      <span>Cancel Request</span>
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link to="/dashboard/kyc/help">
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    <span>Get Help</span>
                                  </Link>
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
            </TabsContent>
            <TabsContent value="pending">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKycRequests.filter(kyc => kyc.status === "pending").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No pending KYC requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredKycRequests
                        .filter(kyc => kyc.status === "pending")
                        .map((kyc) => (
                          <TableRow key={kyc.id}>
                            <TableCell className="font-medium">
                              {kyc.wallet_name}
                            </TableCell>
                            <TableCell>{truncateAddress(kyc.wallet_address)}</TableCell>
                            <TableCell className="capitalize">{kyc.kyc_type}</TableCell>
                            <TableCell>{getStatusBadge(kyc.status)}</TableCell>
                            <TableCell>{formatDate(kyc.submitted_at)}</TableCell>
                            <TableCell>{formatDate(kyc.completed_at)}</TableCell>
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
                                    <Link to={`/dashboard/kyc/${kyc.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/dashboard/kyc/${kyc.id}/cancel`}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      <span>Cancel Request</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link to="/dashboard/kyc/help">
                                      <HelpCircle className="mr-2 h-4 w-4" />
                                      <span>Get Help</span>
                                    </Link>
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
            </TabsContent>
            <TabsContent value="approved">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKycRequests.filter(kyc => kyc.status === "approved").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No approved KYC requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredKycRequests
                        .filter(kyc => kyc.status === "approved")
                        .map((kyc) => (
                          <TableRow key={kyc.id}>
                            <TableCell className="font-medium">
                              {kyc.wallet_name}
                            </TableCell>
                            <TableCell>{truncateAddress(kyc.wallet_address)}</TableCell>
                            <TableCell className="capitalize">{kyc.kyc_type}</TableCell>
                            <TableCell>{getStatusBadge(kyc.status)}</TableCell>
                            <TableCell>{formatDate(kyc.submitted_at)}</TableCell>
                            <TableCell>{formatDate(kyc.completed_at)}</TableCell>
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
                                    <Link to={`/dashboard/kyc/${kyc.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link to="/dashboard/kyc/help">
                                      <HelpCircle className="mr-2 h-4 w-4" />
                                      <span>Get Help</span>
                                    </Link>
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
            </TabsContent>
            <TabsContent value="rejected">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKycRequests.filter(kyc => kyc.status === "rejected").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No rejected KYC requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredKycRequests
                        .filter(kyc => kyc.status === "rejected")
                        .map((kyc) => (
                          <TableRow key={kyc.id}>
                            <TableCell className="font-medium">
                              {kyc.wallet_name}
                            </TableCell>
                            <TableCell>{truncateAddress(kyc.wallet_address)}</TableCell>
                            <TableCell className="capitalize">{kyc.kyc_type}</TableCell>
                            <TableCell>{getStatusBadge(kyc.status)}</TableCell>
                            <TableCell>{formatDate(kyc.submitted_at)}</TableCell>
                            <TableCell>{formatDate(kyc.completed_at)}</TableCell>
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
                                    <Link to={`/dashboard/kyc/${kyc.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/dashboard/kyc/new?wallet=${kyc.wallet_address}`}>
                                      <Shield className="mr-2 h-4 w-4" />
                                      <span>Try Again</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link to="/dashboard/kyc/help">
                                      <HelpCircle className="mr-2 h-4 w-4" />
                                      <span>Get Help</span>
                                    </Link>
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
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredKycRequests.length} of {kycRequests.length} KYC requests
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline">
              <Link to="/dashboard/kyc/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                KYC Help
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/kyc/new">
                <Shield className="mr-2 h-4 w-4" />
                New KYC Request
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KYC Process</CardTitle>
          <CardDescription>
            Learn how the KYC process works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`rounded-lg p-4 border ${
                theme === "dark" ? "bg-card" : "bg-gray-50"
              }`}>
                <div className="flex items-center mb-3">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center mr-3">
                    1
                  </div>
                  <h3 className="font-medium">Submit Request</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add your wallet and submit it for KYC. You'll need to prove ownership by signing a message with your wallet.
                </p>
              </div>
              <div className={`rounded-lg p-4 border ${
                theme === "dark" ? "bg-card" : "bg-gray-50"
              }`}>
                <div className="flex items-center mb-3">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center mr-3">
                    2
                  </div>
                  <h3 className="font-medium">Verification</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our team reviews your KYC request and verifies the ownership proof. This typically takes 24-48 hours.
                </p>
              </div>
              <div className={`rounded-lg p-4 border ${
                theme === "dark" ? "bg-card" : "bg-gray-50"
              }`}>
                <div className="flex items-center mb-3">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center mr-3">
                    3
                  </div>
                  <h3 className="font-medium">Approval</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Once approved, your wallet is marked as verified and you can use it for withdrawals and other platform features.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Validate;
