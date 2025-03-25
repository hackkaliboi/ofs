-- Complete OFSLEDGER Database Setup Script

-- 1. Create Base Tables
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    wallet_name TEXT NOT NULL,
    wallet_type TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_validations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    wallet_name TEXT NOT NULL,
    wallet_type TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    encrypted_data TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Audit and Security Tables
CREATE TABLE IF NOT EXISTS security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Advanced Feature Tables
CREATE TABLE IF NOT EXISTS validation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    validation_id UUID REFERENCES wallet_validations(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS validation_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_validations INTEGER DEFAULT 0,
    approved_validations INTEGER DEFAULT 0,
    rejected_validations INTEGER DEFAULT 0,
    pending_validations INTEGER DEFAULT 0,
    last_validation_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Helper Functions
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id UUID,
    p_event_type TEXT,
    p_description TEXT,
    p_ip_address TEXT
) RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO security_events (user_id, event_type, description, ip_address)
    VALUES (p_user_id, p_event_type, p_description, p_ip_address)
    RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create Triggers
CREATE OR REPLACE FUNCTION update_validation_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert statistics
    INSERT INTO validation_statistics (user_id, total_validations, 
        approved_validations, rejected_validations, pending_validations, 
        last_validation_at, updated_at)
    VALUES (
        NEW.user_id,
        1,
        CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END,
        CASE WHEN NEW.status = 'rejected' THEN 1 ELSE 0 END,
        CASE WHEN NEW.status = 'pending' THEN 1 ELSE 0 END,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_validations = validation_statistics.total_validations + 1,
        approved_validations = validation_statistics.approved_validations + 
            CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END,
        rejected_validations = validation_statistics.rejected_validations + 
            CASE WHEN NEW.status = 'rejected' THEN 1 ELSE 0 END,
        pending_validations = validation_statistics.pending_validations + 
            CASE WHEN NEW.status = 'pending' THEN 1 ELSE 0 END,
        last_validation_at = NOW(),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_validation_insert
    AFTER INSERT ON wallet_validations
    FOR EACH ROW
    EXECUTE FUNCTION update_validation_statistics();

-- 6. Create Admin User Function
CREATE OR REPLACE FUNCTION create_admin_user(
    p_email TEXT,
    p_password TEXT,
    p_full_name TEXT
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_encrypted_pw TEXT;
BEGIN
    -- Check if user already exists
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = p_email;
    
    IF v_user_id IS NOT NULL THEN
        RAISE EXCEPTION 'User with email % already exists', p_email;
    END IF;

    -- Create user in auth.users
    v_user_id := gen_random_uuid();
    v_encrypted_pw := crypt(p_password, gen_salt('bf'));

    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        is_sso_user,
        raw_app_meta_data,
        raw_user_meta_data
    )
    VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        p_email,
        v_encrypted_pw,
        now(),
        now(),
        now(),
        false,
        jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
        '{}'::jsonb
    );

    -- Create admin profile
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        role,
        created_at,
        updated_at
    )
    VALUES (
        v_user_id,
        p_full_name,
        p_email,
        'admin',
        now(),
        now()
    );

    -- Log the admin creation
    INSERT INTO public.user_activity_log (
        user_id,
        action_type,
        details,
        created_at
    )
    VALUES (
        v_user_id,
        'ADMIN_CREATED',
        jsonb_build_object(
            'email', p_email,
            'full_name', p_full_name,
            'created_at', now()
        ),
        now()
    );

    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create Admin User
DO $$ 
DECLARE
    v_user_id UUID;
BEGIN
    SELECT create_admin_user(
        'generalprep.ig@gmail.com',  -- email
        'OFSLedger2025!',           -- default password (change on first login)
        'Admin'                      -- full name
    ) INTO v_user_id;

    RAISE NOTICE 'Admin user created with ID: %', v_user_id;
END $$;

-- 8. Verify Setup
SELECT 
    au.id,
    au.email,
    p.full_name,
    p.role,
    au.created_at
FROM auth.users au
JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'generalprep.ig@gmail.com';

-- Important: Your temporary password is: OFSLedger2025!
-- Please change this password immediately after your first login!
