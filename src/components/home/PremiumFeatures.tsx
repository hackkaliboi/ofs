import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import {
  Shield, Zap, Globe, Users, BarChart3, Settings,
  Lock, Cpu, Database, Cloud, ArrowRight, Play,
  CheckCircle, Star, TrendingUp, Award, Eye,
  Code, Layers, Smartphone, Monitor
} from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

// TypeScript interfaces
interface FeatureStat {
  label: string;
  value: string;
}

interface FeatureDemo {
  type: string;
  component: string;
}

interface PremiumFeature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  stats: FeatureStat[];
  features: string[];
  demo: FeatureDemo;
  gradient: string;
  borderGradient: string;
}

// Feature Data
const premiumFeatures = [
  {
    id: 'security',
    icon: Shield,
    title: 'Military-Grade Security',
    subtitle: 'Bank-level encryption & multi-layer protection',
    description: 'Advanced cryptographic protocols with hardware security modules, multi-signature wallets, and real-time threat detection.',
    stats: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Encryption', value: 'AES-256' },
      { label: 'Audits', value: '12+' }
    ],
    features: [
      'Hardware Security Modules (HSM)',
      'Multi-signature wallet architecture',
      'Real-time fraud detection',
      'Biometric authentication',
      'Cold storage integration'
    ],
    demo: {
      type: 'interactive',
      component: 'SecurityDemo'
    },
    gradient: 'from-red-500/20 to-orange-500/20',
    borderGradient: 'from-red-400 to-orange-400'
  },
  {
    id: 'performance',
    icon: Zap,
    title: 'Lightning-Fast Performance',
    subtitle: 'Sub-second transaction processing',
    description: 'Optimized blockchain infrastructure delivering institutional-grade performance with global scalability.',
    stats: [
      { label: 'Speed', value: '<100ms' },
      { label: 'TPS', value: '50,000+' },
      { label: 'Nodes', value: '1,000+' }
    ],
    features: [
      'Layer 2 scaling solutions',
      'Optimistic rollups',
      'Cross-chain bridges',
      'Load balancing',
      'Edge computing'
    ],
    demo: {
      type: 'chart',
      component: 'PerformanceDemo'
    },
    gradient: 'from-yellow-500/20 to-amber-500/20',
    borderGradient: 'from-yellow-400 to-amber-400'
  },
  {
    id: 'global',
    icon: Globe,
    title: 'Global Infrastructure',
    subtitle: 'Worldwide presence & compliance',
    description: 'Distributed network spanning 6 continents with local compliance and regulatory adherence.',
    stats: [
      { label: 'Countries', value: '150+' },
      { label: 'Data Centers', value: '25' },
      { label: 'Compliance', value: '100%' }
    ],
    features: [
      'Multi-region deployment',
      'Local regulatory compliance',
      'Geographic redundancy',
      'CDN optimization',
      '24/7 global support'
    ],
    demo: {
      type: 'map',
      component: 'GlobalDemo'
    },
    gradient: 'from-yellow-500/20 to-amber-500/20',
    borderGradient: 'from-yellow-400 to-amber-400'
  },
  {
    id: 'enterprise',
    icon: Users,
    title: 'Enterprise Solutions',
    subtitle: 'Scalable infrastructure for institutions',
    description: 'White-label solutions, custom integrations, and dedicated support for enterprise clients.',
    stats: [
      { label: 'Clients', value: '500+' },
      { label: 'Assets', value: '$2.5B+' },
      { label: 'SLA', value: '99.9%' }
    ],
    features: [
      'White-label platform',
      'Custom API development',
      'Dedicated account management',
      'Priority support',
      'Custom compliance'
    ],
    demo: {
      type: 'dashboard',
      component: 'EnterpriseDemo'
    },
    gradient: 'from-yellow-500/20 to-amber-500/20',
    borderGradient: 'from-yellow-400 to-amber-400'
  }
];

// Interactive Security Demo
const SecurityDemo = () => {
  const [activeLayer, setActiveLayer] = useState(0);
  const layers = ['Encryption', 'Authentication', 'Monitoring', 'Storage'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % layers.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [layers.length]);

  return (
    <div className="relative h-64 bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Central Shield */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center"
          >
            <Shield className="w-10 h-10 text-black" />
          </motion.div>

          {/* Security Layers */}
          {layers.map((layer, index) => (
            <motion.div
              key={layer}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${activeLayer === index ? 'text-yellow-400' : 'text-gray-500'
                }`}
              style={{
                transform: `translate(-50%, -50%) rotate(${index * 90}deg) translateY(-60px)`,
              }}
              animate={{
                scale: activeLayer === index ? 1.2 : 1,
                opacity: activeLayer === index ? 1 : 0.5
              }}
            >
              <div className="transform -rotate-90">
                <div className="text-sm font-medium">{layer}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between text-xs">
          {layers.map((layer, index) => (
            <div key={layer} className={`flex items-center space-x-1 ${activeLayer === index ? 'text-yellow-400' : 'text-gray-500'
              }`}>
              <div className={`w-2 h-2 rounded-full ${activeLayer === index ? 'bg-yellow-400' : 'bg-gray-600'
                }`} />
              <span>{layer}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Performance Chart Demo
const PerformanceDemo = () => {
  const [data, setData] = useState([20, 45, 30, 80, 60, 90, 75]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(() => Math.random() * 100));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-64 bg-gradient-to-br from-gray-900 to-black rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-white font-medium">Real-time Performance</h4>
        <div className="flex items-center space-x-2 text-yellow-400">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span className="text-sm">Live</span>
        </div>
      </div>

      <div className="flex items-end justify-between h-40 space-x-2">
        {data.map((value, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-t from-yellow-400 to-amber-500 rounded-t"
            style={{ width: '12%' }}
            animate={{ height: `${value}%` }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>

      <div className="flex justify-between mt-4 text-xs text-gray-400">
        {['1s', '2s', '3s', '4s', '5s', '6s', '7s'].map(time => (
          <span key={time}>{time}</span>
        ))}
      </div>
    </div>
  );
};

// Global Network Demo
const GlobalDemo = () => {
  const [activeRegion, setActiveRegion] = useState(0);
  const regions = ['North America', 'Europe', 'Asia Pacific', 'South America'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRegion((prev) => (prev + 1) % regions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [regions.length]);

  return (
    <div className="h-64 bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 relative overflow-hidden">
      {/* World Map Representation */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-xl" />
      </div>

      <div className="relative z-10">
        <h4 className="text-white font-medium mb-6">Global Network Status</h4>

        <div className="grid grid-cols-2 gap-4">
          {regions.map((region, index) => (
            <motion.div
              key={region}
              className={`p-3 rounded-lg border transition-all duration-500 ${activeRegion === index
                  ? 'bg-yellow-400/10 border-yellow-400/50 text-yellow-400'
                  : 'bg-black/50 border-yellow-500/30 text-gray-400'
                }`}
              animate={{
                scale: activeRegion === index ? 1.05 : 1
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{region}</span>
                <div className={`w-2 h-2 rounded-full ${activeRegion === index ? 'bg-yellow-400' : 'bg-gray-600'
                  } animate-pulse`} />
              </div>
              <div className="text-xs mt-1 opacity-75">
                {activeRegion === index ? 'Active' : 'Standby'}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="text-2xl font-bold text-yellow-400">150+</div>
          <div className="text-sm text-gray-400">Countries Served</div>
        </div>
      </div>
    </div>
  );
};

// Enterprise Dashboard Demo
const EnterpriseDemo = () => {
  const [metrics, setMetrics] = useState({
    users: 1250,
    transactions: 45680,
    volume: 2.5,
    uptime: 99.99
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        users: prev.users + Math.floor(Math.random() * 10),
        transactions: prev.transactions + Math.floor(Math.random() * 100),
        volume: prev.volume + (Math.random() * 0.1),
        uptime: 99.99
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-64 bg-gradient-to-br from-gray-900 to-black rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-white font-medium">Enterprise Dashboard</h4>
        <div className="flex items-center space-x-2">
          <Monitor className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-yellow-400">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-yellow-400 text-lg font-bold">
            {metrics.users.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Active Users</div>
        </div>

        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-yellow-400 text-lg font-bold">
            {metrics.transactions.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Transactions</div>
        </div>

        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-yellow-400 text-lg font-bold">
            ${metrics.volume.toFixed(1)}B
          </div>
          <div className="text-xs text-gray-400">Volume</div>
        </div>

        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-yellow-400 text-lg font-bold">
            {metrics.uptime}%
          </div>
          <div className="text-xs text-gray-400">Uptime</div>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ feature, index }: { feature: PremiumFeature; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const renderDemo = () => {
    switch (feature.demo.component) {
      case 'SecurityDemo':
        return <SecurityDemo />;
      case 'PerformanceDemo':
        return <PerformanceDemo />;
      case 'GlobalDemo':
        return <GlobalDemo />;
      case 'EnterpriseDemo':
        return <EnterpriseDemo />;
      default:
        return null;
    }
  };

  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Glow */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
      />

      {/* Main Card */}
      <motion.div
        className="relative bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 h-full overflow-hidden card-premium gpu-accelerated"
        animate={{
          borderColor: isHovered ? `rgb(${feature.borderGradient.includes('yellow') ? '251, 191, 36' : '156, 163, 175'})` : 'rgb(31, 41, 55)',
          y: isHovered ? -5 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 md:mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <motion.div
              className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r ${feature.gradient} border border-gray-700 magnetic float-animation`}
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0
              }}
            >
              <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </motion.div>

            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1">{feature.title}</h3>
              <p className="text-sm md:text-base text-gray-400">{feature.subtitle}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDemo(!showDemo)}
            className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 btn-premium ripple focus-premium self-start sm:self-auto"
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{showDemo ? 'Hide' : 'Demo'}</span>
            <span className="sm:hidden">{showDemo ? 'Hide' : 'View'}</span>
          </Button>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 leading-relaxed">{feature.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
          {feature.stats.map((stat: FeatureStat, statIndex: number) => (
            <motion.div
              key={statIndex}
              className="text-center p-2 md:p-3 bg-black/50 rounded-lg md:rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 + statIndex * 0.1 }}
            >
              <div className="text-sm md:text-lg lg:text-xl font-bold text-yellow-400 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-6">
          {feature.features.map((item: string, itemIndex: number) => (
            <motion.div
              key={itemIndex}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 + itemIndex * 0.1 }}
            >
              <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-gray-300">{item}</span>
            </motion.div>
          ))}
        </div>

        {/* Interactive Demo */}
        <AnimatePresence>
          {showDemo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              {renderDemo()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          className="flex items-center justify-between pt-4 md:pt-6 border-t border-gray-800"
          animate={{
            borderColor: isHovered ? 'rgb(251, 191, 36)' : 'rgb(31, 41, 55)'
          }}
        >
          <span className="text-sm md:text-base text-gray-400">Learn more about this feature</span>
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            className="text-yellow-400"
          >
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const PremiumFeatures = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-amber-400/5 rounded-full blur-3xl" />
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
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 mb-6 md:mb-8 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 backdrop-blur-sm border border-yellow-400/30 rounded-full text-yellow-400 font-medium text-sm md:text-base pulse-glow magnetic shimmer"
          >
            <Star className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Enterprise-Grade Features
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Built for the
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
              Future of Finance
            </span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Experience cutting-edge blockchain technology with enterprise-grade security,
            lightning-fast performance, and global scalability.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {premiumFeatures.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-12 md:mt-16 lg:mt-20"
        >
          <Link to="/sign-up">
            <Button
              size="lg"
              className="group px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-semibold text-base md:text-lg rounded-xl md:rounded-2xl btn-premium ripple magnetic focus-premium gpu-accelerated"
            >
              <span className="hidden sm:inline">Explore All Features</span>
              <span className="sm:hidden">Explore Features</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.div>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};