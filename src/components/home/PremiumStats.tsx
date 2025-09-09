import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useSpring, useTransform } from 'framer-motion';
import { 
  TrendingUp, Users, DollarSign, Shield, Globe, 
  Zap, Award, BarChart3, Activity, Target,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';

// TypeScript interfaces
interface StatTrend {
  value: number;
  isPositive: boolean;
}

interface StatData {
  id: string;
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: StatTrend;
  description: string;
  color: string;
  chart: number[];
}

// Animated Counter Hook
const useAnimatedCounter = (end: number, duration: number = 2000, startDelay: number = 0) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const start = () => {
    if (hasStarted) return;
    setHasStarted(true);
    
    setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(end * easeOutQuart));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      animate();
    }, startDelay);
  };

  return { count, start, hasStarted };
};

// Real-time Chart Component
const RealTimeChart = ({ data, color = 'yellow' }: { data: number[]; color?: string }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  return (
    <div className="h-32 flex items-end justify-between space-x-1">
      {data.map((value, index) => {
        const height = ((value - minValue) / range) * 100;
        return (
          <motion.div
            key={index}
            className={`bg-gradient-to-t from-${color}-400 to-${color}-300 rounded-t-sm`}
            style={{ width: '8px' }}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          />
        );
      })}
    </div>
  );
};

// Circular Progress Component
const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = 'yellow',
  delay = 0
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  delay?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(55, 65, 81)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`rgb(${color === 'yellow' ? '251, 191, 36' : '245, 158, 11'})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, delay, ease: "easeOut" }}
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-2xl font-bold text-${color}-400`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

// Trend Indicator Component
const TrendIndicator = ({ value, isPositive }: { value: number; isPositive: boolean }) => {
  const Icon = isPositive ? ArrowUp : ArrowDown;
  const colorClass = isPositive ? 'text-yellow-400' : 'text-yellow-400';
  
  return (
    <div className={`flex items-center space-x-1 ${colorClass}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{value}%</span>
    </div>
  );
};

// Enhanced Stats Data with More Impressive Numbers
const statsData = [
  {
    id: 'users',
    title: 'Active Users',
    value: 12500000,
    suffix: '+',
    icon: Users,
    trend: { value: 24.8, isPositive: true },
    description: 'Verified global users',
    color: 'yellow',
    chart: [8.2, 9.1, 9.8, 10.5, 11.2, 11.8, 12.1, 12.3, 12.4, 12.5, 12.6, 12.7]
  },
  {
    id: 'volume',
    title: 'Trading Volume',
    value: 847.2,
    prefix: '$',
    suffix: 'B',
    icon: DollarSign,
    trend: { value: 18.7, isPositive: true },
    description: '24h trading volume',
    color: 'amber',
    chart: [650, 720, 780, 810, 825, 840, 845, 847, 848, 849, 850, 852]
  },
  {
    id: 'transactions',
    title: 'Transactions',
    value: 2847000,
    suffix: '/sec',
    icon: Zap,
    trend: { value: 32.4, isPositive: true },
    description: 'Peak throughput capacity',
    color: 'yellow',
    chart: [1800, 2100, 2350, 2500, 2650, 2750, 2800, 2820, 2835, 2840, 2845, 2847]
  },
  {
    id: 'security',
    title: 'Security Score',
    value: 99.97,
    suffix: '%',
    icon: Shield,
    trend: { value: 0.03, isPositive: true },
    description: 'Uptime & security rating',
    color: 'amber',
    chart: [99.85, 99.88, 99.90, 99.92, 99.94, 99.95, 99.96, 99.97, 99.97, 99.97, 99.97, 99.98]
  },
  {
    id: 'countries',
    title: 'Global Reach',
    value: 195,
    suffix: '+',
    icon: Globe,
    trend: { value: 12.8, isPositive: true },
    description: 'Countries & territories',
    color: 'yellow',
    chart: [165, 172, 178, 182, 186, 189, 191, 193, 194, 195, 195, 196]
  },
  {
    id: 'awards',
    title: 'Industry Awards',
    value: 127,
    suffix: '+',
    icon: Award,
    trend: { value: 28.5, isPositive: true },
    description: 'Global recognition',
    color: 'amber',
    chart: [85, 92, 98, 105, 112, 118, 122, 124, 125, 126, 127, 128]
  },
  {
    id: 'validators',
    title: 'Network Validators',
    value: 50847,
    suffix: '+',
    icon: Activity,
    trend: { value: 15.2, isPositive: true },
    description: 'Decentralized nodes',
    color: 'yellow',
    chart: [42000, 44500, 46200, 47800, 48900, 49500, 50100, 50400, 50600, 50750, 50820, 50847]
  },
  {
    id: 'marketcap',
    title: 'Market Cap',
    value: 2.8,
    prefix: '$',
    suffix: 'T',
    icon: BarChart3,
    trend: { value: 45.6, isPositive: true },
    description: 'Total market value',
    color: 'amber',
    chart: [1.8, 2.0, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.75, 2.78, 2.79, 2.8]
  }
];

// Individual Stat Card Component
const StatCard = ({ stat, index }: { stat: StatData; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [chartData, setChartData] = useState(stat.chart);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const controls = useAnimation();
  
  const { count, start } = useAnimatedCounter(
    stat.value, 
    2000, 
    index * 200
  );

  const Icon = stat.icon;

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      start();
    }
  }, [isInView, controls, start]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1];
        const variation = (Math.random() - 0.5) * 10;
        const newValue = Math.max(0, lastValue + variation);
        newData.push(newValue);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number) => {
    if (stat.id === 'volume') {
      return value.toFixed(1);
    }
    if (stat.id === 'marketcap') {
      return value.toFixed(1);
    }
    if (stat.id === 'users') {
      return (value / 1000000).toFixed(1);
    }
    if (stat.id === 'transactions') {
      return (value / 1000000).toFixed(2);
    }
    if (stat.id === 'validators') {
      return (value / 1000).toFixed(0) + 'K';
    }
    if (stat.id === 'security') {
      return value.toFixed(2);
    }
    return value.toLocaleString();
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Glow */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r from-${stat.color}-400/20 to-amber-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
      />
      
      {/* Main Card */}
      <motion.div
        className="relative bg-black/40 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 h-full overflow-hidden"
        animate={{
          borderColor: isHovered ? `rgb(251, 191, 36)` : 'rgb(31, 41, 55)',
          y: isHovered ? -5 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`p-3 rounded-2xl bg-gradient-to-r from-${stat.color}-400/20 to-amber-400/20 border border-gray-700`}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0
            }}
          >
            <Icon className={`w-6 h-6 text-${stat.color}-400`} />
          </motion.div>
          
          <TrendIndicator 
            value={stat.trend.value} 
            isPositive={stat.trend.isPositive} 
          />
        </div>

        {/* Main Value */}
        <div className="mb-2">
          <div className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>
            {stat.prefix}{formatValue(count)}{stat.suffix}
          </div>
          <div className="text-gray-400 text-sm">{stat.description}</div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-4">{stat.title}</h3>

        {/* Mini Chart */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Real-time data</span>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 bg-${stat.color}-400 rounded-full animate-pulse`} />
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </div>
          <RealTimeChart data={chartData} color={stat.color} />
        </div>

        {/* Progress Ring for certain stats */}
        {(stat.id === 'security' || stat.id === 'users') && (
          <div className="flex justify-center mt-4">
            <CircularProgress 
              percentage={stat.id === 'security' ? stat.value : 85} 
              size={80} 
              strokeWidth={6}
              color={stat.color}
              delay={index * 0.2}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Global Stats Overview Component
const GlobalOverview = () => {
  const [globalMetrics, setGlobalMetrics] = useState({
    totalValue: 2.5,
    dailyGrowth: 12.5,
    activeNodes: 1250,
    networkHealth: 99.9
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalMetrics(prev => ({
        totalValue: prev.totalValue + (Math.random() * 0.1 - 0.05),
        dailyGrowth: prev.dailyGrowth + (Math.random() * 2 - 1),
        activeNodes: prev.activeNodes + Math.floor(Math.random() * 10 - 5),
        networkHealth: Math.max(99.5, Math.min(100, prev.networkHealth + (Math.random() * 0.2 - 0.1)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-8 mb-12"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Global Network Overview</h3>
        <p className="text-gray-400">Real-time blockchain network statistics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            ${globalMetrics.totalValue.toFixed(1)}B
          </div>
          <div className="text-sm text-gray-400">Total Value Locked</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            +{globalMetrics.dailyGrowth.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">24h Growth</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            {globalMetrics.activeNodes.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Active Nodes</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-400 mb-1">
            {globalMetrics.networkHealth.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Network Health</div>
        </div>
      </div>
    </motion.div>
  );
};

export const PremiumStats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 md:w-96 md:h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-96 md:h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-48 h-48 md:w-64 md:h-64 bg-yellow-300/3 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 mb-6 md:mb-8 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 backdrop-blur-sm border border-yellow-400/30 rounded-full text-yellow-400 font-medium text-sm md:text-base"
          >
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Real-time Analytics
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Performance
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
              That Speaks
            </span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Real-time metrics showcasing our platform's exceptional performance, 
            security, and global reach in the blockchain ecosystem.
          </p>
        </motion.div>

        {/* Global Overview */}
        <GlobalOverview />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {statsData.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-12 md:mt-16"
        >
          <div className="bg-gradient-to-r from-yellow-400/10 to-amber-400/10 backdrop-blur-sm border border-yellow-400/30 rounded-xl md:rounded-2xl p-6 md:p-8">
            <Activity className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-yellow-400 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Live Network Status</h3>
            <p className="text-sm md:text-base text-gray-400 mb-3 md:mb-4 px-4">
              All systems operational. Network performing at optimal capacity.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-yellow-400 font-medium text-sm md:text-base">All Systems Operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};