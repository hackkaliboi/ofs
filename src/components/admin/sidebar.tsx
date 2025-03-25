import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  Shield,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Assets",
    href: "/admin/assets",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      console.log("Signed out successfully from admin sidebar");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="group fixed inset-y-0 left-0 flex h-full w-72 flex-col border-r bg-slate-900 shadow-md">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold text-white">
            OFSLEDGER
            <Badge variant="outline" className="ml-2 bg-blue-500 text-white border-blue-600">
              Admin
            </Badge>
          </span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-blue-400",
                pathname === item.href
                  ? "bg-slate-800 text-blue-400"
                  : "text-slate-300 hover:bg-slate-800"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:text-blue-400 hover:bg-slate-800"
          >
            <Home className="h-5 w-5" />
            Back to Website
          </Link>
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:text-red-400 hover:bg-slate-800"
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
