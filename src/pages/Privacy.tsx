import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose prose-indigo max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                At OFSLEDGER, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our platform.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Personal identification information (name, email address, phone number)</li>
                  <li>Account credentials</li>
                  <li>Transaction data</li>
                  <li>Communication preferences</li>
                  <li>Device and usage information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Provide and maintain our services</li>
                  <li>Process your transactions</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Protect against fraudulent or illegal activity</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational security measures to protect your information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Regular security assessments and audits</li>
                  <li>Strict access controls and authentication</li>
                  <li>Continuous monitoring for suspicious activity</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to processing of your information</li>
                  <li>Receive a copy of your information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Email: privacy@ofsledger.com</p>
                  <p className="text-gray-600">Phone: +1 (888) OFS-HELP</p>
                  <p className="text-gray-600">
                    Address: 123 Financial District<br />
                    San Francisco, CA 94111<br />
                    United States
                  </p>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <Link to="/terms">
                  <Button variant="outline">Terms of Service</Button>
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

export default Privacy;
