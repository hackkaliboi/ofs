
import React from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Updated partners with reliable image URLs
const partners = [
  { 
    name: "Stellar", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Stellar_Symbol.png" 
  },
  { 
    name: "Polygon", 
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png" 
  },
  { 
    name: "Solana", 
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png" 
  },
  { 
    name: "Avalanche", 
    logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png" 
  },
  { 
    name: "Cosmos", 
    logo: "https://cryptologos.cc/logos/cosmos-atom-logo.png" 
  },
  { 
    name: "Polkadot", 
    logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" 
  },
];

const Partners = () => {
  return (
    <section id="partners" className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-indigo-50/80 z-0" />
      <div className="absolute top-10 right-10 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl spin-slow" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-sm font-medium border border-indigo-100 shadow-sm mb-4">
              <span className="animate-pulse mr-2">●</span> Strategic Partners
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Backed by <span className="text-gradient-purple">Industry Leaders</span>
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
                className="flex items-center justify-center p-6 rounded-xl shadow-sm border border-gray-100 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="max-h-12 opacity-80 hover:opacity-100 transition-all duration-300" 
                  onError={(e) => {
                    // Fallback for any loading errors
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/200x100/4f46e5/ffffff?text=" + partner.name;
                  }}
                />
              </div>
            ))}
          </div>
        </AnimatedSection>
        
        {/* Trust indicators */}
        <AnimatedSection delay={3}>
          <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center px-6 py-3 bg-indigo-50 rounded-lg">
              <div className="mr-4 p-2 bg-indigo-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">ISO 27001 Certified</div>
                <div className="text-xs text-gray-600">Enterprise-grade security standards</div>
              </div>
            </div>
            
            <div className="flex items-center px-6 py-3 bg-blue-50 rounded-lg">
              <div className="mr-4 p-2 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">SOC 2 Compliant</div>
                <div className="text-xs text-gray-600">Audited annually for maximum security</div>
              </div>
            </div>
            
            <div className="flex items-center px-6 py-3 bg-purple-50 rounded-lg">
              <div className="mr-4 p-2 bg-purple-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
