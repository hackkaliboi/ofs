import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  History,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    title: "Assets",
    icon: <Wallet className="h-5 w-5" />,
    href: "/dashboard/assets",
  },
  {
    title: "Transactions",
    icon: <ArrowLeftRight className="h-5 w-5" />,
    href: "/dashboard/transactions",
  },
  {
    title: "History",
    icon: <History className="h-5 w-5" />,
    href: "/dashboard/history",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/dashboard/settings",
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      console.log("Signed out successfully from sidebar");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="group fixed inset-y-0 left-0 flex h-full w-72 flex-col border-r bg-white/95 shadow-sm">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-2xl font-bold text-primary">OFS</span>
          <span className="text-2xl font-bold">LEDGER</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-indigo-600",
                location.pathname === item.href
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:bg-indigo-50"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <div className="flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-indigo-600 hover:bg-indigo-50"
          >
            <Home className="h-5 w-5" />
            Back to Website
          </Link>
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
