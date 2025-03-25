import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Wallet, ArrowUpDown, Clock } from "lucide-react";
import Footer from "@/components/layout/Footer";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Assets",
      value: "$123,456",
      change: "+12.5%",
      icon: BarChart3,
    },
    {
      title: "Active Wallets",
      value: "3",
      change: "+1 this week",
      icon: Wallet,
    },
    {
      title: "Transactions",
      value: "156",
      change: "24 today",
      icon: ArrowUpDown,
    },
    {
      title: "Last Updated",
      value: "2 min ago",
      change: "Real-time",
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {user?.email}</h1>
            <p className="text-gray-600 mt-2">Here's an overview of your assets and recent activity.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/validate">
                  <Button variant="outline" className="w-full">
                    Validate Assets
                  </Button>
                </Link>
                <Link to="/transactions">
                  <Button variant="outline" className="w-full">
                    View Transactions
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="outline" className="w-full">
                    Account Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">Asset Validation #{i}</p>
                      <p className="text-sm text-gray-600">Processed 2 hours ago</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
