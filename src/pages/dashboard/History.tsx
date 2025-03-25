import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Clock,
  LogIn,
  LogOut,
  ShieldAlert,
  Settings as SettingsIcon,
  Wallet,
  ArrowLeftRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ActivityLog {
  id: string;
  event_type: string;
  description: string;
  timestamp: string;
  ip_address?: string;
  device?: string;
  status: string;
  details?: string;
}

const UserHistory = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const { toast } = useToast();

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activityLogs, searchQuery, typeFilter, dateFilter, sortOrder]);

  const fetchActivityLogs = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would filter by user_id
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*");

      if (error) {
        throw error;
      }

      setActivityLogs(data || []);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast({
        title: "Error",
        description: "Failed to load activity history. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...activityLogs];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (log) =>
          log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.event_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((log) => log.event_type === typeFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (dateFilter === "today") {
        result = result.filter(
          (log) => new Date(log.timestamp) >= today
        );
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        result = result.filter(
          (log) => new Date(log.timestamp) >= weekAgo
        );
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        result = result.filter(
          (log) => new Date(log.timestamp) >= monthAgo
        );
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredLogs(result);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "login":
        return <LogIn className="h-4 w-4 text-green-600" />;
      case "logout":
        return <LogOut className="h-4 w-4 text-blue-600" />;
      case "security":
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case "settings":
        return <SettingsIcon className="h-4 w-4 text-gray-600" />;
      case "asset":
        return <Wallet className="h-4 w-4 text-purple-600" />;
      case "transaction":
        return <ArrowLeftRight className="h-4 w-4 text-indigo-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Activity History</h1>
        <p className="text-muted-foreground">
          View your account activity and security events
        </p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search activity..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
              <SelectItem value="asset">Asset</SelectItem>
              <SelectItem value="transaction">Transaction</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={toggleSortOrder}>
            {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="transaction">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Your recent account activity and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div className="col-span-3">Timestamp</div>
                  <div className="col-span-2">Event Type</div>
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Status</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading activity...</div>
                  ) : filteredLogs.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No activity found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="grid grid-cols-12 items-center px-4 py-3 text-sm"
                      >
                        <div className="col-span-3">{formatDateTime(log.timestamp)}</div>
                        <div className="col-span-2 flex items-center">
                          {getEventTypeIcon(log.event_type)}
                          <span className="ml-2 capitalize">{log.event_type}</span>
                        </div>
                        <div className="col-span-5">{log.description}</div>
                        <div className="col-span-2">
                          <Badge
                            variant="outline"
                            className={getStatusColor(log.status)}
                          >
                            {log.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {activityLogs.length} activities
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Custom Date Range
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="login" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Login Activity</CardTitle>
              <CardDescription>
                Recent login attempts and sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div className="col-span-3">Timestamp</div>
                  <div className="col-span-2">IP Address</div>
                  <div className="col-span-3">Device</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Details</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading login activity...</div>
                  ) : filteredLogs.filter(log => log.event_type === "login").length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No login activity found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredLogs
                      .filter(log => log.event_type === "login")
                      .map((log) => (
                        <div
                          key={log.id}
                          className="grid grid-cols-12 items-center px-4 py-3 text-sm"
                        >
                          <div className="col-span-3">{formatDateTime(log.timestamp)}</div>
                          <div className="col-span-2">{log.ip_address || "Unknown"}</div>
                          <div className="col-span-3">{log.device || "Unknown"}</div>
                          <div className="col-span-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(log.status)}
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <div className="col-span-2 truncate">{log.details || "No details"}</div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Security Events</CardTitle>
              <CardDescription>
                Security-related activities and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div className="col-span-3">Timestamp</div>
                  <div className="col-span-7">Description</div>
                  <div className="col-span-2">Status</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading security events...</div>
                  ) : filteredLogs.filter(log => log.event_type === "security").length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No security events found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredLogs
                      .filter(log => log.event_type === "security")
                      .map((log) => (
                        <div
                          key={log.id}
                          className="grid grid-cols-12 items-center px-4 py-3 text-sm"
                        >
                          <div className="col-span-3">{formatDateTime(log.timestamp)}</div>
                          <div className="col-span-7">{log.description}</div>
                          <div className="col-span-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(log.status)}
                            >
                              {log.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transaction" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Transaction Activity</CardTitle>
              <CardDescription>
                History of transaction-related events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div className="col-span-3">Timestamp</div>
                  <div className="col-span-7">Description</div>
                  <div className="col-span-2">Status</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading transaction activity...</div>
                  ) : filteredLogs.filter(log => log.event_type === "transaction").length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No transaction activity found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredLogs
                      .filter(log => log.event_type === "transaction")
                      .map((log) => (
                        <div
                          key={log.id}
                          className="grid grid-cols-12 items-center px-4 py-3 text-sm"
                        >
                          <div className="col-span-3">{formatDateTime(log.timestamp)}</div>
                          <div className="col-span-7">{log.description}</div>
                          <div className="col-span-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(log.status)}
                            >
                              {log.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserHistory;
