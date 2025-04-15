-- Drop existing policies if any issues
DROP POLICY IF EXISTS "Admins can read all wallet details" ON wallet_details;
DROP POLICY IF EXISTS "Admins can update wallet details" ON wallet_details;

-- Create clearer policies for admins with explicit fallback
CREATE POLICY "Admins can read all wallet details" 
ON wallet_details FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ) OR auth.uid() = user_id
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

-- Double check RLS is enabled
ALTER TABLE wallet_details ENABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated users
GRANT ALL ON wallet_details TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
