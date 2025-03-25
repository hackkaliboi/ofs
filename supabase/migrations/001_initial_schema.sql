-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wallets table
CREATE TABLE wallets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    type TEXT NOT NULL,
    balance DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer')),
    amount DECIMAL(20, 8) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create security_logs table
CREATE TABLE security_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
    ON profiles FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Wallets policies
CREATE POLICY "Users can view their own wallets"
    ON wallets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallets"
    ON wallets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all wallets"
    ON wallets FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Transactions policies
CREATE POLICY "Users can view their wallet transactions"
    ON transactions FOR SELECT
    USING (wallet_id IN (
        SELECT id FROM wallets WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admin can view all transactions"
    ON transactions FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Security logs policies
CREATE POLICY "Users can view their own security logs"
    ON security_logs FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admin can view all security logs"
    ON security_logs FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id UUID,
    p_event_type TEXT,
    p_description TEXT,
    p_ip_address TEXT
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO security_logs (user_id, event_type, description, ip_address)
    VALUES (p_user_id, p_event_type, p_description, p_ip_address)
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
