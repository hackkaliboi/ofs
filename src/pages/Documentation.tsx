
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FileText, Code, ShieldCheck, Database, ChevronRight } from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container-custom">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/documentation" className="font-medium">Documentation</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-purple">OFS Documentation</h1>
            <p className="text-lg text-gray-600 mb-10">
              Comprehensive guides and documentation for the Oracle Financial System
            </p>
            
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="gradient-card-purple inline-block p-2 rounded-lg mr-3">
                    <FileText className="h-5 w-5" />
                  </span>
                  Getting Started
                </h2>
                <div className="p-6 gradient-card hover-3d">
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
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="gradient-card-blue inline-block p-2 rounded-lg mr-3">
                    <Database className="h-5 w-5" />
                  </span>
                  Key Documentation Sections
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="gradient-card-blue p-6 rounded-xl hover-3d">
                    <h3 className="text-xl font-medium mb-3 flex items-center">
                      <ChevronRight className="h-5 w-5 mr-1 text-blue-500" />
                      User Guides
                    </h3>
                    <p>Step-by-step instructions for using the OFSLEDGER platform features</p>
                  </div>
                  <div className="gradient-card-purple p-6 rounded-xl hover-3d">
                    <h3 className="text-xl font-medium mb-3 flex items-center">
                      <ChevronRight className="h-5 w-5 mr-1 text-purple-500" />
                      Technical Documentation
                    </h3>
                    <p>Detailed technical specifications and architecture information</p>
                  </div>
                  <div className="gradient-card-indigo p-6 rounded-xl hover-3d">
                    <h3 className="text-xl font-medium mb-3 flex items-center">
                      <ChevronRight className="h-5 w-5 mr-1 text-indigo-500" />
                      <Code className="h-5 w-5 mr-1" />
                      API References
                    </h3>
                    <p>Complete API documentation for developers integrating with OFS</p>
                  </div>
                  <div className="gradient-card-violet p-6 rounded-xl hover-3d">
                    <h3 className="text-xl font-medium mb-3 flex items-center">
                      <ChevronRight className="h-5 w-5 mr-1 text-violet-500" />
                      <ShieldCheck className="h-5 w-5 mr-1" />
                      Security Features
                    </h3>
                    <p>Understanding the security protocols protecting the OFS ecosystem</p>
                  </div>
                </div>
              </section>
              
              <div className="p-8 bg-indigo-50 rounded-xl border border-indigo-100 hover-3d">
                <h3 className="text-xl font-medium mb-4 flex items-center">
                  <span className="h-3 w-3 rounded-full bg-indigo-500 mr-2 pulse-slow"></span>
                  Documentation Under Development
                </h3>
                <p className="text-gray-700">
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
