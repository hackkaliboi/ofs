
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CheckCircle, Shield, FileText, Lock } from "lucide-react";

const Compliance = () => {
  const regulatoryItems = [
    {
      title: "GDPR Compliance",
      description: "We adhere to the European Union's General Data Protection Regulation, ensuring the highest standards of data privacy and security for all European users."
    },
    {
      title: "KYC/AML Procedures",
      description: "Our Know Your Customer and Anti-Money Laundering protocols ensure we verify the identity of all users and prevent illegal activities on our platform."
    },
    {
      title: "Secure Data Handling",
      description: "All personal and financial data is encrypted and stored according to industry best practices and compliance requirements."
    },
    {
      title: "Regular Audits",
      description: "Our systems undergo regular security audits by third-party experts to ensure compliance with regulatory requirements."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Fixed gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-600/5 pointer-events-none" />
      {/* Blurred background effects */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />

      <Navbar />

      <main className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container-custom">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-3 mb-6"
              >
                <Shield className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Compliance Framework</span>
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-100 to-yellow-200 bg-clip-text text-transparent">Compliance & Regulatory Framework</h1>
              <p className="text-lg text-gray-300">
                At SolmintX, we maintain the highest standards of compliance with financial regulations worldwide, ensuring a secure and legal environment for all users.
              </p>
            </div>
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
                <h2 className="text-2xl font-semibold text-white">Our Compliance Commitment</h2>
              </div>

              <p className="text-gray-300 mb-6">
                SolmintX is committed to full compliance with all applicable laws and regulations in the jurisdictions where we operate. Our platform is designed with compliance at its core, ensuring all transactions and validations meet or exceed regulatory requirements.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {regulatoryItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex gap-3"
                  >
                    <CheckCircle className="h-6 w-6 text-yellow-400 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-white">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
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
                <FileText className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl font-semibold text-white">Regulatory Guidelines We Follow</h2>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="font-semibold text-lg mb-2 text-white">Financial Authorities</h3>
                  <p className="text-gray-300">
                    We maintain compliance with guidelines from major financial authorities, including SEC, FINRA, FCA, and other international regulatory bodies.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h3 className="font-semibold text-lg mb-2 text-white">Data Protection Regulations</h3>
                  <p className="text-gray-300">
                    Our platform adheres to GDPR, CCPA, and other regional data protection regulations to ensure user data is properly protected.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h3 className="font-semibold text-lg mb-2 text-white">Cybersecurity Standards</h3>
                  <p className="text-gray-300">
                    We implement industry-leading cybersecurity standards, including ISO 27001, SOC 2, and NIST frameworks.
                  </p>
                </motion.div>
              </div>
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
                <Lock className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl font-semibold text-white">Compliance Documentation</h2>
              </div>

              <p className="text-gray-300 mb-6">
                Our compliance documentation is available to users and regulatory authorities upon request. This includes:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Privacy policies and procedures</li>
                <li>Data protection impact assessments</li>
                <li>Security incident response plans</li>
                <li>KYC/AML procedures documentation</li>
                <li>Third-party audit reports</li>
                <li>Regulatory filings and certifications</li>
              </ul>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 text-center bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-8"
            >
              <p className="text-gray-300">
                For more information about our compliance procedures or to request compliance documentation, please contact our compliance team at <a href="mailto:compliance@ofsledger.com" className="text-yellow-400 hover:text-yellow-300 transition-colors">compliance@ofsledger.com</a>
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Compliance;
