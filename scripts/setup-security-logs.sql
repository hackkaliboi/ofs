-- Create security events table
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to view all security events
CREATE POLICY "Service role can view all security events"
ON public.security_events
FOR SELECT
USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Create policy for service role to insert security events
CREATE POLICY "Service role can insert security events"
ON public.security_events
FOR INSERT
WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS security_events_user_id_idx ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS security_events_event_type_idx ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS security_events_severity_idx ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS security_events_created_at_idx ON public.security_events(created_at);

-- Create user activity log table as a fallback
CREATE TABLE IF NOT EXISTS public.user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own activity
CREATE POLICY "Users can view their own activity"
ON public.user_activity_log
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for service role to view all activity
CREATE POLICY "Service role can view all activity"
ON public.user_activity_log
FOR SELECT
USING (
    auth.jwt() ->> 'role' = 'service_role'
);

-- Create policy for service role to insert activity
CREATE POLICY "Service role can insert activity"
ON public.user_activity_log
FOR INSERT
WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = user_id
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS user_activity_log_user_id_idx ON public.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS user_activity_log_activity_type_idx ON public.user_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS user_activity_log_created_at_idx ON public.user_activity_log(created_at);

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_user_id UUID,
    p_event_type TEXT,
    p_description TEXT,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_severity TEXT DEFAULT 'low',
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO public.security_events (
        user_id,
        event_type,
        description,
        ip_address,
        user_agent,
        severity,
        metadata,
        created_at
    ) VALUES (
        p_user_id,
        p_event_type,
        p_description,
        p_ip_address,
        p_user_agent,
        p_severity,
        p_metadata,
        NOW()
    ) RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_description TEXT,
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
    v_activity_id UUID;
BEGIN
    INSERT INTO public.user_activity_log (
        user_id,
        activity_type,
        description,
        metadata,
        created_at
    ) VALUES (
        p_user_id,
        p_activity_type,
        p_description,
        p_metadata,
        NOW()
    ) RETURNING id INTO v_activity_id;
    
    RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically log certain events as security events
CREATE OR REPLACE FUNCTION public.log_security_events_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Log failed login attempts
    IF TG_TABLE_NAME = 'auth_log' AND NEW.type = 'login' AND NEW.error IS NOT NULL THEN
        PERFORM public.log_security_event(
            NEW.user_id,
            'failed_login_attempt',
            'Failed login attempt: ' || COALESCE(NEW.error, 'Unknown error'),
            NEW.ip::TEXT,
            NEW.user_agent,
            'medium',
            jsonb_build_object('error', NEW.error)
        );
    END IF;
    
    -- Log successful logins
    IF TG_TABLE_NAME = 'auth_log' AND NEW.type = 'login' AND NEW.error IS NULL THEN
        PERFORM public.log_security_event(
            NEW.user_id,
            'successful_login',
            'User logged in successfully',
            NEW.ip::TEXT,
            NEW.user_agent,
            'low',
            '{}'::JSONB
        );
    END IF;
    
    -- Log password resets
    IF TG_TABLE_NAME = 'auth_log' AND NEW.type = 'password_reset' THEN
        PERFORM public.log_security_event(
            NEW.user_id,
            'password_reset',
            'Password reset requested',
            NEW.ip::TEXT,
            NEW.user_agent,
            'high',
            '{}'::JSONB
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data for testing (comment out in production)
INSERT INTO public.security_events (
    user_id,
    event_type,
    description,
    ip_address,
    user_agent,
    severity,
    metadata,
    created_at
) VALUES 
(NULL, 'system_startup', 'System initialized successfully', NULL, NULL, 'low', '{"version": "1.0.0"}'::JSONB, NOW() - INTERVAL '2 days'),
(NULL, 'suspicious_ip_access', 'Multiple login attempts from unknown location', '203.0.113.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'high', '{"attempts": 5, "location": "Unknown"}'::JSONB, NOW() - INTERVAL '1 day'),
(NULL, 'database_backup', 'Scheduled database backup completed', NULL, NULL, 'low', '{"size_mb": 250, "duration_seconds": 45}'::JSONB, NOW() - INTERVAL '12 hours'),
(NULL, 'api_rate_limit', 'API rate limit exceeded', '198.51.100.1', NULL, 'medium', '{"endpoint": "/api/v1/transactions", "requests": 150, "limit": 100}'::JSONB, NOW() - INTERVAL '6 hours'),
(NULL, 'admin_login', 'Administrator login detected', '192.168.1.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'medium', '{"admin_level": "super_admin"}'::JSONB, NOW() - INTERVAL '3 hours');

-- Add a comment to remind about sample data
COMMENT ON TABLE public.security_events IS 'Table contains security events. Sample data is included for testing - remove in production.';
