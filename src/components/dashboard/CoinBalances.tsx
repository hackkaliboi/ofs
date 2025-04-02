import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { useCoinBalances, CoinBalance } from '@/hooks/useCoinBalances';

const CoinBalances: React.FC = () => {
  const { balances, loading, error, refreshBalances, totalValueUsd } = useCoinBalances();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalances();
    setTimeout(() => setRefreshing(false), 500);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatCoinAmount = (value: number, symbol: string): string => {
    let decimals = 8;
    
    // Use fewer decimals for larger amounts
    if (symbol === 'BTC') {
      decimals = value >= 1 ? 4 : 8;
    } else if (symbol === 'ETH') {
      decimals = value >= 10 ? 2 : 4;
    } else {
      decimals = value >= 100 ? 2 : 4;
    }
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Coin Balances</CardTitle>
          <CardDescription>Your crypto portfolio</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={refreshing || loading}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading && !balances.length ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
              <h3 className="text-2xl font-bold">{formatCurrency(totalValueUsd)}</h3>
            </div>
            
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {balances.map((coin) => (
                    <div 
                      key={coin.coin_symbol} 
                      className="p-4 border rounded-lg bg-card flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                          <img 
                            src={coin.icon || '/placeholder-coin.svg'} 
                            alt={coin.coin_symbol} 
                            className="w-6 h-6"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-coin.svg';
                            }}
                          />
                        </div>
                        <span className="font-medium">{coin.coin_symbol}</span>
                        <PriceChangeBadge change={coin.change_24h || 0} />
                      </div>
                      <div className="mt-1">
                        <div className="text-xl font-bold">
                          {formatCoinAmount(coin.balance, coin.coin_symbol)} {coin.coin_symbol}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(coin.value_usd || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list">
                <div className="space-y-2">
                  {balances.map((coin) => (
                    <div 
                      key={coin.coin_symbol} 
                      className="p-3 border rounded-lg bg-card flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                          <img 
                            src={coin.icon || '/placeholder-coin.svg'} 
                            alt={coin.coin_symbol} 
                            className="w-6 h-6"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-coin.svg';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{coin.coin_symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCoinAmount(coin.balance, coin.coin_symbol)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(coin.value_usd || 0)}</div>
                        <PriceChangeBadge change={coin.change_24h || 0} />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {error && (
              <div className="mt-4 p-3 text-sm border border-red-200 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Helper component for price change badges
const PriceChangeBadge: React.FC<{ change: number }> = ({ change }) => {
  const isPositive = change >= 0;
  
  return (
    <Badge 
      variant="outline" 
      className={`ml-auto ${isPositive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
    >
      {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
      {Math.abs(change).toFixed(2)}%
    </Badge>
  );
};

export default CoinBalances;
