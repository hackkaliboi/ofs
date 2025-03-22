
import React from "react";
import { LockKeyhole, Shield, History, ServerCrash, Fingerprint, FileText } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ButtonEffect from "@/components/ui/ButtonEffect";

const securityLayers = [
  {
    icon: Fingerprint,
    title: "Biometric Authentication",
    description: "Multi-factor authentication with biometric verification for all critical operations"
  },
  {
    icon: LockKeyhole,
    title: "MPC Technology",
    description: "Multi-Party Computation ensures keys are never stored in a single location"
  },
  {
    icon: Shield,
    title: "Cold Storage Vaults",
    description: "Air-gapped cold storage with geographically distributed secure facilities"
  },
  {
    icon: History,
    title: "Real-time Monitoring",
    description: "24/7 surveillance with automated threat detection and response systems"
  },
  {
    icon: ServerCrash,
    title: "Disaster Recovery",
    description: "Comprehensive disaster recovery with redundant systems and regular testing"
  },
  {
    icon: FileText,
    title: "Insurance Coverage",
    description: "Full insurance coverage for digital assets stored on our platform"
  }
];

const Security = () => {
  return (
    <section id="security" className="section-padding bg-gradient-to-b from-custodia-surface/30 to-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-5/12">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Multi-Layer Security Architecture
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform employs a defense-in-depth approach with multiple security layers to provide maximum protection for your digital assets.
              </p>
              <p className="text-gray-600 mb-8">
                Each security layer is independently audited and tested by leading cybersecurity firms to ensure the highest standards of protection.
              </p>
              <ButtonEffect variant="primary">
                Security Whitepaper
              </ButtonEffect>
            </AnimatedSection>
          </div>
          
          <div className="w-full lg:w-7/12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityLayers.map((layer, index) => (
                <AnimatedSection key={layer.title} delay={(index % 4 + 1) as 1 | 2 | 3 | 4}>
                  <div className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-md hover:border-custodia/20">
                    <div className="flex-shrink-0">
                      <div className="bg-custodia/10 p-2 rounded-full">
                        <layer.icon className="h-5 w-5 text-custodia" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{layer.title}</h3>
                      <p className="text-sm text-gray-600">{layer.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
