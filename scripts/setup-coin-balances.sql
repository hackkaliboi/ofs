-- Create coin_balances table to store user balances
CREATE TABLE IF NOT EXISTS coin_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coin_symbol TEXT NOT NULL,
  balance DECIMAL(24, 8) NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure each user can only have one balance entry per coin
  CONSTRAINT unique_user_coin UNIQUE (user_id, coin_symbol)
);

-- Enable Row Level Security
ALTER TABLE coin_balances ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own balances
CREATE POLICY "Users can view their own balances"
  ON coin_balances FOR SELECT
  USING (auth.uid() = user_id);

-- Only admins can insert/update balances
CREATE POLICY "Admins can manage all balances"
  ON coin_balances FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update coin balances
CREATE OR REPLACE FUNCTION update_user_coin_balance(
  p_user_id UUID,
  p_coin_symbol TEXT,
  p_balance DECIMAL(24, 8)
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO coin_balances (user_id, coin_symbol, balance, last_updated)
  VALUES (p_user_id, p_coin_symbol, p_balance, NOW())
  ON CONFLICT (user_id, coin_symbol)
  DO UPDATE SET
    balance = p_balance,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user coin balances
CREATE OR REPLACE FUNCTION get_user_coin_balances(p_user_id UUID)
RETURNS TABLE (
  coin_symbol TEXT,
  balance DECIMAL(24, 8),
  last_updated TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT cb.coin_symbol, cb.balance, cb.last_updated
  FROM coin_balances cb
  WHERE cb.user_id = p_user_id
  ORDER BY cb.coin_symbol;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default coins for all existing users
INSERT INTO coin_balances (user_id, coin_symbol, balance)
SELECT id, 'BTC', 0
FROM auth.users
ON CONFLICT (user_id, coin_symbol) DO NOTHING;

INSERT INTO coin_balances (user_id, coin_symbol, balance)
SELECT id, 'XRP', 0
FROM auth.users
ON CONFLICT (user_id, coin_symbol) DO NOTHING;

INSERT INTO coin_balances (user_id, coin_symbol, balance)
SELECT id, 'ETH', 0
FROM auth.users
ON CONFLICT (user_id, coin_symbol) DO NOTHING;

INSERT INTO coin_balances (user_id, coin_symbol, balance)
SELECT id, 'SOL', 0
FROM auth.users
ON CONFLICT (user_id, coin_symbol) DO NOTHING;

-- Create a trigger to add default coin balances for new users
CREATE OR REPLACE FUNCTION create_default_coin_balances()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO coin_balances (user_id, coin_symbol, balance)
  VALUES 
    (NEW.id, 'BTC', 0),
    (NEW.id, 'XRP', 0),
    (NEW.id, 'ETH', 0),
    (NEW.id, 'SOL', 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_coin_balances();
