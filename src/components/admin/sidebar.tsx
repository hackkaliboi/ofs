import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Menu,
  X,
  Bell,
  ChevronRight,
  HelpCircle,
  Layers,
  Database,
  Wallet,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    exact: true,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
    exact: false,
  },
  {
    title: "Assets",
    href: "/admin/assets",
    icon: <Layers className="h-5 w-5" />,
    exact: false,
  },
  {
    title: "Blockchain",
    href: "/admin/blockchain",
    icon: <Database className="h-5 w-5" />,
    exact: false,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart2 className="h-5 w-5" />,
    exact: false,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: <Shield className="h-5 w-5" />,
    exact: false,
  },
];

const secondaryNavItems = [
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
    exact: false,
  },
  {
    title: "Help & Support",
    href: "/admin/help",
    icon: <HelpCircle className="h-5 w-5" />,
    exact: false,
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      console.log("Signed out successfully from admin sidebar");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm border-muted-foreground/20"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col w-72 bg-background border-r border-border transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo and Brand */}
        <div className="h-16 flex items-center px-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              OL
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold">OFS Ledger</span>
              <Badge variant="outline" className="ml-2 bg-blue-500 text-white border-blue-600">
                Admin
              </Badge>
            </div>
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-muted">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user?.email || "Admin"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-foreground">
                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || ''}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-muted-foreground tracking-wider uppercase px-2 mb-2">
              Main
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                    isActive(item.href, item.exact)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center">
                    <span className={cn(
                      "mr-3",
                      isActive(item.href, item.exact) ? "text-primary" : "text-muted-foreground"
                    )}>
                      {item.icon}
                    </span>
                    {item.title}
                  </div>
                  {isActive(item.href, item.exact) && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Link>
              ))}
            </nav>

            <Separator className="my-4" />
            
            <div className="text-xs font-semibold text-muted-foreground tracking-wider uppercase px-2 mb-2">
              Account
            </div>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                    isActive(item.href, item.exact)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className={cn(
                    "mr-3",
                    isActive(item.href, item.exact) ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.icon}
                  </span>
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t">
          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <Home className="h-5 w-5" />
              Back to Website
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
