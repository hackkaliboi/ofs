import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Home,
  Wallet,
  CreditCard,
  BarChart3,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  HelpCircle,
  Bell,
  Layers,
  Users,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: SidebarProps) {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      exact: true,
    },
    {
      title: "Assets",
      href: "/dashboard/assets",
      icon: <Layers className="h-5 w-5" />,
      exact: false,
    },
    {
      title: "Transactions",
      href: "/dashboard/transactions",
      icon: <BarChart3 className="h-5 w-5" />,
      exact: false,
    },
    {
      title: "History",
      href: "/dashboard/history",
      icon: <History className="h-5 w-5" />,
      exact: false,
    },
    {
      title: "Wallets",
      href: "/dashboard/connect-wallet",
      icon: <Wallet className="h-5 w-5" />,
      exact: false,
    },
  ];

  const secondaryNavItems = [
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      exact: false,
    },
    {
      title: "Help & Support",
      href: "/dashboard/help",
      icon: <HelpCircle className="h-5 w-5" />,
      exact: false,
    },
  ];

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
          "fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Logo and Brand */}
        <div className="h-16 flex items-center px-4 border-b">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              OL
            </div>
            <span className="text-xl font-bold">OFS Ledger</span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-muted">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user?.email || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-foreground">
                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
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

        {/* Pro Badge */}
        <div className="p-4">
          <div className="rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-3 border border-indigo-200/20">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm font-medium">OFS Ledger Pro</p>
                <p className="text-xs text-muted-foreground">Get advanced features</p>
              </div>
            </div>
            <Button size="sm" className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              Upgrade
            </Button>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}
