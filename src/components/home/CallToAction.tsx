
import React from "react";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ButtonEffect from "@/components/ui/ButtonEffect";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-blue-600 to-blue-700 text-white">
      <div className="container-custom">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Secure Your Digital Financial Future?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Join thousands of users already benefiting from OFSLEDGER's revolutionary quantum financial system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sign-up">
                <ButtonEffect 
                  variant="secondary" 
                  className="group bg-white text-blue-700 hover:bg-blue-50"
                >
                  Create Your Account <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </ButtonEffect>
              </Link>
              <Link to="/contact">
                <ButtonEffect 
                  variant="secondary" 
                  className="group bg-transparent border border-white text-white hover:bg-blue-500"
                >
                  Contact Our Team
                </ButtonEffect>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CallToAction;
