
import React from "react";
import { Globe as GlobeIcon, Network, Zap, Shield, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Globe from "@/components/ui/Globe";
import { Link } from "react-router-dom";

const GlobalNetwork = () => {
  return (
    <section id="network" className="section-padding bg-background relative overflow-hidden">
      {/* Background elements with gold/black theme */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-50/10 to-transparent z-0" />
      <div className="absolute top-20 -right-40 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      <div className="absolute top-20 -left-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-600/5 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-conic from-yellow-400/5 via-transparent to-yellow-600/5 animate-spin-slow" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <Globe size={450} color="#FFD700" className="float animate-pulse-slow" dotSize={2} dotDensity={1.5} />
                
                {/* Add subtle glow effect to enhance the Globe presentation */}
                <div className="absolute inset-0 bg-gradient-radial from-yellow-500/5 to-transparent rounded-full blur-xl"></div>
                
                {/* Enhanced decorative elements around the Globe */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] border-2 border-dashed border-yellow-400/30 rounded-full animate-spin-slow"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-yellow-500/20 rounded-full animate-spin-reverse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] border border-amber-400/15 rounded-full animate-pulse"></div>
                
                {/* Floating particles around globe */}
                <div className="absolute top-10 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-particle-float"></div>
                <div className="absolute bottom-20 left-10 w-1.5 h-1.5 bg-amber-500 rounded-full animate-particle-float" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-32 left-32 w-1 h-1 bg-yellow-500 rounded-full animate-particle-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-32 right-32 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-particle-float" style={{animationDelay: '0.5s'}}></div>
                
                {/* Status indicators around the Globe */}
                <div className="absolute top-10 right-10 flex items-center bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-yellow-400/30">
                  <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
                  <span className="text-xs font-medium text-white">Network Active</span>
                </div>
                
                <div className="absolute bottom-10 left-10 flex items-center bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-yellow-400/30">
                  <span className="text-xs font-medium text-white mr-2">Nodes: 13,482</span>
                  <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
                </div>
                
                <div className="absolute top-1/2 right-5 flex items-center bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-yellow-400/30">
                  <span className="text-xs font-medium text-white mr-2">TPS: 50K+</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={2}>
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-700 text-sm font-medium border border-yellow-200 shadow-sm mb-4">
                <span className="animate-pulse mr-2 text-yellow-500">●</span> Global Infrastructure
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Worldwide <span className="text-gradient bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Decentralized Network</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Our quantum financial system operates on a globally distributed network, ensuring 
                security, redundancy, and lightning-fast transactions anywhere in the world.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/5 p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-yellow-500/20 mr-3">
                      <Network className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">Decentralized Structure</h3>
                  </div>
                  <p className="text-gray-300">Fault-tolerant architecture with no single point of failure</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/5 p-6 rounded-xl border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/10">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 mr-3">
                      <Zap className="h-6 w-6 text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">Instant Processing</h3>
                  </div>
                  <p className="text-gray-300">Sub-second transaction times across continents</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-600/10 to-amber-500/5 p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-yellow-600/20 mr-3">
                      <GlobeIcon className="h-6 w-6 text-yellow-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">Global Reach</h3>
                  </div>
                  <p className="text-gray-300">Accessible from 200+ countries and territories</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-600/10 to-yellow-500/5 p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-amber-600/20 mr-3">
                      <Shield className="h-6 w-6 text-amber-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">Enhanced Security</h3>
                  </div>
                  <p className="text-gray-300">Quantum-resistant encryption at every network node</p>
                </div>
              </div>
              
              <div className="border-t border-yellow-400/20 pt-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <p className="text-gray-300 font-medium">
                    Explore our global infrastructure in detail:
                  </p>
                  <Link to="/about">
                    <button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25 group">
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
