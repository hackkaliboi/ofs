import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, Plus, AlertCircle, ExternalLink, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Wallet type definition
interface Wallet {
  id: string;
  name: string;
  type: string;
  address: string;
  connected: boolean;
  balance?: string;
  logoUrl: string;
}

const ConnectWallet = () => {
  const [connectedWallets, setConnectedWallets] = useState<Wallet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Available wallets for connection
  const availableWallets = [
    {
      id: "metamask",
      name: "Metamask",
      type: "Ethereum",
      logoUrl: "/wallets/metamask.png",
      description: "Popular Ethereum wallet with browser extension and mobile app"
    },
    {
      id: "trustwallet",
      name: "Trust Wallet",
      type: "Multi-chain",
      logoUrl: "/wallets/trustwallet.png",
      description: "Secure multi-chain crypto wallet with DApp browser"
    },
    {
      id: "ledger",
      name: "Ledger",
      type: "Hardware",
      logoUrl: "/wallets/ledger.png",
      description: "Hardware wallet for secure cold storage of crypto assets"
    },
    {
      id: "blockchain",
      name: "Blockchain.com",
      type: "Multi-chain",
      logoUrl: "/wallets/blockchain.png",
      description: "Wallet by Blockchain.com with support for multiple cryptocurrencies"
    },
    {
      id: "rainbow",
      name: "Rainbow",
      type: "Ethereum",
      logoUrl: "/wallets/rainbow.png",
      description: "Ethereum wallet focused on design and user experience"
    },
    {
      id: "viawallet",
      name: "ViaBTC",
      type: "Multi-chain",
      logoUrl: "/wallets/viawallet.png",
      description: "Secure multi-chain wallet by ViaBTC"
    },
    {
      id: "ownbit",
      name: "Ownbit",
      type: "Multi-chain",
      logoUrl: "/wallets/ownbit.png",
      description: "Multi-signature wallet with enhanced security features"
    },
    {
      id: "zerion",
      name: "Zerion",
      type: "DeFi",
      logoUrl: "/wallets/zerion.png",
      description: "DeFi-focused wallet with portfolio management"
    },
    {
      id: "xdc",
      name: "XDC Wallet",
      type: "XDC",
      logoUrl: "/wallets/xdc.png",
      description: "Official wallet for the XDC blockchain"
    },
    {
      id: "vision",
      name: "Vision",
      type: "Tron",
      logoUrl: "/wallets/vision.png",
      description: "Wallet for the Tron blockchain ecosystem"
    },
    {
      id: "atomic",
      name: "Atomic",
      type: "Multi-chain",
      logoUrl: "/wallets/atomic.png",
      description: "Desktop and mobile wallet supporting 300+ cryptocurrencies"
    },
    {
      id: "crypto-com",
      name: "Crypto.com DeFi Wallet",
      type: "DeFi",
      logoUrl: "/wallets/crypto-com.png",
      description: "Non-custodial wallet by Crypto.com with DeFi features"
    },
    {
      id: "mathwallet",
      name: "MathWallet",
      type: "Multi-chain",
      logoUrl: "/wallets/mathwallet.png",
      description: "Multi-platform wallet supporting 100+ blockchains"
    },
    {
      id: "morix",
      name: "MoriX Wallet",
      type: "Multi-chain",
      logoUrl: "/wallets/morix.png",
      description: "Secure wallet with cross-chain capabilities"
    },
    {
      id: "safepal",
      name: "SafePal",
      type: "Hardware/Software",
      logoUrl: "/wallets/safepal.png",
      description: "Hardware and software wallet backed by Binance"
    },
    {
      id: "sparkpoint",
      name: "SparkPoint",
      type: "Multi-chain",
      logoUrl: "/wallets/sparkpoint.png",
      description: "Wallet for the SparkPoint ecosystem"
    },
    {
      id: "unstoppable",
      name: "Unstoppable",
      type: "Domains",
      logoUrl: "/wallets/unstoppable.png",
      description: "Wallet with blockchain domains integration"
    },
    {
      id: "peakdefi",
      name: "PeakDeFi Wallet",
      type: "DeFi",
      logoUrl: "/wallets/peakdefi.png",
      description: "Wallet optimized for DeFi investments"
    },
    {
      id: "infinity",
      name: "Infinity Wallet",
      type: "Multi-chain",
      logoUrl: "/wallets/infinity.png",
      description: "Desktop wallet with built-in exchange and staking"
    }
  ];

  // Filter wallets based on search query
  const filteredWallets = availableWallets.filter(wallet => 
    wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wallet.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wallet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock function to connect wallet
  const connectWallet = async (walletId: string) => {
    try {
      // In a real implementation, this would use Web3 libraries to connect to the actual wallet
      console.log(`Connecting to wallet: ${walletId}`);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the wallet details from available wallets
      const walletToConnect = availableWallets.find(w => w.id === walletId);
      
      if (!walletToConnect) {
        throw new Error("Wallet not found");
      }
      
      // Generate a mock address based on wallet type
      const mockAddress = generateMockAddress(walletToConnect.type);
      
      // Add to connected wallets
      const newWallet: Wallet = {
        id: walletToConnect.id,
        name: walletToConnect.name,
        type: walletToConnect.type,
        address: mockAddress,
        connected: true,
        balance: "0.00",
        logoUrl: walletToConnect.logoUrl
      };
      
      setConnectedWallets(prev => [...prev, newWallet]);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletToConnect.name}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock function to disconnect wallet
  const disconnectWallet = (walletId: string) => {
    setConnectedWallets(prev => prev.filter(wallet => wallet.id !== walletId));
    
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected successfully.",
    });
  };

  // Generate mock address based on wallet type
  const generateMockAddress = (type: string): string => {
    switch (type) {
      case "Ethereum":
        return `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      case "Bitcoin":
        return `bc1${Array(38).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      case "Tron":
        return `T${Array(33).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      case "XDC":
        return `xdc${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      default:
        return `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    }
  };

  // Format address for display
  const formatAddress = (address: string): string => {
    if (address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Connect Wallet</h1>
        <p className="text-muted-foreground">
          Connect and manage your crypto wallets securely
        </p>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Wallets</TabsTrigger>
          <TabsTrigger value="connected">Connected Wallets ({connectedWallets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search wallets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Alert variant="default" className="bg-blue-50 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connect securely</AlertTitle>
            <AlertDescription>
              Only connect wallets from trusted sources. We never store your private keys.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredWallets.map((wallet) => {
              const isConnected = connectedWallets.some(w => w.id === wallet.id);
              
              return (
                <Card 
                  key={wallet.id} 
                  className={`overflow-hidden hover:shadow-md transition-shadow ${
                    isConnected ? 'border-green-500 bg-green-50' : ''
                  }`}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                      <img 
                        src={wallet.logoUrl} 
                        alt={`${wallet.name} logo`} 
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Wallet';
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{wallet.name}</h3>
                    <Badge variant="outline" className="mb-3">
                      {wallet.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {wallet.description}
                    </p>
                    {isConnected ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => disconnectWallet(wallet.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => connectWallet(wallet.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredWallets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No wallets found matching your search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="connected" className="space-y-4">
          {connectedWallets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Wallet className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Wallets Connected</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Connect your crypto wallets to manage and secure your digital assets in one place.
                </p>
                <Button onClick={() => {
                  const availableTab = document.querySelector('[data-value="available"]') as HTMLElement;
                  if (availableTab) {
                    availableTab.click();
                  }
                }}>
                  Connect a Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {connectedWallets.map((wallet) => (
                <Card key={wallet.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img 
                            src={wallet.logoUrl} 
                            alt={`${wallet.name} logo`} 
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Wallet';
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{wallet.name}</h3>
                            <Badge variant="outline" className="ml-2">
                              {wallet.type}
                            </Badge>
                            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                              <Check className="mr-1 h-3 w-3" />
                              Connected
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1">
                            <p className="text-sm text-muted-foreground">{formatAddress(wallet.address)}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 ml-1"
                              onClick={() => {
                                navigator.clipboard.writeText(wallet.address);
                                toast({
                                  title: "Address Copied",
                                  description: "Wallet address copied to clipboard",
                                });
                              }}
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">Copy address</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 ml-1"
                              asChild
                            >
                              <a href={`https://etherscan.io/address/${wallet.address}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                                <span className="sr-only">View on explorer</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">{wallet.balance || "0.00"}</p>
                          <p className="text-sm text-muted-foreground">Balance</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => disconnectWallet(wallet.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Wallet icon component
const Wallet = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
      <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
    </svg>
  );
};

// Copy icon component
const Copy = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
};

export default ConnectWallet;
