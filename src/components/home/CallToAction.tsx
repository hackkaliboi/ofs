
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section id="call-to-action" className="section-padding relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background z-0" />
      
      {/* Animated background particles */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full blur-xl animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              backgroundColor: 'black',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="container-custom relative z-10">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium backdrop-blur-md border border-primary/30">
              <Sparkles className="h-4 w-4 mr-2" />
              Join the Financial Revolution
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground drop-shadow-md">
              Ready to Secure Your Digital Financial Future?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground drop-shadow-sm">
              Join thousands of users already benefiting from OFSLEDGER's revolutionary quantum financial system.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/sign-up">
                <button className="gradient-btn group text-base sm:text-lg hover:shadow-lg">
                  <span className="flex items-center">
                    Create Your Account 
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
              <Link to="/contact">
                <button className="gradient-btn-secondary group text-base sm:text-lg hover:shadow-lg">
                  <span className="flex items-center">
                    Contact Our Team
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
      
      {/* Wave pattern at bottom */}
      <div className="absolute bottom-0 left-0 w-full z-10 overflow-hidden leading-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-10 sm:h-16 md:h-20 relative block">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.27C57.71,118.92,128.07,111.44,184.26,103.88,260.16,92.83,276.6,83.62,321.39,56.44Z" className="fill-background"></path>
        </svg>
      </div>
    </section>
  );
};

export default CallToAction;
