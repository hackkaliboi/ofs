import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
import { Wallet, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface WalletConnection {
  id: string;
  user_id: string;
  wallet_address: string;
  chain_type: string;
  connected_at: string;
  user_email?: string;
}

const WalletManagement = () => {
  const [walletConnections, setWalletConnections] = useState<WalletConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletConnections = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('wallet_connections')
          .select('*, profiles(email)')
          .order('connected_at', { ascending: false });
        
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

    fetchWalletConnections();

    // Subscribe to new wallet connections
    const channel: RealtimeChannel = supabase
      .channel('public:wallet_connections')  // Use the full channel name with schema
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'wallet_connections' 
        }, 
        async (payload) => {
          console.log('New wallet connection received:', payload);
          
          try {
            // Fetch the complete wallet connection with user email
            const { data, error } = await supabase
              .from('wallet_connections')
              .select('*, profiles(email)')
              .eq('id', payload.new.id)
              .single();

            if (error) {
              console.error('Error fetching wallet details:', error);
              return;
            }

            if (data) {
              console.log('Adding new wallet to state:', data);
              setWalletConnections(prev => [{
                ...data,
                user_email: data.profiles?.email
              }, ...prev]);
              toast.success('New wallet connected!');
            }
          } catch (err) {
            console.error('Error processing wallet connection:', err);
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
                        {new Date(connection.connected_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {explorerUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6"
                            onClick={() => window.open(explorerUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View on Explorer
                          </Button>
                        )}
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
