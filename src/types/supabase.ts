export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      blockchain_events: {
        Row: {
          block_number: number | null
          contract_id: string
          created_at: string
          event_data: Json | null
          event_name: string
          id: string
          log_index: number | null
          network_id: string
          timestamp: string | null
          transaction_hash: string
        }
        Insert: {
          block_number?: number | null
          contract_id: string
          created_at?: string
          event_data?: Json | null
          event_name: string
          id?: string
          log_index?: number | null
          network_id: string
          timestamp?: string | null
          transaction_hash: string
        }
        Update: {
          block_number?: number | null
          contract_id?: string
          created_at?: string
          event_data?: Json | null
          event_name?: string
          id?: string
          log_index?: number | null
          network_id?: string
          timestamp?: string | null
          transaction_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_events_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "blockchain_smart_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blockchain_events_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "blockchain_networks"
            referencedColumns: ["id"]
          }
        ]
      }
      blockchain_networks: {
        Row: {
          block_height: number | null
          created_at: string
          explorer_url: string | null
          gas_price: number | null
          id: string
          is_testnet: boolean
          last_checked_at: string
          name: string
          rpc_url: string
          status: string
          symbol: string
          updated_at: string
        }
        Insert: {
          block_height?: number | null
          created_at?: string
          explorer_url?: string | null
          gas_price?: number | null
          id?: string
          is_testnet?: boolean
          last_checked_at?: string
          name: string
          rpc_url: string
          status: string
          symbol: string
          updated_at?: string
        }
        Update: {
          block_height?: number | null
          created_at?: string
          explorer_url?: string | null
          gas_price?: number | null
          id?: string
          is_testnet?: boolean
          last_checked_at?: string
          name?: string
          rpc_url?: string
          status?: string
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      blockchain_network_stats: {
        Row: {
          active_addresses: number | null
          avg_block_time: number | null
          block_height: number | null
          created_at: string
          gas_price: number | null
          id: string
          network_id: string
          timestamp: string
          transaction_count: number | null
        }
        Insert: {
          active_addresses?: number | null
          avg_block_time?: number | null
          block_height?: number | null
          created_at?: string
          gas_price?: number | null
          id?: string
          network_id: string
          timestamp?: string
          transaction_count?: number | null
        }
        Update: {
          active_addresses?: number | null
          avg_block_time?: number | null
          block_height?: number | null
          created_at?: string
          gas_price?: number | null
          id?: string
          network_id?: string
          timestamp?: string
          transaction_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_network_stats_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "blockchain_networks"
            referencedColumns: ["id"]
          }
        ]
      }
      blockchain_smart_contracts: {
        Row: {
          abi: Json | null
          address: string
          created_at: string
          deployed_at: string | null
          id: string
          is_verified: boolean
          name: string
          network_id: string
          total_gas_used: number
          transaction_count: number
          type: string
          updated_at: string
        }
        Insert: {
          abi?: Json | null
          address: string
          created_at?: string
          deployed_at?: string | null
          id?: string
          is_verified?: boolean
          name: string
          network_id: string
          total_gas_used?: number
          transaction_count?: number
          type: string
          updated_at?: string
        }
        Update: {
          abi?: Json | null
          address?: string
          created_at?: string
          deployed_at?: string | null
          id?: string
          is_verified?: boolean
          name?: string
          network_id?: string
          total_gas_used?: number
          transaction_count?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_smart_contracts_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "blockchain_networks"
            referencedColumns: ["id"]
          }
        ]
      }
      blockchain_tokens: {
        Row: {
          contract_address: string | null
          created_at: string
          current_price: number | null
          decimals: number
          id: string
          is_enabled: boolean
          is_native: boolean
          logo_url: string | null
          market_cap: number | null
          name: string
          network_id: string
          price_change_24h: number | null
          symbol: string
          updated_at: string
          volume_24h: number | null
        }
        Insert: {
          contract_address?: string | null
          created_at?: string
          current_price?: number | null
          decimals?: number
          id?: string
          is_enabled?: boolean
          is_native?: boolean
          logo_url?: string | null
          market_cap?: number | null
          name: string
          network_id: string
          price_change_24h?: number | null
          symbol: string
          updated_at?: string
          volume_24h?: number | null
        }
        Update: {
          contract_address?: string | null
          created_at?: string
          current_price?: number | null
          decimals?: number
          id?: string
          is_enabled?: boolean
          is_native?: boolean
          logo_url?: string | null
          market_cap?: number | null
          name?: string
          network_id?: string
          price_change_24h?: number | null
          symbol?: string
          updated_at?: string
          volume_24h?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_tokens_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "blockchain_networks"
            referencedColumns: ["id"]
          }
        ]
      }
      blockchain_transactions: {
        Row: {
          block_number: number | null
          created_at: string
          from_address: string
          gas_price: number | null
          gas_used: number | null
          hash: string
          id: string
          network_id: string
          related_contract_id: string | null
          status: string | null
          timestamp: string | null
          to_address: string | null
          transaction_data: Json | null
          value: number | null
        }
        Insert: {
          block_number?: number | null
          created_at?: string
          from_address: string
          gas_price?: number | null
          gas_used?: number | null
          hash: string
          id?: string
          network_id: string
          related_contract_id?: string | null
          status?: string | null
          timestamp?: string | null
          to_address?: string | null
          transaction_data?: Json | null
          value?: number | null
        }
        Update: {
          block_number?: number | null
          created_at?: string
          from_address?: string
          gas_price?: number | null
          gas_used?: number | null
          hash?: string
          id?: string
          network_id?: string
          related_contract_id?: string | null
          status?: string | null
          timestamp?: string | null
          to_address?: string | null
          transaction_data?: Json | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_transactions_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "blockchain_networks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blockchain_transactions_related_contract_id_fkey"
            columns: ["related_contract_id"]
            isOneToOne: false
            referencedRelation: "blockchain_smart_contracts"
            referencedColumns: ["id"]
          }
        ]
      }
      blockchain_wallets: {
        Row: {
          address: string
          balance: number
          created_at: string
          id: string
          is_primary: boolean
          last_updated: string
          name: string
          network_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          balance?: number
          created_at?: string
          id?: string
          is_primary?: boolean
          last_updated?: string
          name: string
          network_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          balance?: number
          created_at?: string
          id?: string
          is_primary?: boolean
          last_updated?: string
          name?: string
          network_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_wallets_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "blockchain_networks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blockchain_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          email_notifications: boolean
          email_notifications_enabled: boolean
          id: string
          language: string
          last_password_change: string
          login_notifications_enabled: boolean
          marketing_emails: boolean
          newsletter_subscription: boolean
          push_notifications: boolean
          security_alerts: boolean
          transaction_alerts: boolean
          two_factor_enabled: boolean
          user_id: string
        }
        Insert: {
          email_notifications?: boolean
          email_notifications_enabled?: boolean
          id?: string
          language?: string
          last_password_change?: string
          login_notifications_enabled?: boolean
          marketing_emails?: boolean
          newsletter_subscription?: boolean
          push_notifications?: boolean
          security_alerts?: boolean
          transaction_alerts?: boolean
          two_factor_enabled?: boolean
          user_id: string
        }
        Update: {
          email_notifications?: boolean
          email_notifications_enabled?: boolean
          id?: string
          language?: string
          last_password_change?: string
          login_notifications_enabled?: boolean
          marketing_emails?: boolean
          newsletter_subscription?: boolean
          push_notifications?: boolean
          security_alerts?: boolean
          transaction_alerts?: boolean
          two_factor_enabled?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
