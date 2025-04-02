import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, Coins, Users, RefreshCw, Edit, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface CoinBalance {
  id: string;
  user_id: string;
  coin_symbol: string;
  balance: number;
  last_updated: string;
}

const SUPPORTED_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '/blockchains/bitcoin.png' },
  { symbol: 'XRP', name: 'XRP', icon: '/blockchains/xrp.png' },
  { symbol: 'ETH', name: 'Ethereum', icon: '/blockchains/ethereum.png' },
  { symbol: 'SOL', name: 'Solana', icon: '/blockchains/solana.png' }
];

const CoinBalancesAdmin = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [balances, setBalances] = useState<CoinBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editingBalance, setEditingBalance] = useState<CoinBalance | null>(null);
  const [newBalanceValue, setNewBalanceValue] = useState<string>("");
  const [newCoinSymbol, setNewCoinSymbol] = useState<string>("BTC");
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch users and balances
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchBalances(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('email');

      if (error) {
        throw error;
      }

      setUsers(data);
      
      // Select the first user by default
      if (data.length > 0 && !selectedUser) {
        setSelectedUser(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coin_balances')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setBalances(data);
    } catch (error: any) {
      console.error('Error fetching balances:', error);
      toast({
        title: "Error",
        description: "Failed to fetch balances: " + error.message,
        variant: "destructive",
      });
      setBalances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (selectedUser) {
      await fetchBalances(selectedUser.id);
    } else {
      await fetchUsers();
    }
    setRefreshing(false);
  };

  const handleEditBalance = (balance: CoinBalance) => {
    setEditingBalance(balance);
    setNewBalanceValue(balance.balance.toString());
    setEditDialogOpen(true);
    setIsAddingNew(false);
  };

  const handleAddNewBalance = () => {
    setEditingBalance(null);
    setNewBalanceValue("0");
    setNewCoinSymbol(SUPPORTED_COINS[0].symbol);
    setEditDialogOpen(true);
    setIsAddingNew(true);
  };

  const saveBalance = async () => {
    if (!selectedUser) return;

    try {
      const balanceValue = parseFloat(newBalanceValue);
      
      if (isNaN(balanceValue)) {
        throw new Error("Please enter a valid number");
      }

      if (balanceValue < 0) {
        throw new Error("Balance cannot be negative");
      }

      setLoading(true);
      
      if (isAddingNew) {
        // Check if this coin already exists for the user
        const existingCoin = balances.find(b => b.coin_symbol === newCoinSymbol);
        
        if (existingCoin) {
          throw new Error(`User already has a ${newCoinSymbol} balance. Please edit the existing one.`);
        }
        
        // Add new balance
        const { error } = await supabase.rpc('update_user_coin_balance', {
          p_user_id: selectedUser.id,
          p_coin_symbol: newCoinSymbol,
          p_balance: balanceValue
        });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: `Added ${newCoinSymbol} balance for ${selectedUser.email}`,
        });
      } else if (editingBalance) {
        // Update existing balance
        const { error } = await supabase.rpc('update_user_coin_balance', {
          p_user_id: selectedUser.id,
          p_coin_symbol: editingBalance.coin_symbol,
          p_balance: balanceValue
        });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: `Updated ${editingBalance.coin_symbol} balance for ${selectedUser.email}`,
        });
      }
      
      // Refresh balances
      await fetchBalances(selectedUser.id);
      setEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving balance:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save balance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const getCoinDetails = (symbol: string) => {
    return SUPPORTED_COINS.find(coin => coin.symbol === symbol) || {
      symbol,
      name: symbol,
      icon: '/placeholder-coin.svg'
    };
  };

  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8
    }).format(balance);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coin Balances</h1>
          <p className="text-muted-foreground">
            Manage user cryptocurrency balances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* User Selection */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Users</CardTitle>
            <CardDescription>Select a user to manage</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading && !users.length ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
                {filteredUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant={selectedUser?.id === user.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    <div className="truncate text-left">
                      <div className="font-medium">{user.full_name || "User"}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                  </Button>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No users found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Balances Management */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {selectedUser ? (
                  <>
                    Balances for {selectedUser.full_name || selectedUser.email}
                  </>
                ) : (
                  "Select a user"
                )}
              </CardTitle>
              <CardDescription>
                {selectedUser ? "Manage cryptocurrency balances" : "Choose a user from the list"}
              </CardDescription>
            </div>
            {selectedUser && (
              <Button onClick={handleAddNewBalance}>
                <Plus className="h-4 w-4 mr-2" />
                Add Balance
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!selectedUser ? (
              <div className="text-center py-8 text-muted-foreground">
                Please select a user to manage their balances
              </div>
            ) : loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coin</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balances.length > 0 ? (
                    balances.map((balance) => {
                      const coinDetails = getCoinDetails(balance.coin_symbol);
                      return (
                        <TableRow key={balance.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                                <img 
                                  src={coinDetails.icon} 
                                  alt={balance.coin_symbol} 
                                  className="w-6 h-6 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-coin.svg';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{balance.coin_symbol}</div>
                                <div className="text-xs text-muted-foreground">{coinDetails.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono font-medium">
                              {formatBalance(balance.balance)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(balance.last_updated).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditBalance(balance)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No balances found. Add a new balance to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit/Add Balance Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddingNew ? "Add New Balance" : "Edit Balance"}
            </DialogTitle>
            <DialogDescription>
              {isAddingNew 
                ? "Add a new cryptocurrency balance for this user" 
                : `Update the ${editingBalance?.coin_symbol} balance for ${selectedUser?.email}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isAddingNew && (
              <div className="space-y-2">
                <Label htmlFor="coin-symbol">Coin</Label>
                <Select value={newCoinSymbol} onValueChange={setNewCoinSymbol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Coin" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_COINS.map((coin) => (
                      <SelectItem key={coin.symbol} value={coin.symbol}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-background flex items-center justify-center">
                            <img 
                              src={coin.icon} 
                              alt={coin.symbol} 
                              className="w-4 h-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-coin.svg';
                              }}
                            />
                          </div>
                          {coin.symbol} - {coin.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="balance-value">Balance</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="balance-value"
                  type="number"
                  step="0.00000001"
                  min="0"
                  value={newBalanceValue}
                  onChange={(e) => setNewBalanceValue(e.target.value)}
                  className="font-mono"
                />
                <div className="font-medium">
                  {isAddingNew ? newCoinSymbol : editingBalance?.coin_symbol}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveBalance} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isAddingNew ? "Add Balance" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoinBalancesAdmin;
