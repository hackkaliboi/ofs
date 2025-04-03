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

-- Create policy for service role to view all withdrawals
CREATE POLICY "Service role can view all withdrawals"
ON public.withdrawals
FOR SELECT
USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Create policy for service role to update all withdrawals
CREATE POLICY "Service role can update all withdrawals"
ON public.withdrawals
FOR UPDATE
USING (
    auth.jwt() ->> 'role' = 'service_role'
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
