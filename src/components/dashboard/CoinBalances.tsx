import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { useCoinBalances, CoinBalance } from '@/hooks/useCoinBalances';

const CoinBalances: React.FC = () => {
  // Use the hook directly without fallback
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Portfolio Overview</h2>
          <p className="text-sm text-muted-foreground">Total Value: {formatCurrency(totalValueUsd)}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={refreshing || loading}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading && !balances.length ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {balances.map((coin) => (
              <Card 
                key={coin.coin_symbol} 
                className="relative overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
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
                      <CardTitle className="text-base">{coin.coin_symbol}</CardTitle>
                    </div>
                    <PriceChangeBadge change={coin.change_24h || 0} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {formatCoinAmount(coin.balance, coin.coin_symbol)} {coin.coin_symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(coin.value_usd || 0)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {error && (
            <div className="mt-4 p-3 text-sm border border-yellow-200 bg-yellow-50 text-yellow-700 rounded-md">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Helper component for price change badges
const PriceChangeBadge: React.FC<{ change: number }> = ({ change }) => {
  const isPositive = change >= 0;
  
  return (
    <Badge 
      variant="outline" 
      className={`ml-auto ${isPositive ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
    >
      {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
      {Math.abs(change).toFixed(2)}%
    </Badge>
  );
};

export default CoinBalances;
