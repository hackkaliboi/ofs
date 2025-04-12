-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create a custom function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Better RLS policy for viewing profiles
CREATE POLICY "Anyone can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create a separate policy for admin view access
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (is_admin());

-- Allow admins to insert profiles
CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (is_admin());

-- Create an RPC function to safely get all profiles for admins
-- This bypasses RLS entirely
CREATE OR REPLACE FUNCTION get_all_profiles()
RETURNS SETOF profiles
LANGUAGE sql
SECURITY DEFINER -- This executes with the privileges of the function creator
AS $$
  SELECT * FROM profiles;
$$;

-- Grant usage permissions
GRANT EXECUTE ON FUNCTION get_all_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
