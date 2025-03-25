-- Enhance profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;

-- Create user sessions table for "Login as User"
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id),
    user_id UUID REFERENCES auth.users(id),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    ip_address TEXT,
    user_agent TEXT
);

-- Create user activity log
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
    p_user_id UUID,
    p_action_type TEXT,
    p_details JSONB
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO user_activity_log (user_id, action_type, details)
    VALUES (p_user_id, p_action_type, p_details)
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start admin session as user
CREATE OR REPLACE FUNCTION start_user_session(
    p_admin_id UUID,
    p_user_id UUID,
    p_ip_address TEXT,
    p_user_agent TEXT
) RETURNS UUID AS $$
DECLARE
    v_session_id UUID;
BEGIN
    -- Verify admin role
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = p_admin_id 
        AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required';
    END IF;

    -- Create session
    INSERT INTO user_sessions (
        admin_id,
        user_id,
        ip_address,
        user_agent
    )
    VALUES (
        p_admin_id,
        p_user_id,
        p_ip_address,
        p_user_agent
    )
    RETURNING id INTO v_session_id;

    -- Log activity
    PERFORM log_user_activity(
        p_admin_id,
        'LOGIN_AS_USER',
        jsonb_build_object(
            'target_user_id', p_user_id,
            'session_id', v_session_id
        )
    );

    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end user session
CREATE OR REPLACE FUNCTION end_user_session(
    p_session_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE user_sessions
    SET ended_at = NOW()
    WHERE id = p_session_id
    AND ended_at IS NULL;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view sessions
CREATE POLICY "Admins can view all sessions"
    ON user_sessions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Only admins can insert sessions
CREATE POLICY "Admins can create sessions"
    ON user_sessions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Activity log policies
CREATE POLICY "Users can view their own activity"
    ON user_activity_log FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity"
    ON user_activity_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Update profiles policies for admin management
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_admin_id ON user_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action_type ON user_activity_log(action_type);
