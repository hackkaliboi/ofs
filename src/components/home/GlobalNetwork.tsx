
import React from "react";
import { Globe as GlobeIcon, Network, Zap, Shield } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Globe from "@/components/ui/Globe";

const GlobalNetwork = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-50/20 to-transparent z-0" />
      <div className="absolute top-20 right-0 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <Globe size={400} color="#4f46e5" className="float" />
                
                {/* Connection dots */}
                <div className="absolute top-[15%] left-[20%] w-4 h-4 bg-blue-500 rounded-full pulse-slow"></div>
                <div className="absolute top-[30%] right-[25%] w-3 h-3 bg-purple-500 rounded-full pulse-slow" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-[25%] left-[30%] w-3 h-3 bg-teal-500 rounded-full pulse-slow" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-[20%] right-[20%] w-4 h-4 bg-orange-500 rounded-full pulse-slow" style={{animationDelay: '1.5s'}}></div>
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
                  <line x1="20%" y1="15%" x2="80%" y2="85%" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="1" />
                  <line x1="75%" y1="30%" x2="25%" y2="75%" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="1" />
                  <line x1="20%" y1="15%" x2="75%" y2="30%" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="1" />
                  <line x1="30%" y1="75%" x2="80%" y2="85%" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={2}>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-sm font-medium border border-indigo-100 shadow-sm mb-4">
                <span className="animate-pulse mr-2">●</span> Global Infrastructure
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Worldwide <span className="text-gradient-purple">Decentralized Network</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our quantum financial system operates on a globally distributed network, ensuring 
                security, redundancy, and lightning-fast transactions anywhere in the world.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="gradient-card gradient-card-purple hover-3d">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 mr-3">
                      <Network className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Decentralized Structure</h3>
                  </div>
                  <p className="text-gray-600">Fault-tolerant architecture with no single point of failure</p>
                </div>
                
                <div className="gradient-card gradient-card-blue hover-3d">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 mr-3">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Instant Processing</h3>
                  </div>
                  <p className="text-gray-600">Sub-second transaction times across continents</p>
                </div>
                
                <div className="gradient-card gradient-card-teal hover-3d">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-teal-500/10 mr-3">
                      <GlobeIcon className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Global Reach</h3>
                  </div>
                  <p className="text-gray-600">Accessible from 200+ countries and territories</p>
                </div>
                
                <div className="gradient-card gradient-card-orange hover-3d">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 mr-3">
                      <Shield className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Enhanced Security</h3>
                  </div>
                  <p className="text-gray-600">Quantum-resistant encryption at every network node</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default GlobalNetwork;
