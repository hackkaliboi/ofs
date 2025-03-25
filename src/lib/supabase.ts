import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// User profile helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// Wallet helpers
export const getWallets = async (userId: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

// Transaction helpers
export const getTransactions = async (walletId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('wallet_id', walletId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Admin helpers
export const getAllUsers = async () => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
  return { data, error }
}

export const getSecurityLogs = async () => {
  const { data, error } = await supabaseAdmin
    .from('security_logs')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}
