
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ButtonEffect from "@/components/ui/ButtonEffect";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 z-0" />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
        <div className="absolute top-10 left-[10%] w-20 h-20 bg-white rounded-full blur-xl animate-pulse" />
        <div className="absolute top-[30%] left-[50%] w-12 h-12 bg-white rounded-full blur-lg animate-ping" style={{animationDuration: '3s'}} />
        <div className="absolute bottom-[20%] left-[20%] w-16 h-16 bg-white rounded-full blur-xl animate-pulse" style={{animationDuration: '4s'}} />
        <div className="absolute bottom-[30%] right-[15%] w-14 h-14 bg-white rounded-full blur-lg animate-ping" style={{animationDuration: '5s'}} />
      </div>
      
      <div className="container-custom relative z-10">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-md">
              <Sparkles className="h-4 w-4 mr-2" />
              Join the Financial Revolution
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white drop-shadow-md">
              Ready to Secure Your Digital Financial Future?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-50 drop-shadow-sm">
              Join thousands of users already benefiting from OFSLEDGER's revolutionary quantum financial system.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/sign-up">
                <button className="gradient-btn group text-base sm:text-lg hover:shadow-lg">
                  Create Your Account <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link to="/contact">
                <button className="gradient-btn-secondary group text-base sm:text-lg hover:shadow-lg">
                  Contact Our Team
                </button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
      
      {/* Wave pattern at bottom */}
      <div className="absolute bottom-0 left-0 w-full z-10 overflow-hidden leading-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-10 sm:h-16 md:h-20 relative block">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.27C57.71,118.92,128.07,111.44,184.26,103.88,260.16,92.83,276.6,83.62,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
};

export default CallToAction;
