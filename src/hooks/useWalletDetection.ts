import { useState, useEffect } from 'react';

// Define wallet provider interfaces
interface EthereumProvider {
  isMetaMask?: boolean;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  isCoinbaseWallet?: boolean;
  isRainbow?: boolean;
  isExodus?: boolean;
  isBraveWallet?: boolean;
  isRabby?: boolean;
  isLedgerConnect?: boolean;
  isAtomic?: boolean;
  isSafePal?: boolean;
  selectedProvider?: {
    isCoinbaseWallet?: boolean;
  };
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  connect?: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect?: () => Promise<void>;
}

interface SolanaProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect?: () => Promise<void>;
}

interface WindowWithWallets extends Window {
  ethereum?: EthereumProvider;
  solana?: SolanaProvider;
  phantom?: SolanaProvider;
  trustwallet?: EthereumProvider;
  coinbaseWalletExtension?: EthereumProvider;
  rainbow?: EthereumProvider;
  exodus?: {
    ethereum?: EthereumProvider;
  };
  brave?: EthereumProvider;
  rabby?: EthereumProvider;
  ledger?: EthereumProvider;
  atomic?: EthereumProvider;
  safepal?: EthereumProvider;
}

// Define wallet detection interfaces
interface DetectedWallet {
  id: string;
  name: string;
  isInstalled: boolean;
  provider?: EthereumProvider | SolanaProvider;
  icon?: string;
}

interface WalletDetector {
  id: string;
  name: string;
  icon: string;
  detect: () => boolean;
  provider: () => EthereumProvider | SolanaProvider | undefined;
}

// Wallet detection configurations
const WALLET_DETECTORS: WalletDetector[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/wallets/metamask.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               windowWithWallets.ethereum.isMetaMask === true;
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '/wallets/trust.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               (windowWithWallets.ethereum.isTrust === true || 
                windowWithWallets.ethereum.isTrustWallet === true);
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '/wallets/crypto.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               (windowWithWallets.ethereum.isCoinbaseWallet === true ||
                windowWithWallets.ethereum.selectedProvider?.isCoinbaseWallet === true);
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '/wallets/rainbow.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               windowWithWallets.ethereum.isRainbow === true;
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '/wallets/phantom.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.solana !== 'undefined' && 
               windowWithWallets.solana.isPhantom === true;
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).solana
  },
  {
    id: 'exodus',
    name: 'Exodus',
    icon: '/wallets/exodus.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               windowWithWallets.ethereum.isExodus === true;
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  },
  {
    id: 'brave',
    name: 'Brave Wallet',
    icon: '/wallets/brave.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               windowWithWallets.ethereum.isBraveWallet === true;
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  },
  {
    id: 'rabby',
    name: 'Rabby Wallet',
    icon: '/wallets/rabby.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               windowWithWallets.ethereum.isRabby === true;
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  },
  {
    id: 'ledger',
    name: 'Ledger Live',
    icon: '/wallets/ledger.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               windowWithWallets.ethereum.isLedgerConnect === true;
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  },
  {
    id: 'atomic',
    name: 'Atomic Wallet',
    icon: '/wallets/atomic.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               windowWithWallets.ethereum.isAtomic === true;
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  },
  {
    id: 'safepal',
    name: 'SafePal',
    icon: '/wallets/safepal.png',
    detect: () => {
      try {
        const windowWithWallets = window as WindowWithWallets;
        return typeof window !== 'undefined' && 
               typeof windowWithWallets.ethereum !== 'undefined' && 
               windowWithWallets.ethereum.isSafePal === true;
      } catch {
        return false;
      }
    },
    provider: () => (window as WindowWithWallets).ethereum
  }
];

export const useWalletDetection = () => {
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([]);
  const [isDetecting, setIsDetecting] = useState(true);
  const [hasDetected, setHasDetected] = useState(false);

  const detectWallets = async () => {
    setIsDetecting(true);
    
    try {
      // Wait a bit for wallet extensions to load
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const detected: DetectedWallet[] = [];
      
      for (const detector of WALLET_DETECTORS) {
        try {
          const isInstalled = detector.detect();
          
          detected.push({
            id: detector.id,
            name: detector.name,
            icon: detector.icon,
            isInstalled,
            provider: isInstalled ? detector.provider() : undefined
          });
        } catch (error) {
          console.warn(`Error detecting ${detector.name}:`, error);
          detected.push({
            id: detector.id,
            name: detector.name,
            icon: detector.icon,
            isInstalled: false
          });
        }
      }
      
      setDetectedWallets(detected);
      setHasDetected(true);
    } catch (error) {
      console.error('Error during wallet detection:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const getInstalledWallets = () => {
    return detectedWallets.filter(wallet => wallet.isInstalled);
  };

  const connectWallet = async (walletId: string) => {
    const wallet = detectedWallets.find(w => w.id === walletId && w.isInstalled);
    
    if (!wallet || !wallet.provider) {
      throw new Error(`Wallet '${walletId}' not found or not installed`);
    }
    
    try {
      // Handle Solana wallets
      if (walletId === 'phantom') {
        const provider = wallet.provider as SolanaProvider;
        if (!provider.isPhantom) {
          throw new Error('Phantom wallet not properly initialized');
        }
        
        const response = await provider.connect();
        if (!response || !response.publicKey) {
          throw new Error('Failed to connect to Phantom wallet');
        }
        
        return {
          address: response.publicKey.toString(),
          provider: provider,
          walletName: wallet.name,
          walletType: 'solana' as const
        };
      }
      
      // Handle Ethereum-based wallets
      const provider = wallet.provider as EthereumProvider;
      if (!provider.request) {
        throw new Error(`${wallet.name} provider not properly initialized`);
      }
      
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      }) as string[];
      
      if (!accounts || accounts.length === 0) {
        throw new Error(`No accounts found in ${wallet.name}`);
      }
      
      // Get chain ID for additional context
      let chainId: string | undefined;
      try {
        chainId = await provider.request({ method: 'eth_chainId' }) as string;
      } catch (error) {
        console.warn('Could not get chain ID:', error);
      }
      
      return {
        address: accounts[0],
        provider: provider,
        walletName: wallet.name,
        walletType: 'ethereum' as const,
        chainId: chainId
      };
    } catch (error) {
      console.error(`Error connecting to ${wallet.name}:`, error);
      throw new Error(`Failed to connect to ${wallet.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const disconnectWallet = async (provider: EthereumProvider | SolanaProvider) => {
    try {
      if (provider && typeof provider.disconnect === 'function') {
        await provider.disconnect();
      }
    } catch (error) {
      console.warn('Error disconnecting wallet:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initialDetection = async () => {
      if (mounted) {
        await detectWallets();
      }
    };
    
    initialDetection();
    
    // Re-detect when window gains focus or becomes visible
    const handleFocus = () => {
      if (mounted) {
        detectWallets();
      }
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden && mounted) {
        detectWallets();
      }
    };
    
    // Listen for wallet installation events
    const handleWalletInstalled = () => {
      if (mounted) {
        setTimeout(() => detectWallets(), 1000);
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('ethereum#initialized', handleWalletInstalled);
    
    return () => {
      mounted = false;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('ethereum#initialized', handleWalletInstalled);
    };
  }, []);

  return {
    detectedWallets,
    installedWallets: getInstalledWallets(),
    isDetecting,
    hasDetected,
    detectWallets,
    connectWallet,
    disconnectWallet
  };
};