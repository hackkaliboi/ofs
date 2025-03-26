import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "./sidebar";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export function AdminLayout() {
  const { user, profile, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated or not an admin
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 pl-72">
        <main className="py-6 px-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
