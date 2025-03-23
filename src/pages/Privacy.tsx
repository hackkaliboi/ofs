
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Shield } from "lucide-react";

const Privacy = () => {
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
                <BreadcrumbLink href="/privacy" className="font-medium">Privacy Policy</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="flex items-center gap-3 mb-6 text-indigo-600">
                <Shield className="h-6 w-6" />
                <span className="font-medium text-xl">Your Privacy Matters</span>
              </div>
              
              <p>
                At OFSLEDGER, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you visit our website or use our Oracle Financial System.
              </p>
              
              <h2>Information We Collect</h2>
              <p>
                We may collect information about you in various ways. The information we may collect via the Service includes:
              </p>
              <ul>
                <li>
                  <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, 
                  and telephone number, that you voluntarily give to us when you register with the Service or when you 
                  choose to participate in various activities related to the Service.
                </li>
                <li>
                  <strong>Derivative Data:</strong> Information our servers automatically collect when you access the 
                  Service, such as your IP address, browser type, operating system, access times, and the pages you have viewed.
                </li>
                <li>
                  <strong>Financial Data:</strong> Financial information, such as data related to your wallet address and 
                  transaction history, that we may collect when you use our services.
                </li>
              </ul>
              
              <h2>Use of Your Information</h2>
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. 
                Specifically, we may use information collected about you via the Service to:
              </p>
              <ul>
                <li>Create and manage your account.</li>
                <li>Process transactions and send validation updates.</li>
                <li>Fulfill and manage asset validations.</li>
                <li>Offer new products, services, mobile applications, and/or recommendations to you.</li>
                <li>Increase the efficiency and operation of the Service.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                <li>Notify you of updates to the Service.</li>
                <li>Resolve disputes and troubleshoot problems.</li>
                <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
              </ul>
              
              <h2>Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. 
                While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
                that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission 
                can be guaranteed against any interception or other type of misuse.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <p>
                OFSLEDGER<br />
                Email: privacy@ofsledger.com<br />
                Phone: +1 (888) OFS-LEDG
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
