
import React from "react";
import { ArrowRight, Shield, Lock, BarChart } from "lucide-react";
import ButtonEffect from "@/components/ui/ButtonEffect";
import AnimatedSection from "@/components/ui/AnimatedSection";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-36 md:pb-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-custodia-surface to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-custodia/5 rounded-full blur-3xl" />
      <div className="absolute top-20 -left-20 w-80 h-80 bg-custodia/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-custodia/10 text-custodia-dark text-sm font-medium">
              Quantum Financial System
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Welcome to <span className="text-gradient">OFSLEDGER</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={3}>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Put an end to corruption, usury, and manipulation within the banking system. 
              Our system ensures 100% financial security and transparency for all currency holders.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonEffect variant="primary" className="group">
                Connect Wallet <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonEffect>
              <ButtonEffect variant="secondary">
                Learn More
              </ButtonEffect>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={4} className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-6 flex flex-col items-center">
                <div className="bg-custodia/10 p-3 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-custodia" />
                </div>
                <h3 className="font-medium mb-2">Asset-Backed System</h3>
                <p className="text-sm text-gray-600 text-center">Not a cryptocurrency, but backed by real assets</p>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center">
                <div className="bg-custodia/10 p-3 rounded-full mb-4">
                  <Lock className="h-6 w-6 text-custodia" />
                </div>
                <h3 className="font-medium mb-2">Global Network</h3>
                <p className="text-sm text-gray-600 text-center">Replaces SWIFT with decentralized CIPS</p>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center">
                <div className="bg-custodia/10 p-3 rounded-full mb-4">
                  <BarChart className="h-6 w-6 text-custodia" />
                </div>
                <h3 className="font-medium mb-2">Secure Validation</h3>
                <p className="text-sm text-gray-600 text-center">Validate your digital assets for maximum security</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Hero;
