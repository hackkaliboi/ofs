import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Shield, Plus, MoreVertical, Eye, CheckCircle, Clock, AlertCircle, XCircle, HelpCircle, Search, Filter, Mail, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useKycVerifications } from "@/hooks/useKycVerifications";
import { useWalletConnections } from "@/hooks/useWalletConnections";

const KYC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showKycForm, setShowKycForm] = useState(false);
  const [kycFormData, setKycFormData] = useState({
    documentType: "passport",
    documentNumber: "",
    fullName: "",
    dateOfBirth: "",
    country: "",
    address: "",
    walletId: "",
    additionalInfo: ""
  });
  
  // Use our real-time KYC hook
  const { 
    kycVerifications, 
    loading, 
    error, 
    stats,
    submitKycVerification 
  } = useKycVerifications();
  
  // Get wallet connections for the KYC form
  const { walletConnections, loading: walletsLoading } = useWalletConnections();

  // Filter KYC requests based on search query and active tab
  const filteredKycRequests = kycVerifications.filter((kyc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      (kyc.document_type || '').toLowerCase().includes(query) ||
      kyc.status.toLowerCase().includes(query)
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

  // Handle input change in KYC form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKycFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select change in KYC form
  const handleSelectChange = (name, value) => {
    setKycFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submitting a new KYC request
  const handleSubmitKyc = async (e) => {
    e?.preventDefault();
    try {
      // Create metadata with all the form data
      const metadata = {
        ...kycFormData,
        submittedBy: user?.email || user?.id
      };
      
      await submitKycVerification(kycFormData.documentType, metadata, kycFormData.walletId);
      setShowKycForm(false);
      
      // Reset form data
      setKycFormData({
        documentType: "passport",
        documentNumber: "",
        fullName: "",
        dateOfBirth: "",
        country: "",
        address: "",
        walletId: "",
        additionalInfo: ""
      });
    } catch (error) {
      console.error("Error submitting KYC verification:", error);
    }
  };

  if (loading || walletsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading KYC data...</h2>
        <p className="text-muted-foreground">Please wait while we fetch your verification information</p>
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
          <h1 className="text-2xl font-bold tracking-tight">KYC Center</h1>
          <p className="text-muted-foreground">
            Verify your identity and wallet ownership
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showKycForm} onOpenChange={setShowKycForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New KYC Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Submit KYC Verification</DialogTitle>
                <DialogDescription>
                  Please provide your identity information for verification. All information will be kept confidential.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitKyc}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="documentType">Document Type</Label>
                      <Select 
                        value={kycFormData.documentType} 
                        onValueChange={(value) => handleSelectChange("documentType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                          <SelectItem value="residence_permit">Residence Permit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">Document Number</Label>
                      <Input 
                        id="documentNumber" 
                        name="documentNumber" 
                        value={kycFormData.documentNumber}
                        onChange={handleInputChange}
                        placeholder="Enter document number"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        value={kycFormData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input 
                        id="dateOfBirth" 
                        name="dateOfBirth" 
                        type="date" 
                        value={kycFormData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        name="country" 
                        value={kycFormData.country}
                        onChange={handleInputChange}
                        placeholder="Enter your country"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletId">Wallet to Verify</Label>
                      <Select 
                        value={kycFormData.walletId} 
                        onValueChange={(value) => handleSelectChange("walletId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          {walletConnections.length === 0 ? (
                            <SelectItem value="" disabled>No wallets connected</SelectItem>
                          ) : (
                            walletConnections.map(wallet => (
                              <SelectItem key={wallet.id} value={wallet.id}>
                                {wallet.wallet_address.substring(0, 6)}...{wallet.wallet_address.substring(wallet.wallet_address.length - 4)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Residential Address</Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      value={kycFormData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea 
                      id="additionalInfo" 
                      name="additionalInfo" 
                      value={kycFormData.additionalInfo}
                      onChange={handleInputChange}
                      placeholder="Any additional information you'd like to provide"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Document Upload</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Drag and drop your document here or click to browse</p>
                      <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                      <Button type="button" variant="outline" size="sm" className="mt-2">
                        Upload Document
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Document upload is currently in development. Please submit the form without uploading for now.
                    </p>
                  </div>
                </div>
                <Alert className="mb-4">
                  <HelpCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    By submitting this form, you confirm that all information provided is accurate and belongs to you. 
                    Providing false information may result in account termination.
                  </AlertDescription>
                </Alert>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowKycForm(false)}>Cancel</Button>
                  <Button type="submit" disabled={!kycFormData.walletId}>Submit Verification</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
          <CardTitle>KYC Verifications</CardTitle>
          <CardDescription>
            View and manage your KYC verification requests
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
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
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
                    ? `You don't have any ${activeTab} KYC verifications` 
                    : "Submit a new KYC verification to get started"}
              </p>
              {!searchQuery && activeTab === "all" && (
                <Button onClick={() => setShowKycForm(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New KYC Request
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completed Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKycRequests.map((kyc) => (
                  <TableRow key={kyc.id}>
                    <TableCell className="font-medium">
                      {kyc.document_type || "ID Document"}
                    </TableCell>
                    <TableCell>{formatDate(kyc.submitted_at)}</TableCell>
                    <TableCell>{getStatusBadge(kyc.status)}</TableCell>
                    <TableCell>
                      {kyc.status === "approved" 
                        ? formatDate(kyc.verified_at) 
                        : kyc.status === "rejected" 
                          ? formatDate(kyc.rejected_at) 
                          : "Pending"}
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
                            View Details
                          </DropdownMenuItem>
                          {kyc.status === "rejected" && (
                            <DropdownMenuItem onClick={() => setShowKycForm(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Submit New
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KYC Information</CardTitle>
          <CardDescription>
            Learn about our KYC verification process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <HelpCircle className="h-4 w-4" />
            <AlertTitle>What is KYC?</AlertTitle>
            <AlertDescription>
              Know Your Customer (KYC) is a process that verifies the identity of users on our platform. This helps prevent fraud and ensures compliance with regulations.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h3 className="font-medium">KYC Process</h3>
            <p className="text-sm text-muted-foreground">
              Our KYC process typically involves the following steps:
            </p>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Submit your identification documents</li>
              <li>Our team reviews your submission</li>
              <li>You receive approval or feedback if additional information is needed</li>
              <li>Once approved, your account is fully verified</li>
            </ol>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="font-medium">Acceptable Documents</h3>
            <p className="text-sm text-muted-foreground">
              We accept the following documents for KYC verification:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Government-issued ID (passport, driver's license, ID card)</li>
              <li>Proof of address (utility bill, bank statement)</li>
              <li>Selfie with your ID document</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYC;
