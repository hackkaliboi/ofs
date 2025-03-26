import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Token {
  id: string;
  name: string;
  symbol: string;
  icon_url?: string;
  current_price?: number;
  price_change_24h?: number;
  market_cap?: number;
  blockchain_networks?: {
    name: string;
    symbol: string;
    is_testnet: boolean;
  };
}

interface TokenPricesProps {
  tokens: Token[];
  isLoading: boolean;
}

export function TokenPrices({ tokens, isLoading }: TokenPricesProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded w-full"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter out tokens without price data
  const tokensWithPrice = tokens.filter(token => token.current_price !== undefined && token.current_price !== null);

  // Sort by market cap (if available) or price
  const sortedTokens = tokensWithPrice.sort((a, b) => {
    if (a.market_cap && b.market_cap) {
      return b.market_cap - a.market_cap;
    }
    return (b.current_price || 0) - (a.current_price || 0);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Prices</CardTitle>
        <CardDescription>Real-time cryptocurrency prices and market data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTokens.length > 0 ? (
            <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground mb-2">
              <div>Token</div>
              <div className="text-right">Price</div>
              <div className="text-right">24h Change</div>
              <div className="text-right">Market Cap</div>
            </div>
          ) : null}
          
          <div className="space-y-3">
            {sortedTokens.map((token) => (
              <div key={token.id} className="grid grid-cols-4 items-center py-2 border-b border-muted last:border-0">
                <div className="flex items-center gap-2">
                  {token.icon_url ? (
                    <img src={token.icon_url} alt={token.name} className="h-6 w-6 rounded-full" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                      {token.symbol.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-xs text-muted-foreground">{token.name}</div>
                  </div>
                </div>
                
                <div className="text-right font-medium">
                  ${token.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                
                <div className="text-right">
                  {token.price_change_24h !== undefined ? (
                    <Badge 
                      variant="outline" 
                      className={`${token.price_change_24h >= 0 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}
                    >
                      <span className="flex items-center">
                        {token.price_change_24h >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(token.price_change_24h).toFixed(2)}%
                      </span>
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </div>
                
                <div className="text-right text-muted-foreground">
                  {token.market_cap ? (
                    `$${(token.market_cap / 1000000).toFixed(2)}M`
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
            ))}
            
            {sortedTokens.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No token price data available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
