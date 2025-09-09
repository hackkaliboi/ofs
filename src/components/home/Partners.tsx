
import React from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Web3 partners with custom SVG graphics
const partners = [
  { 
    name: "Stellar", 
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <defs>
          <linearGradient id="stellar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#0099cc" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#stellar-grad)" />
        <path d="M30 50 L50 30 L70 50 L50 70 Z" fill="white" />
        <circle cx="50" cy="50" r="8" fill="white" />
      </svg>
    )
  },
  { 
    name: "Polygon", 
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <defs>
          <linearGradient id="polygon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8247e5" />
            <stop offset="100%" stopColor="#6c2bd9" />
          </linearGradient>
        </defs>
        <polygon points="50,15 75,35 75,65 50,85 25,65 25,35" fill="url(#polygon-grad)" />
        <polygon points="50,25 65,35 65,55 50,65 35,55 35,35" fill="white" />
      </svg>
    )
  },
  { 
    name: "Solana", 
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <defs>
          <linearGradient id="solana-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffa3" />
            <stop offset="50%" stopColor="#dc1fff" />
            <stop offset="100%" stopColor="#9945ff" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#solana-grad)" />
        <path d="M25 35 Q50 20 75 35 Q50 50 25 35" fill="white" />
        <path d="M25 65 Q50 50 75 65 Q50 80 25 65" fill="white" opacity="0.8" />
      </svg>
    )
  },
  { 
    name: "Avalanche", 
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <defs>
          <linearGradient id="avalanche-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e84142" />
            <stop offset="100%" stopColor="#c73e3a" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#avalanche-grad)" />
        <path d="M50 20 L70 55 L30 55 Z" fill="white" />
        <path d="M35 65 L45 65 L40 75 Z" fill="white" />
        <path d="M55 65 L65 65 L60 75 Z" fill="white" />
      </svg>
    )
  },
  { 
    name: "Cosmos", 
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <defs>
          <linearGradient id="cosmos-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e3148" />
            <stop offset="100%" stopColor="#1a1d29" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#cosmos-grad)" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="50" cy="25" r="5" fill="white" />
        <circle cx="75" cy="50" r="5" fill="white" />
        <circle cx="50" cy="75" r="5" fill="white" />
        <circle cx="25" cy="50" r="5" fill="white" />
      </svg>
    )
  },
  { 
    name: "Polkadot", 
    svg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12">
        <defs>
          <linearGradient id="polkadot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e6007a" />
            <stop offset="100%" stopColor="#c4005a" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#polkadot-grad)" />
        <circle cx="50" cy="35" r="8" fill="white" />
        <circle cx="35" cy="55" r="8" fill="white" />
        <circle cx="65" cy="55" r="8" fill="white" />
        <circle cx="50" cy="65" r="6" fill="white" opacity="0.8" />
      </svg>
    )
  },
];

const Partners = () => {
  return (
    <section id="partners" className="section-padding bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-primary/5 z-0" />
      <div className="absolute top-10 right-10 w-60 h-60 bg-yellow-500/5 rounded-full blur-3xl spin-slow" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-gray-400/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 shadow-sm mb-4">
              <span className="animate-pulse mr-2">●</span> Strategic Partners
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Backed by <span className="text-gradient">Industry Leaders</span>
            </h2>
            <p className="text-lg text-gray-600">
              We've partnered with the most trusted names in blockchain to build a secure and reliable financial ecosystem.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={2}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <div 
                key={partner.name} 
                className="group flex items-center justify-center p-6 rounded-xl shadow-sm border border-border bg-card/90 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 hover:border-primary/30"
              >
                <div className="opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse-slow">
                  {partner.svg}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
        
        {/* Trust indicators */}
        <AnimatedSection delay={3}>
          <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center px-6 py-3 bg-muted/30 rounded-lg">
              <div className="mr-4 p-2 bg-yellow-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">ISO 27001 Certified</div>
                <div className="text-xs text-gray-600">Enterprise-grade security standards</div>
              </div>
            </div>
            
            <div className="flex items-center px-6 py-3 bg-yellow-50 rounded-lg">
            <div className="mr-4 p-2 bg-yellow-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">SOC 2 Compliant</div>
                <div className="text-xs text-gray-600">Audited annually for maximum security</div>
              </div>
            </div>
            
            <div className="flex items-center px-6 py-3 bg-muted/30 rounded-lg">
              <div className="mr-4 p-2 bg-black rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">$100M Insurance</div>
                <div className="text-xs text-gray-600">Assets fully insured and protected</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Partners;
