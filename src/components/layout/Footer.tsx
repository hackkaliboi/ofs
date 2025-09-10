import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Facebook, Instagram, ChevronRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-yellow-500/20">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-gradient">SolmintX</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Secure asset validation solutions for digital assets in the Quantum Financial System.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Features", path: "/#features" },
                { name: "Security", path: "/#security" },
                { name: "Validation", path: "/validate" }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-primary text-sm flex items-center group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Team", path: "/team" },
                { name: "Liquidity Pool", path: "/liquidity-pool" },
                { name: "Contact", path: "/contact" },
                { name: "Careers", path: "/careers" }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-primary text-sm flex items-center group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Security Policy", path: "/security-policy" },
                { name: "Compliance", path: "/compliance" }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-primary text-sm flex items-center group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-yellow-500/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            {currentYear} SolmintX. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm">
              Terms
            </Link>
            <Link to="/cookies" className="text-muted-foreground hover:text-primary text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
