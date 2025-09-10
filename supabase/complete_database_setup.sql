-- =============================================================================
-- COMPLETE SUPABASE DATABASE SETUP FOR SOLMINTX
-- =============================================================================
-- This file contains all SQL commands needed to set up the complete database
-- for the SolmintX application. Run this in your Supabase SQL Editor.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. PROFILES TABLE - Core user profiles with role management
-- =============================================================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active',
    has_validated_wallet BOOLEAN DEFAULT false,
    first_wallet_validated_at TIMESTAMP WITH TIME ZONE,
    kyc_status TEXT DEFAULT 'not_started',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sign_in TIMESTAMP WITH TIME ZONE
);

-- Create RLS policies for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to insert profiles
CREATE POLICY "Admins can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        CASE 
            WHEN NEW.email = 'pastendro@gmail.com' THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 2. WALLET CONNECTIONS TABLE - Track user wallet connections
-- =============================================================================

-- Drop existing table and recreate
DROP TABLE IF EXISTS public.wallet_connections CASCADE;

-- Create wallet_connections table
CREATE TABLE public.wallet_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    wallet_address TEXT NOT NULL,
    chain_type TEXT NOT NULL,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX wallet_connections_user_id_idx 
    ON public.wallet_connections(user_id);

CREATE INDEX wallet_connections_connected_at_idx 
    ON public.wallet_connections(connected_at);

-- Enable row level security
ALTER TABLE public.wallet_connections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own wallet connections" ON public.wallet_connections;
DROP POLICY IF EXISTS "Users can insert own wallet connections" ON public.wallet_connections;
DROP POLICY IF EXISTS "Admins can view all wallet connections" ON public.wallet_connections;

-- Create policies
CREATE POLICY "Users can view own wallet connections"
    ON public.wallet_connections
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet connections"
    ON public.wallet_connections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallet connections"
    ON public.wallet_connections
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- =============================================================================
-- 3. USER WALLETS TABLE - Wallet validation system
-- =============================================================================

-- Create user wallets table
CREATE TABLE IF NOT EXISTS public.user_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    wallet_address TEXT NOT NULL,
    wallet_name TEXT,
    chain_type TEXT NOT NULL,
    validated BOOLEAN,
    validation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "Users can create their own wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "Service role can view all wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "Service role can update all wallets" ON public.user_wallets;

-- Create policy for users to view their own wallets
CREATE POLICY "Users can view their own wallets"
ON public.user_wallets
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to insert their own wallets
CREATE POLICY "Users can create their own wallets"
ON public.user_wallets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for admins to view all wallets
CREATE POLICY "Admins can view all wallets"
ON public.user_wallets
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Create policy for admins to update all wallets
CREATE POLICY "Admins can update all wallets"
ON public.user_wallets
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS user_wallets_user_id_idx ON public.user_wallets(user_id);
CREATE INDEX IF NOT EXISTS user_wallets_validated_idx ON public.user_wallets(validated);
CREATE INDEX IF NOT EXISTS user_wallets_wallet_address_idx ON public.user_wallets(wallet_address);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_wallet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
DROP TRIGGER IF EXISTS set_wallet_updated_at ON public.user_wallets;
CREATE TRIGGER set_wallet_updated_at
BEFORE UPDATE ON public.user_wallets
FOR EACH ROW
EXECUTE FUNCTION public.handle_wallet_updated_at();

-- Add function to update profiles when a wallet is validated
CREATE OR REPLACE FUNCTION public.handle_wallet_validation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.validated = true AND (OLD.validated IS NULL OR OLD.validated = false) THEN
        -- Update the user's profile to mark that they have at least one validated wallet
        UPDATE public.profiles
        SET has_validated_wallet = true,
            first_wallet_validated_at = COALESCE(first_wallet_validated_at, NOW())
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update profile when a wallet is validated
DROP TRIGGER IF EXISTS update_profile_on_wallet_validation ON public.user_wallets;
CREATE TRIGGER update_profile_on_wallet_validation
AFTER UPDATE ON public.user_wallets
FOR EACH ROW
WHEN (NEW.validated = true AND (OLD.validated IS NULL OR OLD.validated = false))
EXECUTE FUNCTION public.handle_wallet_validation();

-- =============================================================================
-- 4. WALLET DETAILS TABLE - Admin wallet validation submissions
-- =============================================================================

-- Create a new table for storing wallet details dropped by users
CREATE TABLE IF NOT EXISTS public.wallet_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  wallet_type TEXT NOT NULL,
  wallet_phrase TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  
  -- Add any additional fields you might need
  ip_address TEXT,
  user_agent TEXT
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.wallet_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can read all wallet details" ON public.wallet_details;
DROP POLICY IF EXISTS "Admins can update wallet details" ON public.wallet_details;
DROP POLICY IF EXISTS "Users can insert their own wallet details" ON public.wallet_details;
DROP POLICY IF EXISTS "Users can view their own wallet details" ON public.wallet_details;

-- Create policies
-- Allow admins to read all wallet details with fallback for users to see their own
CREATE POLICY "Admins can read all wallet details" 
ON public.wallet_details FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) OR auth.uid() = user_id
);

-- Allow admins to update wallet details (for review)
CREATE POLICY "Admins can update wallet details" 
ON public.wallet_details FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow users to insert their own wallet details
CREATE POLICY "Users can insert their own wallet details" 
ON public.wallet_details FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own wallet details
CREATE POLICY "Users can view their own wallet details" 
ON public.wallet_details FOR SELECT 
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS wallet_details_user_id_idx ON public.wallet_details(user_id);
CREATE INDEX IF NOT EXISTS wallet_details_created_at_idx ON public.wallet_details(created_at);
CREATE INDEX IF NOT EXISTS wallet_details_status_idx ON public.wallet_details(status);

-- =============================================================================
-- 5. ADMIN USERS TABLE - Legacy admin tracking
-- =============================================================================

-- Create admin_users table if it doesn't exist (for legacy compatibility)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin users can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can manage admin_users" ON public.admin_users;

CREATE POLICY "Admin users can view admin_users"
  ON public.admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can manage admin_users"
  ON public.admin_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- 6. KYC DOCUMENTS TABLE - Know Your Customer verification
-- =============================================================================

-- Create KYC documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  front_image_url TEXT NOT NULL,
  back_image_url TEXT,
  selfie_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ NOT NULL,
  reviewed_at TIMESTAMPTZ,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON public.kyc_documents(status);

-- Enable Row Level Security
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can insert their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admin users can view all KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admin users can update KYC documents" ON public.kyc_documents;

-- Policy for users to view their own documents
CREATE POLICY "Users can view their own KYC documents"
  ON public.kyc_documents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own documents
CREATE POLICY "Users can insert their own KYC documents"
  ON public.kyc_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for admin users to view all documents
CREATE POLICY "Admin users can view all KYC documents"
  ON public.kyc_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policy for admin users to update documents
CREATE POLICY "Admin users can update KYC documents"
  ON public.kyc_documents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- 7. WITHDRAWALS TABLE - User withdrawal requests
-- =============================================================================

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    wallet_id UUID NOT NULL,
    wallet_name TEXT,
    wallet_address TEXT NOT NULL,
    amount TEXT NOT NULL,
    token TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    transaction_hash TEXT,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    rejected_reason TEXT
);

-- Add RLS policies
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Users can create their own withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Admins can view all withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Admins can update all withdrawals" ON public.withdrawals;

-- Create policy for users to view their own withdrawals
CREATE POLICY "Users can view their own withdrawals"
ON public.withdrawals
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to insert their own withdrawals
CREATE POLICY "Users can create their own withdrawals"
ON public.withdrawals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for admins to view all withdrawals
CREATE POLICY "Admins can view all withdrawals"
ON public.withdrawals
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Create policy for admins to update all withdrawals
CREATE POLICY "Admins can update all withdrawals"
ON public.withdrawals
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS withdrawals_user_id_idx ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS withdrawals_status_idx ON public.withdrawals(status);
CREATE INDEX IF NOT EXISTS withdrawals_created_at_idx ON public.withdrawals(created_at);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.withdrawals;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.withdrawals
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 8. COIN BALANCES TABLE - User cryptocurrency balances
-- =============================================================================

-- Create a table for storing user coin balances
CREATE TABLE IF NOT EXISTS public.coin_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coin_symbol TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Ensure each user can only have one balance per coin type
  CONSTRAINT unique_user_coin UNIQUE (user_id, coin_symbol)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.coin_balances ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can read all coin balances" ON public.coin_balances;
DROP POLICY IF EXISTS "Admins can update all coin balances" ON public.coin_balances;
DROP POLICY IF EXISTS "Admins can insert coin balances" ON public.coin_balances;
DROP POLICY IF EXISTS "Users can view their own coin balances" ON public.coin_balances;

-- Create policies
-- Allow admins to read all coin balances
CREATE POLICY "Admins can read all coin balances" 
ON public.coin_balances FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow admins to update all coin balances
CREATE POLICY "Admins can update all coin balances" 
ON public.coin_balances FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow admins to insert coin balances
CREATE POLICY "Admins can insert coin balances" 
ON public.coin_balances FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow users to view their own coin balances
CREATE POLICY "Users can view their own coin balances" 
ON public.coin_balances FOR SELECT 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS coin_balances_user_id_idx ON public.coin_balances(user_id);
CREATE INDEX IF NOT EXISTS coin_balances_coin_symbol_idx ON public.coin_balances(coin_symbol);

-- =============================================================================
-- 9. UTILITY FUNCTIONS
-- =============================================================================

-- Add function to get table information
CREATE OR REPLACE FUNCTION public.get_table_info(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT 
    jsonb_build_object(
      'exists', (SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = get_table_info.table_name
      )),
      'columns', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'column_name', column_name,
            'data_type', data_type,
            'is_nullable', is_nullable
          )
        )
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = get_table_info.table_name
      )
    ) INTO result;
    
  RETURN result;
END;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_table_info(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_table_info(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_table_info(text) TO service_role;

-- Create a function to update or insert a user's coin balance
CREATE OR REPLACE FUNCTION public.update_user_coin_balance(
  p_user_id UUID,
  p_coin_symbol TEXT,
  p_balance NUMERIC
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update the balance
  INSERT INTO public.coin_balances (user_id, coin_symbol, balance, last_updated, updated_by)
  VALUES (p_user_id, p_coin_symbol, p_balance, NOW(), auth.uid())
  ON CONFLICT (user_id, coin_symbol) 
  DO UPDATE SET 
    balance = p_balance,
    last_updated = NOW(),
    updated_by = auth.uid();
END;
$$;

-- Create a function to get a user's coin balances
CREATE OR REPLACE FUNCTION public.get_user_coin_balances(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  coin_symbol TEXT,
  balance NUMERIC,
  last_updated TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, coin_symbol, balance, last_updated
  FROM public.coin_balances
  WHERE user_id = p_user_id
  ORDER BY coin_symbol;
$$;

-- Create admin functions for wallet details
CREATE OR REPLACE FUNCTION public.get_all_wallet_details_admin()
RETURNS SETOF public.wallet_details
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    -- Return all wallet details if user is admin
    RETURN QUERY SELECT * FROM public.wallet_details ORDER BY created_at DESC;
  ELSE
    -- Return only the user's own wallet details if not admin
    RETURN QUERY SELECT * FROM public.wallet_details WHERE user_id = auth.uid() ORDER BY created_at DESC;
  END IF;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_all_wallet_details_admin() TO authenticated;

-- Create a function for wallet detail statistics
CREATE OR REPLACE FUNCTION public.get_wallet_detail_stats_admin()
RETURNS TABLE (
  total bigint,
  pending bigint,
  approved bigint,
  rejected bigint,
  today_submissions bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today_date date := current_date;
BEGIN
  -- Check if the current user is an admin
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    -- Return stats for all wallet details if user is admin
    RETURN QUERY 
    SELECT 
      COUNT(*)::bigint as total,
      COUNT(*) FILTER (WHERE status = 'pending')::bigint as pending,
      COUNT(*) FILTER (WHERE status = 'approved')::bigint as approved,
      COUNT(*) FILTER (WHERE status = 'rejected')::bigint as rejected,
      COUNT(*) FILTER (WHERE created_at::date = today_date)::bigint as today_submissions
    FROM public.wallet_details;
  ELSE
    -- Return zeros if not admin
    RETURN QUERY SELECT 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint;
  END IF;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_wallet_detail_stats_admin() TO authenticated;

-- =============================================================================
-- 10. ENABLE REALTIME AND SETUP INITIAL DATA
-- =============================================================================

-- Enable realtime for the tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_connections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coin_balances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawals;

-- Insert admin user if they don't exist yet
INSERT INTO public.profiles (id, email, full_name, role, status)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    'admin',
    'active'
FROM auth.users
WHERE email = 'pastendro@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE email = 'pastendro@gmail.com'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- Insert existing users from auth.users table if they don't have profiles yet
INSERT INTO public.profiles (id, email, full_name, role, status)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    CASE WHEN email = 'pastendro@gmail.com' THEN 'admin' ELSE 'user' END,
    'active'
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================
-- The SolmintX database is now fully configured with:
-- ✅ User profiles with role management
-- ✅ Wallet connection tracking
-- ✅ Wallet validation system
-- ✅ Admin wallet detail submissions
-- ✅ KYC document verification
-- ✅ Withdrawal request management
-- ✅ Coin balance tracking
-- ✅ Row Level Security policies
-- ✅ Admin functions and utilities
-- ✅ Realtime subscriptions
-- ✅ Automatic user profile creation
-- =============================================================================