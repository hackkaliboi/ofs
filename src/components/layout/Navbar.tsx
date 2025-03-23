import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const aboutItems = [
    { name: "About OFS", path: "/about" }
  ];

  const resourceItems = [
    { name: "FAQ", path: "/faq" },
    { name: "Documentation", path: "/documentation" },
    { name: "Support", path: "/contact" },
    { name: "Blog", path: "/blog" }
  ];

  const isActive = (path: string) => {
    if (path.includes("#")) {
      const [pagePath, section] = path.split("#");
      return location.pathname === pagePath && location.hash === `#${section}`;
    }
    return location.pathname === path;
  };

  return (
    <nav 
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled 
          ? "py-3 bg-white/95 backdrop-blur-lg shadow-md" 
          : "py-5 bg-white/70 backdrop-blur-md"
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">OFSLEDGER</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <NavigationMenu className="mr-6">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <Link 
                  to="/" 
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-semibold transition-colors",
                    isActive("/") 
                      ? "text-indigo-600" 
                      : "text-gray-800 hover:text-indigo-600"
                  )}
                >
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link 
                  to="/about" 
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-semibold transition-colors",
                    isActive("/about") 
                      ? "text-indigo-600" 
                      : "text-gray-800 hover:text-indigo-600"
                  )}
                >
                  About
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link 
                  to="/validate" 
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-semibold transition-colors",
                    isActive("/validate") 
                      ? "text-indigo-600" 
                      : "text-gray-800 hover:text-indigo-600"
                  )}
                >
                  Validate Assets
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "px-3 py-2 rounded-md text-sm font-semibold bg-transparent hover:bg-transparent",
                  isActive("/faq") || resourceItems.some(item => isActive(item.path))
                    ? "text-indigo-600" 
                    : "text-gray-800 hover:text-indigo-600"
                )}>
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-1 p-2 bg-white rounded-md shadow-lg">
                    {resourceItems.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:bg-indigo-50 focus:text-indigo-600"
                          >
                            <div className="text-sm font-medium">{item.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link 
                  to="/contact" 
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-semibold transition-colors",
                    isActive("/contact") 
                      ? "text-indigo-600" 
                      : "text-gray-800 hover:text-indigo-600"
                  )}
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold"
            >
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button
              asChild
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors font-semibold"
            >
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} className="text-indigo-600" /> : <Menu size={24} className="text-indigo-600" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-fade-in max-h-[80vh] overflow-y-auto">
          <ul className="py-4 px-6 space-y-4">
            <li>
              <Link 
                to="/"
                className={cn(
                  "block py-2 transition-colors font-semibold",
                  isActive("/") 
                    ? "text-indigo-600" 
                    : "text-gray-800 hover:text-indigo-600"
                )}
              >
                Home
              </Link>
            </li>
            
            <li>
              <Link 
                to="/about"
                className={cn(
                  "block py-2 transition-colors font-semibold",
                  isActive("/about") 
                    ? "text-indigo-600" 
                    : "text-gray-800 hover:text-indigo-600"
                )}
              >
                About
              </Link>
            </li>
            
            <li>
              <Link 
                to="/validate"
                className={cn(
                  "block py-2 transition-colors font-semibold",
                  isActive("/validate") 
                    ? "text-indigo-600" 
                    : "text-gray-800 hover:text-indigo-600"
                )}
              >
                Validate Assets
              </Link>
            </li>
            
            <li>
              <div className="py-2 flex items-center justify-between font-semibold" onClick={(e) => {
                const target = e.currentTarget.nextElementSibling;
                if (target) {
                  target.classList.toggle('hidden');
                }
              }}>
                <span className={cn(
                  "text-gray-800 hover:text-indigo-600",
                  isActive("/faq") || resourceItems.some(item => isActive(item.path))
                    ? "text-indigo-600" 
                    : ""
                )}>Resources</span>
                <ChevronDown size={18} className="text-indigo-600" />
              </div>
              <ul className="pl-4 space-y-2 mt-2 hidden">
                {resourceItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path}
                      className={cn(
                        "block py-1 text-sm transition-colors",
                        isActive(item.path) 
                          ? "text-indigo-600 font-semibold" 
                          : "text-gray-600 hover:text-indigo-600"
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            
            <li>
              <Link 
                to="/contact"
                className={cn(
                  "block py-2 transition-colors font-semibold",
                  isActive("/contact") 
                    ? "text-indigo-600" 
                    : "text-gray-800 hover:text-indigo-600"
                )}
              >
                Contact
              </Link>
            </li>
            
            <li className="pt-2">
              <Button
                asChild
                variant="outline"
                className="w-full mb-3 rounded-lg border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold"
              >
                <Link to="/sign-in">Sign In</Link>
              </Button>
            </li>
            <li>
              <Button
                asChild
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
