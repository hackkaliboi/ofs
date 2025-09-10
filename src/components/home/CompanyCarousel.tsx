import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CompanyImage {
  src: string;
  alt: string;
  name: string;
}

const CompanyCarousel = () => {
  // Company/Partner images from wallets - using only images that exist in the project
  const companies: CompanyImage[] = [
    // Wallet partners - all available in /public/wallets/
    { src: '/wallets/metamask.png', alt: 'MetaMask', name: 'MetaMask' },
    { src: '/wallets/trust.png', alt: 'Trust Wallet', name: 'Trust Wallet' },
    { src: '/wallets/ledger.png', alt: 'Ledger', name: 'Ledger' },
    { src: '/wallets/exodus.png', alt: 'Exodus', name: 'Exodus' },
    { src: '/wallets/atomic.png', alt: 'Atomic Wallet', name: 'Atomic Wallet' },
    { src: '/wallets/rainbow.png', alt: 'Rainbow', name: 'Rainbow' },
    { src: '/wallets/safepal.png', alt: 'SafePal', name: 'SafePal' },
    { src: '/wallets/crypto.png', alt: 'Crypto.com', name: 'Crypto.com' },
    { src: '/wallets/infinity.png', alt: 'Infinity Wallet', name: 'Infinity Wallet' },
    { src: '/wallets/lobstr.png', alt: 'Lobstr', name: 'Lobstr' },
    { src: '/wallets/mathwallet.png', alt: 'Math Wallet', name: 'Math Wallet' },
    { src: '/wallets/unstoppable.png', alt: 'Unstoppable Wallet', name: 'Unstoppable' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate every 3 seconds when not hovered
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === companies.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, companies.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === companies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? companies.length - 1 : prevIndex - 1
    );
  };

  // Get visible items based on screen size
  const getVisibleItems = () => {
    // Show 4 on desktop, 3 on tablet, 2 on mobile
    return {
      desktop: 4,
      tablet: 3,
      mobile: 2
    };
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/30 to-gray-900/50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent mb-4"
          >
            Trusted Partners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Integrated with leading wallet providers for seamless crypto management
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-yellow-400/20"
            aria-label="Previous partners"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-yellow-400/20"
            aria-label="Next partners"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/30 via-black/20 to-gray-900/30 backdrop-blur-sm border border-yellow-400/10">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleItems.desktop)}%)`
              }}
            >
              {companies.map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 w-1/2 sm:w-1/3 lg:w-1/4 p-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 h-32 flex flex-col items-center justify-center backdrop-blur-sm border border-gray-700/30 hover:border-yellow-400/30 transition-all duration-300"
                  >
                    {/* Company Logo */}
                    <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
                      <img
                        src={company.src}
                        alt={company.alt}
                        className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Company Name */}
                    <span className="text-sm font-medium text-gray-300 group-hover:text-yellow-400 transition-colors duration-300 text-center">
                      {company.name}
                    </span>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/0 to-amber-400/0 group-hover:from-yellow-400/5 group-hover:to-amber-400/5 transition-all duration-300" />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(companies.length / visibleItems.desktop) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * visibleItems.desktop)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${Math.floor(currentIndex / visibleItems.desktop) === index
                    ? 'bg-yellow-400 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 text-sm md:text-base">
            Join thousands of users who trust SolmintX for secure crypto management
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyCarousel;