-- Enhance wallet_connections table with validation functionality
BEGIN;

-- First, add the validated column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'wallet_connections'
        AND column_name = 'validated'
    ) THEN
        ALTER TABLE public.wallet_connections
        ADD COLUMN validated BOOLEAN DEFAULT NULL;
    END IF;
END $$;

-- Create a function to check if a column exists
CREATE OR REPLACE FUNCTION public.check_column_exists(
    table_name TEXT,
    column_name TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = table_name
        AND column_name = column_name
    );
END;
$$;

-- Create a function to add a column if it doesn't exist
CREATE OR REPLACE FUNCTION public.add_column_if_not_exists(
    table_name TEXT,
    column_name TEXT,
    column_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = table_name
        AND column_name = column_name
    ) THEN
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN %I %s DEFAULT NULL', 
                      table_name, column_name, column_type);
    END IF;
END;
$$;

-- Create a function to get all wallet connections (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_all_wallet_connections()
RETURNS SETOF public.wallet_connections
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM public.wallet_connections ORDER BY created_at DESC;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_column_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_column_if_not_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_wallet_connections TO authenticated;

-- Update RLS policies for wallet_connections
DROP POLICY IF EXISTS "Admins can view all wallet connections" ON public.wallet_connections;

-- Create a better admin policy using the is_admin function
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

-- Add policy for admins to update wallet connections
DROP POLICY IF EXISTS "Admins can update wallet connections" ON public.wallet_connections;

CREATE POLICY "Admins can update wallet connections"
ON public.wallet_connections
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

COMMIT;
