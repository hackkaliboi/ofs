
import React from "react";
import { ArrowRight, Shield, BarChart, Globe } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Enhanced radial glow effects */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-blue-400/30 to-transparent opacity-70 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-gradient-radial from-purple-400/30 to-transparent opacity-70 rounded-full blur-3xl"></div>
      
      {/* Animated particles */}
      <div className="absolute top-20 right-10 w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl animate-pulse-slow" style={{animationDelay: '3s'}}></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column - Content */}
          <div className="lg:col-span-6">
            <AnimatedSection>
              <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-sm text-white text-sm font-medium border border-indigo-400/30 shadow-sm">
                <span className="animate-pulse mr-2 inline-block h-2 w-2 rounded-full bg-blue-400"></span> 
                Next Generation Oracle Finance
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
                Smart Trading, <br/>
                <span className="text-gradient bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">
                  Secure Assets.
                </span>
              </h1>
            </AnimatedSection>
            
            <AnimatedSection delay={2}>
              <p className="text-lg md:text-xl text-blue-50/90 mb-8 max-w-xl leading-relaxed">
                OFSLEDGER's oracle financial system transforms global finance with enterprise-grade security, lightning-fast transactions, and complete sovereignty over your digital assets.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={3}>
              <div className="flex flex-wrap gap-4">
                <Link to="/sign-in">
                  <button className="gradient-btn group px-6 py-3 rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300">
                    <span className="flex items-center">
                      Connect Wallet 
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
                <a href="#market">
                  <button className="bg-white/10 backdrop-blur-md hover:bg-white/15 text-white border border-white/20 px-6 py-3 rounded-full flex items-center shadow-lg transition-all duration-300">
                    View Market 
                    <BarChart className="ml-2 h-4 w-4" />
                  </button>
                </a>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={4}>
              <div className="mt-12 flex items-center space-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-900 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-medium">250k+</p>
                  <p className="text-blue-100/70 text-sm">Trusted users</p>
                </div>
                <div className="h-10 w-px bg-white/20"></div>
                <div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-white font-medium">10k+</span>
                  </div>
                  <p className="text-blue-100/70 text-sm">5-star reviews</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Right column - App Mockup */}
          <div className="lg:col-span-6 relative">
            <AnimatedSection delay={2}>
              <div className="relative">
                <img 
                  src="/lovable-uploads/b0660419-ff48-408b-b86c-aa674c117a77.png" 
                  alt="OFSLEDGER Mobile App" 
                  className="relative z-10 mx-auto w-[360px] md:w-[400px] drop-shadow-2xl rounded-[30px]"
                />
                
                {/* Floating particles around the phone */}
                <div className="absolute -top-6 -left-10 z-20 w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg animate-float" style={{animationDelay: '0.5s'}}>
                  <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-amber-800 font-bold">
                    $
                  </div>
                </div>
                <div className="absolute top-16 -right-12 z-20 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg animate-float" style={{animationDelay: '1.5s'}}>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 flex items-center justify-center text-white font-bold">
                    OFS
                  </div>
                </div>
                <div className="absolute bottom-20 -left-8 z-20 w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg animate-float" style={{animationDelay: '2.5s'}}>
                  <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-violet-300 to-violet-500 flex items-center justify-center text-white font-bold">
                    Φ
                  </div>
                </div>
                
                {/* Glow effects */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-2xl rounded-full transform scale-110"></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
