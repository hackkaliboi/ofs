import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Eye } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-600/5 pointer-events-none" />
      <div className="fixed top-20 left-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex-grow relative z-10">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Privacy & Security</span>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-invert max-w-none"
            >
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                At OFSLEDGER, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our platform.
              </p>

              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Personal identification information (name, email address, phone number)</li>
                  <li>Account credentials</li>
                  <li>Transaction data</li>
                  <li>Communication preferences</li>
                  <li>Device and usage information</li>
                </ul>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">How We Use Your Information</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Provide and maintain our services</li>
                  <li>Process your transactions</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Protect against fraudulent or illegal activity</li>
                </ul>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">Information Security</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  We implement appropriate technical and organizational security measures to protect your information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Regular security assessments and audits</li>
                  <li>Strict access controls and authentication</li>
                  <li>Continuous monitoring for suspicious activity</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to processing of your information</li>
                  <li>Receive a copy of your information</li>
                </ul>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy or our practices, please contact us at:
                </p>
                <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm border border-yellow-500/30 p-4 rounded-lg">
                  <p className="text-gray-300">Email: privacy@ofsledger.com</p>
                  <p className="text-gray-300">Phone: +1 (888) OFS-HELP</p>
                  <p className="text-gray-300">
                    Address: 123 Financial District<br />
                    San Francisco, CA 94111<br />
                    United States
                  </p>
                </div>
              </motion.section>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mt-12"
              >
                <Link to="/terms">
                  <Button 
                    variant="outline" 
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-300"
                  >
                    Terms of Service
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    variant="outline" 
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
