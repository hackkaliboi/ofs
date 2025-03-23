
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Lock, Shield, Server, Eye, Key } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const SecurityPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container-custom">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/security-policy" className="font-medium">Security Policy</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Security Policy</h1>
                <p className="text-lg text-gray-600">
                  Our comprehensive approach to protecting your assets and data on the Oracle Financial System
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={1}>
              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-10">
                <div className="flex items-center gap-3 mb-4 text-indigo-600">
                  <Shield className="h-6 w-6" />
                  <span className="font-semibold text-xl">Security Commitment</span>
                </div>
                <p className="text-gray-700">
                  At OFSLEDGER, security is our top priority. We employ state-of-the-art security measures and follow industry 
                  best practices to ensure that your digital assets and personal information remain safe and protected at all times.
                </p>
              </div>
            </AnimatedSection>
            
            <div className="prose prose-lg max-w-none">
              <AnimatedSection delay={2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-indigo-600">
                      <Lock className="h-6 w-6" />
                      <h3 className="font-semibold text-xl m-0">Data Encryption</h3>
                    </div>
                    <p className="m-0">
                      We use advanced encryption protocols to protect all data in transit and at rest. All 
                      communications between your device and our servers are encrypted using TLS 1.3, and sensitive 
                      information is stored using AES-256 encryption.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-indigo-600">
                      <Server className="h-6 w-6" />
                      <h3 className="font-semibold text-xl m-0">Infrastructure Security</h3>
                    </div>
                    <p className="m-0">
                      Our infrastructure is hosted in secure, ISO 27001 certified data centers with 24/7 monitoring, 
                      intrusion detection systems, and comprehensive disaster recovery protocols to ensure service continuity.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={3}>
                <h2>Access Controls</h2>
                <p>
                  We implement strict access controls to ensure that only authorized personnel can access sensitive 
                  systems and data. These controls include:
                </p>
                <ul>
                  <li>Multi-factor authentication for all staff accessing internal systems</li>
                  <li>Role-based access control with the principle of least privilege</li>
                  <li>Regular access reviews and prompt deprovisioning of access</li>
                  <li>Detailed audit logging of all access to sensitive systems</li>
                </ul>
                
                <h2>User Account Security</h2>
                <p>
                  We provide multiple security features for user accounts, including:
                </p>
                <ul>
                  <li>Multi-factor authentication options</li>
                  <li>Biometric authentication support where available</li>
                  <li>Secure password policies and storage</li>
                  <li>Account activity monitoring and suspicious activity alerts</li>
                  <li>Session timeout and device verification</li>
                </ul>
              </AnimatedSection>
              
              <AnimatedSection delay={4}>
                <h2>Security Testing</h2>
                <p>
                  Our security team conducts regular security assessments to identify and address potential vulnerabilities:
                </p>
                <ul>
                  <li>Regular penetration testing by independent security experts</li>
                  <li>Vulnerability scanning and remediation</li>
                  <li>Code security reviews before deployment</li>
                  <li>Bug bounty program to encourage responsible disclosure</li>
                </ul>
                
                <h2>Incident Response</h2>
                <p>
                  We maintain a comprehensive incident response plan that includes:
                </p>
                <ul>
                  <li>24/7 security monitoring and alerting</li>
                  <li>Defined incident response procedures and escalation paths</li>
                  <li>Regular incident response drills and tabletop exercises</li>
                  <li>Transparent communication with affected users in the event of a security incident</li>
                </ul>
                
                <h2>Compliance</h2>
                <p>
                  OFSLEDGER maintains compliance with relevant industry standards and regulations, including:
                </p>
                <ul>
                  <li>ISO 27001 certification for information security management</li>
                  <li>SOC 2 Type II attestation</li>
                  <li>GDPR compliance for protection of personal data</li>
                  <li>Regular independent security audits</li>
                </ul>
              </AnimatedSection>
              
              <AnimatedSection delay={5}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 my-10">
                  <div className="flex items-center gap-3 mb-4 text-indigo-600">
                    <Key className="h-6 w-6" />
                    <h3 className="font-semibold text-xl m-0">Your Role in Security</h3>
                  </div>
                  <p className="mb-4">
                    While we implement comprehensive security measures, your participation in security is essential. We recommend:
                  </p>
                  <ul className="mb-0">
                    <li>Using a strong, unique password for your OFSLEDGER account</li>
                    <li>Enabling multi-factor authentication</li>
                    <li>Being vigilant about phishing attempts and only accessing OFSLEDGER through official channels</li>
                    <li>Keeping your devices and software updated with the latest security patches</li>
                    <li>Contacting our security team immediately if you notice any suspicious activity</li>
                  </ul>
                </div>
                
                <h2>Contact Security Team</h2>
                <p>
                  If you discover a security vulnerability or have security concerns, please contact our security team at:
                </p>
                <p>
                  Email: security@ofsledger.com<br />
                  For sensitive security issues: PGP Key available on our security page
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SecurityPolicy;
