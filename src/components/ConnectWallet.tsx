import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface ConnectWalletProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onConnect?: (walletId: string) => void;
  iconSize?: string;
  showIconOnly?: boolean;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  onConnect,
  iconSize = 'h-4 w-4',
  showIconOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLocalWalletDetails, setShowLocalWalletDetails] = useState(false);
  const { toast } = useToast();

  const handleOpenDialog = async (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      setIsOpen(true);
      setShowLocalWalletDetails(false);
    } catch (error) {
      console.error('Error opening wallet dialog:', error);
      toast({
        title: 'Wallet Dialog Failed',
        description: 'There was an error opening the wallet dialog. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShowLocalWalletDetails = () => {
    setShowLocalWalletDetails(true);
  };

  const handleBackToWalletSelection = () => {
    setShowLocalWalletDetails(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleOpenDialog}
        type="button"
      >
        <Wallet className={`${iconSize} ${className.includes('flex-col') ? 'mb-2' : ''}`} />
        {!showIconOnly && <span>Connect Wallet</span>}
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          try {
            setIsOpen(false);
            setShowLocalWalletDetails(false);
          } catch (error) {
            console.error('Error closing dialog:', error);
          }
        } else {
          setIsOpen(true);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          {!showLocalWalletDetails ? (
            <>
              <DialogHeader>
                <DialogTitle>Connect Local Wallet</DialogTitle>
                <DialogDescription>
                  Connect your local wallet to access your account
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold mb-2">Local Wallet Connection</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      This feature will allow you to connect your local wallet.
                    </p>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => {
                          toast({
                            title: 'Coming Soon',
                            description: 'Local wallet connection functionality will be implemented soon.',
                          });
                          setIsOpen(false);
                        }}
                        className="w-full"
                      >
                        Connect Local Wallet
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleShowLocalWalletDetails}
                        className="w-full"
                      >
                        Learn More About Local Wallets
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Local Wallet Details</DialogTitle>
                <DialogDescription>
                  Import your existing wallet using private key or seed phrase
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">What is a local wallet?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    A local wallet is stored directly on your device. You can import an existing wallet using your private key or seed phrase.
                  </p>
                  
                  <div className="grid gap-3">
                    <Card className="cursor-pointer hover:bg-gray-800 transition-colors">
                      <CardContent className="flex items-center p-3">
                        <Upload className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <span className="text-sm font-medium">Import with Private Key</span>
                          <p className="text-xs text-muted-foreground">Securely import your wallet using your private key</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:bg-gray-800 transition-colors">
                      <CardContent className="flex items-center p-3">
                        <Upload className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <span className="text-sm font-medium">Import with Seed Phrase</span>
                          <p className="text-xs text-muted-foreground">Recover your wallet using your recovery phrase</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 p-3 rounded-md">
                  <h4 className="text-sm font-medium flex items-center text-yellow-800 dark:text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                      <path d="M12 9v4"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                    Security Notice
                  </h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300/80 mt-1">
                    Never share your private key or seed phrase with anyone. This application stores your wallet information locally and securely on your device.
                  </p>
                </div>
                
                <Button variant="outline" onClick={handleBackToWalletSelection}>
                  Back to Wallet Selection
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectWallet;