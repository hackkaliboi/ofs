import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Wallet, 
  AlertCircle, 
  RefreshCcw,
  Download,
  Upload,
  MoreHorizontal,
  Check,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  total_supply: number;
  current_price: number;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
}

const AdminAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      setLoadingError(null);
      
      // In a real implementation, this would fetch from a 'assets' table
      // For now, we'll use mock data since the table might not exist yet
      
      // Simulating API call
      setTimeout(() => {
        const mockAssets: Asset[] = [
          {
            id: "1",
            name: "Bitcoin",
            symbol: "BTC",
            type: "cryptocurrency",
            total_supply: 21000000,
            current_price: 55000,
            status: "active",
            created_at: "2023-01-15T12:00:00Z"
          },
          {
            id: "2",
            name: "Ethereum",
            symbol: "ETH",
            type: "cryptocurrency",
            total_supply: 120000000,
            current_price: 2500,
            status: "active",
            created_at: "2023-01-20T14:30:00Z"
          },
          {
            id: "3",
            name: "USD Coin",
            symbol: "USDC",
            type: "stablecoin",
            total_supply: 45000000000,
            current_price: 1,
            status: "active",
            created_at: "2023-02-05T09:15:00Z"
          },
          {
            id: "4",
            name: "Solana",
            symbol: "SOL",
            type: "cryptocurrency",
            total_supply: 500000000,
            current_price: 100,
            status: "active",
            created_at: "2023-02-10T16:45:00Z"
          },
          {
            id: "5",
            name: "New Token",
            symbol: "NTK",
            type: "utility",
            total_supply: 1000000000,
            current_price: 0.05,
            status: "pending",
            created_at: "2023-03-01T11:20:00Z"
          },
          {
            id: "6",
            name: "Legacy Token",
            symbol: "LGT",
            type: "security",
            total_supply: 10000000,
            current_price: 0,
            status: "inactive",
            created_at: "2022-10-15T08:30:00Z"
          }
        ];
        
        setAssets(mockAssets);
        setIsLoading(false);
      }, 1000);
      
      // When you have the actual table, use this:
      // const { data, error } = await supabase.from('assets').select('*');
      // if (error) throw error;
      // setAssets(data || []);
      
    } catch (error) {
      console.error("Error fetching assets:", error);
      setLoadingError("Failed to load assets. Please try again.");
      setIsLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    // Filter by search query
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && asset.status === "active";
    if (activeTab === "pending") return matchesSearch && asset.status === "pending";
    if (activeTab === "inactive") return matchesSearch && asset.status === "inactive";
    
    return matchesSearch;
  });

  // Handle loading error
  if (loadingError) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <div className="text-destructive text-xl mb-4">{loadingError}</div>
        <Button 
          onClick={() => fetchAssets()}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Asset Management</h1>
        <p className="text-muted-foreground">
          Manage all assets on the platform
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Asset Inventory</CardTitle>
              <CardDescription>
                Showing {filteredAssets.length} of {assets.length} assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-muted"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-muted rounded"></div>
                          <div className="h-3 w-16 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="h-8 w-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredAssets.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Wallet className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-muted-foreground">{asset.symbol} • {asset.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">${asset.current_price.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Supply: {asset.total_supply.toLocaleString()}</div>
                          </div>
                          <Badge 
                            variant={
                              asset.status === "active" ? "success" : 
                              asset.status === "pending" ? "outline" : "destructive"
                            }
                            className={
                              asset.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : 
                              asset.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : 
                              "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {asset.status === "active" && <Check className="mr-1 h-3 w-3" />}
                            {asset.status === "pending" && <AlertCircle className="mr-1 h-3 w-3" />}
                            {asset.status === "inactive" && <X className="mr-1 h-3 w-3" />}
                            {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No assets found</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {searchQuery 
                      ? `No assets match your search "${searchQuery}". Try a different search term.` 
                      : "There are no assets in this category. Add your first asset to get started."}
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Asset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs share the same content structure but with filtered data */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Assets</CardTitle>
              <CardDescription>
                Showing {filteredAssets.length} active assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same content structure as "all" tab */}
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-muted"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-muted rounded"></div>
                          <div className="h-3 w-16 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="h-8 w-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredAssets.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Wallet className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-muted-foreground">{asset.symbol} • {asset.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">${asset.current_price.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Supply: {asset.total_supply.toLocaleString()}</div>
                          </div>
                          <Badge 
                            variant="success"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Active
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active assets found</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {searchQuery 
                      ? `No active assets match your search "${searchQuery}". Try a different search term.` 
                      : "There are no active assets. Activate an asset to see it here."}
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Asset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending and Inactive tabs would follow the same pattern */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pending Assets</CardTitle>
              <CardDescription>
                Showing {filteredAssets.length} pending assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar content structure */}
              {isLoading ? (
                <div className="animate-pulse">Loading...</div>
              ) : filteredAssets.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors">
                        {/* Similar structure to other tabs */}
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Wallet className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-muted-foreground">{asset.symbol} • {asset.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">${asset.current_price.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Supply: {asset.total_supply.toLocaleString()}</div>
                          </div>
                          <Badge 
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          >
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending assets</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There are no assets awaiting approval.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Inactive Assets</CardTitle>
              <CardDescription>
                Showing {filteredAssets.length} inactive assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar content structure */}
              {isLoading ? (
                <div className="animate-pulse">Loading...</div>
              ) : filteredAssets.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors">
                        {/* Similar structure to other tabs */}
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Wallet className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-muted-foreground">{asset.symbol} • {asset.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">${asset.current_price.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Supply: {asset.total_supply.toLocaleString()}</div>
                          </div>
                          <Badge 
                            variant="destructive"
                            className="bg-red-100 text-red-800 hover:bg-red-100"
                          >
                            <X className="mr-1 h-3 w-3" />
                            Inactive
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No inactive assets</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There are no inactive assets in the system.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAssets;
