import React from "react";
import { Shield, Zap, Globe, Users, Award, Cpu, Target, ChartBar, Network } from "lucide-react";
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
      description: "The Oracle Financial System provides nearly instantaneous transaction settlement, unlike traditional banking systems."
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Built on a decentralized network spanning the globe, ensuring reliability and accessibility worldwide."
    },
    {
      icon: Cpu,
      title: "Oracle Computing",
      description: "Leveraging oracle technology to provide unparalleled security and processing capabilities."
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

  const missionPoints = [
    {
      icon: Target,
      title: "Our Vision",
      description: "To facilitate the global transition to the Oracle Financial System (OFS), creating a transparent and corruption-free banking ecosystem."
    },
    {
      icon: ChartBar,
      title: "Our Impact",
      description: "Eliminating transaction fees and funds transfer costs, making banking services accessible and affordable for everyone."
    },
    {
      icon: Network,
      title: "Our Technology",
      description: "Replacing SWIFT with a Global-Decentralized CIPS, ensuring secure and transparent cross-border transactions."
    }
  ];

  const teamMembers = [
    {
      role: "Technology",
      description: "Expert developers and engineers specializing in blockchain, oracle systems, and secure financial infrastructure.",
      count: 15
    },
    {
      role: "Security",
      description: "Dedicated security specialists ensuring the highest level of protection for all transactions and user data.",
      count: 8
    },
    {
      role: "Financial Experts",
      description: "Experienced professionals from traditional banking and fintech sectors guiding our strategic decisions.",
      count: 12
    },
    {
      role: "Operations",
      description: "24/7 global operations team maintaining system performance and providing customer support.",
      count: 20
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 text-white">
          <div className="container-custom">
            <AnimatedSection>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About OFSLEDGER</h1>
                <p className="text-xl text-blue-100/90">
                  Pioneering the transition to the Oracle Financial System
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container-custom">
            <AnimatedSection delay={2}>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  OFSLEDGER is revolutionizing the financial system by providing a secure, transparent, and efficient platform for the future of banking.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {missionPoints.map((point, index) => (
                  <div key={point.title} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                      <point.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{point.title}</h3>
                    <p className="text-gray-600">{point.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
                <p className="text-gray-600 mb-6">
                  OFS is NOT cryptocurrency. After the reevaluation of currencies (REVAL), all sovereign currencies will be asset-backed, ensuring stable value which makes the need for unbacked cryptocurrencies obsolete.
                </p>
                <p className="text-gray-600">
                  OFSLEDGER reigns supreme in the technology it applies and creates, providing 100% financial security and transparency for all currency holders. It ends corruption in Central Banking and replaces the US-centrally controlled SWIFT system with a Global-Decentralized CIPS.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <AnimatedSection delay={3}>
              <h2 className="text-3xl font-bold mb-8 text-center">Why Choose OFSLEDGER?</h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlights.map((item, index) => (
                <AnimatedSection key={item.title} delay={(index % 3 + 1) as 1 | 2 | 3 | 4}>
                  <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="bg-indigo-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container-custom">
            <AnimatedSection delay={2}>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Our Team</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  OFSLEDGER is backed by a dedicated team of experts working globally to build a better financial future.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={member.role} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{member.role}</h3>
                      <span className="text-sm font-semibold px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                        Team of {member.count}
                      </span>
                    </div>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                ))}
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
