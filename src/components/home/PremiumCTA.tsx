import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, Shield, Zap, Users, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Button } from '../ui/button';

const enterpriseFeatures = [
  { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade protection with multi-layer encryption' },
  { icon: Zap, title: 'Lightning Performance', desc: 'Sub-second processing with 99.99% uptime SLA' },
  { icon: Users, title: '24/7 Support', desc: 'Dedicated success team and priority assistance' }
];

const benefits = [
  'White-glove onboarding and migration',
  'Custom integrations and API access',
  'Dedicated account management',
  'Priority feature requests',
  'Advanced analytics and reporting',
  'Compliance and audit support'
];

const stats = [
  { value: '$50B+', label: 'Assets Under Management' },
  { value: '99.99%', label: 'Uptime Guarantee' },
  { value: '500+', label: 'Enterprise Clients' },
  { value: '<100ms', label: 'Average Response Time' }
];

export const PremiumCTA: React.FC = () => {
  return (
    <section className="py-32 bg-gradient-to-br from-background via-background/90 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent transform rotate-12 scale-150" 
               style={{
                 backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(var(--primary), 0.1) 50%, transparent 100%)',
                 backgroundSize: '100px 2px',
                 backgroundRepeat: 'repeat-y'
               }} />
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 mb-8 bg-gradient-to-r from-primary/10 to-primary/10 backdrop-blur-sm border border-primary/30 rounded-full text-primary font-medium"
            >
              <Target className="w-5 h-5 mr-2" />
              Ready to Transform Your Business?
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Elevate to
              </span>
              <br />
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Enterprise Excellence
              </span>
            </h2>
            
            <p className="text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Join the elite tier of organizations leveraging cutting-edge blockchain technology. 
              Experience enterprise-grade security, lightning-fast performance, and unparalleled support.
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="text-center group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-card/40 backdrop-blur-sm border border-border group-hover:border-primary/50 rounded-2xl p-6 transition-all duration-500">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main CTA Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-3xl font-bold text-foreground mb-8">
              Enterprise Benefits
            </h3>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="flex items-center group"
                >
                  <CheckCircle className="w-6 h-6 text-primary mr-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center text-primary font-medium"
            >
              <Star className="w-5 h-5 mr-2 fill-current" />
              Trusted by Fortune 500 companies worldwide
            </motion.div>
          </motion.div>

          {/* Right: CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center lg:text-left"
          >
            <div className="space-y-6">
              <Button
                size="lg"
                className="group relative w-full lg:w-auto px-12 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold text-xl rounded-2xl btn-premium ripple magnetic focus-premium gpu-accelerated"
                onClick={() => window.location.href = '/dashboard'}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Get Enterprise Access
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-3"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="group w-full lg:w-auto px-12 py-6 border-2 border-primary/50 hover:border-primary text-primary hover:text-primary-foreground hover:bg-primary font-bold text-xl rounded-2xl btn-premium magnetic focus-premium gpu-accelerated gradient-border"
                onClick={() => window.location.href = '/dashboard'}
              >
                <Award className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Schedule Demo
              </Button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-muted-foreground text-sm mt-6"
            >
              No setup fees • 30-day money-back guarantee • SOC 2 Type II certified
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {enterpriseFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Icon className="relative w-12 h-12 text-yellow-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};