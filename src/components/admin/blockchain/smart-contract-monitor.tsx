import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Database, ExternalLink, CheckCircle2, XCircle, Activity } from "lucide-react";

interface SmartContract {
  id: string;
  network_id: string;
  name: string;
  address: string;
  type: string;
  description?: string;
  transaction_count: number;
  total_gas_used: number;
  is_verified: boolean;
  deployed_at?: string;
  blockchain_networks?: {
    name: string;
    symbol: string;
    is_testnet: boolean;
    explorer_url?: string;
  };
}

interface SmartContractMonitorProps {
  contracts: SmartContract[];
  isLoading: boolean;
}

export function SmartContractMonitor({ contracts, isLoading }: SmartContractMonitorProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded w-full"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort contracts by transaction count (most active first)
  const sortedContracts = [...contracts].sort((a, b) => b.transaction_count - a.transaction_count);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Contract Monitor</CardTitle>
        <CardDescription>Track performance and usage of deployed smart contracts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {sortedContracts.map((contract) => (
              <div key={contract.id} className="p-4 rounded-md border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{contract.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {contract.blockchain_networks?.name}
                        {contract.blockchain_networks?.is_testnet && " (Testnet)"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={contract.is_verified ? 'success' : 'outline'} className="flex items-center gap-1">
                      {contract.is_verified ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Unverified
                        </>
                      )}
                    </Badge>
                    {contract.blockchain_networks?.explorer_url && (
                      <Button variant="outline" size="sm" className="h-8" asChild>
                        <a 
                          href={`${contract.blockchain_networks.explorer_url}/address/${contract.address}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Explorer
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                {contract.description && (
                  <div className="text-sm mb-3">{contract.description}</div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground">Address</div>
                    <div className="text-sm font-mono">
                      {`${contract.address.substring(0, 6)}...${contract.address.substring(contract.address.length - 4)}`}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground">Type</div>
                    <div className="text-sm">{contract.type}</div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground">Transactions</div>
                    <div className="text-sm font-medium flex items-center">
                      <Activity className="h-3 w-3 mr-1 text-blue-500" />
                      {contract.transaction_count.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground">Gas Used</div>
                    <div className="text-sm">
                      {contract.total_gas_used > 1000000000
                        ? `${(contract.total_gas_used / 1000000000).toFixed(2)}B`
                        : contract.total_gas_used > 1000000
                        ? `${(contract.total_gas_used / 1000000).toFixed(2)}M`
                        : contract.total_gas_used > 1000
                        ? `${(contract.total_gas_used / 1000).toFixed(2)}K`
                        : contract.total_gas_used.toLocaleString()}
                    </div>
                  </div>
                  
                  {contract.deployed_at && (
                    <div className="flex flex-col col-span-2">
                      <div className="text-xs text-muted-foreground">Deployed</div>
                      <div className="text-sm">
                        {new Date(contract.deployed_at).toLocaleDateString()} 
                        {" "}
                        {new Date(contract.deployed_at).toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {contracts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No smart contracts found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
