
import React from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ButtonEffect from "@/components/ui/ButtonEffect";

const Integration = () => {
  return (
    <section id="integrations" className="section-padding">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Seamless Integration Ecosystem
            </h2>
            <p className="text-lg text-gray-600">
              Connect with exchanges, DeFi protocols, and financial services through our secure API infrastructure.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection className="order-2 lg:order-1">
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3">Exchange Connectivity</h3>
                <p className="text-gray-600 mb-4">
                  Direct integration with major exchanges allows for seamless trading while assets remain in secure custody.
                </p>
                <a href="#" className="text-custodia font-medium inline-flex items-center">
                  Learn more <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3">DeFi Protocol Access</h3>
                <p className="text-gray-600 mb-4">
                  Securely participate in staking, lending, and other DeFi activities without compromising custody.
                </p>
                <a href="#" className="text-custodia font-medium inline-flex items-center">
                  Learn more <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold mb-3">Enterprise API</h3>
                <p className="text-gray-600 mb-4">
                  Robust API suite for customized integration with your existing systems and workflows.
                </p>
                <a href="#" className="text-custodia font-medium inline-flex items-center">
                  Learn more <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={2} className="order-1 lg:order-2">
            <div className="bg-gradient-to-br from-custodia-surface to-white p-8 rounded-2xl border border-custodia/10">
              <h3 className="text-2xl font-bold mb-4">Developer Resources</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive documentation, SDK, and developer tools to build secure integrations with the Custodia platform.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-custodia text-white font-semibold mr-4">1</div>
                  <p className="font-medium">Explore API documentation</p>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-custodia text-white font-semibold mr-4">2</div>
                  <p className="font-medium">Download SDK and sample code</p>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-custodia text-white font-semibold mr-4">3</div>
                  <p className="font-medium">Connect to sandbox environment</p>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-custodia text-white font-semibold mr-4">4</div>
                  <p className="font-medium">Go live with production integration</p>
                </div>
              </div>
              
              <ButtonEffect variant="primary" className="group w-full justify-center">
                Access Developer Portal <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonEffect>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Integration;
