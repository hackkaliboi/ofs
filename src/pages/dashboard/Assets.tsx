import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, ArrowUpDown, BarChart3, PieChart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
  status: string;
  last_updated: string;
  description?: string;
}

const UserAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [assets, searchQuery, typeFilter, statusFilter, sortBy, sortOrder]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would filter by user_id
      const { data, error } = await supabase
        .from("assets")
        .select("*");

      if (error) {
        throw error;
      }

      setAssets(data || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast({
        title: "Error",
        description: "Failed to load assets. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...assets];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((asset) => asset.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((asset) => asset.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "value") {
        comparison = a.value - b.value;
      } else if (sortBy === "last_updated") {
        comparison = new Date(a.last_updated).getTime() - new Date(b.last_updated).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredAssets(result);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "locked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
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
    });
  };

  // Calculate total asset value
  const totalAssetValue = filteredAssets.reduce(
    (total, asset) => total + asset.value,
    0
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">My Assets</h1>
        <p className="text-muted-foreground">
          View and manage your digital assets
        </p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets..."
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
              <SelectItem value="token">Token</SelectItem>
              <SelectItem value="nft">NFT</SelectItem>
              <SelectItem value="defi">DeFi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={toggleSortOrder}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="charts">
            <BarChart3 className="mr-2 h-4 w-4" />
            Charts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Asset Summary</CardTitle>
              <CardDescription>
                You have {filteredAssets.length} assets with a total value of{" "}
                {formatCurrency(totalAssetValue)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div className="col-span-2">Asset Name</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Value</div>
                  <div>Last Updated</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm">Loading assets...</div>
                  ) : filteredAssets.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No assets found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="grid grid-cols-6 items-center px-4 py-3 text-sm"
                      >
                        <div className="col-span-2 font-medium">{asset.name}</div>
                        <div className="capitalize">{asset.type}</div>
                        <div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(asset.status)}
                          >
                            {asset.status}
                          </Badge>
                        </div>
                        <div>{formatCurrency(asset.value)}</div>
                        <div>{formatDate(asset.last_updated)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <Card className="p-6">Loading assets...</Card>
            ) : filteredAssets.length === 0 ? (
              <Card className="p-6">
                <p className="text-muted-foreground">
                  No assets found. Try adjusting your filters.
                </p>
              </Card>
            ) : (
              filteredAssets.map((asset) => (
                <Card key={asset.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{asset.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={getStatusColor(asset.status)}
                      >
                        {asset.status}
                      </Badge>
                    </div>
                    <CardDescription className="capitalize">
                      {asset.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Value:</span>
                        <span className="font-medium">
                          {formatCurrency(asset.value)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Last Updated:
                        </span>
                        <span>{formatDate(asset.last_updated)}</span>
                      </div>
                      {asset.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {asset.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
                <CardDescription>
                  Distribution of assets by type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <PieChart className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Chart visualization will be implemented here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asset Value History</CardTitle>
                <CardDescription>
                  Value changes over the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Chart visualization will be implemented here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Asset
        </Button>
      </div>
    </div>
  );
};

export default UserAssets;
