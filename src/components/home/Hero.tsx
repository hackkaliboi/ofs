
import React from "react";
import { ArrowRight, Shield, Lock, BarChart, Globe, Zap, Phone } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 to-purple-900">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Radial glow effects */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-gradient-radial from-purple-400/20 to-transparent opacity-70 rounded-full blur-3xl"></div>
      
      {/* Animated circles */}
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white drop-shadow-sm">
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
          
          {/* Right column - Mobile App Display */}
          <div className="lg:col-span-6 relative">
            <AnimatedSection delay={2}>
              <div className="relative z-10 transform lg:scale-110">
                {/* Hand holding phone */}
                <div className="relative">
                  {/* Phone mockup */}
                  <div className="mx-auto w-[280px] md:w-[320px] relative z-10">
                    <div className="rounded-[40px] overflow-hidden border-[8px] border-gray-900 shadow-2xl shadow-blue-900/20 relative">
                      <div className="absolute top-0 w-full h-6 bg-gray-900 z-20"></div>
                      <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gray-800 rounded-full z-30"></div>
                      <div className="aspect-[9/19.5] bg-gray-900 relative overflow-hidden">
                        {/* App content */}
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900">
                          {/* App UI */}
                          <div className="p-4 text-white">
                            {/* Status bar */}
                            <div className="flex justify-between items-center mb-4">
                              <div className="text-xs">9:41</div>
                              <div className="flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* App header */}
                            <div className="flex justify-between items-center mb-6">
                              <div>
                                <h2 className="text-lg font-semibold">Markets</h2>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Tabs */}
                            <div className="flex space-x-2 mb-6">
                              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 text-xs font-medium">
                                Top Charts
                              </div>
                              <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
                                Assets
                              </div>
                              <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
                                Watchlist
                              </div>
                            </div>
                            
                            {/* Market cards */}
                            <div className="mb-4">
                              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/50 to-indigo-800/50 backdrop-blur-md border border-indigo-500/20 mb-3">
                                <div className="flex justify-between mb-2">
                                  <div className="text-xs text-indigo-200">OFS Coin</div>
                                  <div className="text-xs text-green-400">+5.3%</div>
                                </div>
                                <div className="text-lg font-bold">$46,347</div>
                                {/* Simple chart */}
                                <div className="h-6 mt-2 flex items-end space-x-0.5">
                                  {[3,5,4,7,5,8,6,9,8,7,8,9,10].map((h, i) => (
                                    <div key={i} className="w-1 bg-indigo-300/70 rounded-t" style={{height: `${h*3}px`}}></div>
                                  ))}
                                </div>
                              </div>
                              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/70 to-orange-600/70 backdrop-blur-md border border-amber-500/20">
                                <div className="flex justify-between mb-2">
                                  <div className="text-xs text-amber-100">OFS Token</div>
                                  <div className="text-xs text-green-300">+2.8%</div>
                                </div>
                                <div className="text-lg font-bold">$516.93</div>
                                {/* Simple chart */}
                                <div className="h-6 mt-2 flex items-end space-x-0.5">
                                  {[5,7,6,4,8,7,6,8,9,7,8,9,7].map((h, i) => (
                                    <div key={i} className="w-1 bg-amber-300/70 rounded-t" style={{height: `${h*3}px`}}></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {/* Bottom navigation */}
                            <div className="absolute bottom-1 left-0 right-0 p-2">
                              <div className="flex justify-around items-center bg-white/5 backdrop-blur-lg rounded-full py-2 px-3">
                                <div className="p-1 rounded-full bg-white/10">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                </div>
                                <div>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                </div>
                                <div>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating coin graphics */}
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
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
