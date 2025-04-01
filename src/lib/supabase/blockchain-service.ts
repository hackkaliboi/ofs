import { createClient } from '@supabase/supabase-js';
// Use a type-safe Database interface
type Database = any; // Temporary fix until we create proper types

// Create a single supabase client for the entire app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Types for blockchain data
export interface BlockchainNetwork {
  id: string;
  name: string;
  symbol: string;
  is_testnet: boolean;
  rpc_url: string;
  explorer_url: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  gas_price: number | null;
  block_height: number | null;
  last_checked_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlockchainToken {
  id: string;
  network_id: string;
  name: string;
  symbol: string;
  contract_address: string | null;
  decimals: number;
  current_price: number | null;
  price_change_24h: number | null;
  market_cap: number | null;
  volume_24h: number | null;
  is_native: boolean;
  is_enabled: boolean;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlockchainSmartContract {
  id: string;
  network_id: string;
  name: string;
  address: string;
  type: 'ERC20' | 'ERC721' | 'ERC1155' | 'Custom';
  abi: any | null;
  transaction_count: number;
  total_gas_used: number;
  is_verified: boolean;
  deployed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlockchainNetworkStats {
  id: string;
  network_id: string;
  timestamp: string;
  block_height: number | null;
  gas_price: number | null;
  transaction_count: number | null;
  avg_block_time: number | null;
  active_addresses: number | null;
  created_at: string;
}

export interface BlockchainTransaction {
  id: string;
  network_id: string;
  hash: string;
  from_address: string;
  to_address: string | null;
  value: number | null;
  gas_used: number | null;
  gas_price: number | null;
  block_number: number | null;
  status: 'pending' | 'success' | 'failed' | null;
  timestamp: string | null;
  related_contract_id: string | null;
  transaction_data: any | null;
  created_at: string;
}

export interface BlockchainWallet {
  id: string;
  user_id: string;
  name: string;
  address: string;
  network_id: string;
  is_primary: boolean;
  balance: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface BlockchainEvent {
  id: string;
  network_id: string;
  contract_id: string;
  event_name: string;
  transaction_hash: string;
  block_number: number | null;
  log_index: number | null;
  event_data: any | null;
  timestamp: string | null;
  created_at: string;
}

// Blockchain service functions
export const BlockchainService = {
  // Networks
  async getNetworks(): Promise<BlockchainNetwork[]> {
    const { data, error } = await supabase
      .from('blockchain_networks')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching blockchain networks:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getNetworkById(id: string): Promise<BlockchainNetwork | null> {
    const { data, error } = await supabase
      .from('blockchain_networks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching network with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async createNetwork(network: Omit<BlockchainNetwork, 'id' | 'created_at' | 'updated_at'>): Promise<BlockchainNetwork> {
    const { data, error } = await supabase
      .from('blockchain_networks')
      .insert(network)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blockchain network:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateNetwork(id: string, updates: Partial<BlockchainNetwork>): Promise<BlockchainNetwork> {
    const { data, error } = await supabase
      .from('blockchain_networks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating network with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async deleteNetwork(id: string): Promise<void> {
    const { error } = await supabase
      .from('blockchain_networks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting network with id ${id}:`, error);
      throw error;
    }
  },
  
  // Tokens
  async getTokens(): Promise<BlockchainToken[]> {
    const { data, error } = await supabase
      .from('blockchain_tokens')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching blockchain tokens:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getTokensByNetworkId(networkId: string): Promise<BlockchainToken[]> {
    const { data, error } = await supabase
      .from('blockchain_tokens')
      .select('*')
      .eq('network_id', networkId)
      .order('name');
    
    if (error) {
      console.error(`Error fetching tokens for network ${networkId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  async createToken(token: Omit<BlockchainToken, 'id' | 'created_at' | 'updated_at'>): Promise<BlockchainToken> {
    const { data, error } = await supabase
      .from('blockchain_tokens')
      .insert(token)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blockchain token:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateToken(id: string, updates: Partial<BlockchainToken>): Promise<BlockchainToken> {
    const { data, error } = await supabase
      .from('blockchain_tokens')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating token with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async deleteToken(id: string): Promise<void> {
    const { error } = await supabase
      .from('blockchain_tokens')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting token with id ${id}:`, error);
      throw error;
    }
  },
  
  // Smart Contracts
  async getSmartContracts(): Promise<BlockchainSmartContract[]> {
    const { data, error } = await supabase
      .from('blockchain_smart_contracts')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching smart contracts:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getSmartContractsByNetworkId(networkId: string): Promise<BlockchainSmartContract[]> {
    const { data, error } = await supabase
      .from('blockchain_smart_contracts')
      .select('*')
      .eq('network_id', networkId)
      .order('name');
    
    if (error) {
      console.error(`Error fetching smart contracts for network ${networkId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  async createSmartContract(contract: Omit<BlockchainSmartContract, 'id' | 'created_at' | 'updated_at'>): Promise<BlockchainSmartContract> {
    const { data, error } = await supabase
      .from('blockchain_smart_contracts')
      .insert(contract)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating smart contract:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateSmartContract(id: string, updates: Partial<BlockchainSmartContract>): Promise<BlockchainSmartContract> {
    const { data, error } = await supabase
      .from('blockchain_smart_contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating smart contract with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async deleteSmartContract(id: string): Promise<void> {
    const { error } = await supabase
      .from('blockchain_smart_contracts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting smart contract with id ${id}:`, error);
      throw error;
    }
  },
  
  // Network Stats
  async getNetworkStats(networkId: string, limit: number = 10): Promise<BlockchainNetworkStats[]> {
    const { data, error } = await supabase
      .from('blockchain_network_stats')
      .select('*')
      .eq('network_id', networkId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error(`Error fetching network stats for network ${networkId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  async createNetworkStats(stats: Omit<BlockchainNetworkStats, 'id' | 'created_at'>): Promise<BlockchainNetworkStats> {
    const { data, error } = await supabase
      .from('blockchain_network_stats')
      .insert(stats)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating network stats:', error);
      throw error;
    }
    
    return data;
  },
  
  // Transactions
  async getTransactions(limit: number = 20, offset: number = 0): Promise<BlockchainTransaction[]> {
    const { data, error } = await supabase
      .from('blockchain_transactions')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getTransactionsByNetworkId(networkId: string, limit: number = 20, offset: number = 0): Promise<BlockchainTransaction[]> {
    const { data, error } = await supabase
      .from('blockchain_transactions')
      .select('*')
      .eq('network_id', networkId)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error(`Error fetching transactions for network ${networkId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  async getTransactionsByAddress(address: string, limit: number = 20, offset: number = 0): Promise<BlockchainTransaction[]> {
    const { data, error } = await supabase
      .from('blockchain_transactions')
      .select('*')
      .or(`from_address.eq.${address},to_address.eq.${address}`)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error(`Error fetching transactions for address ${address}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  async createTransaction(transaction: Omit<BlockchainTransaction, 'id' | 'created_at'>): Promise<BlockchainTransaction> {
    const { data, error } = await supabase
      .from('blockchain_transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
    
    return data;
  },
  
  // Wallets
  async getUserWallets(userId: string): Promise<BlockchainWallet[]> {
    const { data, error } = await supabase
      .from('blockchain_wallets')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false });
    
    if (error) {
      console.error(`Error fetching wallets for user ${userId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  async createWallet(wallet: Omit<BlockchainWallet, 'id' | 'created_at' | 'updated_at'>): Promise<BlockchainWallet> {
    const { data, error } = await supabase
      .from('blockchain_wallets')
      .insert(wallet)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateWallet(id: string, updates: Partial<BlockchainWallet>): Promise<BlockchainWallet> {
    const { data, error } = await supabase
      .from('blockchain_wallets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating wallet with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async deleteWallet(id: string): Promise<void> {
    const { error } = await supabase
      .from('blockchain_wallets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting wallet with id ${id}:`, error);
      throw error;
    }
  },
  
  // Events
  async getEvents(limit: number = 20, offset: number = 0): Promise<BlockchainEvent[]> {
    const { data, error } = await supabase
      .from('blockchain_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getEventsByContractId(contractId: string, limit: number = 20, offset: number = 0): Promise<BlockchainEvent[]> {
    const { data, error } = await supabase
      .from('blockchain_events')
      .select('*')
      .eq('contract_id', contractId)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error(`Error fetching events for contract ${contractId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  async createEvent(event: Omit<BlockchainEvent, 'id' | 'created_at'>): Promise<BlockchainEvent> {
    const { data, error } = await supabase
      .from('blockchain_events')
      .insert(event)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }
    
    return data;
  }
};

export default BlockchainService;
