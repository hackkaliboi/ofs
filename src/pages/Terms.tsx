import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            
            <div className="prose prose-indigo max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                Welcome to OFSLEDGER. By accessing our platform, you agree to be bound by these Terms of Service.
                Please read these terms carefully before using our services.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing or using OFSLEDGER's platform and services, you agree to be bound by these Terms 
                  of Service and all applicable laws and regulations. If you do not agree with any of these terms, 
                  you are prohibited from using or accessing our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Platform Services</h2>
                <p className="text-gray-600 mb-4">
                  OFSLEDGER provides the following services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Digital asset validation and verification</li>
                  <li>Blockchain transaction monitoring</li>
                  <li>Secure wallet management</li>
                  <li>Financial reporting and analytics</li>
                  <li>API access for enterprise integration</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
                <p className="text-gray-600 mb-4">
                  As a user of our platform, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Use the platform responsibly and ethically</li>
                  <li>Report any security concerns or suspicious activity</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
                <p className="text-gray-600">
                  All content, features, and functionality of the OFSLEDGER platform, including but not limited 
                  to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, 
                  and software, are the exclusive property of OFSLEDGER and are protected by international 
                  copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
                <p className="text-gray-600">
                  OFSLEDGER shall not be liable for any indirect, incidental, special, consequential, or 
                  punitive damages, including without limitation, loss of profits, data, use, goodwill, or 
                  other intangible losses, resulting from your access to or use of or inability to access 
                  or use the platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Modifications to Terms</h2>
                <p className="text-gray-600">
                  OFSLEDGER reserves the right to modify or replace these Terms of Service at any time. 
                  We will notify users of any material changes via email or through the platform. Your 
                  continued use of the platform after such modifications constitutes acceptance of the 
                  updated terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Email: legal@ofsledger.com</p>
                  <p className="text-gray-600">Phone: +1 (888) OFS-HELP</p>
                  <p className="text-gray-600">
                    Address: 123 Financial District<br />
                    San Francisco, CA 94111<br />
                    United States
                  </p>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <Link to="/privacy">
                  <Button variant="outline">Privacy Policy</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
