
import React from "react";
import { Shield, Key, Clock, Users, Server, Zap } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const features = [
  {
    icon: Shield,
    title: "Financial Security",
    description: "QFS provides 100% financial security and transparency for all currency holders globally."
  },
  {
    icon: Key,
    title: "Asset-Backed Currency",
    description: "All sovereign currencies will be asset-backed after reevaluation, ensuring stable value."
  },
  {
    icon: Clock,
    title: "End of Corruption",
    description: "Put an end to corruption, usury, and manipulation within the banking system."
  },
  {
    icon: Users,
    title: "Decentralized Control",
    description: "QFS replaces the centrally controlled SWIFT system with decentralized CIPS."
  },
  {
    icon: Server,
    title: "Secure Validation",
    description: "Secure verification and validation of digital assets with our advanced system."
  },
  {
    icon: Zap,
    title: "Instant Transfers",
    description: "Fast and secure global transfers without the need for excessive transaction fees."
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-gradient-to-b from-white to-custodia-surface/30">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              OFSLEDGER Features
            </h2>
            <p className="text-lg text-gray-600">
              Our platform delivers a revolutionary solution for securing and validating your digital assets.
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
