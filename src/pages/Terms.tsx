import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import { FileText, Shield, Users, Scale } from "lucide-react";

const Terms = () => {
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
                <FileText className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Legal Terms</span>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Terms of Service
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-invert max-w-none"
            >
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Welcome to OFSLEDGER. By accessing our platform, you agree to be bound by these Terms of Service.
                Please read these terms carefully before using our services.
              </p>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
                </div>
                <p className="text-gray-300">
                  By accessing or using SolmintX's platform and services, you agree to be bound by these Terms
                  of Service and all applicable laws and regulations. If you do not agree with any of these terms,
                  you are prohibited from using or accessing our services.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">2. Platform Services</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  SolmintX provides the following services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Digital asset validation and verification</li>
                  <li>Blockchain transaction monitoring</li>
                  <li>Secure wallet management</li>
                  <li>Financial reporting and analytics</li>
                  <li>API access for enterprise integration</li>
                </ul>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">3. User Responsibilities</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  As a user of our platform, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Use the platform responsibly and ethically</li>
                  <li>Report any security concerns or suspicious activity</li>
                </ul>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">4. Intellectual Property</h2>
                </div>
                <p className="text-gray-300">
                  All content, features, and functionality of the SolmintX platform, including but not limited
                  to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations,
                  and software, are the exclusive property of SolmintX and are protected by international
                  copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">5. Limitation of Liability</h2>
                </div>
                <p className="text-gray-300">
                  OFSLEDGER shall not be liable for any indirect, incidental, special, consequential, or
                  punitive damages, including without limitation, loss of profits, data, use, goodwill, or
                  other intangible losses, resulting from your access to or use of or inability to access
                  or use the platform.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">6. Modifications to Terms</h2>
                </div>
                <p className="text-gray-300">
                  OFSLEDGER reserves the right to modify or replace these Terms of Service at any time.
                  We will notify users of any material changes via email or through the platform. Your
                  continued use of the platform after such modifications constitutes acceptance of the
                  updated terms.
                </p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">7. Contact Information</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm border border-yellow-500/30 p-4 rounded-lg">
                  <p className="text-gray-300">Email: legal@ofsledger.com</p>
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
                transition={{ duration: 0.6, delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4 mt-12"
              >
                <Link to="/privacy">
                  <Button
                    variant="outline"
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-300"
                  >
                    Privacy Policy
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

export default Terms;
