import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Shield, 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Loader2,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { useWalletConnections } from "@/hooks/useWalletConnections";

const ValidateAssets = () => {
  const { user, profile } = useAuth();
  const { walletConnections, loading: walletsLoading, refreshWallets } = useWalletConnections();
  const [activeTab, setActiveTab] = useState("wallets");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [proofDescription, setProofDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Filter wallets that need validation
  const walletsNeedingValidation = walletConnections.filter(
    wallet => !wallet.validated && wallet.validation_status !== "validated"
  );

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshWallets();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Handle validation submission
  const handleSubmit = async (e: React.FormEvent, walletId: string) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Validation Submitted",
        description: "Your asset validation has been submitted for review.",
        variant: "default",
      });
      
      // Refresh wallets to show updated status
      await refreshWallets();
    } catch (error) {
      console.error("Validation submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your validation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
      setProofDescription("");
    }
  };

  // Get status badge for wallet
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validated":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Validated
          </Badge>
        );
      case "pending":
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            Needs Validation
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Validate Assets</h1>
          <p className="text-muted-foreground">
            Verify ownership of your wallets and assets
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallets">
            <Shield className="h-4 w-4 mr-2" />
            Wallet Validation
          </TabsTrigger>
          <TabsTrigger value="assets">
            <FileText className="h-4 w-4 mr-2" />
            Asset Proof
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallets" className="space-y-4">
          {walletsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your wallets...</p>
            </div>
          ) : walletsNeedingValidation.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-1">All Wallets Validated</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  All your connected wallets have been validated. If you connect a new wallet, it will appear here for validation.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Alert className="bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertTitle>Wallet Validation Required</AlertTitle>
                <AlertDescription>
                  Validate your wallets to enable withdrawals and other platform features. This helps ensure the security of your assets.
                </AlertDescription>
              </Alert>
              
              {walletsNeedingValidation.map((wallet) => (
                <Card key={wallet.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Wallet Validation</CardTitle>
                        <CardDescription>
                          {wallet.wallet_address.substring(0, 6)}...
                          {wallet.wallet_address.substring(wallet.wallet_address.length - 4)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(wallet.validation_status || "needs_validation")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Wallet Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span>{"External Wallet"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Network:</span>
                              <span>{wallet.chain_type || "Ethereum"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Connected:</span>
                              <span>{new Date(wallet.connected_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-1">Validation Requirements</h3>
                          <ul className="space-y-1 text-sm">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Wallet must be connected to your account</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Proof of ownership must be provided</span>
                            </li>
                            <li className="flex items-center gap-2">
                              {wallet.validation_status === "pending" ? (
                                <Clock className="h-4 w-4 text-yellow-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={wallet.validation_status === "pending" ? "text-yellow-600 font-medium" : ""}>
                                Admin verification (typically 24-48 hours)
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {wallet.validation_status === "pending" ? (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <div>
                              <h3 className="font-medium text-yellow-800">Validation In Progress</h3>
                              <p className="text-sm text-yellow-700">
                                Your validation request has been submitted and is being reviewed by our team.
                                This process typically takes 24-48 hours.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : wallet.validation_status === "rejected" ? (
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                              <h3 className="font-medium text-red-800">Validation Rejected</h3>
                              <p className="text-sm text-red-700">
                                Your validation was rejected. Please submit a new validation with correct information.
                              </p>
                            </div>
                          </div>
                          <form onSubmit={(e) => handleSubmit(e, wallet.id)} className="mt-4">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="proof-file">Upload Proof of Ownership</Label>
                                <div className="mt-1">
                                  <Input
                                    id="proof-file"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Accepted formats: JPG, PNG, PDF (max 5MB)
                                </p>
                              </div>
                              
                              <div>
                                <Label htmlFor="proof-description">Description</Label>
                                <Input
                                  id="proof-description"
                                  placeholder="Briefly describe your proof of ownership"
                                  value={proofDescription}
                                  onChange={(e) => setProofDescription(e.target.value)}
                                />
                              </div>
                              
                              <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting || !selectedFile}
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Submit New Validation
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleSubmit(e, wallet.id)} className="space-y-4">
                          <div>
                            <Label htmlFor="proof-file">Upload Proof of Ownership</Label>
                            <div className="mt-1">
                              <Input
                                id="proof-file"
                                type="file"
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.pdf"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Accepted formats: JPG, PNG, PDF (max 5MB)
                            </p>
                          </div>
                          
                          <div>
                            <Label htmlFor="proof-description">Description</Label>
                            <Input
                              id="proof-description"
                              placeholder="Briefly describe your proof of ownership"
                              value={proofDescription}
                              onChange={(e) => setProofDescription(e.target.value)}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isSubmitting || !selectedFile}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Submit for Validation
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Ownership Proof</CardTitle>
              <CardDescription>
                Provide proof of ownership for your digital assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Why Provide Asset Proof?</AlertTitle>
                  <AlertDescription>
                    Providing proof of asset ownership enhances your account security and enables additional platform features.
                  </AlertDescription>
                </Alert>
                
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="asset-type">Asset Type</Label>
                    <select 
                      id="asset-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select asset type</option>
                      <option value="cryptocurrency">Cryptocurrency</option>
                      <option value="nft">NFT</option>
                      <option value="token">Token</option>
                      <option value="other">Other Digital Asset</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="asset-identifier">Asset Identifier</Label>
                    <Input
                      id="asset-identifier"
                      placeholder="Asset address, token ID, or other identifier"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="asset-proof">Upload Proof Document</Label>
                    <Input
                      id="asset-proof"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Accepted formats: JPG, PNG, PDF (max 5MB)
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="asset-description">Description</Label>
                    <Input
                      id="asset-description"
                      placeholder="Briefly describe your asset and proof"
                    />
                  </div>
                  
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Asset Proof
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Validation Guidelines</CardTitle>
              <CardDescription>
                How to provide valid proof of asset ownership
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Acceptable Proof Types</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>
                        <strong>Signed Messages:</strong> A message signed with your private key proving ownership
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>
                        <strong>Transaction Screenshots:</strong> Screenshots showing transactions from your wallet
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>
                        <strong>Exchange Statements:</strong> Official statements from exchanges showing your holdings
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>
                        <strong>Wallet Interface Screenshots:</strong> Screenshots of your wallet interface showing the assets
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Validation Process</h3>
                  <ol className="space-y-2 text-sm list-decimal pl-5">
                    <li>Submit your proof of ownership documentation</li>
                    <li>Our team reviews your submission (typically within 24-48 hours)</li>
                    <li>You'll receive notification once your assets are validated</li>
                    <li>Validated assets will be eligible for platform features</li>
                  </ol>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h3 className="font-medium text-yellow-800">Important Note</h3>
                      <p className="text-sm text-yellow-700">
                        Never share your private keys or seed phrases as proof of ownership.
                        We will never ask for this sensitive information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValidateAssets;
