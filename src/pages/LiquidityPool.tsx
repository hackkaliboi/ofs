import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, History, TrendingUp } from "lucide-react";
import Footer from "@/components/layout/Footer";

const LiquidityPool = () => {
  // Sample portfolio data - user's liquidity positions
  const portfolioPositions = [
    {
      pair: "ETH/USDT",
      icons: ["🔷", "💵"],
      liquidity: "$12,450",
      lpTokens: "0.0234",
      apr: "12.4%",
      fees24h: "$23.45",
      share: "0.15%"
    },
    {
      pair: "OFS/USDC",
      icons: ["🪙", "💲"],
      liquidity: "$8,750",
      lpTokens: "0.0156",
      apr: "18.7%",
      fees24h: "$18.92",
      share: "0.08%"
    },
    {
      pair: "BTC/ETH",
      icons: ["₿", "🔷"],
      liquidity: "$25,600",
      lpTokens: "0.0089",
      apr: "9.2%",
      fees24h: "$45.67",
      share: "0.03%"
    }
  ];

  // Sample transaction history
  const transactions = [
    { type: "Add Liquidity", tokens: "ETH/USDT", value: "$5,000", time: "2 hours ago", address: "0x1a2...3b4c" },
    { type: "Remove Liquidity", tokens: "OFS/USDC", value: "$2,500", time: "5 hours ago", address: "0x5d6...7e8f" },
    { type: "Swap", tokens: "BTC → ETH", value: "$10,000", time: "1 day ago", address: "0x9g0...1h2i" },
    { type: "Add Liquidity", tokens: "OFS/ETH", value: "$7,500", time: "2 days ago", address: "0x3j4...5k6l" },
    { type: "Claim Rewards", tokens: "ETH/USDT", value: "$125.50", time: "3 days ago", address: "0x7m8...9n0o" },
  ];

  // Calculate total portfolio value
  const totalPortfolioValue = portfolioPositions.reduce((total, position) => {
    return total + parseFloat(position.liquidity.replace('$', '').replace(',', ''));
  }, 0);

  const totalDailyFees = portfolioPositions.reduce((total, position) => {
    return total + parseFloat(position.fees24h.replace('$', ''));
  }, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex-grow relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
                <Wallet className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">My Liquidity</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                Portfolio Overview
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Track your liquidity positions and transaction history in the OFSLEDGER ecosystem.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Portfolio Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="border border-yellow-500/20 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">My Portfolio</h2>
                      <Wallet className="text-yellow-400 w-6 h-6" />
                    </div>
                    
                    {/* Portfolio Summary */}
                    <div className="bg-black/30 rounded-lg p-6 mb-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Total Portfolio Value</p>
                          <p className="text-2xl font-bold text-white">${totalPortfolioValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">24h Fees Earned</p>
                          <p className="text-2xl font-bold text-yellow-400">${totalDailyFees.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Portfolio Positions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Active Positions</h3>
                      {portfolioPositions.map((position, index) => (
                        <div key={index} className="bg-black/30 rounded-lg p-4 border border-yellow-500/20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex items-center mr-3">
                                <span className="text-xl mr-1">{position.icons[0]}</span>
                                <span className="text-xl">{position.icons[1]}</span>
                              </div>
                              <div>
                                <h4 className="text-white font-medium">{position.pair}</h4>
                                <p className="text-gray-400 text-sm">LP Tokens: {position.lpTokens}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">{position.liquidity}</p>
                              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                {position.apr} APR
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Pool Share</p>
                              <p className="text-white">{position.share}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">24h Fees</p>
                              <p className="text-yellow-400">{position.fees24h}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">APR</p>
                              <p className="text-green-400">{position.apr}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Transaction History */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.4 }}
                 className="space-y-8"
               >
                 {/* Transaction History */}
                 <Card className="border border-yellow-500/20 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
                   <CardContent className="p-6">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="text-xl font-bold text-white">Transaction History</h3>
                       <History className="text-yellow-400 w-5 h-5" />
                     </div>
                     
                     <div className="space-y-3">
                       {transactions.map((tx, index) => (
                         <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-yellow-500/10">
                           <div className="flex items-center space-x-3">
                             <div className={`w-2 h-2 rounded-full ${
                               tx.type === 'Add Liquidity' ? 'bg-green-400' :
                               tx.type === 'Remove Liquidity' ? 'bg-red-400' :
                               tx.type === 'Swap' ? 'bg-blue-400' :
                               'bg-yellow-400'
                             }`} />
                             <div>
                               <p className="text-white font-medium text-sm">{tx.type}</p>
                               <p className="text-gray-400 text-xs">{tx.tokens}</p>
                             </div>
                           </div>
                           <div className="text-right">
                             <p className="text-white font-medium text-sm">{tx.value}</p>
                             <p className="text-gray-400 text-xs">{tx.time}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </motion.div>
             </div>
           </div>
         </div>
       </div>
       <Footer />
     </div>
   );
 };
 
 export default LiquidityPool;