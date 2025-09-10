import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Wallet,
  User,
  Settings,
  FileText,
  Users,
  CreditCard,
  Shield,
  LogOut,
  ArrowDownToLine,
  Coins,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }: SidebarProps) => {
  const { pathname } = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

  // Determine if we're on admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // User navigation items
  const userNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Withdrawals",
      href: "/dashboard/withdrawals",
      icon: <ArrowDownToLine className="h-5 w-5" />,
    },
    {
      title: "KYC Verification",
      href: "/dashboard/kyc",
      icon: <Shield className="h-5 w-5" />,
      badge: profile?.kyc_status === "verified" ? "Verified" : "Required",
      badgeVariant: profile?.kyc_status === "verified" ? "success" : "destructive",
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  // Admin navigation items
  const adminNavItems = [
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Wallets",
      href: "/admin/wallets",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      title: "Withdrawals",
      href: "/admin/withdrawals",
      icon: <ArrowDownToLine className="h-5 w-5" />,
    },
    {
      title: "Coin Balances",
      href: "/admin/coin-balances",
      icon: <Coins className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform border-r border-primary/20 bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 md:shadow-xl",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center border-b border-primary/20 px-4 sm:px-6">
            {/* Empty header space - SolmintX logo is now only in the main header */}
          </div>

          {/* Sidebar content */}
          <ScrollArea className="flex-1 px-3 sm:px-4 py-6">
            <nav className="flex flex-col gap-6">
              {/* Show admin navigation when on admin routes, user navigation otherwise */}
              {isAdminRoute ? (
                <div>
                  <h3 className="px-3 text-xs font-semibold text-primary/70 uppercase tracking-wider">
                    Admin Dashboard
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {adminNavItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20",
                            pathname === item.href
                              ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 shadow-lg"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <h3 className="px-3 text-xs font-semibold text-primary/70 uppercase tracking-wider">
                    User Dashboard
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {userNavItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.href}
                          className={cn(
                            "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20",
                            pathname === item.href
                              ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 shadow-lg"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <Badge
                              variant={item.badgeVariant as "default" | "secondary" | "destructive" | "outline"}
                              className="ml-auto"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </nav>
          </ScrollArea>

          {/* Sidebar footer */}
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
