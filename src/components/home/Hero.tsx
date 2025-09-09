import React from "react";
import { ArrowRight, Shield, BarChart, Globe, Zap, Lock, Cpu } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
// import ParticleSystem from "@/components/ui/ParticleSystem"; // Disabled for better scroll performance
import { Link } from "react-router-dom";
import EnhancedMarketTicker from "./EnhancedMarketTicker";
import BlockchainVisualization from "./BlockchainVisualization";

const Hero = () => {
  return (
    <>
      <section className="pt-20 pb-8 md:pt-28 md:pb-12 relative overflow-hidden min-h-screen flex items-center">
        {/* Hero Particle System - Disabled for better scroll performance */}
        {/* <div className="absolute inset-0 z-0">
          <ParticleSystem 
            particleCount={40}
            mouseInteraction={true}
            colors={['#fbbf24', '#f59e0b', '#d97706', '#06b6d4']}
            connectionDistance={80}
          />
        </div> */}
        
        {/* Gold & Black Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-yellow-900/20 to-black">
          {/* Blockchain grid pattern */}
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd700' fill-opacity='0.1'%3E%3Cpath d='M40 40L20 20h40L40 40zM40 40L60 60H20L40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }} />
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffd700' stroke-width='1'%3E%3Cpath d='M10 10h80v80H10z'/%3E%3Cpath d='M20 20h60v60H20z'/%3E%3Cpath d='M30 30h40v40H30z'/%3E%3Cpath d='M40 40h20v20H40z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }} />
        </div>

        {/* Gold glow effects */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-yellow-400/20 to-transparent opacity-80 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[400px] bg-gradient-radial from-amber-400/20 to-transparent opacity-80 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-0 w-[600px] h-[300px] bg-gradient-radial from-yellow-500/15 to-transparent opacity-70 rounded-full blur-3xl"></div>
        
        {/* Interactive Blockchain Visualization */}
        <BlockchainVisualization />
        
        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-400/60 animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
        
        <div className="container-custom relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left column - Content */}
            <div className="lg:col-span-6">
              <AnimatedSection animation="fade">
                <div className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-md text-yellow-300 text-sm font-medium border border-yellow-400/30 shadow-lg shadow-yellow-400/20">
                  <span className="animate-pulse mr-2 inline-block h-2 w-2 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50"></span> 
                  🚀 Web3 • DeFi • Blockchain Revolution
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="zoom" delay={1}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
                  <span className="text-white font-mono">DEFI</span><br/>
                  <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                    REVOLUTION
                  </span><br/>
                  <span className="text-yellow-400 font-mono text-4xl sm:text-5xl md:text-6xl">
                    STARTS HERE
                  </span>
                </h1>
              </AnimatedSection>
              
              <AnimatedSection animation="slide-left" delay={2}>
                <p className="text-lg md:text-xl text-yellow-100/80 mb-8 max-w-2xl leading-relaxed font-light">
                  Enter the future of decentralized finance. Trade, stake, and govern with 
                  <span className="text-yellow-400 font-semibold"> zero intermediaries</span>, 
                  <span className="text-yellow-400 font-semibold"> maximum security</span>, and 
                  <span className="text-yellow-400 font-semibold"> infinite possibilities</span>.
                </p>
              </AnimatedSection>
              
              <AnimatedSection animation="slide-up" delay={3}>
                <div className="flex flex-wrap gap-6">
                  <Link to="/sign-in">
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl font-bold text-black shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 transform hover:scale-105 border border-yellow-400/30">
                      <span className="flex items-center relative z-10">
                        <Zap className="mr-2 h-5 w-5" />
                        LAUNCH DAPP
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </Link>
                  <a href="#features">
                    <button className="group px-8 py-4 bg-black/50 backdrop-blur-md hover:bg-black/70 text-yellow-300 border-2 border-yellow-400/30 hover:border-yellow-400/60 rounded-xl flex items-center font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
                      <Cpu className="mr-2 h-5 w-5" />
                      EXPLORE TECH
                      <BarChart className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </a>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fade" delay={4}>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">$2.4B+</div>
            <div className="text-yellow-100/70 text-sm font-medium">Total Value Locked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">500K+</div>
                    <div className="text-yellow-100/70 text-sm font-medium">Active Wallets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">99.9%</div>
                    <div className="text-yellow-100/70 text-sm font-medium">Uptime</div>
                  </div>
                </div>
                
                <div className="mt-12 flex items-center justify-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Audited by CertiK</span>
                  </div>
                  <div className="h-6 w-px bg-yellow-400/30"></div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Multi-Sig Security</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            
            {/* Right column - Web3 Visual */}
            <div className="lg:col-span-6 relative">
              <AnimatedSection animation="slide-right" delay={2}>
                <div className="relative flex items-center justify-center">
                  {/* Central blockchain node */}
                  <div className="relative z-20 w-48 h-48 md:w-64 md:h-64">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">OFS</div>
            <div className="text-sm text-yellow-300">PROTOCOL</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Orbiting nodes */}
                  <div className="absolute inset-0 animate-spin-reverse" style={{animationDuration: '20s'}}>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg shadow-yellow-400/50 flex items-center justify-center text-white font-bold text-xs">
                      ETH
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full shadow-lg shadow-yellow-400/50 flex items-center justify-center text-black font-bold text-xs">
                      BTC
                    </div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg shadow-green-400/50 flex items-center justify-center text-white font-bold text-xs">
                      USDC
                    </div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-lg shadow-pink-400/50 flex items-center justify-center text-white font-bold text-xs">
                      SOL
                    </div>
                  </div>
                  
                  {/* Outer ring nodes */}
                  <div className="absolute inset-0 scale-150 animate-spin" style={{animationDuration: '30s'}}>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg shadow-yellow-400/50"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg shadow-red-400/50"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg shadow-yellow-400/50"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg shadow-orange-400/50"></div>
                  </div>
                  
                  {/* Connecting energy beams */}
                  <div className="absolute inset-0 opacity-60">
                    <svg className="w-full h-full" viewBox="0 0 400 400">
                      <defs>
                        <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.8"/>
                        </linearGradient>
                      </defs>
                      <circle cx="200" cy="200" r="120" fill="none" stroke="url(#beam1)" strokeWidth="2" strokeDasharray="10,5" className="animate-pulse">
                        <animateTransform attributeName="transform" type="rotate" values="0 200 200;360 200 200" dur="10s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="200" cy="200" r="180" fill="none" stroke="url(#beam1)" strokeWidth="1" strokeDasharray="5,10" className="animate-pulse" style={{animationDelay: '1s'}}>
                        <animateTransform attributeName="transform" type="rotate" values="360 200 200;0 200 200" dur="15s" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  </div>
                  
                  {/* Background glow */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-600/20 blur-3xl rounded-full transform scale-150"></div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
      <EnhancedMarketTicker />
    </>
  );
};

export default Hero;
