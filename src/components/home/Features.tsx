
import React from "react";
import { Shield, Key, Clock, Users, Server, Zap } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const features = [
  {
    icon: Shield,
    title: "Complete Asset Protection",
    description: "Institutional-grade security with multi-signature technology and hardware security modules."
  },
  {
    icon: Key,
    title: "Private Key Management",
    description: "Secure private key generation and storage with advanced backup and recovery systems."
  },
  {
    icon: Clock,
    title: "24/7 Access & Support",
    description: "Instant access to your assets with round-the-clock support from security experts."
  },
  {
    icon: Users,
    title: "Governance Controls",
    description: "Customizable approval workflows and role-based access controls for organizations."
  },
  {
    icon: Server,
    title: "Regulatory Compliance",
    description: "Built-in compliance tools for KYC/AML requirements and audit trail reporting."
  },
  {
    icon: Zap,
    title: "Fast Transaction Processing",
    description: "Quick settlement with optimized transaction batching and fee management."
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-gradient-to-b from-white to-custodia-surface/30">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Custody Features
            </h2>
            <p className="text-lg text-gray-600">
              Our platform delivers a complete solution for managing your digital assets securely and efficiently.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={(index % 3 + 1) as 1 | 2 | 3 | 4}>
              <div className="custodia-card h-full">
                <div className="bg-custodia/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-custodia" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
