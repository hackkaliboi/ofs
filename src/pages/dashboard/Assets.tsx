import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowUpDown, Clock, CreditCard, Wallet, Download, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Withdrawal {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  destination: string;
  transaction_id?: string;
  notes?: string;
}

const withdrawalSchema = z.object({
  amount: z.string().min(1, { message: "Amount is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  destination: z.string().min(1, { message: "Destination address is required" }),
  notes: z.string().optional(),
});

const UserWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [availableBalance, setAvailableBalance] = useState(10250.75);
  const [pendingBalance, setPendingBalance] = useState(1500.00);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: "",
      currency: "USD",
      destination: "",
      notes: "",
    },
  });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [withdrawals, searchQuery, statusFilter, sortBy, sortOrder]);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would filter by user_id
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*");

      if (error) {
        throw error;
      }

      // If no data is returned from Supabase, use sample data
      const sampleWithdrawals: Withdrawal[] = [
        {
          id: "w1",
          amount: 1000,
          currency: "USD",
          status: "completed",
          created_at: "2025-03-20T10:30:00Z",
          destination: "0x1234...5678",
          transaction_id: "0xabc...def",
          notes: "Monthly withdrawal"
        },
        {
          id: "w2",
          amount: 500,
          currency: "USD",
          status: "pending",
          created_at: "2025-03-24T14:15:00Z",
          destination: "0x8765...4321",
          notes: "Emergency funds"
        },
        {
          id: "w3",
          amount: 2500,
          currency: "USD",
          status: "failed",
          created_at: "2025-03-18T09:45:00Z",
          destination: "0xabcd...efgh",
          notes: "Insufficient balance"
        },
        {
          id: "w4",
          amount: 750,
          currency: "USD",
          status: "completed",
          created_at: "2025-03-15T16:20:00Z",
          destination: "0xijkl...mnop",
          transaction_id: "0x123...456",
        },
        {
          id: "w5",
          amount: 1200,
          currency: "USD",
          status: "pending",
          created_at: "2025-03-23T11:10:00Z",
          destination: "0xqrst...uvwx",
          notes: "Investment withdrawal"
        }
      ];

      setWithdrawals(data || sampleWithdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast({
        title: "Error",
        description: "Failed to load withdrawal history. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...withdrawals];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (withdrawal) =>
          withdrawal.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (withdrawal.transaction_id && withdrawal.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (withdrawal.notes && withdrawal.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((withdrawal) => withdrawal.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "created_at") {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredWithdrawals(result);
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600" />;
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

  const onSubmit = (values: z.infer<typeof withdrawalSchema>) => {
    // Convert amount to number
    const amount = parseFloat(values.amount);
    
    // Check if amount is valid
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }
    
    // Check if amount exceeds available balance
    if (amount > availableBalance) {
      toast({
        title: "Insufficient funds",
        description: "Your withdrawal amount exceeds your available balance",
        variant: "destructive",
      });
      return;
    }
    
    // Create a new withdrawal
    const newWithdrawal: Withdrawal = {
      id: `w${withdrawals.length + 1}`,
      amount: amount,
      currency: values.currency,
      status: "pending",
      created_at: new Date().toISOString(),
      destination: values.destination,
      notes: values.notes,
    };
    
    // In a real app, you would send this to the backend
    // For now, we'll just update the local state
    setWithdrawals([newWithdrawal, ...withdrawals]);
    
    // Update balances
    setAvailableBalance(availableBalance - amount);
    setPendingBalance(pendingBalance + amount);
    
    // Reset form
    form.reset();
    
    // Show success toast
    toast({
      title: "Withdrawal requested",
      description: "Your withdrawal request has been submitted and is pending approval",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Withdrawals</h1>
        <p className="text-muted-foreground">
          Request withdrawals and view your withdrawal history
        </p>
      </div>

      <Tabs defaultValue="request" className="space-y-4">
        <TabsList>
          <TabsTrigger value="request">Request Withdrawal</TabsTrigger>
          <TabsTrigger value="history">Withdrawal History</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Withdrawal Request</CardTitle>
              <CardDescription>
                Fill in the details to request a withdrawal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Please double-check your destination address before submitting. Withdrawals cannot be reversed once processed.
                </AlertDescription>
              </Alert>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5">$</span>
                              <Input
                                placeholder="0.00"
                                className="pl-7"
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Maximum: {formatCurrency(availableBalance)}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="BTC">BTC</SelectItem>
                              <SelectItem value="ETH">ETH</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter wallet address or bank details" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the wallet address or bank account where you want to receive funds
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional information"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit">Request Withdrawal</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Methods</CardTitle>
              <CardDescription>
                Available withdrawal options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <Wallet className="h-10 w-10 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Crypto Wallet</h3>
                    <p className="text-sm text-muted-foreground">
                      Withdraw to any cryptocurrency wallet. Processing time: 1-2 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <CreditCard className="h-10 w-10 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Bank Transfer</h3>
                    <p className="text-sm text-muted-foreground">
                      Withdraw directly to your bank account. Processing time: 1-3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search withdrawals..."
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
            <div className="flex items-center space-x-2">
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
              <Button variant="outline" size="sm" onClick={toggleSortOrder}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortOrder === "asc" ? "Oldest First" : "Newest First"}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>
                You have {filteredWithdrawals.length} withdrawal {filteredWithdrawals.length === 1 ? "record" : "records"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div className="col-span-2">Details</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Date</div>
                  <div>Transaction ID</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading withdrawal history...</div>
                  ) : filteredWithdrawals.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No withdrawals found. Try adjusting your filters or make a new withdrawal request.
                    </div>
                  ) : (
                    filteredWithdrawals.map((withdrawal) => (
                      <div
                        key={withdrawal.id}
                        className="grid grid-cols-6 items-center px-4 py-3 text-sm"
                      >
                        <div className="col-span-2">
                          <div className="font-medium">To: {withdrawal.destination}</div>
                          {withdrawal.notes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {withdrawal.notes}
                            </div>
                          )}
                        </div>
                        <div className="font-medium">{formatCurrency(withdrawal.amount)}</div>
                        <div>
                          <Badge
                            variant="outline"
                            className={`flex w-fit items-center gap-1 ${getStatusColor(withdrawal.status)}`}
                          >
                            {getStatusIcon(withdrawal.status)}
                            <span>{withdrawal.status}</span>
                          </Badge>
                        </div>
                        <div>{formatDate(withdrawal.created_at)}</div>
                        <div className="truncate max-w-[120px]">
                          {withdrawal.transaction_id || "-"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserWithdrawals;
