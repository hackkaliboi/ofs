import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Facebook, Instagram, ChevronRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">OFSLEDGER</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-xs mb-6">
              Secure asset validation solutions for digital assets in the Quantum Financial System.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Features", path: "/#features" },
                { name: "Security", path: "/#security" },
                { name: "Validation", path: "/validate" }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-600 hover:text-indigo-600 text-sm flex items-center group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About", path: "/about" },
                { name: "FAQ", path: "/faq" },
                { name: "Contact", path: "/contact" },
                { name: "Careers", path: "/careers" }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-600 hover:text-indigo-600 text-sm flex items-center group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Security", path: "/security-policy" },
                { name: "Compliance", path: "/compliance" }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-600 hover:text-indigo-600 text-sm flex items-center group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            {currentYear} OFSLEDGER. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
