
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
    { name: "About OFS", path: "/about" },
    { name: "Our Mission", path: "/about#mission" },
    { name: "Team", path: "/about#team" },
    { name: "Roadmap", path: "/about#roadmap" },
  ];

  const resourceItems = [
    { name: "FAQ", path: "/faq" },
    { name: "Documentation", path: "/documentation" },
    { name: "Support", path: "/contact" },
    { name: "News", path: "/#news" },
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
        isScrolled ? "py-3 bg-white/95 backdrop-blur-lg shadow-sm" : "py-5"
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-custodia">OFSLEDGER</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <NavigationMenu className="mr-4">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link 
                  to="/" 
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive("/") 
                      ? "text-custodia font-semibold" 
                      : "text-gray-600 hover:text-custodia"
                  )}
                >
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "px-2 py-2 rounded-full text-sm font-medium bg-transparent hover:bg-transparent",
                  isActive("/about") || aboutItems.some(item => isActive(item.path))
                    ? "text-custodia font-semibold" 
                    : "text-gray-600 hover:text-custodia"
                )}>
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    {aboutItems.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
                  to="/validate" 
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive("/validate") 
                      ? "text-custodia font-semibold" 
                      : "text-gray-600 hover:text-custodia"
                  )}
                >
                  Validate Assets
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "px-2 py-2 rounded-full text-sm font-medium bg-transparent hover:bg-transparent",
                  isActive("/faq") || resourceItems.some(item => isActive(item.path))
                    ? "text-custodia font-semibold" 
                    : "text-gray-600 hover:text-custodia"
                )}>
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    {resourceItems.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive("/contact") 
                      ? "text-custodia font-semibold" 
                      : "text-gray-600 hover:text-custodia"
                  )}
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-custodia text-custodia hover:bg-custodia hover:text-white"
            >
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-custodia hover:bg-custodia-light text-white transition-colors"
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
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                  "block py-2 transition-colors",
                  isActive("/") 
                    ? "text-custodia font-semibold" 
                    : "text-gray-800 hover:text-custodia"
                )}
              >
                Home
              </Link>
            </li>
            
            <li>
              <div className="py-2 flex items-center justify-between" onClick={(e) => {
                const target = e.currentTarget.nextElementSibling;
                if (target) {
                  target.classList.toggle('hidden');
                }
              }}>
                <span className={cn(
                  "text-gray-800 hover:text-custodia",
                  isActive("/about") || aboutItems.some(item => isActive(item.path))
                    ? "text-custodia font-semibold" 
                    : ""
                )}>About</span>
                <ChevronDown size={18} />
              </div>
              <ul className="pl-4 space-y-2 mt-2 hidden">
                {aboutItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path}
                      className={cn(
                        "block py-1 text-sm transition-colors",
                        isActive(item.path) 
                          ? "text-custodia font-semibold" 
                          : "text-gray-600 hover:text-custodia"
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
                to="/validate"
                className={cn(
                  "block py-2 transition-colors",
                  isActive("/validate") 
                    ? "text-custodia font-semibold" 
                    : "text-gray-800 hover:text-custodia"
                )}
              >
                Validate Assets
              </Link>
            </li>
            
            <li>
              <div className="py-2 flex items-center justify-between" onClick={(e) => {
                const target = e.currentTarget.nextElementSibling;
                if (target) {
                  target.classList.toggle('hidden');
                }
              }}>
                <span className={cn(
                  "text-gray-800 hover:text-custodia",
                  isActive("/faq") || resourceItems.some(item => isActive(item.path))
                    ? "text-custodia font-semibold" 
                    : ""
                )}>Resources</span>
                <ChevronDown size={18} />
              </div>
              <ul className="pl-4 space-y-2 mt-2 hidden">
                {resourceItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path}
                      className={cn(
                        "block py-1 text-sm transition-colors",
                        isActive(item.path) 
                          ? "text-custodia font-semibold" 
                          : "text-gray-600 hover:text-custodia"
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
                  "block py-2 transition-colors",
                  isActive("/contact") 
                    ? "text-custodia font-semibold" 
                    : "text-gray-800 hover:text-custodia"
                )}
              >
                Contact
              </Link>
            </li>
            
            <li>
              <Button
                asChild
                variant="outline"
                className="w-full mb-2 rounded-full border-custodia text-custodia hover:bg-custodia hover:text-white"
              >
                <Link to="/sign-in">Sign In</Link>
              </Button>
            </li>
            <li>
              <Button
                asChild
                className="w-full rounded-full bg-custodia hover:bg-custodia-light text-white"
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
