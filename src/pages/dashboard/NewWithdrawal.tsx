import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, ArrowDownToLine, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Wallet {
  id: string;
  wallet_address: string;
  wallet_name?: string;
  chain_type: string;
  validated: boolean;
}

const NewWithdrawal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [note, setNote] = useState<string>("");
  
  // Validation state
  const [amountError, setAmountError] = useState<string | null>(null);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  
  // Fetch user's validated wallets
  useEffect(() => {
    const fetchWallets = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', user.id)
          .eq('validated', true);
        
        if (error) throw error;
        
        setWallets(data || []);
      } catch (err: any) {
        console.error('Error fetching wallets:', err);
        setError('Failed to load your wallets. Please try again later.');
        
        // For demo purposes, add some sample wallets if none are found
        if (wallets.length === 0) {
          setWallets([
            {
              id: '1',
              wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
              wallet_name: 'Main Ethereum Wallet',
              chain_type: 'ethereum',
              validated: true
            },
            {
              id: '2',
              wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12',
              wallet_name: 'Polygon Wallet',
              chain_type: 'polygon',
              validated: true
            },
            {
              id: '3',
              wallet_address: '8ZUfTVPNuSPdMFkZ7z3iWZQmMVNbQnqmqoDpMcX7RLbL',
              wallet_name: 'Solana Wallet',
              chain_type: 'solana',
              validated: true
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchWallets();
  }, [user]);
  
  // Validate form
  const validateForm = () => {
    let valid = true;
    
    // Validate amount
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setAmountError('Please enter a valid amount greater than 0');
      valid = false;
    } else {
      setAmountError(null);
    }
    
    // Validate destination address
    if (!destinationAddress || destinationAddress.trim() === '') {
      setDestinationError('Please enter a destination address');
      valid = false;
    } else {
      // Basic validation for Ethereum-like addresses
      const selectedWalletObj = wallets.find(w => w.id === selectedWallet);
      if (selectedWalletObj?.chain_type === 'ethereum' || selectedWalletObj?.chain_type === 'polygon') {
        if (!destinationAddress.startsWith('0x') || destinationAddress.length !== 42) {
          setDestinationError('Please enter a valid Ethereum address (0x followed by 40 characters)');
          valid = false;
        } else {
          setDestinationError(null);
        }
      } else if (selectedWalletObj?.chain_type === 'solana') {
        // Basic Solana address validation (should be 44 characters)
        if (destinationAddress.length !== 44) {
          setDestinationError('Please enter a valid Solana address (44 characters)');
          valid = false;
        } else {
          setDestinationError(null);
        }
      } else {
        setDestinationError(null);
      }
    }
    
    return valid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Get the selected wallet
      const wallet = wallets.find(w => w.id === selectedWallet);
      if (!wallet) {
        throw new Error('Selected wallet not found');
      }
      
      // Submit withdrawal request to Supabase
      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert([
          {
            user_id: user.id,
            wallet_id: wallet.id,
            wallet_name: wallet.wallet_name || `${wallet.chain_type} Wallet`,
            wallet_address: wallet.wallet_address,
            amount: amount,
            token: getSelectedWalletDetails()?.chain_type === 'ethereum' ? 'ETH' : 
                   getSelectedWalletDetails()?.chain_type === 'polygon' ? 'MATIC' : 
                   getSelectedWalletDetails()?.chain_type === 'solana' ? 'SOL' : 'Token',
            destination: destinationAddress,
            status: 'pending',
            note: note || null
          }
        ]);
      
      if (withdrawalError) {
        throw new Error(withdrawalError.message || 'Failed to submit withdrawal request');
      }
      setSuccess(true);
      toast({
        title: "Withdrawal request submitted",
        description: "Your withdrawal request has been submitted and is pending review.",
        duration: 5000,
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard/withdrawals');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error submitting withdrawal request:', err);
      setError(err.message || 'Failed to submit withdrawal request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Get the selected wallet details
  const getSelectedWalletDetails = () => {
    return wallets.find(w => w.id === selectedWallet);
  };
  
  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    if (address.length <= 16) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };
  
  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard/withdrawals')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Withdrawals
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowDownToLine className="mr-2 h-5 w-5" />
            New Withdrawal Request
          </CardTitle>
          <CardDescription>
            Request a withdrawal from one of your validated wallets
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && !success && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success ? (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success</AlertTitle>
              <AlertDescription>
                Your withdrawal request has been submitted and is pending review.
                Redirecting to withdrawals page...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="wallet">Source Wallet</Label>
                  <Select 
                    value={selectedWallet} 
                    onValueChange={setSelectedWallet}
                    disabled={loading || submitting}
                  >
                    <SelectTrigger id="wallet" className="w-full">
                      <SelectValue placeholder="Select a wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.wallet_name || formatAddress(wallet.wallet_address)} ({wallet.chain_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedWallet && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {getSelectedWalletDetails()?.wallet_address}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <div className="flex items-center">
                    <Input
                      id="amount"
                      type="number"
                      step="0.000001"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={!selectedWallet || submitting}
                      className={amountError ? "border-red-500" : ""}
                    />
                    <div className="ml-2 w-24">
                      <Select disabled={!selectedWallet || submitting}>
                        <SelectTrigger>
                          <SelectValue>
                            {getSelectedWalletDetails()?.chain_type === 'ethereum' ? 'ETH' : 
                             getSelectedWalletDetails()?.chain_type === 'polygon' ? 'MATIC' : 
                             getSelectedWalletDetails()?.chain_type === 'solana' ? 'SOL' : 'Token'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {getSelectedWalletDetails()?.chain_type === 'ethereum' && (
                            <>
                              <SelectItem value="ETH">ETH</SelectItem>
                              <SelectItem value="USDT">USDT</SelectItem>
                              <SelectItem value="USDC">USDC</SelectItem>
                            </>
                          )}
                          {getSelectedWalletDetails()?.chain_type === 'polygon' && (
                            <>
                              <SelectItem value="MATIC">MATIC</SelectItem>
                              <SelectItem value="USDT">USDT</SelectItem>
                              <SelectItem value="USDC">USDC</SelectItem>
                            </>
                          )}
                          {getSelectedWalletDetails()?.chain_type === 'solana' && (
                            <>
                              <SelectItem value="SOL">SOL</SelectItem>
                              <SelectItem value="USDC">USDC</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {amountError && (
                    <p className="text-xs text-red-500 mt-1">{amountError}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Network fees will be deducted from the withdrawal amount
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="destination">Destination Address</Label>
                  <Input
                    id="destination"
                    placeholder="Enter destination wallet address"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    disabled={!selectedWallet || submitting}
                    className={destinationError ? "border-red-500" : ""}
                  />
                  {destinationError && (
                    <p className="text-xs text-red-500 mt-1">{destinationError}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Double-check the address to ensure it's correct
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input
                    id="note"
                    placeholder="Add a note for this withdrawal"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="bg-muted/50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Important Information:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Withdrawals are processed within 24-48 hours</li>
                  <li>• Network fees will be deducted from the withdrawal amount</li>
                  <li>• Minimum withdrawal amounts: 0.01 ETH, 1 MATIC, 0.1 SOL</li>
                  <li>• Always double-check the destination address</li>
                </ul>
              </div>
            </form>
          )}
        </CardContent>
        
        {!success && (
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/withdrawals')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={!selectedWallet || !amount || !destinationAddress || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Submit Withdrawal Request
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default NewWithdrawal;
