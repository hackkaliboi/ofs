import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  User,
  Globe,
  Monitor,
  Search
} from "lucide-react";
import { useSecurityLogs, SecurityLog } from "@/hooks/useSecurityLogs";

const SecurityLogs: React.FC = () => {
  const { securityLogs, loading, error, usingFallbackData } = useSecurityLogs(50);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  // Filter logs based on active tab
  const filteredLogs = securityLogs.filter(log => {
    if (activeTab === "all") return true;
    if (activeTab === "critical") return log.severity === "critical";
    if (activeTab === "high") return log.severity === "high";
    if (activeTab === "medium") return log.severity === "medium";
    if (activeTab === "low") return log.severity === "low";
    return true;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh - in a real app this would trigger a refetch
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getEventIcon = (eventType: string) => {
    if (eventType.includes('login') || eventType.includes('auth')) {
      return <User className="h-4 w-4" />;
    } else if (eventType.includes('ip') || eventType.includes('location')) {
      return <Globe className="h-4 w-4" />;
    } else if (eventType.includes('session') || eventType.includes('browser')) {
      return <Monitor className="h-4 w-4" />;
    } else if (eventType.includes('scan') || eventType.includes('detect')) {
      return <Search className="h-4 w-4" />;
    } else {
      return <Shield className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Shield className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {severity}
          </Badge>
        );
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Security Logs</CardTitle>
          <CardDescription>Monitor security events and potential threats</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {usingFallbackData && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Using Sample Data</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Unable to load real security logs. Displaying sample data instead.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" className="mb-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="high">High</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="low">Low</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading security logs...</p>
              </div>
            ) : error && !usingFallbackData ? (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Error Loading Logs</AlertTitle>
                <AlertDescription className="text-red-700">
                  {error}. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No security logs found</h3>
                <p className="text-sm text-muted-foreground">
                  No {activeTab !== "all" ? activeTab : ""} security events have been recorded
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors">
                      <div className="mt-0.5">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          log.severity === 'critical' ? 'bg-red-100' :
                          log.severity === 'high' ? 'bg-orange-100' :
                          log.severity === 'medium' ? 'bg-yellow-100' :
                          'bg-green-100'
                        }`}>
                          {getEventIcon(log.event_type)}
                        </div>
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{log.description}</p>
                          <div className="flex items-center space-x-2">
                            {getSeverityBadge(log.severity)}
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(log.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {log.event_type && (
                            <span className="bg-secondary px-2 py-1 rounded-md">
                              Type: {log.event_type.replace(/_/g, ' ')}
                            </span>
                          )}
                          {log.ip_address && (
                            <span className="bg-secondary px-2 py-1 rounded-md">
                              IP: {log.ip_address}
                            </span>
                          )}
                          {log.user_email && (
                            <span className="bg-secondary px-2 py-1 rounded-md">
                              User: {log.user_email}
                            </span>
                          )}
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <span 
                              className="bg-secondary px-2 py-1 rounded-md cursor-pointer hover:bg-secondary/80"
                              title={JSON.stringify(log.metadata, null, 2)}
                            >
                              Additional details
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SecurityLogs;
