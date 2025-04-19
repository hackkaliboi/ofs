-- Create a table for storing user coin balances
CREATE TABLE IF NOT EXISTS coin_balances (
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
ALTER TABLE coin_balances ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow admins to read all coin balances
CREATE POLICY "Admins can read all coin balances" 
ON coin_balances FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow admins to update all coin balances
CREATE POLICY "Admins can update all coin balances" 
ON coin_balances FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow admins to insert coin balances
CREATE POLICY "Admins can insert coin balances" 
ON coin_balances FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow users to view their own coin balances
CREATE POLICY "Users can view their own coin balances" 
ON coin_balances FOR SELECT 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS coin_balances_user_id_idx ON coin_balances(user_id);
CREATE INDEX IF NOT EXISTS coin_balances_coin_symbol_idx ON coin_balances(coin_symbol);

-- Create a function to update or insert a user's coin balance
CREATE OR REPLACE FUNCTION update_user_coin_balance(
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
  INSERT INTO coin_balances (user_id, coin_symbol, balance, last_updated, updated_by)
  VALUES (p_user_id, p_coin_symbol, p_balance, NOW(), auth.uid())
  ON CONFLICT (user_id, coin_symbol) 
  DO UPDATE SET 
    balance = p_balance,
    last_updated = NOW(),
    updated_by = auth.uid();
END;
$$;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_user_coin_balances(UUID);

-- Create a function to get a user's coin balances
CREATE FUNCTION get_user_coin_balances(p_user_id UUID)
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
  FROM coin_balances
  WHERE user_id = p_user_id
  ORDER BY coin_symbol;
$$;
