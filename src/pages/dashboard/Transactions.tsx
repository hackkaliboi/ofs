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
  Plus, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Download, 
  Calendar 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  asset_name: string;
  status: string;
  date: string;
  description?: string;
  recipient?: string;
  sender?: string;
  transaction_hash?: string;
}

const UserTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchQuery, typeFilter, statusFilter, dateFilter, sortBy, sortOrder]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would filter by user_id
      const { data, error } = await supabase
        .from("transactions")
        .select("*");

      if (error) {
        throw error;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...transactions];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (transaction) =>
          transaction.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.transaction_hash?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((transaction) => transaction.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (dateFilter === "today") {
        result = result.filter(
          (transaction) => new Date(transaction.date) >= today
        );
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        result = result.filter(
          (transaction) => new Date(transaction.date) >= weekAgo
        );
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        result = result.filter(
          (transaction) => new Date(transaction.date) >= monthAgo
        );
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "asset_name") {
        comparison = a.asset_name.localeCompare(b.asset_name);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredTransactions(result);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "deposit":
        return <ArrowDown className="h-4 w-4 text-green-600" />;
      case "withdrawal":
        return <ArrowUp className="h-4 w-4 text-red-600" />;
      case "transfer":
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate totals
  const totalDeposits = filteredTransactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawals = filteredTransactions
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage your transaction history
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalDeposits)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Withdrawals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalWithdrawals)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              totalDeposits - totalWithdrawals >= 0 
                ? "text-green-600" 
                : "text-red-600"
            }`}>
              {formatCurrency(totalDeposits - totalWithdrawals)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
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
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={toggleSortOrder}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortOrder === "asc" ? "Oldest First" : "Newest First"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div>Date</div>
                  <div>Type</div>
                  <div>Asset</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div className="col-span-2">Description</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading transactions...</div>
                  ) : filteredTransactions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No transactions found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="grid grid-cols-7 items-center px-4 py-3 text-sm"
                      >
                        <div>{formatDate(transaction.date)}</div>
                        <div className="flex items-center">
                          {getTypeIcon(transaction.type)}
                          <span className="ml-2 capitalize">{transaction.type}</span>
                        </div>
                        <div>{transaction.asset_name}</div>
                        <div className={`font-medium ${
                          transaction.type === "deposit" 
                            ? "text-green-600" 
                            : transaction.type === "withdrawal" 
                              ? "text-red-600" 
                              : ""
                        }`}>
                          {transaction.type === "deposit" ? "+" : transaction.type === "withdrawal" ? "-" : ""}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(transaction.status)}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="col-span-2 truncate">
                          {transaction.description || 
                            (transaction.type === "transfer" 
                              ? `Transfer to ${transaction.recipient}` 
                              : transaction.type === "deposit" 
                                ? `Deposit from ${transaction.sender}` 
                                : `Withdrawal to ${transaction.recipient}`
                            )
                          }
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="deposits" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div>Date</div>
                  <div>Type</div>
                  <div>Asset</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div className="col-span-2">Description</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading deposits...</div>
                  ) : filteredTransactions.filter(t => t.type === "deposit").length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No deposits found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredTransactions
                      .filter(t => t.type === "deposit")
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="grid grid-cols-7 items-center px-4 py-3 text-sm"
                        >
                          <div>{formatDate(transaction.date)}</div>
                          <div className="flex items-center">
                            <ArrowDown className="h-4 w-4 text-green-600" />
                            <span className="ml-2 capitalize">Deposit</span>
                          </div>
                          <div>{transaction.asset_name}</div>
                          <div className="font-medium text-green-600">
                            +{formatCurrency(transaction.amount)}
                          </div>
                          <div>
                            <Badge
                              variant="outline"
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                          <div className="col-span-2 truncate">
                            {transaction.description || `Deposit from ${transaction.sender}`}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div>Date</div>
                  <div>Type</div>
                  <div>Asset</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div className="col-span-2">Description</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading withdrawals...</div>
                  ) : filteredTransactions.filter(t => t.type === "withdrawal").length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No withdrawals found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredTransactions
                      .filter(t => t.type === "withdrawal")
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="grid grid-cols-7 items-center px-4 py-3 text-sm"
                        >
                          <div>{formatDate(transaction.date)}</div>
                          <div className="flex items-center">
                            <ArrowUp className="h-4 w-4 text-red-600" />
                            <span className="ml-2 capitalize">Withdrawal</span>
                          </div>
                          <div>{transaction.asset_name}</div>
                          <div className="font-medium text-red-600">
                            -{formatCurrency(transaction.amount)}
                          </div>
                          <div>
                            <Badge
                              variant="outline"
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                          <div className="col-span-2 truncate">
                            {transaction.description || `Withdrawal to ${transaction.recipient}`}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div>Date</div>
                  <div>Type</div>
                  <div>Asset</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div className="col-span-2">Description</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading transfers...</div>
                  ) : filteredTransactions.filter(t => t.type === "transfer").length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No transfers found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredTransactions
                      .filter(t => t.type === "transfer")
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="grid grid-cols-7 items-center px-4 py-3 text-sm"
                        >
                          <div>{formatDate(transaction.date)}</div>
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 text-blue-600" />
                            <span className="ml-2 capitalize">Transfer</span>
                          </div>
                          <div>{transaction.asset_name}</div>
                          <div className="font-medium">
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div>
                            <Badge
                              variant="outline"
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                          <div className="col-span-2 truncate">
                            {transaction.description || `Transfer to ${transaction.recipient}`}
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

      <div className="flex justify-end">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Transaction
        </Button>
      </div>
    </div>
  );
};

export default UserTransactions;
