export type UserRole = 'admin' | 'user'

export interface Profile {
  id: string
  email: string
  role: UserRole
  full_name: string
  created_at: string
  updated_at: string
}

export interface Wallet {
  id: string
  user_id: string
  name: string
  address: string
  type: string
  balance: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  wallet_id: string
  type: 'deposit' | 'withdrawal' | 'transfer'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  description: string
  created_at: string
}

export interface SecurityLog {
  id: string
  user_id: string
  event_type: string
  description: string
  ip_address: string
  created_at: string
}

export interface Dashboard {
  total_users: number
  total_wallets: number
  total_transactions: number
  total_volume: number
}
