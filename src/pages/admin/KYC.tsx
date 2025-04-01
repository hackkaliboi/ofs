import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Shield, MoreVertical, Eye, CheckCircle, Clock, AlertCircle, XCircle, Search, Filter, Mail, Loader2, ThumbsUp, ThumbsDown, User, FileText, Calendar, MapPin, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useKycVerifications } from "@/hooks/useKycVerifications";
import { useWalletConnections } from "@/hooks/useWalletConnections";
import { useUsers } from "@/hooks/useUsers";

const KYCManagement = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  
  // Use our real-time KYC hook
  const { 
    kycVerifications, 
    loading, 
    error, 
    stats,
    updateKycVerification 
  } = useKycVerifications();
  
  // Get users for additional info
  const { users, loading: usersLoading } = useUsers();
  
  // Get wallet connections for verification
  const { walletConnections, loading: walletsLoading } = useWalletConnections();

  // Filter KYC requests based on search query and active tab
  const filteredKycRequests = kycVerifications.filter((kyc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      (kyc.document_type || '').toLowerCase().includes(query) ||
      kyc.status.toLowerCase().includes(query) ||
      (kyc.user_id || '').toLowerCase().includes(query)
    );
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "approved") return matchesSearch && kyc.status === "approved";
    if (activeTab === "pending") return matchesSearch && kyc.status === "pending";
    if (activeTab === "rejected") return matchesSearch && kyc.status === "rejected";
    
    return matchesSearch;
  });

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

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
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

  // Handle approving a KYC request
  const handleApproveKyc = async (kycId) => {
    try {
      await updateKycVerification(kycId, "approved");
      setReviewDialog(false);
      setSelectedKyc(null);
    } catch (error) {
      console.error("Error approving KYC verification:", error);
    }
  };

  // Handle rejecting a KYC request
  const handleRejectKyc = async (kycId) => {
    try {
      await updateKycVerification(kycId, "rejected", rejectionReason);
      setReviewDialog(false);
      setSelectedKyc(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting KYC verification:", error);
    }
  };

  // Get user information by ID
  const getUserInfo = (userId) => {
    if (!users || !userId) return null;
    return users.find(u => u.id === userId);
  };

  // Get wallet information by ID
  const getWalletInfo = (walletId) => {
    if (!walletConnections || !walletId) return null;
    return walletConnections.find(w => w.id === walletId);
  };

  // Open review dialog
  const openReviewDialog = (kyc) => {
    setSelectedKyc(kyc);
    setReviewDialog(true);
  };

  if (loading || usersLoading || walletsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading KYC data...</h2>
        <p className="text-muted-foreground">Please wait while we fetch verification information</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load KYC verification data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">KYC Management</h1>
          <p className="text-muted-foreground">
            Review and manage user identity verifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {stats.approved}
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected KYC</CardTitle>
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
          <CardTitle>KYC Verification Requests</CardTitle>
          <CardDescription>
            Review and manage user identity verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                placeholder="Search verifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[300px]"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredKycRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No KYC verifications found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery 
                  ? "No verifications match your search criteria" 
                  : activeTab !== "all" 
                    ? `There are no ${activeTab} KYC verifications` 
                    : "No KYC verification requests have been submitted yet"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKycRequests.map((kyc) => {
                  const userInfo = getUserInfo(kyc.user_id);
                  return (
                    <TableRow key={kyc.id}>
                      <TableCell className="font-medium">
                        {userInfo ? userInfo.email : kyc.user_id}
                      </TableCell>
                      <TableCell>
                        {kyc.document_type || "ID Document"}
                      </TableCell>
                      <TableCell>{formatDate(kyc.submitted_at)}</TableCell>
                      <TableCell>{getStatusBadge(kyc.status)}</TableCell>
                      <TableCell>
                        {kyc.status === "approved" 
                          ? formatDate(kyc.verified_at) 
                          : kyc.status === "rejected" 
                            ? formatDate(kyc.rejected_at) 
                            : "Awaiting Review"}
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
                            <DropdownMenuItem onClick={() => openReviewDialog(kyc)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Review Details
                            </DropdownMenuItem>
                            {kyc.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleApproveKyc(kyc.id)}>
                                  <ThumbsUp className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openReviewDialog(kyc)}>
                                  <ThumbsDown className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* KYC Review Dialog */}
      {selectedKyc && (
        <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>KYC Verification Review</DialogTitle>
              <DialogDescription>
                Review the user's identity verification details
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Verification Details</h3>
                {getStatusBadge(selectedKyc.status)}
              </div>
              
              <Separator />
              
              {/* User Information */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Personal Information
                </h4>
                
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedKyc.metadata?.fullName || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{selectedKyc.metadata?.dateOfBirth ? formatDate(selectedKyc.metadata.dateOfBirth) : "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{selectedKyc.metadata?.country || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-medium">{selectedKyc.user_id}</p>
                  </div>
                </div>
              </div>
              
              {/* Document Information */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Document Information
                </h4>
                
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Document Type</p>
                    <p className="font-medium">{selectedKyc.document_type || "ID Document"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Document Number</p>
                    <p className="font-medium">{selectedKyc.metadata?.documentNumber || "Not provided"}</p>
                  </div>
                </div>
              </div>
              
              {/* Address Information */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address Information
                </h4>
                
                <div className="pl-6">
                  <p className="text-sm text-muted-foreground">Residential Address</p>
                  <p className="font-medium">{selectedKyc.metadata?.address || "Not provided"}</p>
                </div>
              </div>
              
              {/* Wallet Information */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallet Information
                </h4>
                
                <div className="pl-6">
                  {selectedKyc.wallet_id ? (
                    <>
                      <p className="text-sm text-muted-foreground">Wallet Address</p>
                      <p className="font-medium font-mono text-sm">
                        {getWalletInfo(selectedKyc.wallet_id)?.wallet_address || "Wallet not found"}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No wallet associated with this verification</p>
                  )}
                </div>
              </div>
              
              {/* Additional Information */}
              {selectedKyc.metadata?.additionalInfo && (
                <div className="space-y-2">
                  <h4 className="font-medium">Additional Information</h4>
                  <p className="text-sm pl-6">{selectedKyc.metadata.additionalInfo}</p>
                </div>
              )}
              
              {/* Timestamps */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timeline
                </h4>
                
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium">{formatDate(selectedKyc.submitted_at)}</p>
                  </div>
                  {selectedKyc.status === "approved" && (
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="font-medium">{formatDate(selectedKyc.verified_at)}</p>
                    </div>
                  )}
                  {selectedKyc.status === "rejected" && (
                    <div>
                      <p className="text-sm text-muted-foreground">Rejected</p>
                      <p className="font-medium">{formatDate(selectedKyc.rejected_at)}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Rejection Reason (if rejected) */}
              {selectedKyc.status === "rejected" && selectedKyc.metadata?.reason && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-500">Rejection Reason</h4>
                  <p className="text-sm pl-6">{selectedKyc.metadata.reason}</p>
                </div>
              )}
              
              {/* Rejection Form (if pending) */}
              {selectedKyc.status === "pending" && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium">Decision</h4>
                  <div className="flex gap-4 pl-6">
                    <Button 
                      variant="outline" 
                      className="border-green-500 text-green-500 hover:bg-green-50"
                      onClick={() => handleApproveKyc(selectedKyc.id)}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        if (rejectionReason) {
                          handleRejectKyc(selectedKyc.id);
                        }
                      }}
                      disabled={!rejectionReason}
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                  
                  <div className="pl-6 mt-2">
                    <Label htmlFor="rejectionReason">Rejection Reason (required for rejection)</Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Provide a reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setReviewDialog(false);
                setRejectionReason("");
              }}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardHeader>
          <CardTitle>KYC Verification Guidelines</CardTitle>
          <CardDescription>
            Best practices for reviewing identity verifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Process</AlertTitle>
            <AlertDescription>
              Follow these guidelines to ensure proper verification of user identities:
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h3 className="font-medium">Document Verification Checklist</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Verify that the document type matches the document image</li>
              <li>Check that the document is not expired</li>
              <li>Ensure the name matches across all provided information</li>
              <li>Verify the document appears authentic and unaltered</li>
              <li>Confirm the user's address information is complete</li>
            </ol>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="font-medium">Rejection Guidelines</h3>
            <p className="text-sm text-muted-foreground">
              Reject verification requests for the following reasons:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Document appears altered or fraudulent</li>
              <li>Information is incomplete or inconsistent</li>
              <li>Document is expired or invalid</li>
              <li>Image quality is too poor to verify details</li>
              <li>Suspicious patterns or multiple failed attempts</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Export the component with both names for compatibility
export { KYCManagement as default, KYCManagement };
