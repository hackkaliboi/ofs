import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Shield, 
  Plus, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search,
  User,
  FileCheck,
  XCircle,
  Loader2
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useKycVerification } from "@/hooks/useKycVerification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const KYCManagement = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock KYC documents data
  const mockDocuments = [
    {
      id: "doc-1",
      user_id: "user-1",
      document_type: "Passport",
      document_number: "P123456789",
      front_image_url: "https://placehold.co/600x400?text=Passport+Front",
      back_image_url: "https://placehold.co/600x400?text=Passport+Back",
      selfie_image_url: "https://placehold.co/400x400?text=Selfie",
      status: "pending",
      submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      profiles: {
        full_name: "John Smith",
        email: "john.smith@example.com",
        avatar_url: null
      }
    },
    {
      id: "doc-2",
      user_id: "user-2",
      document_type: "Driver's License",
      document_number: "DL98765432",
      front_image_url: "https://placehold.co/600x400?text=License+Front",
      back_image_url: "https://placehold.co/600x400?text=License+Back",
      selfie_image_url: null,
      status: "approved",
      submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      reviewed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      profiles: {
        full_name: "Jane Doe",
        email: "jane.doe@example.com",
        avatar_url: null
      }
    },
    {
      id: "doc-3",
      user_id: "user-3",
      document_type: "National ID",
      document_number: "ID87654321",
      front_image_url: "https://placehold.co/600x400?text=ID+Front",
      back_image_url: "https://placehold.co/600x400?text=ID+Back",
      selfie_image_url: "https://placehold.co/400x400?text=Selfie",
      status: "rejected",
      submitted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      reviewed_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      rejection_reason: "Document is expired",
      profiles: {
        full_name: "Robert Johnson",
        email: "robert.johnson@example.com",
        avatar_url: null
      }
    }
  ];
  
  // State for loading and error simulation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock update function
  const updateKycStatus = async (documentId, status, notes) => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: status === "approved" ? "Document Approved" : "Document Rejected",
      description: status === "approved" 
        ? "The KYC document has been approved successfully." 
        : "The KYC document has been rejected.",
    });
    
    return true;
  };
  
  // Mock refresh function
  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  // Filter KYC requests based on search and status filter
  const filteredRequests = mockDocuments.filter((request) => {
    const matchesSearch = searchQuery === "" || 
      request.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.document_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.document_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle approving a document
  const handleApprove = async () => {
    if (!selectedDocument) return;
    
    setIsProcessing(true);
    const success = await updateKycStatus(selectedDocument.id, "approved", reviewNotes);
    
    if (success) {
      toast({
        title: "Document Approved",
        description: "The KYC document has been approved successfully.",
      });
      setShowReviewDialog(false);
      setReviewNotes("");
      setSelectedDocument(null);
    }
    
    setIsProcessing(false);
  };
  
  // Handle rejecting a document
  const handleReject = async () => {
    if (!selectedDocument) return;
    
    setIsProcessing(true);
    const success = await updateKycStatus(selectedDocument.id, "rejected", reviewNotes);
    
    if (success) {
      toast({
        title: "Document Rejected",
        description: "The KYC document has been rejected.",
      });
      setShowReviewDialog(false);
      setReviewNotes("");
      setSelectedDocument(null);
    }
    
    setIsProcessing(false);
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
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
            <XCircle className="mr-1 h-3 w-3" /> Rejected
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
  
  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "?";
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
          <h1 className="text-2xl font-bold tracking-tight">KYC Management</h1>
          <p className="text-muted-foreground">
            Verify and manage user identity documents
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>KYC Requests</CardTitle>
              <CardDescription>
                Review and verify user identity documents
              </CardDescription>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, document type, or number..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was an error loading KYC documents. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading KYC documents...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No KYC requests found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-md">
                {searchQuery || statusFilter !== "all"
                  ? "No KYC requests match your search criteria. Try different filters."
                  : "There are no KYC requests in the system yet."}
              </p>
              <Button variant="outline" onClick={refresh}>
                <Loader2 className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Document Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {request.profiles?.avatar_url ? (
                              <AvatarImage src={request.profiles.avatar_url} alt={request.profiles.full_name} />
                            ) : null}
                            <AvatarFallback>
                              {getUserInitials(request.profiles?.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.profiles?.full_name || "Unknown User"}</div>
                            <div className="text-sm text-muted-foreground">{request.profiles?.email || "No email"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.document_type || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {request.document_number || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        {formatDate(request.submitted_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => window.open(request.front_image_url, '_blank')}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Front Image</span>
                            </DropdownMenuItem>
                            {request.back_image_url && (
                              <DropdownMenuItem onClick={() => window.open(request.back_image_url, '_blank')}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Back Image</span>
                              </DropdownMenuItem>
                            )}
                            {request.selfie_image_url && (
                              <DropdownMenuItem onClick={() => window.open(request.selfie_image_url, '_blank')}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Selfie</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {request.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedDocument(request);
                                  setShowReviewDialog(true);
                                }}>
                                  <FileCheck className="mr-2 h-4 w-4" />
                                  <span>Review</span>
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
        </CardContent>
      </Card>
      
      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review KYC Document</DialogTitle>
            <DialogDescription>
              Approve or reject this KYC document submission.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">User</h4>
                  <p className="text-sm">{selectedDocument.profiles?.full_name || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Email</h4>
                  <p className="text-sm">{selectedDocument.profiles?.email || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Document Type</h4>
                  <p className="text-sm">{selectedDocument.document_type || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Document Number</h4>
                  <p className="text-sm">{selectedDocument.document_number || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Submitted</h4>
                  <p className="text-sm">{formatDate(selectedDocument.submitted_at)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Review Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter notes about this document (optional)"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(selectedDocument.front_image_url, '_blank')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Document
                </Button>
                {selectedDocument.selfie_image_url && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(selectedDocument.selfie_image_url, '_blank')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Selfie
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                Reject
              </Button>
              <Button
                variant="default"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Approve
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Export the component with both names for compatibility
export { KYCManagement as default, KYCManagement };
