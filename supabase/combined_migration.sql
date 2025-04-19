-- Combined migration file for manual application

-- Fix the admin_users reference in the policies to use profiles table with role='admin' instead
-- This prevents the infinite recursion error when checking admin permissions

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can read all coin balances" ON coin_balances;
DROP POLICY IF EXISTS "Admins can update all coin balances" ON coin_balances;
DROP POLICY IF EXISTS "Admins can insert coin balances" ON coin_balances;

-- Recreate policies with corrected references
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
