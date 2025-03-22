
import React from "react";
import { Shield, Zap, Globe, Users, Award, Cpu } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  const highlights = [
    {
      icon: Shield,
      title: "Secure Asset Validation",
      description: "Our platform uses advanced encryption to ensure your digital assets remain secure throughout the validation process."
    },
    {
      icon: Zap,
      title: "Fast Implementation",
      description: "The Quantum Financial System provides nearly instantaneous transaction settlement, unlike traditional banking systems."
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Built on a decentralized network spanning the globe, ensuring reliability and accessibility worldwide."
    },
    {
      icon: Cpu,
      title: "Quantum Computing",
      description: "Leveraging quantum technology to provide unparalleled security and processing capabilities."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Developed with input from financial experts and the global community to ensure it meets everyone's needs."
    },
    {
      icon: Award,
      title: "Asset-Backed Currency",
      description: "Supporting the transition to asset-backed currencies, ending the era of fiat currencies."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <section className="py-16 bg-gradient-to-b from-custodia-surface/30 to-white">
          <div className="container-custom">
            <AnimatedSection>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About OFSLEDGER</h1>
                <p className="text-lg text-gray-600">
                  Pioneering the transition to the Quantum Financial System
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={2}>
              <div className="mb-16">
                <div className="custodia-card">
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-gray-600 mb-6">
                    The purpose of OFSLEDGER is to facilitate the transition to the Quantum Financial System (QFS), putting an end to corruption, usury, and manipulation within the banking system. The QFS will ensure that banks no longer need to generate significant profits from transaction fees or funds transfers.
                  </p>
                  <p className="text-gray-600 mb-6">
                    QFS is NOT cryptocurrency. After the reevaluation of currencies (REVAL), all sovereign currencies will be asset-backed, ensuring stable value which makes the need for unbacked cryptocurrencies obsolete. The process simply digests the information on computer memory banks.
                  </p>
                  <p className="text-gray-600">
                    OFSLEDGER reigns supreme in the technology it applies and creates, providing 100% financial security and transparency for all currency holders. OFSLEDGER ends corruption that currently exists with regard to Central Banking. It replaces the US-centrally controlled SWIFT system with a Global-Decentralized CIPS (Cross Border Interbank Payment System).
                  </p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={3}>
              <h2 className="text-3xl font-bold mb-8 text-center">Why Choose OFSLEDGER?</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlights.map((item, index) => (
                <AnimatedSection key={item.title} delay={(index % 3 + 1) as 1 | 2 | 3 | 4}>
                  <div className="custodia-card h-full">
                    <div className="bg-custodia/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-custodia" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            
            <AnimatedSection delay={2}>
              <div className="mt-16 custodia-card">
                <h2 className="text-2xl font-bold mb-4">Our Team</h2>
                <p className="text-gray-600">
                  OFSLEDGER is backed by a dedicated team of financial experts, technology innovators, and security specialists committed to building a better financial future. Our global team works around the clock to ensure the platform remains secure, efficient, and accessible to all.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
