import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Security from "@/components/home/Security";
import Integration from "@/components/home/Integration";
import CryptoMarket from "@/components/home/CryptoMarket";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import NewsSection from "@/components/home/NewsSection";
import Partners from "@/components/home/Partners";
import CallToAction from "@/components/home/CallToAction";
import GlobalNetwork from "@/components/home/GlobalNetwork";

const Index = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Offset for fixed header
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Scroll to specific section if URL contains hash
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        setTimeout(() => {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }, 300);
      }
    }

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function() {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CryptoMarket />
        <HowItWorks />
        <Features />
        <GlobalNetwork />
        <Security />
        <Integration />
        <Testimonials />
        <Partners />
        <NewsSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
