import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, Coins } from "lucide-react";
import { useCoinBalances } from "@/hooks/useCoinBalances";

const CoinBalancesWidget = () => {
  const { balances, loading, error, refreshBalances, totalValueUsd } = useCoinBalances();
  const [lastLoadedBalances, setLastLoadedBalances] = React.useState([]);
  
  // Store successful balance loads to prevent flickering
  React.useEffect(() => {
    if (balances.length > 0 && !loading) {
      setLastLoadedBalances(balances);
    }
  }, [balances, loading]);
  
  // Use either current balances or last successfully loaded balances
  const displayBalances = balances.length > 0 ? balances : lastLoadedBalances;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatCoinAmount = (value: number, symbol: string) => {
    // Different precision for different coins
    let precision = 8;
    if (symbol === "BTC") precision = 8;
    else if (symbol === "ETH") precision = 6;
    else if (symbol === "XRP" || symbol === "SOL") precision = 2;
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Coin Balances</CardTitle>
          <CardDescription>Your cryptocurrency holdings</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => refreshBalances()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {loading && displayBalances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your balances...</p>
          </div>
        ) : error && displayBalances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Coins className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-1">No balances found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error || "Your cryptocurrency balances will appear here"}
            </p>
            <Button
              variant="outline"
              onClick={() => refreshBalances()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 pb-4 border-b">
              <div className="text-sm text-muted-foreground">Total Balance</div>
              <div className="text-2xl font-bold">{formatCurrency(totalValueUsd)}</div>
              {loading && <div className="text-xs text-muted-foreground mt-1">Refreshing...</div>}
            </div>
            
            {displayBalances.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No coins in your portfolio yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {displayBalances.map((coin) => (
                  <Card key={coin.coin_symbol} className="overflow-hidden border bg-background/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-2 mt-2">
                          <img 
                            src={coin.icon || '/placeholder-coin.svg'} 
                            alt={coin.coin_symbol} 
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-coin.svg';
                            }}
                          />
                        </div>
                        <div className="font-medium text-lg">{coin.coin_symbol}</div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {formatCoinAmount(coin.balance, coin.coin_symbol)}
                        </div>
                        <div className="font-medium">{formatCurrency(coin.value_usd || 0)}</div>
                        <div className={`text-xs ${(coin.change_24h || 0) >= 0 ? 'text-yellow-600' : 'text-yellow-600'}`}>
                          {(coin.change_24h || 0) >= 0 ? '↑' : '↓'} {Math.abs(coin.change_24h || 0).toFixed(2)}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinBalancesWidget;
