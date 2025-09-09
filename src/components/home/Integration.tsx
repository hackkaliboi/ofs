
import React from "react";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ButtonEffect from "@/components/ui/ButtonEffect";

const Integration = () => {
  return (
    <section id="integrations" className="section-padding relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.05),transparent_50%)]" />
      </div>
      
      <div className="container-custom relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 mb-6">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Enterprise Integration</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Seamless Integration{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Ecosystem
              </span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Connect with exchanges, DeFi protocols, and financial services through our secure API infrastructure.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection className="order-2 lg:order-1">
            <div className="space-y-8">
              <div className="custodia-card group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-400/20 border border-yellow-400/30">
                    <ExternalLink className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">Exchange Connectivity</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Direct integration with major exchanges allows for seamless trading while assets remain in secure custody.
                    </p>
                    <a href="#" className="text-yellow-400 font-medium inline-flex items-center hover:text-yellow-300 transition-colors">
                      Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="custodia-card group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-400/20 border border-yellow-400/30">
                    <ExternalLink className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">DeFi Protocol Access</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Securely participate in staking, lending, and other DeFi activities without compromising custody.
                    </p>
                    <a href="#" className="text-yellow-400 font-medium inline-flex items-center hover:text-yellow-300 transition-colors">
                      Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="custodia-card group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-400/20 border border-yellow-400/30">
                    <ExternalLink className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">Enterprise API</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                       Robust API suite for customized integration with your existing systems and workflows.
                     </p>
                     <a href="#" className="text-yellow-400 font-medium inline-flex items-center hover:text-yellow-300 transition-colors">
                       Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                     </a>
                   </div>
                 </div>
               </div>
             </div>
           </AnimatedSection>
          
          <AnimatedSection delay={2} className="order-1 lg:order-2">
            <div className="custodia-card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-amber-400/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400/20 to-amber-400/20 border border-yellow-400/30">
                    <Sparkles className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Developer Resources</h3>
                </div>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Comprehensive documentation, SDK, and developer tools to build secure integrations with the Custodia platform.
                </p>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500 text-black font-bold text-lg">1</div>
                    <p className="font-semibold text-white">Explore API documentation</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500 text-black font-bold text-lg">2</div>
                    <p className="font-semibold text-white">Download SDK and sample code</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500 text-black font-bold text-lg">3</div>
                    <p className="font-semibold text-white">Connect to sandbox environment</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500 text-black font-bold text-lg">4</div>
                    <p className="font-semibold text-white">Go live with production integration</p>
                  </div>
                </div>
                
                <ButtonEffect variant="primary" className="group w-full justify-center bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold">
                  Access Developer Portal <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </ButtonEffect>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Integration;
