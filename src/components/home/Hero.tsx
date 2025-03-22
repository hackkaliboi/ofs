
import React from "react";
import { ArrowRight, Shield, Lock, BarChart, Globe, Zap } from "lucide-react";
import ButtonEffect from "@/components/ui/ButtonEffect";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-36 md:pb-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-gray-100/80 z-0" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400/5 rounded-full blur-2xl" />
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-sm font-medium border border-blue-100 shadow-sm">
              <span className="animate-pulse mr-2">●</span> Revolutionizing Global Finance
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-sm">
              Welcome to <span className="text-gradient bg-gradient-to-r from-blue-600 to-blue-400">OFSLEDGER</span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 text-gray-700 drop-shadow-sm">
              The Next Generation <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">Quantum Financial System</span>
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
                <ButtonEffect variant="primary" className="group">
                  Connect Your Wallet <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </ButtonEffect>
              </Link>
              <a href="#market">
                <ButtonEffect variant="secondary" className="group">
                  View Market Updates <BarChart className="ml-2 h-4 w-4" />
                </ButtonEffect>
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
                <div className="bg-blue-500/10 p-3 rounded-full mb-4">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Global Network</h3>
                <p className="text-sm text-gray-600 text-center">Decentralized CIPS replaces traditional SWIFT system</p>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-blue-500/10 p-3 rounded-full mb-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Secure Transactions</h3>
                <p className="text-sm text-gray-600 text-center">End-to-end encrypted for maximum security and privacy</p>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-blue-500/10 p-3 rounded-full mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
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
