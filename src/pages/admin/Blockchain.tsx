import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkStatus } from "@/components/admin/blockchain/network-status";
import { TokenPrices } from "@/components/admin/blockchain/token-prices";
import { SmartContractMonitor } from "@/components/admin/blockchain/smart-contract-monitor";
import { NetworkStats } from "@/components/admin/blockchain/network-stats";
import { AdminLoadingState } from "@/components/admin/loading-state";
import { AdminErrorState } from "@/components/admin/error-state";

// Sample data for blockchain components
const sampleNetworks = [
  {
    id: "1",
    name: "Ethereum",
    symbol: "ETH",
    is_testnet: false,
    rpc_url: "https://mainnet.infura.io/v3/",
    explorer_url: "https://etherscan.io",
    status: "active" as const,
    gas_price: 25,
    block_height: 18500000,
    last_checked_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Polygon",
    symbol: "MATIC",
    is_testnet: false,
    rpc_url: "https://polygon-rpc.com",
    explorer_url: "https://polygonscan.com",
    status: "active" as const,
    gas_price: 50,
    block_height: 47250000,
    last_checked_at: new Date().toISOString()
  }
];

const sampleTokens = [
  {
    id: "1",
    network_id: "1",
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    current_price: 3450.75,
    price_change_24h: 2.5,
    is_native: true,
    is_enabled: true
  },
  {
    id: "2",
    network_id: "2",
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    current_price: 0.58,
    price_change_24h: -1.2,
    is_native: true,
    is_enabled: true
  }
];

const sampleContracts = [
  {
    id: "1",
    network_id: "1",
    name: "OFS Token",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    type: "ERC20",
    transaction_count: 1250,
    total_gas_used: 5600000,
    is_verified: true
  },
  {
    id: "2",
    network_id: "2",
    name: "OFS NFT Collection",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    type: "ERC721",
    transaction_count: 450,
    total_gas_used: 2300000,
    is_verified: true
  }
];

const sampleStats = [
  {
    id: "1",
    network_id: "1",
    timestamp: new Date().toISOString(),
    block_height: 18500000,
    gas_price: 25,
    transaction_count: 1250,
    avg_block_time: 12.5
  },
  {
    id: "2",
    network_id: "1",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    block_height: 18499000,
    gas_price: 30,
    transaction_count: 1200,
    avg_block_time: 13.2
  }
];

const AdminBlockchain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("networks");

  if (isLoading) {
    return <AdminLoadingState message="Loading blockchain data..." />;
  }

  if (loadingError) {
    return (
      <AdminErrorState
        message={loadingError}
        onRetry={() => {
          setIsLoading(true);
          setLoadingError(null);
          // Add retry logic here
          setTimeout(() => setIsLoading(false), 1000);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Blockchain Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage blockchain networks, tokens, and smart contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="networks" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="networks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Status</CardTitle>
              <CardDescription>
                Monitor the status of connected blockchain networks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NetworkStatus 
                networks={sampleNetworks} 
                tokens={sampleTokens}
                smartContracts={sampleContracts}
                isLoading={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Prices</CardTitle>
              <CardDescription>
                Track token prices and market data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TokenPrices 
                tokens={sampleTokens}
                isLoading={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Monitor</CardTitle>
              <CardDescription>
                Monitor deployed smart contracts and their interactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SmartContractMonitor 
                contracts={sampleContracts}
                isLoading={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Statistics</CardTitle>
              <CardDescription>
                View detailed statistics for each blockchain network.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NetworkStats 
                stats={sampleStats}
                networkName="Ethereum"
                isLoading={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBlockchain;
