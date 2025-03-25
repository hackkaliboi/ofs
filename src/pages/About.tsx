import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Users, Globe, Code, ChevronRight } from "lucide-react";
import Footer from "@/components/layout/Footer";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Asset Validation",
      description: "Industry-leading security protocols to validate and verify digital assets with confidence."
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Lightning-fast transaction processing and instant validation results."
    },
    {
      icon: Users,
      title: "Enterprise Solutions",
      description: "Tailored solutions for businesses of all sizes, from startups to large corporations."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Access your assets and perform validations from anywhere in the world."
    },
    {
      icon: Code,
      title: "Developer-Friendly",
      description: "Comprehensive API documentation and SDKs for seamless integration."
    }
  ];

  const stats = [
    { label: "Active Users", value: "100K+" },
    { label: "Transactions Validated", value: "10M+" },
    { label: "Countries Served", value: "150+" },
    { label: "Enterprise Clients", value: "500+" }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former fintech executive with 15+ years of experience in blockchain and digital assets."
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      bio: "Blockchain architect and security expert with multiple patents in digital asset validation."
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of Research",
      bio: "PhD in Cryptography, leading research in advanced validation algorithms."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="container mx-auto px-4 py-24">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Revolutionizing Digital Asset Validation
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              OFSLEDGER is leading the future of financial technology with our innovative 
              Oracle Financial System, making digital asset validation secure, efficient, and accessible.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/contact">
                <Button className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/documentation">
                <Button variant="outline" className="gap-2">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose OFSLEDGER?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                          <Icon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-xl mb-1">{member.name}</h3>
                    <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                    <p className="text-gray-600">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of businesses and individuals who trust OFSLEDGER for their digital asset validation needs.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/signup">
                <Button size="lg">Create Account</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
