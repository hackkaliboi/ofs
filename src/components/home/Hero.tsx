
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
              Digital Asset Custody Platform
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gradient">Secure</span> & <span className="text-gradient">Direct</span> Custody for Your Digital Assets
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={3}>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Institutional-grade security with zero counterparty risk. Manage your digital assets with confidence through our state-of-the-art custody platform.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonEffect variant="primary" className="group">
                Get Started <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonEffect>
              <ButtonEffect variant="secondary">
                Book a Demo
              </ButtonEffect>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={4} className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-6 flex flex-col items-center">
                <div className="bg-custodia/10 p-3 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-custodia" />
                </div>
                <h3 className="font-medium mb-2">Zero Counterparty Risk</h3>
                <p className="text-sm text-gray-600 text-center">Direct custody with no intermediaries</p>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center">
                <div className="bg-custodia/10 p-3 rounded-full mb-4">
                  <Lock className="h-6 w-6 text-custodia" />
                </div>
                <h3 className="font-medium mb-2">Multi-Layer Security</h3>
                <p className="text-sm text-gray-600 text-center">Military-grade encryption protocols</p>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center">
                <div className="bg-custodia/10 p-3 rounded-full mb-4">
                  <BarChart className="h-6 w-6 text-custodia" />
                </div>
                <h3 className="font-medium mb-2">Seamless Integration</h3>
                <p className="text-sm text-gray-600 text-center">Connect with exchanges and DeFi apps</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Hero;
