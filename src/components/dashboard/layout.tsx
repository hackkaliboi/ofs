import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./sidebar";
import Header from "./header";

export function DashboardLayout() {
  const { user, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <Header 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto lg:ml-64 transition-all duration-200 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
