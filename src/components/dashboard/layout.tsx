import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { DashboardSidebar as Sidebar } from "./sidebar";
import { useAuth } from "@/context/AuthContext";

export function DashboardLayout() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 pl-72">
        <main className="py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
