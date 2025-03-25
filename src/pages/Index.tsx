import React, { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Security from "@/components/home/Security";
import Integration from "@/components/home/Integration";
import CryptoMarket from "@/components/home/CryptoMarket";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Partners from "@/components/home/Partners";
import CallToAction from "@/components/home/CallToAction";
import GlobalNetwork from "@/components/home/GlobalNetwork";
import MarketTable from "@/components/home/MarketTable";

const Index = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href') || "");
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Features />
        <Security />
        <Integration />
        <CryptoMarket />
        <HowItWorks />
        <Testimonials />
        <Partners />
        <GlobalNetwork />
        <MarketTable />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
