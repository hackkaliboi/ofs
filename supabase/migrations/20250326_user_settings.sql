-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    
    -- Security settings
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    email_notifications_enabled BOOLEAN DEFAULT TRUE,
    login_notifications_enabled BOOLEAN DEFAULT TRUE,
    last_password_change TIMESTAMPTZ DEFAULT NOW(),
    
    -- Notification settings
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    transaction_alerts BOOLEAN DEFAULT TRUE,
    security_alerts BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    newsletter_subscription BOOLEAN DEFAULT TRUE,
    
    -- Preference settings
    language TEXT DEFAULT 'en',
    currency TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    theme TEXT DEFAULT 'light',
    compact_view BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own settings"
ON user_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON user_settings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON user_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add phone and bio fields to profiles table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'phone'
    ) THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'bio'
    ) THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
END
$$;

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile updates
DROP TRIGGER IF EXISTS on_profile_update ON profiles;
CREATE TRIGGER on_profile_update
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_profile_update();

-- Create function to handle settings updates
CREATE OR REPLACE FUNCTION handle_settings_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for settings updates
DROP TRIGGER IF EXISTS on_settings_update ON user_settings;
CREATE TRIGGER on_settings_update
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION handle_settings_update();
