
import React from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const partners = [
  { name: "Acme Corp", logo: "https://via.placeholder.com/150x80?text=PARTNER1" },
  { name: "Globex", logo: "https://via.placeholder.com/150x80?text=PARTNER2" },
  { name: "Initech", logo: "https://via.placeholder.com/150x80?text=PARTNER3" },
  { name: "Massive Dynamic", logo: "https://via.placeholder.com/150x80?text=PARTNER4" },
  { name: "Wayne Enterprises", logo: "https://via.placeholder.com/150x80?text=PARTNER5" },
  { name: "Stark Industries", logo: "https://via.placeholder.com/150x80?text=PARTNER6" },
];

const Partners = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-gradient">Industry Leaders</span>
            </h2>
            <p className="text-lg text-gray-600">
              We work with the best in the industry to provide you with the most secure and reliable service.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={2}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner) => (
              <div 
                key={partner.name} 
                className="flex items-center justify-center p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="max-h-12 grayscale hover:grayscale-0 transition-all duration-300" 
                />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Partners;
