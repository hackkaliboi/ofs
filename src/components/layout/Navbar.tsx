import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Connect Wallet", path: "/connect-wallet" },
    { name: "FAQ", path: "/faq" },
    { name: "Documentation", path: "/documentation" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60"
          : "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              OFSLEDGER
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.path)
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">My Profile</Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/sign-up">
                  <Button variant="default" size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive(item.path)
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
