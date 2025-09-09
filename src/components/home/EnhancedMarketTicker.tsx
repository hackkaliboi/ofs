import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  icon: string;
}

const EnhancedMarketTicker = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67420.50,
      change24h: 1250.30,
      changePercent: 1.89,
      icon: '₿'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3890.75,
      change24h: -45.20,
      changePercent: -1.15,
      icon: 'Ξ'
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 635.40,
      change24h: 12.80,
      changePercent: 2.05,
      icon: '🔶'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 245.60,
      change24h: 8.90,
      changePercent: 3.76,
      icon: '◎'
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      price: 1.25,
      change24h: 0.05,
      changePercent: 4.17,
      icon: '₳'
    },
    {
      symbol: 'XRP',
      name: 'Ripple',
      price: 2.85,
      change24h: -0.12,
      changePercent: -4.04,
      icon: '◉'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData(prev => prev.map(coin => ({
        ...coin,
        price: coin.price + (Math.random() - 0.5) * coin.price * 0.001,
        change24h: coin.change24h + (Math.random() - 0.5) * 10,
        changePercent: coin.changePercent + (Math.random() - 0.5) * 0.5
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % cryptoData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [cryptoData.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number) => {
    return change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-y border-yellow-400/20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [-100, window.innerWidth + 100],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 w-32 h-full bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent"
        />
      </div>

      <div className="relative z-10 py-4">
        {/* Main Ticker Display */}
        <div className="flex items-center justify-between px-6">
          {/* Live Indicator */}
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
            />
            <span className="text-yellow-400 font-semibold text-sm">LIVE</span>
            <Activity className="w-4 h-4 text-yellow-400" />
          </div>

          {/* Scrolling Ticker */}
          <div className="flex-1 mx-8 overflow-hidden">
            <motion.div
              animate={{ x: [-100, 0] }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex space-x-8"
            >
              {cryptoData.map((coin, index) => (
                <motion.div
                  key={coin.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 min-w-max group cursor-pointer"
                >
                  <div className="text-2xl">{coin.icon}</div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold text-lg">{coin.symbol}</span>
                      <span className="text-yellow-400 font-bold text-lg">
                        {formatPrice(coin.price)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {coin.changePercent >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-yellow-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-yellow-400" />
                      )}
                      <span className={`text-xs font-medium ${
                        coin.changePercent >= 0 ? 'text-yellow-400' : 'text-yellow-400'
                      }`}>
                        {formatChange(coin.changePercent)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Featured Coin Spotlight */}
          <div className="bg-gradient-to-r from-yellow-400/10 to-amber-400/10 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4 min-w-max">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl mb-1">{cryptoData[currentIndex]?.icon}</div>
                <div className="text-yellow-400 font-bold text-sm">
                  {cryptoData[currentIndex]?.symbol}
                </div>
                <div className="text-white font-bold text-lg">
                  {formatPrice(cryptoData[currentIndex]?.price || 0)}
                </div>
                <div className={`text-xs font-medium flex items-center justify-center space-x-1 ${
                  (cryptoData[currentIndex]?.changePercent || 0) >= 0 ? 'text-yellow-400' : 'text-yellow-400'
                }`}>
                  {(cryptoData[currentIndex]?.changePercent || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{formatChange(cryptoData[currentIndex]?.changePercent || 0)}%</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Market Summary */}
        <div className="mt-4 px-6">
          <div className="flex justify-center space-x-8 text-sm">
            <div className="text-center">
              <div className="text-gray-400">Market Cap</div>
              <div className="text-yellow-400 font-bold">$2.8T</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">24h Volume</div>
              <div className="text-yellow-400 font-bold">$156B</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">BTC Dominance</div>
              <div className="text-amber-400 font-bold">54.2%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Active Coins</div>
              <div className="text-yellow-400 font-bold">2.4M+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <motion.div
        animate={{
          background: [
            'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent)',
            'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.5), transparent)',
            'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-0 left-0 right-0 h-0.5"
      />
    </div>
  );
};

export default EnhancedMarketTicker;