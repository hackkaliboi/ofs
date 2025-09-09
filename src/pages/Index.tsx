import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumHero } from '../components/home/PremiumHero';
import Footer from '../components/layout/Footer';
import { ChevronDown, TrendingUp, Shield, Zap, Users, Star, Award, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
// Removed heavy animation components for better performance

// Lazy load components for better performance
const PremiumFeatures = lazy(() => import('../components/home/PremiumFeatures').then(module => ({ default: module.PremiumFeatures })));
const PremiumStats = lazy(() => import('../components/home/PremiumStats').then(module => ({ default: module.PremiumStats })));
const PremiumTestimonials = lazy(() => import('../components/home/PremiumTestimonials').then(module => ({ default: module.PremiumTestimonials })));
const PremiumCTA = lazy(() => import('../components/home/PremiumCTA').then(module => ({ default: module.PremiumCTA })));
const CryptoMarket = lazy(() => import('../components/home/CryptoMarket'));
const Integration = lazy(() => import('../components/home/Integration'));

// Simplified loading component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);
  
  // Removed heavy scroll progress tracking for better performance

  const sections = [
    { id: 'hero', component: <PremiumHero /> },
    { 
      id: 'stats', 
      component: (
        <Suspense fallback={<SectionLoader />}>
          <PremiumStats />
        </Suspense>
      )
    },
    { 
      id: 'features', 
      component: (
        <Suspense fallback={<SectionLoader />}>
          <PremiumFeatures />
        </Suspense>
      )
    },
    { 
      id: 'testimonials', 
      component: (
        <Suspense fallback={<SectionLoader />}>
          <PremiumTestimonials />
        </Suspense>
      )
    },
    { 
      id: 'cta', 
      component: (
        <Suspense fallback={<SectionLoader />}>
          <PremiumCTA />
        </Suspense>
      )
    },
    { 
      id: 'integration', 
      component: (
        <Suspense fallback={<SectionLoader />}>
          <Integration />
        </Suspense>
      )
    },
    { 
      id: 'market', 
      component: (
        <Suspense fallback={<SectionLoader />}>
          <CryptoMarket />
        </Suspense>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden scroll-optimized">
      {/* Static Background Effects - No Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/2 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-400/2 rounded-full blur-3xl" />
      </div>

      {/* Static Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      </div>
      
      {/* Removed Particle System for Better Performance */}

      {/* Static Progress Indicator - No scroll animation for better performance */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 z-50" />

      {/* Main Content */}
      <div className="relative z-10">
        {sections.map((section, index) => {
          return (
            <div key={section.id} className="relative">
              {/* Simplified section rendering - No scroll animations for better performance */}
              <div className="opacity-100">
                {section.component}
              </div>
              
              {/* Static Section Separator */}
              {index < sections.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent my-12" />
              )}
            </div>
          );
        })}
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
