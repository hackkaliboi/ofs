
import React from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Sample crypto data - in a real app, this would come from an API
const cryptoData = [
  { 
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 63428.51, 
    change: 2.45,
    data: [
      { date: "Aug", value: 58000 },
      { date: "Sep", value: 61000 },
      { date: "Oct", value: 57000 },
      { date: "Nov", value: 59000 },
      { date: "Dec", value: 62000 },
      { date: "Jan", value: 63428 },
    ] 
  },
  { 
    id: "ethereum", 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 3487.12, 
    change: -1.23,
    data: [
      { date: "Aug", value: 3100 },
      { date: "Sep", value: 3300 },
      { date: "Oct", value: 3600 },
      { date: "Nov", value: 3400 },
      { date: "Dec", value: 3550 },
      { date: "Jan", value: 3487 },
    ] 
  },
  { 
    id: "ripple", 
    name: "XRP", 
    symbol: "XRP", 
    price: 0.5246, 
    change: 5.32,
    data: [
      { date: "Aug", value: 0.41 },
      { date: "Sep", value: 0.45 },
      { date: "Oct", value: 0.48 },
      { date: "Nov", value: 0.50 },
      { date: "Dec", value: 0.49 },
      { date: "Jan", value: 0.52 },
    ] 
  },
  { 
    id: "cardano", 
    name: "Cardano", 
    symbol: "ADA", 
    price: 0.4578, 
    change: 3.14,
    data: [
      { date: "Aug", value: 0.38 },
      { date: "Sep", value: 0.40 },
      { date: "Oct", value: 0.42 },
      { date: "Nov", value: 0.41 },
      { date: "Dec", value: 0.44 },
      { date: "Jan", value: 0.45 },
    ] 
  },
];

const CryptoMarket = () => {
  const chartConfig = {
    crypto: {
      label: "Price",
    },
  };

  return (
    <section id="market" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Crypto Market <span className="text-gradient">Updates</span>
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed with real-time cryptocurrency market data in the transitional Quantum Financial System.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cryptoData.map((crypto) => (
              <Card key={crypto.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">{crypto.name}</CardTitle>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded-md">{crypto.symbol}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold">${crypto.price.toLocaleString()}</p>
                      <div className={`flex items-center mt-1 ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {crypto.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">{crypto.change}%</span>
                      </div>
                    </div>
                    <div className="h-16 w-24">
                      <ChartContainer config={chartConfig} className="h-full">
                        <LineChart data={crypto.data}>
                          <XAxis dataKey="date" hide />
                          <YAxis hide domain={['auto', 'auto']} />
                          <ChartTooltip
                            content={<ChartTooltipContent />}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            name="crypto"
                            dot={false}
                            activeDot={{ r: 4 }}
                            strokeWidth={2}
                            stroke={crypto.change >= 0 ? "#22c55e" : "#ef4444"}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={3}>
          <div className="flex justify-center mt-8">
            <button className="flex items-center gap-2 text-custodia font-medium text-sm hover:underline">
              <RefreshCw className="h-4 w-4" />
              Refresh Market Data
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CryptoMarket;
