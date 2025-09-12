// Wallet Service for Django Backend
// Handles wallet connections, validations, and crypto operations

import { apiClient, ApiResponse } from './api';

// Wallet connection model
export interface WalletConnection {
  id: number;
  user: number;
  wallet_address: string;
  chain_type: string;
  wallet_type: string;
  wallet_name?: string;
  is_validated: boolean;
  validation_status: 'pending' | 'validated' | 'rejected';
  connected_at: string;
  validated_at?: string;
  validator_notes?: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}

// Wallet details (for KYC and validation)
export interface WalletDetails {
  id: number;
  wallet_connection: number;
  seed_phrase?: string; // Encrypted on backend
  private_key?: string; // Encrypted on backend
  verification_documents: string[];
  verification_status: 'pending' | 'verified' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewer?: number;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// Coin balance model
export interface CoinBalance {
  id: number;
  user: number;
  coin_symbol: string;
  coin_name: string;
  balance: string; // Decimal field as string
  usd_value?: string;
  last_updated: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Transaction model
export interface WalletTransaction {
  id: number;
  wallet: number;
  transaction_hash: string;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'trade';
  amount: string;
  coin_symbol: string;
  from_address?: string;
  to_address?: string;
  fee: string;
  status: 'pending' | 'confirmed' | 'failed';
  block_number?: number;
  confirmations: number;
  created_at: string;
  updated_at: string;
}

// Wallet validation stats
export interface WalletStats {
  total_wallets: number;
  validated_wallets: number;
  pending_wallets: number;
  rejected_wallets: number;
  validation_rate: number;
  total_balance_usd: string;
  active_chains: string[];
}

// Request/Response types
export interface WalletListResponse extends ApiResponse<WalletConnection> {
  results: WalletConnection[];
}

export interface ConnectWalletData {
  wallet_address: string;
  chain_type: string;
  wallet_type: string;
  wallet_name?: string;
  signature?: string; // For ownership verification
  message?: string; // Message that was signed
}

export interface ValidateWalletData {
  wallet_id: number;
  validation_status: 'validated' | 'rejected';
  validator_notes?: string;
}

export interface UpdateBalanceData {
  user_id: number;
  coin_symbol: string;
  balance: string;
  usd_value?: string;
}

export interface WalletFilters {
  user?: number;
  chain_type?: string;
  validation_status?: 'pending' | 'validated' | 'rejected';
  is_validated?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

class WalletService {
  // Get wallet connections with filters
  async getWalletConnections(filters: WalletFilters = {}): Promise<WalletListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/wallets/${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<WalletListResponse>(endpoint);
  }

  // Get single wallet connection
  async getWalletConnection(walletId: number): Promise<WalletConnection> {
    return apiClient.get<WalletConnection>(`/wallets/${walletId}/`);
  }

  // Connect new wallet
  async connectWallet(walletData: ConnectWalletData): Promise<WalletConnection> {
    return apiClient.post<WalletConnection>('/wallets/', walletData);
  }

  // Update wallet connection
  async updateWalletConnection(walletId: number, data: Partial<ConnectWalletData>): Promise<WalletConnection> {
    return apiClient.patch<WalletConnection>(`/wallets/${walletId}/`, data);
  }

  // Delete wallet connection
  async deleteWalletConnection(walletId: number): Promise<void> {
    return apiClient.delete<void>(`/wallets/${walletId}/`);
  }

  // Validate wallet (admin only)
  async validateWallet(data: ValidateWalletData): Promise<WalletConnection> {
    return apiClient.post<WalletConnection>(`/wallets/${data.wallet_id}/validate/`, data);
  }

  // Get wallet details for validation
  async getWalletDetails(walletId: number): Promise<WalletDetails> {
    return apiClient.get<WalletDetails>(`/wallets/${walletId}/details/`);
  }

  // Submit wallet details for validation
  async submitWalletDetails(walletId: number, details: Partial<WalletDetails>): Promise<WalletDetails> {
    return apiClient.post<WalletDetails>(`/wallets/${walletId}/details/`, details);
  }

  // Get user's coin balances
  async getCoinBalances(userId?: number): Promise<CoinBalance[]> {
    const endpoint = userId ? `/coin-balances/?user=${userId}` : '/coin-balances/me/';
    return apiClient.get<CoinBalance[]>(endpoint);
  }

  // Update coin balance (admin only)
  async updateCoinBalance(data: UpdateBalanceData): Promise<CoinBalance> {
    return apiClient.post<CoinBalance>('/coin-balances/', data);
  }

  // Get wallet transactions
  async getWalletTransactions(walletId: number, page?: number): Promise<ApiResponse<WalletTransaction>> {
    const params = page ? `?page=${page}` : '';
    return apiClient.get<ApiResponse<WalletTransaction>>(`/wallets/${walletId}/transactions/${params}`);
  }

  // Get wallet statistics
  async getWalletStats(): Promise<WalletStats> {
    return apiClient.get<WalletStats>('/wallets/stats/');
  }

  // Search wallets by address
  async searchWallets(query: string): Promise<WalletConnection[]> {
    const response = await this.getWalletConnections({
      search: query,
      page_size: 20
    });
    return response.results;
  }

  // Get pending validations (admin only)
  async getPendingValidations(): Promise<WalletConnection[]> {
    const response = await this.getWalletConnections({
      validation_status: 'pending',
      ordering: 'connected_at'
    });
    return response.results;
  }

  // Verify wallet ownership
  async verifyWalletOwnership(walletId: number, signature: string, message: string): Promise<{ verified: boolean }> {
    return apiClient.post<{ verified: boolean }>(`/wallets/${walletId}/verify-ownership/`, {
      signature,
      message
    });
  }

  // Get supported blockchains
  async getSupportedChains(): Promise<{ chain_type: string; name: string; is_active: boolean }[]> {
    return apiClient.get<{ chain_type: string; name: string; is_active: boolean }[]>('/wallets/supported-chains/');
  }

  // Get supported wallet types
  async getSupportedWalletTypes(): Promise<{ wallet_type: string; name: string; is_active: boolean }[]> {
    return apiClient.get<{ wallet_type: string; name: string; is_active: boolean }[]>('/wallets/supported-types/');
  }

  // Bulk operations
  async bulkValidateWallets(walletIds: number[], status: 'validated' | 'rejected', notes?: string): Promise<{ updated: number }> {
    return apiClient.post<{ updated: number }>('/wallets/bulk-validate/', {
      wallet_ids: walletIds,
      validation_status: status,
      validator_notes: notes
    });
  }

  // Export wallet data
  async exportWallets(format: 'csv' | 'xlsx' = 'csv', filters: WalletFilters = {}): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...Object.fromEntries(
        Object.entries(filters).map(([k, v]) => [k, v?.toString() || ''])
      )
    });

    const response = await fetch(`${apiClient['baseURL']}/wallets/export/?${params}`, {
      headers: await apiClient['getHeaders'](),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }
}

// Create singleton instance
export const walletService = new WalletService();

export default WalletService;