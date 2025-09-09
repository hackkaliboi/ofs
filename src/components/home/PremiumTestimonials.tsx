import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Award, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../ui/button';

// TypeScript interfaces
interface TestimonialMetrics {
  improvement: string;
  label: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  metrics: TestimonialMetrics;
  featured: boolean;
}

// Testimonials Data
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Chief Technology Officer",
    company: "TechCorp Global",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    content: "OFSLEDGER has revolutionized our digital asset management. The security features are unparalleled, and the performance is exceptional. Our transaction processing time has decreased by 90%.",
    metrics: {
      improvement: "90%",
      label: "Faster Processing"
    },
    featured: true
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Head of Digital Assets",
    company: "Financial Dynamics",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    content: "The enterprise-grade security and compliance features have made OFSLEDGER our go-to platform. The multi-signature wallet architecture gives us complete peace of mind.",
    metrics: {
      improvement: "99.9%",
      label: "Security Uptime"
    },
    featured: true
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    role: "Blockchain Research Director",
    company: "Innovation Labs",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    content: "OFSLEDGER's advanced cryptographic protocols and real-time threat detection have exceeded our expectations. The platform scales beautifully with our growing needs.",
    metrics: {
      improvement: "300%",
      label: "Scalability Increase"
    },
    featured: true
  },
  {
    id: 4,
    name: "James Thompson",
    role: "CEO",
    company: "CryptoVentures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    content: "The global infrastructure and 24/7 support have been game-changing for our international operations. OFSLEDGER delivers on every promise.",
    metrics: {
      improvement: "150+",
      label: "Countries Served"
    },
    featured: false
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Risk Management Director",
    company: "SecureBank",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    content: "The compliance features and regulatory adherence make OFSLEDGER perfect for our banking operations. The audit trail is comprehensive and transparent.",
    metrics: {
      improvement: "100%",
      label: "Compliance Rate"
    },
    featured: false
  },
  {
    id: 6,
    name: "David Kumar",
    role: "Portfolio Manager",
    company: "Asset Management Pro",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    content: "OFSLEDGER's analytics and reporting capabilities have transformed how we manage our digital asset portfolios. The insights are invaluable.",
    metrics: {
      improvement: "$2.5B+",
      label: "Assets Managed"
    },
    featured: false
  }
];

// Success Metrics
const successMetrics = [
  {
    icon: TrendingUp,
    value: "500+",
    label: "Enterprise Clients",
    description: "Leading companies trust our platform"
  },
  {
    icon: Shield,
    value: "$2.5B+",
    label: "Assets Secured",
    description: "Digital assets under protection"
  },
  {
    icon: Award,
    value: "99.9%",
    label: "Client Satisfaction",
    description: "Consistently high ratings"
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
    description: "Based on 1000+ reviews"
  }
];

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative group ${
        testimonial.featured 
          ? 'lg:col-span-2 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 border-yellow-400/30' 
          : 'bg-gray-900/50 border-gray-700/50'
      } backdrop-blur-sm border rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-500`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-amber-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Quote Icon */}
      <div className="relative mb-6">
        <Quote className="w-8 h-8 text-yellow-400/60" />
      </div>

      {/* Content */}
      <div className="relative">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          "{testimonial.content}"
        </p>

        {/* Rating */}
        <div className="flex items-center mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>

        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full border-2 border-yellow-400/30 mr-4"
            />
            <div>
              <h4 className="text-white font-semibold">{testimonial.name}</h4>
              <p className="text-gray-400 text-sm">{testimonial.role}</p>
              <p className="text-yellow-400 text-sm font-medium">{testimonial.company}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">{testimonial.metrics.improvement}</div>
            <div className="text-gray-400 text-sm">{testimonial.metrics.label}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Success Metrics Component
const SuccessMetrics = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
    >
      {successMetrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center group"
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 group-hover:border-yellow-400/60 transition-all duration-500">
                <Icon className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-yellow-400 font-medium text-sm mb-2">{metric.label}</div>
                <div className="text-gray-400 text-xs">{metric.description}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export const PremiumTestimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featuredTestimonials = testimonials.filter(t => t.featured);
  const regularTestimonials = testimonials.filter(t => !t.featured);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredTestimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length);
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-64 h-64 md:w-96 md:h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 md:w-96 md:h-96 bg-amber-400/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 mb-6 md:mb-8 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 backdrop-blur-sm border border-yellow-400/30 rounded-full text-yellow-400 font-medium text-sm md:text-base"
          >
            <Star className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Client Success Stories
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Trusted by
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            See how leading enterprises are transforming their digital asset operations 
            with OFSLEDGER's cutting-edge platform.
          </p>
        </motion.div>

        {/* Success Metrics */}
        <SuccessMetrics />

        {/* Featured Testimonials Carousel */}
        <div className="mb-12 md:mb-16">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
              >
                <TestimonialCard 
                  testimonial={featuredTestimonials[currentSlide]} 
                  index={0}
                />
                <div className="hidden lg:block">
                  <TestimonialCard 
                    testimonial={featuredTestimonials[(currentSlide + 1) % featuredTestimonials.length]} 
                    index={1}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center mt-6 md:mt-8 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex space-x-2">
                {featuredTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-yellow-400 w-6 md:w-8' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Regular Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {regularTestimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-yellow-400/10 to-amber-400/10 backdrop-blur-sm border border-yellow-400/30 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-gray-400 text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Experience the same transformative results that our clients achieve every day. 
              Start your journey with OFSLEDGER today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 text-sm md:text-base"
              >
                <span className="hidden sm:inline">Start Free Trial</span>
                <span className="sm:hidden">Start Trial</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 text-sm md:text-base"
              >
                <span className="hidden sm:inline">Schedule Demo</span>
                <span className="sm:hidden">Demo</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumTestimonials;