// Django API Types and Interfaces
// Defines all data models and API response structures for Django backend integration

// Base API Response Types
export interface DjangoApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
  data?: T;
}

export interface DjangoApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  non_field_errors?: string[];
  code?: string;
}

// Authentication Types
export interface DjangoUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
  groups: string[];
  user_permissions: string[];
}

export interface UserProfile {
  id: number;
  user: number;
  full_name: string;
  phone: string | null;
  country: string | null;
  timezone: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Auth Response Types
export interface AuthTokenResponse {
  access: string;
  refresh: string;
  user: DjangoUser;
  profile?: UserProfile;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

// Wallet Types
export interface WalletConnection {
  id: number;
  user: number;
  wallet_address: string;
  chain_type: 'ethereum' | 'bitcoin' | 'solana' | 'polygon' | 'binance_smart_chain';
  wallet_type: 'metamask' | 'trust_wallet' | 'coinbase_wallet' | 'phantom' | 'other';
  wallet_name?: string;
  is_validated: boolean;
  validation_status: 'pending' | 'validated' | 'rejected';
  connected_at: string;
  validated_at?: string;
  validator_notes?: string;
  created_at: string;
  updated_at: string;
  // Additional fields for API responses
  user_email?: string;
  user_name?: string;
}

export interface ConnectWalletRequest {
  wallet_address: string;
  chain_type: string;
  wallet_type: string;
  wallet_name?: string;
  signature?: string;
  message?: string;
}

export interface ValidateWalletRequest {
  wallet_id: number;
  validation_status: 'validated' | 'rejected';
  validator_notes?: string;
}

// Coin Balance Types
export interface CoinBalance {
  id: number;
  user: number;
  coin_symbol: string;
  coin_name: string;
  balance: string; // Decimal as string
  usd_value?: string;
  last_updated: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateBalanceRequest {
  user_id: number;
  coin_symbol: string;
  balance: string;
  usd_value?: string;
}

// Transaction Types
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

// KYC Types
export interface KycDocument {
  id: number;
  user: number;
  document_type: 'passport' | 'driver_license' | 'national_id' | 'utility_bill';
  document_number: string;
  front_image_url?: string;
  back_image_url?: string;
  selfie_image_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewer?: number;
  rejection_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface KycSubmissionRequest {
  document_type: string;
  document_number: string;
  front_image?: File;
  back_image?: File;
  selfie_image?: File;
}

// Statistics Types
export interface UserStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  users_with_wallets: number;
  users_with_validated_wallets: number;
  admin_users: number;
  inactive_users: number;
}

export interface WalletStats {
  total_wallets: number;
  validated_wallets: number;
  pending_wallets: number;
  rejected_wallets: number;
  validation_rate: number;
  total_balance_usd: string;
  active_chains: string[];
}

export interface ValidationStats {
  total_wallets: number;
  validated_wallets: number;
  pending_wallets: number;
  rejected_wallets: number;
  validation_rate: number;
  average_validation_time: number;
}

// Filter Types
export interface UserFilters {
  search?: string;
  is_active?: boolean;
  is_staff?: boolean;
  role?: 'user' | 'admin';
  date_joined_after?: string;
  date_joined_before?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
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

// Response Types
export interface UserListResponse extends DjangoApiResponse<DjangoUser> {
  results: DjangoUser[];
}

export interface WalletListResponse extends DjangoApiResponse<WalletConnection> {
  results: WalletConnection[];
}

export interface TransactionListResponse extends DjangoApiResponse<WalletTransaction> {
  results: WalletTransaction[];
}

// API Error Response
export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  non_field_errors?: string[];
  status_code?: number;
}

// Pagination Info
export interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  page_size: number;
  total_pages: number;
}

// Generic Paginated Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  pagination?: PaginationInfo;
}

// Bulk Operation Types
export interface BulkOperationRequest {
  ids: number[];
  action: string;
  data?: Record<string, any>;
}

export interface BulkOperationResponse {
  success_count: number;
  error_count: number;
  errors?: Array<{
    id: number;
    error: string;
  }>;
}

// File Upload Types
export interface FileUploadResponse {
  id: number;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

// Notification Types
export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  notification_type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

// Activity Log Types
export interface ActivityLog {
  id: number;
  user: number;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

// Settings Types
export interface UserSettings {
  id: number;
  user: number;
  email_notifications: boolean;
  sms_notifications: boolean;
  two_factor_enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

// All types are already exported as interfaces above