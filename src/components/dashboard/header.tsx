import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ConnectWallet from "@/components/ConnectWallet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Menu, X, User, Settings, LogOut, Wallet, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Header = ({ mobileMenuOpen, setMobileMenuOpen }: HeaderProps) => {
  const { user, profile, loading, signOut } = useAuth();
  const { pathname } = useLocation();

  // Determine if we're on admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary/20 bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-xl px-3 sm:px-4 md:px-6 shadow-xl">
      <div className="flex items-center">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden hover:bg-primary/10 hover:text-primary transition-all duration-200 border border-transparent hover:border-primary/20"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
        <Link to={isAdminRoute ? "/admin" : "/dashboard"} className="ml-3 md:ml-0">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">SolmintX</h1>
        </Link>
      </div>

      <div className="hidden md:flex items-center max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-background/50 border-primary/20 pl-9 focus-visible:ring-primary focus-visible:border-primary/40 backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Only show Connect Wallet button for user dashboard, not admin */}
        {!isAdminRoute && !user && (
          <ConnectWallet variant="default" size="sm" className="shadow-sm" />
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar} alt={user?.email || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.name || user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={isAdminRoute ? "/admin" : "/dashboard/profile"} className="flex w-full cursor-pointer items-center">
                <User className="mr-2 h-4 w-4" />
                {isAdminRoute ? "Admin Profile" : "Profile"}
              </Link>
            </DropdownMenuItem>
            {!isAdminRoute && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/wallets" className="flex w-full cursor-pointer items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallets
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="flex w-full cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            {isAdminRoute && (
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Settings
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center text-destructive focus:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
