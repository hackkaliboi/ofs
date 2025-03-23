
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Shield, Lock, Database, AlertTriangle } from "lucide-react";

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container-custom">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Security Policy</h1>
              <p className="text-lg text-gray-600">
                At OFSLEDGER, we prioritize the security of your assets and personal information above all else. Our comprehensive security measures are designed to provide maximum protection.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={1}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-7 w-7 text-indigo-600" />
                <h2 className="text-2xl font-semibold">Our Security Commitment</h2>
              </div>
              
              <p className="text-gray-700 mb-6">
                OFSLEDGER employs state-of-the-art security protocols to safeguard your assets and personal information. Our security infrastructure is built on the principles of confidentiality, integrity, and availability, ensuring that your data is protected at all times.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {securityMeasures.map((measure, index) => (
                  <div key={index} className="flex gap-3">
                    <Lock className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{measure.title}</h3>
                      <p className="text-gray-600">{measure.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={2}>
            <div className="bg-indigo-50 rounded-xl p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-7 w-7 text-indigo-600" />
                <h2 className="text-2xl font-semibold">Data Protection</h2>
              </div>
              
              <p className="text-gray-700 mb-6">
                Protecting your data is fundamental to our security strategy. We implement the following measures to ensure your data remains secure:
              </p>
              
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-white rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-indigo-600 font-semibold">1</span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Data Encryption:</span> All sensitive data is encrypted both at rest and in transit.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-white rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-indigo-600 font-semibold">2</span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Secure Storage:</span> User data is stored on secure servers with restricted access.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-white rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-indigo-600 font-semibold">3</span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Access Controls:</span> Strict access controls and authentication mechanisms are in place.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-white rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-indigo-600 font-semibold">4</span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Regular Backups:</span> Data is regularly backed up to prevent loss in case of system failures.
                  </p>
                </li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={3}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-7 w-7 text-amber-500" />
                <h2 className="text-2xl font-semibold">Security Incident Response</h2>
              </div>
              
              <p className="text-gray-700 mb-6">
                Despite our robust security measures, we have a comprehensive incident response plan in place to address any potential security breaches promptly and effectively.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Detection & Monitoring</h3>
                  <p className="text-gray-600">
                    Our systems are continuously monitored for suspicious activities. We employ advanced threat detection tools to identify potential security incidents in real-time.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Incident Response Team</h3>
                  <p className="text-gray-600">
                    Our dedicated incident response team is available 24/7 to investigate and address any security concerns promptly.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Communication Protocol</h3>
                  <p className="text-gray-600">
                    In the event of a security incident that may affect you, we will notify you promptly with information about the incident and steps you should take to protect your account.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={4}>
            <div className="text-center">
              <p className="text-gray-600">
                For more information about our security practices or to report a security concern, please contact our security team at <a href="mailto:security@ofsledger.com" className="text-indigo-600 hover:underline">security@ofsledger.com</a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SecurityPolicy;
