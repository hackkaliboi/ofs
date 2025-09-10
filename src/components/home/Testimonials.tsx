
import React from "react";
import { Star, Quote } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Crypto Investor",
    content: "SolmintX has transformed how I manage my digital assets. The security features are unmatched and the real-time tracking is incredibly valuable.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Financial Advisor",
    content: "I recommend SolmintX to all my clients. Their quantum-secure technology provides peace of mind, and the interface is intuitive even for beginners.",
    rating: 5,
  },
  {
    name: "Diana Rodriguez",
    role: "Blockchain Developer",
    content: "As someone who works in blockchain technology, I appreciate the technical excellence of SolmintX. Their architecture is cutting-edge.",
    rating: 5,
  },
  {
    name: "Robert Williams",
    role: "Enterprise Client",
    content: "We've integrated SolmintX across our entire organization. The API is robust and the customer support has been exceptional.",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-gradient">Thousands</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our users are saying about their experience with OFSLEDGER's financial ecosystem.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} delay={(index % 4 + 1) as 1 | 2 | 3 | 4}>
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <div className="relative mb-6">
                    <Quote className="absolute top-0 left-0 h-8 w-8 text-primary/20 -translate-x-4 -translate-y-4" />
                    <p className="text-foreground leading-relaxed">{testimonial.content}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-primary to-primary/80 w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
