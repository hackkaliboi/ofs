
import React from "react";
import { Wallet, BarChart3, Shield, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ButtonEffect from "@/components/ui/ButtonEffect";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Wallet,
    title: "Connect Your Wallet",
    description: "Securely connect your cryptocurrency wallet to our platform with end-to-end encryption.",
  },
  {
    icon: BarChart3,
    title: "Track Investments",
    description: "Access real-time data and insights about your investments and market trends.",
  },
  {
    icon: Shield,
    title: "Secure Your Assets",
    description: "Rest easy knowing your digital assets are protected by quantum-resistant security.",
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-yellow-50/50">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-gradient">OFSLEDGER</span> Works
            </h2>
            <p className="text-lg text-gray-600">
              Our simple three-step process makes managing your digital assets secure and efficient.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 transform -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <AnimatedSection key={step.title} delay={(index + 1) as 1 | 2 | 3 | 4}>
                <div className="bg-card rounded-xl p-6 text-center shadow-lg border h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-6 text-yellow-600">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="mb-2 flex items-center justify-center">
                    <span className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-2">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection delay={4}>
          <div className="text-center mt-12">
            <Link to="/sign-up">
              <ButtonEffect variant="primary" className="group">
                Get Started Today <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonEffect>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HowItWorks;
