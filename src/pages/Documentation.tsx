
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gradient-purple">OFS Documentation</h1>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
                <div className="p-6 gradient-card">
                  <p className="mb-4">
                    The Oracle Financial System (OFS) represents a paradigm shift in global finance. 
                    This documentation will guide you through the fundamentals of the OFS and how to 
                    interact with the OFSLEDGER platform.
                  </p>
                  <p>
                    Use the navigation on the left to explore specific topics or follow the 
                    getting started guide for a comprehensive introduction.
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-4">Key Documentation Sections</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="gradient-card-blue">
                    <h3 className="text-lg font-medium mb-2">User Guides</h3>
                    <p>Step-by-step instructions for using the OFSLEDGER platform features</p>
                  </div>
                  <div className="gradient-card-purple">
                    <h3 className="text-lg font-medium mb-2">Technical Documentation</h3>
                    <p>Detailed technical specifications and architecture information</p>
                  </div>
                  <div className="gradient-card-indigo">
                    <h3 className="text-lg font-medium mb-2">API References</h3>
                    <p>Complete API documentation for developers integrating with OFS</p>
                  </div>
                  <div className="gradient-card-violet">
                    <h3 className="text-lg font-medium mb-2">Security Features</h3>
                    <p>Understanding the security protocols protecting the OFS ecosystem</p>
                  </div>
                </div>
              </section>
              
              <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                  Documentation Under Development
                </h3>
                <p>
                  Our comprehensive documentation is currently being expanded. 
                  Check back frequently for updates or subscribe to our newsletter 
                  to be notified when new documentation sections are published.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;
