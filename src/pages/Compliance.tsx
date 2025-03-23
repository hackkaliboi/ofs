
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CheckSquare, FileCheck, Globe, Landmark } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const Compliance = () => {
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
                <BreadcrumbLink href="/compliance" className="font-medium">Compliance</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Compliance Framework</h1>
                <p className="text-lg text-gray-600">
                  OFSLEDGER's approach to regulatory compliance and industry standards
                </p>
              </div>
            </AnimatedSection>
            
            <div className="prose prose-lg max-w-none">
              <AnimatedSection delay={1}>
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mb-10">
                  <div className="flex items-center gap-3 mb-4 text-indigo-600">
                    <CheckSquare className="h-6 w-6" />
                    <span className="font-semibold text-xl">Compliance Commitment</span>
                  </div>
                  <p className="text-gray-700">
                    OFSLEDGER is committed to maintaining the highest standards of compliance with relevant laws, 
                    regulations, and industry best practices across all jurisdictions in which we operate. Our 
                    compliance program is designed to ensure the integrity, transparency, and security of our Oracle 
                    Financial System while protecting our users and partners.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={2}>
                <h2>Regulatory Framework</h2>
                <p>
                  Our compliance framework addresses key regulatory requirements applicable to financial technology and digital asset services:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3 text-indigo-600">
                      <Landmark className="h-5 w-5" />
                      <h3 className="font-medium text-lg m-0">Financial Regulations</h3>
                    </div>
                    <ul className="m-0 pl-5">
                      <li>Anti-Money Laundering (AML)</li>
                      <li>Know Your Customer (KYC)</li>
                      <li>Counter-Terrorist Financing (CTF)</li>
                      <li>Securities and Exchange regulations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3 text-indigo-600">
                      <Globe className="h-5 w-5" />
                      <h3 className="font-medium text-lg m-0">Data Protection</h3>
                    </div>
                    <ul className="m-0 pl-5">
                      <li>General Data Protection Regulation (GDPR)</li>
                      <li>California Consumer Privacy Act (CCPA)</li>
                      <li>Cross-border data transfer requirements</li>
                      <li>Data retention and protection standards</li>
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={3}>
                <h2>Compliance Program Elements</h2>
                <p>
                  Our comprehensive compliance program includes:
                </p>
                
                <h3>Customer Due Diligence</h3>
                <p>
                  We implement risk-based Know Your Customer (KYC) procedures to verify the identity of our users 
                  and understand the nature of their activities. These procedures help us identify and mitigate risks 
                  associated with money laundering, fraud, and other illicit activities.
                </p>
                
                <h3>Transaction Monitoring</h3>
                <p>
                  We utilize advanced analytics and monitoring tools to review transactions for suspicious patterns 
                  and potential compliance issues. Our system flags unusual activities for review by our compliance 
                  team, ensuring that we can quickly identify and address potential compliance concerns.
                </p>
                
                <h3>Sanctions Screening</h3>
                <p>
                  We screen our users and transactions against relevant sanctions lists to ensure that we do not 
                  facilitate transactions involving sanctioned individuals, entities, or jurisdictions.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={4}>
                <h2>Industry Certifications and Standards</h2>
                <p>
                  OFSLEDGER adheres to recognized industry standards and has obtained relevant certifications:
                </p>
                <ul>
                  <li><strong>ISO 27001:</strong> Information security management</li>
                  <li><strong>SOC 2 Type II:</strong> Security, availability, and confidentiality controls</li>
                  <li><strong>PCI DSS:</strong> Payment card industry data security standard</li>
                </ul>
                
                <h2>Global Compliance Approach</h2>
                <p>
                  As a global platform, we maintain a dedicated compliance team responsible for:
                </p>
                <ul>
                  <li>Monitoring regulatory developments across jurisdictions</li>
                  <li>Updating our compliance program to address new requirements</li>
                  <li>Conducting regular risk assessments</li>
                  <li>Training staff on compliance requirements and procedures</li>
                  <li>Engaging with regulators and industry groups</li>
                </ul>
              </AnimatedSection>
              
              <AnimatedSection delay={5}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 my-10">
                  <div className="flex items-center gap-3 mb-4 text-indigo-600">
                    <FileCheck className="h-6 w-6" />
                    <h3 className="font-semibold text-xl m-0">Reporting and Transparency</h3>
                  </div>
                  <p>
                    We are committed to transparency in our compliance efforts. We regularly publish reports on our 
                    compliance activities, including:
                  </p>
                  <ul className="mb-0">
                    <li>Annual compliance reports</li>
                    <li>Transparency reports on government requests for information</li>
                    <li>Updates on significant regulatory developments affecting our services</li>
                  </ul>
                </div>
                
                <h2>Contact Compliance Team</h2>
                <p>
                  If you have questions about our compliance program or need to report a compliance concern, please contact:
                </p>
                <p>
                  Email: compliance@ofsledger.com<br />
                  Phone: +1 (888) OFS-COMP
                </p>
                
                <p className="text-sm text-gray-500 mt-10">
                  <em>Note: This compliance framework overview is for informational purposes only and does not constitute 
                  legal advice. Regulatory requirements may vary by jurisdiction, and users should consult with their 
                  own legal advisors regarding their specific compliance obligations.</em>
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

export default Compliance;
