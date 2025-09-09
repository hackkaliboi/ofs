import React from "react";
import { Outlet } from "react-router-dom";
import { PremiumNavbar } from "./PremiumNavbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-black">
      <PremiumNavbar />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
