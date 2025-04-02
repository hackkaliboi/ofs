import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useCoinBalances } from '@/hooks/useCoinBalances';

// Time periods for chart display
const TIME_PERIODS = [
  { value: '1h', label: '1H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '1y', label: '1Y' },
];

// Function to generate realistic-looking price data
const generatePriceData = (
  basePriceUsd: number, 
  timeframe: string, 
  volatility: number = 0.05
) => {
  let dataPoints = 0;
  let startTime = new Date();
  
  switch (timeframe) {
    case '1h':
      dataPoints = 60; // One point per minute
      startTime = new Date(Date.now() - 60 * 60 * 1000);
      break;
    case '24h':
      dataPoints = 24; // One point per hour
      startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      dataPoints = 7 * 24; // One point per hour for 7 days
      startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      dataPoints = 30; // One point per day
      startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      dataPoints = 12; // One point per month
      startTime = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      dataPoints = 24;
      startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
  }
  
  // Generate random walk data
  const data = [];
  let currentPrice = basePriceUsd;
  
  // Seed with a trend bias (-1 to 1) to create realistic trends
  const trendBias = (Math.random() * 2 - 1) * 0.3;
  
  for (let i = 0; i < dataPoints; i++) {
    // Calculate time for this data point
    let timeOffset;
    switch (timeframe) {
      case '1h': timeOffset = i * 60 * 1000; break; // minutes
      case '24h': timeOffset = i * 60 * 60 * 1000; break; // hours
      case '7d': timeOffset = i * 60 * 60 * 1000; break; // hours
      case '30d': timeOffset = i * 24 * 60 * 60 * 1000; break; // days
      case '1y': timeOffset = i * 30 * 24 * 60 * 60 * 1000; break; // months
      default: timeOffset = i * 60 * 60 * 1000;
    }
    
    const time = new Date(startTime.getTime() + timeOffset);
    
    // Random price change with trend bias
    const change = (Math.random() * 2 - 1 + trendBias) * volatility * currentPrice;
    currentPrice += change;
    
    // Ensure price doesn't go negative
    if (currentPrice <= 0) currentPrice = basePriceUsd * 0.01;
    
    data.push({
      time: time.toISOString(),
      price: currentPrice,
      formattedTime: formatTime(time, timeframe)
    });
  }
  
  return data;
};

// Format time based on the selected timeframe
const formatTime = (date: Date, timeframe: string): string => {
  switch (timeframe) {
    case '1h':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case '24h':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case '7d':
      return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit' })}`;
    case '30d':
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    case '1y':
      return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    default:
      return date.toLocaleTimeString();
  }
};

// Format currency values
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const CoinChart: React.FC = () => {
  const { balances, loading } = useCoinBalances();
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC');
  const [timeframe, setTimeframe] = useState<string>('24h');
  const [chartData, setChartData] = useState<any[]>([]);
  const [priceChange, setPriceChange] = useState<number>(0);
  
  useEffect(() => {
    if (balances.length > 0 && !loading) {
      // Set default selected coin if not already set
      if (!selectedCoin || !balances.find(b => b.coin_symbol === selectedCoin)) {
        setSelectedCoin(balances[0].coin_symbol);
      }
      
      // Generate chart data for the selected coin
      updateChartData();
    }
  }, [balances, loading, selectedCoin, timeframe]);
  
  const updateChartData = () => {
    const coin = balances.find(b => b.coin_symbol === selectedCoin);
    if (!coin) return;
    
    const basePrice = coin.price || 1;
    // Adjust volatility based on the coin (BTC less volatile than smaller coins)
    const volatility = selectedCoin === 'BTC' ? 0.03 : 
                      selectedCoin === 'ETH' ? 0.04 : 0.06;
    
    const data = generatePriceData(basePrice, timeframe, volatility);
    setChartData(data);
    
    // Calculate price change
    if (data.length >= 2) {
      const startPrice = data[0].price;
      const endPrice = data[data.length - 1].price;
      const change = ((endPrice - startPrice) / startPrice) * 100;
      setPriceChange(change);
    }
  };
  
  const getCoinPrice = () => {
    const coin = balances.find(b => b.coin_symbol === selectedCoin);
    return coin?.price || 0;
  };
  
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Price Chart</CardTitle>
          <CardDescription>Real-time cryptocurrency prices</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Coin" />
            </SelectTrigger>
            <SelectContent>
              {balances.map((coin) => (
                <SelectItem key={coin.coin_symbol} value={coin.coin_symbol}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-background flex items-center justify-center">
                      <img 
                        src={coin.icon || '/placeholder-coin.svg'} 
                        alt={coin.coin_symbol} 
                        className="w-4 h-4"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-coin.svg';
                        }}
                      />
                    </div>
                    {coin.coin_symbol}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-bold">{formatCurrency(getCoinPrice())}</h3>
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={`${priceChange >= 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                  >
                    {priceChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(priceChange).toFixed(2)}%
                  </Badge>
                  <span className="text-sm text-muted-foreground ml-2">{timeframe} change</span>
                </div>
              </div>
              
              <div className="flex gap-1">
                {TIME_PERIODS.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setTimeframe(period.value)}
                    className={`px-3 py-1 text-xs rounded-md ${
                      timeframe === period.value 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="area" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="area">Area Chart</TabsTrigger>
                <TabsTrigger value="line">Line Chart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="area" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="formattedTime" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
                        return `$${value.toFixed(1)}`;
                      }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), "Price"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="line" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="formattedTime" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
                        return `$${value.toFixed(1)}`;
                      }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), "Price"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinChart;
