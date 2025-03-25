-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for first admin" 
ON profiles FOR INSERT 
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM profiles WHERE role = 'admin'
  )
  OR 
  (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ))
);

CREATE POLICY "Enable update for users based on id" 
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
