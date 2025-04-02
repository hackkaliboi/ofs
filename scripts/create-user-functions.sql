-- Function to check if a column exists in a table
CREATE OR REPLACE FUNCTION check_column_exists(table_name text, column_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  column_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = $1
    AND column_name = $2
  ) INTO column_exists;
  
  RETURN column_exists;
END;
$$;

-- Function to add status column to profiles table
CREATE OR REPLACE FUNCTION add_status_column_to_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'pending';
    
    -- Update existing profiles to have a status based on their activity
    UPDATE profiles 
    SET status = 
      CASE 
        WHEN last_sign_in IS NOT NULL AND last_sign_in > (NOW() - INTERVAL '30 days') THEN 'active'
        WHEN created_at > (NOW() - INTERVAL '7 days') THEN 'pending'
        ELSE 'inactive'
      END
    WHERE status IS NULL OR status = 'pending';
    
    -- Create an index on the status field for faster queries
    CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
  END IF;
END;
$$;
