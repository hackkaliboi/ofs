
import React from "react";
import { ArrowRight, Shield, Lock, BarChart, Globe, Zap } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-36 md:pb-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Glowing orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400/10 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay: '2s'}} />
      
      {/* Central glow effect */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-[800px] h-[400px] bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 blur-3xl opacity-50 rounded-full" />
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-sm font-medium border border-blue-100 shadow-sm">
              <span className="animate-pulse mr-2">●</span> Revolutionizing Global Finance
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-sm">
              Welcome to <span className="text-gradient bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">OFSLEDGER</span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 text-gray-700 drop-shadow-sm">
              The Next Generation <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600">Quantum Financial System</span>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={3}>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              OFSLEDGER is transforming global finance with advanced blockchain technology. 
              Our system ensures 100% financial security, transparency, and freedom from traditional banking limitations.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sign-in">
                <button className="gradient-btn group">
                  <span className="flex items-center">
                    Connect Your Wallet 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
              <a href="#market">
                <button className="gradient-btn-secondary group">
                  <span className="flex items-center">
                    View Market Updates 
                    <BarChart className="ml-2 h-4 w-4" />
                  </span>
                </button>
              </a>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={4} className="mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="glass rounded-2xl p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-blue-500/10 p-3 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Asset-Backed Value</h3>
                <p className="text-sm text-gray-600 text-center">Fully backed by real assets ensuring stable currency value</p>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-indigo-500/10 p-3 rounded-full mb-4">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium mb-2">Global Network</h3>
                <p className="text-sm text-gray-600 text-center">Decentralized CIPS replaces traditional SWIFT system</p>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-violet-500/10 p-3 rounded-full mb-4">
                  <Lock className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="font-medium mb-2">Secure Transactions</h3>
                <p className="text-sm text-gray-600 text-center">End-to-end encrypted for maximum security and privacy</p>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-purple-500/10 p-3 rounded-full mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Quantum Technology</h3>
                <p className="text-sm text-gray-600 text-center">Powered by cutting-edge quantum computing architecture</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Hero;
