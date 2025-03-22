
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-custodia">Custodia</span>
            </Link>
            <p className="mt-4 text-gray-600 text-sm max-w-xs">
              Secure asset management solutions for digital assets with zero counterparty risk.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {["Features", "Security", "Integrations", "Pricing"].map((item) => (
                <li key={item}>
                  <a href={`/#${item.toLowerCase()}`} className="text-gray-600 hover:text-custodia text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a href={`/#${item.toLowerCase()}`} className="text-gray-600 hover:text-custodia text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {["Privacy", "Terms", "Security", "Compliance"].map((item) => (
                <li key={item}>
                  <a href={`/#${item.toLowerCase()}`} className="text-gray-600 hover:text-custodia text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Custodia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
