import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from '@supabase/supabase-js';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, Copy, ExternalLink, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface WalletConnection {
  id: string;
  user_id: string;
  wallet_address: string;
  chain_type: string;
  created_at: string;
  validated: boolean;
  user_email?: string;
  wallet_name?: string;
}

const WalletManagement = () => {
  const [walletConnections, setWalletConnections] = useState<WalletConnection[]>([]);
  const [loading, setLoading] = useState(true);

  const [validating, setValidating] = useState(false);

  const fetchWalletConnections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*, profiles:user_id(email, full_name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setWalletConnections(data.map(wallet => ({
        ...wallet,
        user_email: wallet.profiles?.email
      })));
    } catch (error) {
      console.error('Error fetching wallet connections:', error);
      toast.error('Failed to load wallet connections');
    } finally {
      setLoading(false);
    }
  };
  
  const validateWallet = async (walletId: string, isValid: boolean) => {
    setValidating(true);
    try {
      const { error } = await supabase
        .from('user_wallets')
        .update({ validated: isValid })
        .eq('id', walletId);
      
      if (error) throw error;
      
      // Update local state
      setWalletConnections(prev => 
        prev.map(wallet => 
          wallet.id === walletId ? { ...wallet, validated: isValid } : wallet
        )
      );
      
      toast.success(`Wallet ${isValid ? 'validated' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error validating wallet:', error);
      toast.error('Failed to validate wallet');
    } finally {
      setValidating(false);
    }
  };
  
  useEffect(() => {

    fetchWalletConnections();

    // Subscribe to new wallet connections
    const channel: RealtimeChannel = supabase
      .channel('public:user_wallets')  // Use the full channel name with schema
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_wallets' 
        }, 
        (payload) => {
          console.log('Wallet change detected:', payload);
          // Refresh the wallet list when any change happens
          fetchWalletConnections();
          
          if (payload.eventType === 'INSERT') {
            toast.success('New wallet connection received!');
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    console.log('Subscribed to wallet connections channel');

    return () => {
      console.log('Unsubscribing from wallet connections channel');
      channel.unsubscribe();
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard');
  };

  const getExplorerUrl = (chainType: string, address: string) => {
    switch (chainType.toLowerCase()) {
      case 'ethereum':
        return `https://etherscan.io/address/${address}`;
      case 'bitcoin':
        return `https://www.blockchain.com/btc/address/${address}`;
      case 'polygon':
        return `https://polygonscan.com/address/${address}`;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Wallet Connections</h1>
          <p className="text-muted-foreground mt-1">Monitor wallet connections in real-time</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Wallets</CardTitle>
          <CardDescription>
            View all wallet connections as they happen in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Connected At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletConnections.map((connection) => {
                  const explorerUrl = getExplorerUrl(connection.chain_type, connection.wallet_address);
                  
                  return (
                    <TableRow key={connection.id}>
                      <TableCell className="font-medium">
                        {connection.user_email || 'Unknown User'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          {connection.wallet_address.slice(0, 6)}...
                          {connection.wallet_address.slice(-4)}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(connection.wallet_address)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {connection.chain_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(connection.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {connection.validated === true ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" /> Validated
                          </Badge>
                        ) : connection.validated === false ? (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                            <XCircle className="mr-1 h-3 w-3" /> Rejected
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
                            <AlertTriangle className="mr-1 h-3 w-3" /> Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {explorerUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => window.open(explorerUrl, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Explorer
                            </Button>
                          )}
                          
                          {connection.validated === null && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                onClick={() => validateWallet(connection.id, true)}
                                disabled={validating}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Validate
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                onClick={() => validateWallet(connection.id, false)}
                                disabled={validating}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {walletConnections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No wallet connections yet. They will appear here in real-time when users connect.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { WalletManagement as default, WalletManagement as AdminWallets };
