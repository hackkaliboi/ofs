
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FileText } from "lucide-react";

const Terms = () => {
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
                <BreadcrumbLink href="/terms" className="font-medium">Terms of Service</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
              <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="flex items-center gap-3 mb-6 text-indigo-600">
                <FileText className="h-6 w-6" />
                <span className="font-medium text-xl">Agreement to Terms</span>
              </div>
              
              <p>
                These Terms of Service constitute a legally binding agreement made between you and OFSLEDGER, 
                concerning your access to and use of the OFSLEDGER website and Oracle Financial System.
              </p>
              
              <h2>User Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and 
                current at all times. Failure to do so constitutes a breach of the Terms, which may result in 
                immediate termination of your account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any 
                activities or actions under your password. You agree not to disclose your password to any third party. 
                You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
              
              <h2>Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive 
                property of OFSLEDGER and its licensors. The Service is protected by copyright, trademark, and other 
                laws of both the United States and foreign countries. Our trademarks and trade dress may not be used 
                in connection with any product or service without the prior written consent of OFSLEDGER.
              </p>
              
              <h2>Limitation of Liability</h2>
              <p>
                In no event shall OFSLEDGER, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ol>
                <li>Your access to or use of or inability to access or use the Service;</li>
                <li>Any conduct or content of any third party on the Service;</li>
                <li>Any content obtained from the Service; and</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ol>
              
              <h2>Financial Risks</h2>
              <p>
                All investments involve risk, and the past performance of a digital asset, security, or financial product 
                does not guarantee future results or returns. There is always the potential of losing money when you invest 
                in digital assets, securities, or other financial products. You should consider your investment objectives 
                and risks carefully before investing.
              </p>
              
              <h2>Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without 
                regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms 
                will not be considered a waiver of those rights.
              </p>
              
              <h2>Changes</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
                is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What 
                constitutes a material change will be determined at our sole discretion.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                OFSLEDGER<br />
                Email: terms@ofsledger.com<br />
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

export default Terms;
