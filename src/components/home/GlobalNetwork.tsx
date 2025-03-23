
import React from "react";
import { Globe as GlobeIcon, Network, Zap, Shield, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Globe from "@/components/ui/Globe";
import { Link } from "react-router-dom";

const GlobalNetwork = () => {
  return (
    <section id="network" className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-indigo-50/20 to-transparent z-0" />
      <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />
      <div className="absolute top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-400/5 rounded-full blur-2xl" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <Globe size={450} color="#4f46e5" className="float" dotSize={1.5} dotDensity={1.2} />
                
                {/* Add subtle glow effect to enhance the Globe presentation */}
                <div className="absolute inset-0 bg-gradient-radial from-indigo-500/5 to-transparent rounded-full blur-xl"></div>
                
                {/* Decorative elements around the Globe */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border-2 border-dashed border-indigo-200/20 rounded-full animate-spin-slow"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] border border-indigo-300/10 rounded-full"></div>
                
                {/* Status indicators around the Globe */}
                <div className="absolute top-10 right-10 flex items-center bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm border border-gray-100">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  <span className="text-xs font-medium text-gray-700">Network Active</span>
                </div>
                
                <div className="absolute bottom-10 left-10 flex items-center bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm border border-gray-100">
                  <span className="text-xs font-medium text-gray-700 mr-2">Nodes: 13,482</span>
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                </div>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
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
                
                <div className="gradient-card gradient-card-indigo hover-3d">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 mr-3">
                      <GlobeIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Global Reach</h3>
                  </div>
                  <p className="text-gray-600">Accessible from 200+ countries and territories</p>
                </div>
                
                <div className="gradient-card gradient-card-purple hover-3d">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 mr-3">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Enhanced Security</h3>
                  </div>
                  <p className="text-gray-600">Quantum-resistant encryption at every network node</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <p className="text-gray-600 font-medium">
                    Explore our global infrastructure in detail:
                  </p>
                  <Link to="/about">
                    <button className="gradient-btn group px-5 py-2 text-sm">
                      <span className="flex items-center">
                        View Network Status
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </button>
                  </Link>
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
