
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CheckCircle, Shield } from "lucide-react";

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container-custom">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Compliance & Regulatory Framework</h1>
              <p className="text-lg text-gray-600">
                At OFSLEDGER, we maintain the highest standards of compliance with financial regulations worldwide, ensuring a secure and legal environment for all users.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={1}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-7 w-7 text-indigo-600" />
                <h2 className="text-2xl font-semibold">Our Compliance Commitment</h2>
              </div>
              
              <p className="text-gray-700 mb-6">
                OFSLEDGER is committed to full compliance with all applicable laws and regulations in the jurisdictions where we operate. Our platform is designed with compliance at its core, ensuring all transactions and validations meet or exceed regulatory requirements.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {regulatoryItems.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={2}>
            <div className="bg-indigo-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6">Regulatory Guidelines We Follow</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Financial Authorities</h3>
                  <p className="text-gray-700">
                    We maintain compliance with guidelines from major financial authorities, including SEC, FINRA, FCA, and other international regulatory bodies.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Data Protection Regulations</h3>
                  <p className="text-gray-700">
                    Our platform adheres to GDPR, CCPA, and other regional data protection regulations to ensure user data is properly protected.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Cybersecurity Standards</h3>
                  <p className="text-gray-700">
                    We implement industry-leading cybersecurity standards, including ISO 27001, SOC 2, and NIST frameworks.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={3}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold mb-6">Compliance Documentation</h2>
              
              <p className="text-gray-700 mb-6">
                Our compliance documentation is available to users and regulatory authorities upon request. This includes:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Privacy policies and procedures</li>
                <li>Data protection impact assessments</li>
                <li>Security incident response plans</li>
                <li>KYC/AML procedures documentation</li>
                <li>Third-party audit reports</li>
                <li>Regulatory filings and certifications</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={4}>
            <div className="mt-12 text-center">
              <p className="text-gray-600">
                For more information about our compliance procedures or to request compliance documentation, please contact our compliance team at <a href="mailto:compliance@ofsledger.com" className="text-indigo-600 hover:underline">compliance@ofsledger.com</a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Compliance;
