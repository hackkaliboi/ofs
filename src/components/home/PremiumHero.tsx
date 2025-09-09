import React from 'react';
// Removed framer-motion imports for better performance
import { Play, Shield, Zap, Globe, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import ConnectWallet from '../ConnectWallet';

// Static Background Elements - No Animation
const StaticBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Static gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/5 to-amber-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/5 to-yellow-400/5 rounded-full blur-3xl" />
    </div>
  );
};

// Removed floating elements for better performance

// Premium Stats Component
const PremiumStats = () => {
  const stats = [
    { icon: Shield, value: "99.9%", label: "Security Uptime", color: "text-yellow-400" },
    { icon: Zap, value: "<0.1s", label: "Transaction Speed", color: "text-amber-400" },
    { icon: Globe, value: "150+", label: "Countries Served", color: "text-yellow-300" },
    { icon: TrendingUp, value: "$2.5B+", label: "Assets Secured", color: "text-amber-300" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 px-4 sm:px-0">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="text-center group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-3 sm:p-4 group-hover:border-yellow-400/60 transition-all duration-500">
                <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-lg sm:text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-gray-300 text-xs sm:text-sm">{stat.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PremiumHero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
    >
      {/* Static Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent" />
      </div>

      {/* Static Background */}
      <StaticBackground />

      {/* Removed complex 3D floating elements for better performance */}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-20 lg:py-24">
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 backdrop-blur-sm border border-yellow-400/30 rounded-full text-yellow-400 font-medium text-sm sm:text-base pulse-glow magnetic">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden sm:inline">Enterprise-Grade Blockchain Infrastructure</span>
            <span className="sm:hidden">Enterprise Blockchain</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-yellow-100 to-amber-200 bg-clip-text text-transparent glow-text">
              Secure Digital
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent glow-text">
              Asset Management
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Premium blockchain infrastructure built for enterprises and secured by advanced cryptography.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Button
              size="lg"
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-semibold text-base sm:text-lg rounded-2xl btn-premium ripple magnetic focus-premium gpu-accelerated w-full sm:w-auto"
              onClick={() => window.location.href = '/dashboard'}
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="hidden sm:inline">Start Your Journey</span>
                <span className="sm:hidden">Get Started</span>
                <div className="ml-2">
                  →
                </div>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="px-6 sm:px-8 py-3 sm:py-4 border-yellow-400/30 hover:border-yellow-400/60 text-yellow-400 hover:text-yellow-300 font-semibold text-base sm:text-lg rounded-2xl ripple magnetic focus-premium gpu-accelerated w-full sm:w-auto"
              onClick={() => window.location.href = '/dashboard'}
            >
              Connect Wallet
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="group px-6 sm:px-8 py-3 sm:py-4 border-2 border-yellow-400/50 hover:border-yellow-400 text-yellow-400 hover:text-black hover:bg-yellow-400 font-semibold text-base sm:text-lg rounded-2xl transition-all duration-500 backdrop-blur-sm w-full sm:w-auto"
              onClick={() => window.location.href = '/dashboard'}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline">Watch Demo</span>
              <span className="sm:hidden">Demo</span>
            </Button>
          </div>
        </div>

        {/* Premium Stats */}
        <PremiumStats />

        {/* Removed scroll indicator for cleaner layout */}
      </div>

      {/* Removed interactive cursor effect for better performance */}
    </section>
  );
};