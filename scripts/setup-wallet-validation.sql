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

-- Create policy for service role to view all wallets
CREATE POLICY "Service role can view all wallets"
ON public.user_wallets
FOR SELECT
USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Create policy for service role to update all wallets
CREATE POLICY "Service role can update all wallets"
ON public.user_wallets
FOR UPDATE
USING (
    auth.jwt() ->> 'role' = 'service_role'
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

-- Ensure profiles table has the necessary columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_validated_wallet BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS first_wallet_validated_at TIMESTAMP WITH TIME ZONE;
