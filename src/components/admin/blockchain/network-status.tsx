import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Database,
  Server
} from "lucide-react";

interface BlockchainNetwork {
  id: string;
  name: string;
  symbol: string;
  icon_url?: string;
  is_testnet: boolean;
  rpc_url: string;
  explorer_url: string;
  status: 'active' | 'inactive' | 'maintenance';
  gas_price?: number;
  block_height?: number;
  last_checked_at: string;
}

interface Token {
  id: string;
  network_id: string;
  name: string;
  symbol: string;
  contract_address?: string;
  decimals: number;
  icon_url?: string;
  current_price?: number;
  price_change_24h?: number;
  is_native: boolean;
  is_enabled: boolean;
  blockchain_networks?: {
    name: string;
    symbol: string;
    is_testnet: boolean;
  };
}

interface SmartContract {
  id: string;
  network_id: string;
  name: string;
  address: string;
  type: string;
  transaction_count: number;
  total_gas_used: number;
  is_verified: boolean;
  blockchain_networks?: {
    name: string;
    symbol: string;
    is_testnet: boolean;
  };
}

interface NetworkStatusProps {
  networks: BlockchainNetwork[];
  tokens: Token[];
  smartContracts: SmartContract[];
  isLoading: boolean;
}

export function NetworkStatus({ networks, tokens, smartContracts, isLoading }: NetworkStatusProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full animate-pulse">
        <CardHeader>
          <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded w-full"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Blockchain Network Status</CardTitle>
        <CardDescription>Monitor the status of connected blockchain networks and assets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="networks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="networks" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Networks
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Tokens
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Smart Contracts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="networks" className="space-y-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {networks.map((network) => (
                  <div key={network.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center gap-3">
                      {network.icon_url ? (
                        <img src={network.icon_url} alt={network.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {network.symbol.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {network.name}
                          {network.is_testnet && (
                            <Badge variant="outline" className="text-xs">Testnet</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {network.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-end">
                              <div className="text-sm font-medium">Gas Price</div>
                              <div className="text-sm text-muted-foreground">
                                {network.gas_price ? `${network.gas_price.toFixed(2)} Gwei` : 'N/A'}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current gas price on the network</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-end">
                              <div className="text-sm font-medium">Block Height</div>
                              <div className="text-sm text-muted-foreground">
                                {network.block_height?.toLocaleString() || 'N/A'}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Latest block number on the network</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <div>
                        <Badge 
                          variant={
                            network.status === 'active' ? 'success' : 
                            network.status === 'maintenance' ? 'outline' : 'destructive'
                          }
                          className="flex items-center gap-1"
                        >
                          {network.status === 'active' ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </>
                          ) : network.status === 'maintenance' ? (
                            <>
                              <AlertCircle className="h-3 w-3" />
                              Maintenance
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              Inactive
                            </>
                          )}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1 text-right">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(network.last_checked_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {networks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No blockchain networks found
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="tokens" className="space-y-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {tokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center gap-3">
                      {token.icon_url ? (
                        <img src={token.icon_url} alt={token.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {token.symbol.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {token.name}
                          {token.is_native && (
                            <Badge variant="outline" className="text-xs">Native</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {token.symbol} • {token.blockchain_networks?.name}
                          {token.blockchain_networks?.is_testnet && " (Testnet)"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">Price</div>
                        <div className="text-sm text-muted-foreground">
                          {token.current_price ? `$${token.current_price.toLocaleString()}` : 'N/A'}
                        </div>
                      </div>
                      
                      {token.price_change_24h !== undefined && (
                        <div className="flex flex-col items-end">
                          <div className="text-sm font-medium">24h Change</div>
                          <div className={`text-sm flex items-center ${token.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {token.price_change_24h >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(token.price_change_24h).toFixed(2)}%
                          </div>
                        </div>
                      )}
                      
                      <Badge variant={token.is_enabled ? 'outline' : 'secondary'}>
                        {token.is_enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {tokens.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No tokens found
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="contracts" className="space-y-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {smartContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-3 rounded-md border">
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
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">Address</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {`${contract.address.substring(0, 6)}...${contract.address.substring(contract.address.length - 4)}`}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">Type</div>
                        <div className="text-sm text-muted-foreground">
                          {contract.type}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">Transactions</div>
                        <div className="text-sm text-muted-foreground">
                          {contract.transaction_count.toLocaleString()}
                        </div>
                      </div>
                      
                      <Badge variant={contract.is_verified ? 'success' : 'outline'}>
                        {contract.is_verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {smartContracts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No smart contracts found
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
