import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";
import { DashboardLayout } from "./components/dashboard/layout";
import AdminAccessProvider from "./components/AdminAccessProvider";
import { useEffect, lazy, Suspense } from "react";

// Public Pages
import Index from "./pages/Index.tsx";
import CreateToken from "./pages/CreateToken.tsx";
import Team from "./pages/Team.tsx";
import Careers from "./pages/Careers.tsx";
import LiquidityPool from "./pages/LiquidityPool.tsx";
import Contact from "./pages/Contact.tsx";
import Blog from "./pages/Blog.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import SecurityPolicy from "./pages/SecurityPolicy.tsx";
import Compliance from "./pages/Compliance.tsx";
import Cookies from "./pages/Cookies.tsx";
import AdminAccess from "./pages/AdminAccess.tsx";

// User Dashboard Pages
import Dashboard from "./pages/dashboard/Index.tsx";
import Withdrawals from "./pages/dashboard/Withdrawals.tsx";
import NewWithdrawal from "./pages/dashboard/NewWithdrawal.tsx";
import KYC from "./pages/dashboard/KYC.tsx";
import Profile from "./pages/dashboard/Profile.tsx";
// Removed ConnectWallet import as we're replacing it with a button

// Admin Dashboard Pages
import AdminDashboard from "./pages/admin/Index.tsx";
import AdminUsers from "./pages/admin/Users.tsx";
import UserEdit from "./pages/admin/UserEdit.tsx";
import WalletManagement from "./pages/admin/Wallets.tsx";
import WalletsDirect from "./pages/admin/WalletsDirect.tsx";
import KYCManagement from "./pages/admin/KYC.tsx";
import WithdrawalManagement from "./pages/admin/Withdrawals.tsx";
import AdminSettings from "./pages/admin/Settings.tsx";
import CoinBalancesAdmin from "./pages/admin/CoinBalances.tsx";
import AdminRoute from "./components/auth/AdminRoute.tsx";
// import WalletDetailsPage from "./pages/admin/WalletDetails.tsx"; // Removed because file was deleted
// Import the direct admin access page
import DirectAdminAccess from "./pages/DirectAdminAccess.tsx";

// Create a new query client instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <BrowserRouter>
          <AuthProvider>
            <AdminAccessProvider>
              <Routes>
                {/* Public Routes */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/create-token" element={<CreateToken />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/liquidity-pool" element={<LiquidityPool />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/security-policy" element={<SecurityPolicy />} />
                  <Route path="/compliance" element={<Compliance />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/admin-access" element={<AdminAccess />} />
                </Route>

                {/* User Dashboard Routes */}
                <Route element={<PrivateRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* Removed ConnectWallet route as we're replacing it with a button */}
                    <Route path="/dashboard/withdrawals" element={<Withdrawals />} />
                    <Route path="/dashboard/withdrawals/new" element={<NewWithdrawal />} />
                    <Route path="/dashboard/kyc" element={<KYC />} />
                    <Route path="/dashboard/profile" element={<Profile />} />
                  </Route>
                </Route>

                {/* Admin Access Routes */}
                <Route path="/admin-access" element={<DirectAdminAccess />} />
                <Route path="/admin-wallets" element={<WalletsDirect />} />

                {/* Admin Dashboard Routes - Authentication Enabled */}
                <Route element={<AdminRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/users/:userId/edit" element={<UserEdit />} />
                    <Route path="/admin/wallets" element={<WalletManagement />} />
                    {/* <Route path="/admin/wallet-details" element={<WalletDetailsPage />} /> */}
                    <Route path="/admin/kyc" element={<KYCManagement />} />
                    <Route path="/admin/withdrawals" element={<WithdrawalManagement />} />
                    <Route path="/admin/coin-balances" element={<CoinBalancesAdmin />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
            </AdminAccessProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
