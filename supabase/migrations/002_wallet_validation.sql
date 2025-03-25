-- Create wallet_validations table
CREATE TABLE wallet_validations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    wallet_name TEXT NOT NULL,
    wallet_type TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    encrypted_data TEXT, -- For storing encrypted sensitive data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wallet_validations ENABLE ROW LEVEL SECURITY;

-- Policies for wallet_validations
CREATE POLICY "Users can view their own validations"
    ON wallet_validations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own validations"
    ON wallet_validations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all validations"
    ON wallet_validations FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Admin can update validation status"
    ON wallet_validations FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));
