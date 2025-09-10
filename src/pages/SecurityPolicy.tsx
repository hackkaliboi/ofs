
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Shield, Lock, Database, AlertTriangle, FileText, Eye } from "lucide-react";

const SecurityPolicy = () => {
  const securityMeasures = [
    {
      title: "End-to-End Encryption",
      description: "All data transmitted through our platform is encrypted using industry-standard encryption protocols, ensuring that your sensitive information cannot be intercepted."
    },
    {
      title: "Multi-Factor Authentication",
      description: "We implement multi-factor authentication to add an extra layer of security beyond your password, preventing unauthorized access to your account."
    },
    {
      title: "Regular Security Audits",
      description: "Our systems undergo regular security audits by independent third-party security experts to identify and address potential vulnerabilities."
    },
    {
      title: "Cold Storage for Digital Assets",
      description: "The majority of digital assets are stored in offline, cold storage facilities, protected from online threats and unauthorized access."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Fixed gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-600/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.1),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.05),transparent_50%)] pointer-events-none" />

      <Navbar />

      <main className="flex-grow pt-28 pb-16">
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Security Policy</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Security Policy
              </h1>
              <p className="text-lg text-gray-300">
                At SolmintX, we prioritize the security of your assets and personal information above all else. Our comprehensive security measures are designed to provide maximum protection.
              </p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={1}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-8 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl font-semibold text-white">Our Security Commitment</h2>
              </div>

              <p className="text-gray-300 mb-6">
                OFSLEDGER employs state-of-the-art security protocols to safeguard your assets and personal information. Our security infrastructure is built on the principles of confidentiality, integrity, and availability, ensuring that your data is protected at all times.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {securityMeasures.map((measure, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex gap-3"
                  >
                    <Lock className="h-6 w-6 text-yellow-400 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-white">{measure.title}</h3>
                      <p className="text-gray-300">{measure.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-8 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl font-semibold text-white">Data Protection</h2>
              </div>

              <p className="text-gray-300 mb-6">
                Protecting your data is fundamental to our security strategy. We implement the following measures to ensure your data remains secure:
              </p>

              <ul className="space-y-4">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex gap-3"
                >
                  <div className="bg-yellow-500/20 rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-yellow-400 font-semibold">1</span>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">Data Encryption:</span> All sensitive data is encrypted both at rest and in transit.
                  </p>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex gap-3"
                >
                  <div className="bg-yellow-500/20 rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-yellow-400 font-semibold">2</span>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">Secure Storage:</span> User data is stored on secure servers with restricted access.
                  </p>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex gap-3"
                >
                  <div className="bg-yellow-500/20 rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-yellow-400 font-semibold">3</span>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">Access Controls:</span> Strict access controls and authentication mechanisms are in place.
                  </p>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex gap-3"
                >
                  <div className="bg-yellow-500/20 rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-yellow-400 font-semibold">4</span>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">Regular Backups:</span> Data is regularly backed up to prevent loss in case of system failures.
                  </p>
                </motion.li>
              </ul>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-8 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl font-semibold text-white">Security Incident Response</h2>
              </div>

              <p className="text-gray-300 mb-6">
                Despite our robust security measures, we have a comprehensive incident response plan in place to address any potential security breaches promptly and effectively.
              </p>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h3 className="font-semibold text-lg mb-2 text-white">Detection & Monitoring</h3>
                  <p className="text-gray-300">
                    Our systems are continuously monitored for suspicious activities. We employ advanced threat detection tools to identify potential security incidents in real-time.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <h3 className="font-semibold text-lg mb-2 text-white">Incident Response Team</h3>
                  <p className="text-gray-300">
                    Our dedicated incident response team is available 24/7 to investigate and address any security concerns promptly.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <h3 className="font-semibold text-lg mb-2 text-white">Communication Protocol</h3>
                  <p className="text-gray-300">
                    In the event of a security incident that may affect you, we will notify you promptly with information about the incident and steps you should take to protect your account.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">Contact Security Team</h3>
              </div>
              <p className="text-gray-300">
                For more information about our security practices or to report a security concern, please contact our security team at <a href="mailto:security@ofsledger.com" className="text-yellow-400 hover:text-yellow-300 transition-colors">security@ofsledger.com</a>
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SecurityPolicy;
