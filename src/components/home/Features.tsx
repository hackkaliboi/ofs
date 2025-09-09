
import React from "react";
import { Shield, Cpu, Zap, Globe, Lock, Coins, Network, Layers } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const features = [
  {
    icon: Cpu,
    title: "Smart Contracts",
    description: "Automated, trustless execution of complex financial agreements with zero intermediaries.",
    cardStyle: "gradient-card-blue",
    iconGradient: "from-yellow-400 to-amber-500",
    textGradient: "text-gradient-blue"
  },
  {
    icon: Shield,
    title: "Zero-Knowledge Proofs",
    description: "Privacy-preserving transactions that maintain complete anonymity while ensuring security.",
    cardStyle: "gradient-card-gold",
    iconGradient: "from-yellow-400 to-amber-500",
    textGradient: "text-gradient-gold"
  },
  {
    icon: Network,
    title: "Cross-Chain Bridge",
    description: "Seamlessly transfer assets across multiple blockchain networks with minimal fees.",
    cardStyle: "gradient-card-emerald",
    iconGradient: "from-emerald-400 to-yellow-500",
    textGradient: "text-gradient-emerald"
  },
  {
    icon: Zap,
    title: "Lightning Speed",
    description: "Sub-second transaction finality powered by advanced Layer 2 scaling solutions.",
    cardStyle: "gradient-card-amber",
    iconGradient: "from-amber-400 to-yellow-500",
    textGradient: "text-gradient-amber"
  },
  {
    icon: Coins,
    title: "Yield Farming",
    description: "Maximize returns through automated liquidity provision and staking rewards.",
    cardStyle: "gradient-card-indigo",
    iconGradient: "from-yellow-400 to-amber-500",
    textGradient: "text-gradient-blue"
  },
  {
    icon: Layers,
    title: "Multi-Layer Security",
    description: "Military-grade encryption with multi-signature wallets and hardware security modules.",
    cardStyle: "gradient-card-rose",
    iconGradient: "from-rose-400 to-amber-500",
    textGradient: "text-gradient-rainbow"
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-gradient-to-b from-black via-yellow-900/10 to-black relative overflow-hidden">
      {/* Gold & Black Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-yellow-400/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-radial from-amber-400/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-yellow-500/5 to-transparent rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd700' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Blockchain flow elements */}
      <div className="absolute top-10 left-0 w-full h-1 overflow-hidden">
        <div className="w-8 h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-blockchain-flow"></div>
      </div>
      <div className="absolute bottom-20 left-0 w-full h-0.5 overflow-hidden">
        <div className="w-6 h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-blockchain-flow" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Matrix rain effect */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i}
          className="absolute w-0.5 h-20 bg-gradient-to-b from-yellow-400/30 to-transparent animate-matrix-rain"
          style={{
            left: `${10 + i * 15}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${6 + Math.random() * 3}s`
          }}
        />
      ))}
      
      <div className="container-custom relative z-10">
        <AnimatedSection animation="fade" delay={1}>
          <div className="text-center max-w-4xl mx-auto mb-20">
            <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-md text-yellow-300 text-sm font-bold border border-yellow-400/30 shadow-lg shadow-yellow-400/20 mb-6">
              <span className="animate-pulse mr-2 inline-block h-2 w-2 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50">●</span> 
              🔮 NEXT-GEN FEATURES
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-white font-mono">WEB3</span><br/>
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                SUPERPOWERS
              </span>
            </h2>
            <p className="text-xl text-yellow-100/80 leading-relaxed font-light">
              Unlock the full potential of decentralized finance with cutting-edge blockchain technology.
              <br/>
              <span className="text-yellow-400 font-semibold">Built for the future. Available today.</span>
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="stagger" staggerDelay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="group relative h-full perspective-1000 reveal-stagger-child">
                {/* Enhanced Glassmorphism card */}
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-900/50 backdrop-blur-2xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-700 hover:transform hover:scale-[1.02] hover:-translate-y-2 hover:rotate-y-12 shadow-2xl shadow-black/50 hover:shadow-yellow-400/20">
                  {/* Multi-layer glow effects */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.iconGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-2xl`}></div>
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/10 to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Animated border gradient */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/50 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Glass reflection effect */}
                  <div className="absolute top-0 left-0 w-full h-1/2 rounded-t-3xl bg-gradient-to-b from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Enhanced Icon container */}
                  <div className={`relative mb-8 w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.iconGradient} p-0.5 shadow-2xl shadow-yellow-400/40 group-hover:shadow-yellow-400/60 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                    <div className="w-full h-full rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                      {/* Icon glow background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconGradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                      <feature.icon className={`relative h-10 w-10 text-yellow-400 group-hover:text-yellow-300 transition-all duration-500 group-hover:scale-110 drop-shadow-lg`} />
                    </div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-yellow-300 transition-all duration-500 group-hover:transform group-hover:translate-x-1">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-100 transition-all duration-500 text-base group-hover:transform group-hover:translate-x-1">
                    {feature.description}
                  </p>
                  
                  {/* Interactive elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse shadow-lg shadow-yellow-400/50"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                  
                  {/* Floating particles effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`absolute w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000 animate-float`}
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + i * 20}%`,
                          animationDelay: `${i * 0.5}s`,
                          animationDuration: `${3 + i}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Enhanced background glow with multiple layers */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.iconGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl -z-10 transform group-hover:scale-110`}></div>
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-amber-400/20 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl -z-20 transform group-hover:scale-105`}></div>
              </div>
            ))}
          </div>
        </AnimatedSection>
        
        {/* Bottom CTA */}
        <AnimatedSection animation="scale" delay={4}>
          <div className="text-center mt-20">
            <div className="inline-flex items-center space-x-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-md border border-yellow-400/30">
              <Globe className="h-6 w-6 text-yellow-400 animate-pulse" />
              <span className="text-yellow-300 font-semibold">Join 500K+ DeFi pioneers</span>
              <Lock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Features;
