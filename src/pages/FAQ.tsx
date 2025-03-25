import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/layout/Footer";

const FAQ = () => {
  const faqs = [
    {
      question: "What is OFSLEDGER?",
      answer: "OFSLEDGER is a cutting-edge financial platform that combines blockchain technology with oracle systems to provide secure, transparent, and efficient digital asset management solutions. It offers features like real-time market data streaming, enterprise-grade security, and cross-chain compatibility."
    },
    {
      question: "How does OFSLEDGER ensure security?",
      answer: "OFSLEDGER employs multiple layers of security including enterprise-grade encryption, multi-signature wallet support, and real-time transaction monitoring. Our platform is built with advanced blockchain technology and incorporates best practices in cybersecurity to protect your digital assets."
    },
    {
      question: "What types of assets can I manage with OFSLEDGER?",
      answer: "OFSLEDGER supports a wide range of digital assets across multiple blockchain networks. Our platform's cross-chain compatibility allows you to manage various types of tokens, cryptocurrencies, and digital assets all in one place."
    },
    {
      question: "How do I get started with OFSLEDGER?",
      answer: "Getting started is simple: 1) Create an account on our platform, 2) Complete the verification process, 3) Connect your preferred Web3 wallet (we recommend MetaMask), and 4) Start managing your digital assets. Our documentation provides detailed guides for each step."
    },
    {
      question: "Is OFSLEDGER available worldwide?",
      answer: "Yes, OFSLEDGER is available globally. Our platform is designed to serve users from different jurisdictions while complying with relevant regulations. However, some features may be restricted in certain regions due to local regulations."
    },
    {
      question: "What kind of support does OFSLEDGER offer?",
      answer: "We provide comprehensive support through multiple channels: 24/7 customer service, detailed documentation, video tutorials, and a dedicated support team. You can reach us via email, phone, or through our contact form."
    },
    {
      question: "How does OFSLEDGER integrate with existing systems?",
      answer: "OFSLEDGER offers robust API integration capabilities, allowing seamless connection with various trading platforms, market data providers, and enterprise systems. Our platform supports standard protocols and provides detailed documentation for integration."
    },
    {
      question: "What makes OFSLEDGER different from other platforms?",
      answer: "OFSLEDGER stands out through its combination of advanced oracle systems, enterprise-grade security, and comprehensive asset management capabilities. Our platform provides real-time market data, cross-chain compatibility, and a user-friendly interface backed by cutting-edge blockchain technology."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
            
            <div className="prose prose-indigo max-w-none mb-8">
              <p className="text-lg text-gray-600">
                Find answers to common questions about OFSLEDGER and our services. Can't find what you're looking for? 
                Feel free to <Link to="/contact" className="text-indigo-600 hover:text-indigo-500">contact us</Link>.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
