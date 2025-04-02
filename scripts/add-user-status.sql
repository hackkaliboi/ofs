-- Add status field to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END
$$;

-- Check if last_sign_in column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'last_sign_in'
    ) THEN
        -- If last_sign_in doesn't exist, set all profiles to 'pending' status
        UPDATE profiles 
        SET status = 'pending'
        WHERE status IS NULL;
    ELSE
        -- If last_sign_in exists, update based on activity
        UPDATE profiles 
        SET status = 
            CASE 
                WHEN last_sign_in IS NOT NULL AND last_sign_in > (NOW() - INTERVAL '30 days') THEN 'active'
                WHEN created_at > (NOW() - INTERVAL '7 days') THEN 'pending'
                ELSE 'inactive'
            END
        WHERE status IS NULL OR status = 'pending';
    END IF;
END
$$;

-- Create an index on the status field for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- Add RLS policy for status updates
-- First drop the policy if it exists to avoid errors
DO $$
BEGIN
    BEGIN
        DROP POLICY IF EXISTS "Admin users can update profile status" ON profiles;
    EXCEPTION WHEN OTHERS THEN
        -- Policy doesn't exist, ignore error
    END;
END
$$;

-- Create the policy
CREATE POLICY "Admin users can update profile status" 
    ON profiles 
    FOR UPDATE 
    USING (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE user_id = auth.uid()
        )
    );
