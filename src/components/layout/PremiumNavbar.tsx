import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown, Shield, Zap, Globe, Users,
  BarChart3, Settings, HelpCircle, Phone, Mail,
  ArrowRight, Star, Award, TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import ConnectWallet from '../ConnectWallet';

// TypeScript interfaces
interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface FeaturedItem {
  title: string;
  description: string;
  image: string;
  href: string;
}

interface MegaMenuData {
  title: string;
  sections: MenuSection[];
  featured?: FeaturedItem;
}

// Mega Menu Data
const megaMenuData = {
  products: {
    title: 'Products & Services',
    sections: [
      {
        title: 'Core Platform',
        items: [
          { name: 'Wallet Management', href: '/wallet', icon: Shield, description: 'Secure multi-chain wallet infrastructure' },
          { name: 'Asset Trading', href: '/trading', icon: TrendingUp, description: 'Advanced trading tools and analytics' },
          { name: 'Liquidity Pool', href: '/liquidity-pool', icon: Zap, description: 'Provide liquidity and earn rewards' },
          { name: 'DeFi Integration', href: '/defi', icon: Zap, description: 'Seamless DeFi protocol connections' },
          { name: 'Staking Rewards', href: '/staking', icon: Award, description: 'Maximize your crypto earnings' }
        ]
      },
      {
        title: 'Enterprise Solutions',
        items: [
          { name: 'API Access', href: '/api', icon: Settings, description: 'Developer-friendly blockchain APIs' },
          { name: 'White Label', href: '/white-label', icon: Users, description: 'Custom branded solutions' },
          { name: 'Analytics Suite', href: '/analytics', icon: BarChart3, description: 'Advanced blockchain analytics' },
          { name: 'Compliance Tools', href: '/compliance', icon: Shield, description: 'Regulatory compliance made easy' }
        ]
      }
    ],
    featured: {
      title: 'Featured Integration',
      description: 'New partnership with leading DeFi protocols',
      image: '/placeholder.svg',
      href: '/partnerships'
    }
  },
  company: {
    title: 'Company',
    sections: [
      {
        title: 'About Us',
        items: [
          { name: 'Create Token', href: '/create-token', icon: Users, description: 'Create your own custom token' },
          { name: 'Team', href: '/team', icon: Star, description: 'Meet our world-class team' },
          { name: 'Careers', href: '/careers', icon: TrendingUp, description: 'Join our growing team' },
          { name: 'Press Kit', href: '/press', icon: Globe, description: 'Media resources and assets' }
        ]
      },
      {
        title: 'Resources',
        items: [

          { name: 'Blog', href: '/blog', icon: BarChart3, description: 'Latest insights and updates' },
          { name: 'Support Center', href: '/support', icon: Phone, description: '24/7 customer support' },
          { name: 'Contact Us', href: '/contact', icon: Mail, description: 'Get in touch with our team' }
        ]
      }
    ]
  }
};

// Animated Logo Component
const AnimatedLogo = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center space-x-3"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-black" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg blur opacity-50" />
      </motion.div>
      <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
        SolmintX
      </span>
    </motion.div>
  );
};

// Mega Menu Component
const MegaMenu = ({ data, isOpen, onClose }: { data: MegaMenuData; isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-yellow-400/20 shadow-2xl z-50"
          onMouseLeave={onClose}
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Menu Sections */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-8">{data.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.sections.map((section: MenuSection, sectionIndex: number) => (
                    <div key={sectionIndex}>
                      <h4 className="text-lg font-semibold text-yellow-400 mb-4">{section.title}</h4>
                      <div className="space-y-3">
                        {section.items.map((item: MenuItem, itemIndex: number) => {
                          const Icon = item.icon;
                          return (
                            <motion.div
                              key={itemIndex}
                              whileHover={{ x: 5 }}
                              className="group"
                            >
                              <Link
                                to={item.href}
                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-yellow-400/10 transition-all duration-300"
                                onClick={onClose}
                              >
                                <Icon className="w-5 h-5 text-yellow-400 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                                <div>
                                  <div className="font-medium text-white group-hover:text-yellow-400 transition-colors duration-300">
                                    {item.name}
                                  </div>
                                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                    {item.description}
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-auto mt-0.5" />
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Section */}
              {data.featured && (
                <div className="lg:col-span-1">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-yellow-400/10 to-amber-400/10 border border-yellow-400/30 rounded-2xl p-6 h-full"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Featured</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{data.featured.title}</h4>
                    <p className="text-gray-300 mb-6">{data.featured.description}</p>
                    <Link
                      to={data.featured.href}
                      className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300"
                      onClick={onClose}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Navigation Item Component
const NavItem = ({
  children,
  href,
  hasDropdown = false,
  isActive = false,
  onClick,
  onMouseEnter,
  onMouseLeave
}: {
  children: React.ReactNode;
  href?: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  const content = (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer group ${isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-white'
        }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center space-x-1">
        <span className="font-medium">{children}</span>
        {hasDropdown && (
          <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
        )}
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        layoutId="navHover"
      />

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full"
        />
      )}
    </motion.div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
};

export const PremiumNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);

  // Removed heavy scroll transforms for better performance

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { name: 'Home', href: '/', hasDropdown: false },
    { name: 'Create Token', href: '/create-token', hasDropdown: false },
    { name: 'Liquidity Pool', href: '/liquidity-pool', hasDropdown: false },
    { name: 'Contact', href: '/contact', hasDropdown: false }
  ];

  return (
    <motion.nav
      ref={navRef}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(20px)' }}
      className={`fixed top-8 left-6 right-6 z-50 transition-all duration-500 rounded-3xl ${isScrolled ? 'border border-yellow-400/30 shadow-2xl' : 'border border-white/20'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <NavItem
                key={item.name}
                href={item.href}
                hasDropdown={item.hasDropdown}
                isActive={location.pathname === item.href}
              >
                {item.name}
              </NavItem>
            ))}
            <ConnectWallet
              variant="outline"
              className="text-gray-300 hover:text-white border-gray-600 hover:border-yellow-400"
            />
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-medium transition-all duration-300"
                >
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mega Menus */}
      <MegaMenu
        data={megaMenuData.products}
        isOpen={activeMegaMenu === 'products'}
        onClose={() => setActiveMegaMenu(null)}
      />
      <MegaMenu
        data={megaMenuData.company}
        isOpen={activeMegaMenu === 'company'}
        onClose={() => setActiveMegaMenu(null)}
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-yellow-400/20"
          >
            <div className="px-6 py-8 space-y-6">
              {menuItems.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to={item.href || '#'}
                    className="block text-lg font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ConnectWallet
                  variant="outline"
                  className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                />
              </motion.div>

              <div className="pt-6 border-t border-yellow-400/20 space-y-4">
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};