import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, TrendingUp, CpuIcon, Clock } from "lucide-react";

interface NetworkStat {
  id: string;
  network_id: string;
  timestamp: string;
  block_height: number;
  gas_price: number;
  transaction_count: number;
  avg_block_time: number;
  active_validators?: number;
}

interface NetworkStatsProps {
  stats: NetworkStat[];
  networkName: string;
  isLoading: boolean;
}

export function NetworkStats({ stats, networkName, isLoading }: NetworkStatsProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-slate-200 rounded w-full"></div>
        </CardContent>
      </Card>
    );
  }

  // Sort stats by timestamp (oldest first for charting)
  const sortedStats = [...stats].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Format data for charts
  const formatChartData = (stats: NetworkStat[]) => {
    return stats.map(stat => ({
      time: new Date(stat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gasPrice: stat.gas_price,
      blockTime: stat.avg_block_time,
      txCount: stat.transaction_count,
      blockHeight: stat.block_height,
    }));
  };

  const chartData = formatChartData(sortedStats);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{networkName} Network Statistics</CardTitle>
        <CardDescription>Real-time performance metrics for the blockchain network</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gas" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Gas Price
            </TabsTrigger>
            <TabsTrigger value="blocks" className="flex items-center gap-2">
              <CpuIcon className="h-4 w-4" />
              Block Time
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Transactions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gas">
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="gasPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis unit=" Gwei" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="gasPrice"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#gasPrice)"
                      name="Gas Price"
                      unit=" Gwei"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No gas price data available
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="blocks">
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="blockTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis unit=" sec" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="blockTime"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#blockTime)"
                      name="Block Time"
                      unit=" sec"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No block time data available
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="txCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="txCount"
                      stroke="#ffc658"
                      fillOpacity={1}
                      fill="url(#txCount)"
                      name="Transaction Count"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No transaction data available
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex flex-col items-center p-3 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Latest Block</div>
            <div className="text-xl font-bold">
              {stats.length > 0 ? stats[stats.length - 1].block_height.toLocaleString() : 'N/A'}
            </div>
          </div>
          
          <div className="flex flex-col items-center p-3 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Current Gas</div>
            <div className="text-xl font-bold">
              {stats.length > 0 ? `${stats[stats.length - 1].gas_price.toFixed(2)} Gwei` : 'N/A'}
            </div>
          </div>
          
          <div className="flex flex-col items-center p-3 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Avg Block Time</div>
            <div className="text-xl font-bold">
              {stats.length > 0 ? `${stats[stats.length - 1].avg_block_time.toFixed(2)}s` : 'N/A'}
            </div>
          </div>
          
          <div className="flex flex-col items-center p-3 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Validators</div>
            <div className="text-xl font-bold">
              {stats.length > 0 && stats[stats.length - 1].active_validators
                ? stats[stats.length - 1].active_validators.toLocaleString()
                : 'N/A'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
