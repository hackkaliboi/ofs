-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Function to create kyc_documents table if it doesn't exist
CREATE OR REPLACE FUNCTION create_kyc_documents_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create kyc_documents table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_name = 'kyc_documents'
  ) THEN
    CREATE TABLE kyc_documents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      document_type TEXT NOT NULL,
      document_number TEXT NOT NULL,
      front_image_url TEXT NOT NULL,
      back_image_url TEXT,
      selfie_image_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      submitted_at TIMESTAMPTZ NOT NULL,
      reviewed_at TIMESTAMPTZ,
      reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      rejection_reason TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
    
    -- Create indexes for better performance
    CREATE INDEX idx_kyc_documents_user_id ON kyc_documents(user_id);
    CREATE INDEX idx_kyc_documents_status ON kyc_documents(status);
    CREATE INDEX idx_kyc_documents_submitted_at ON kyc_documents(submitted_at);
    
    -- Set up Row Level Security (RLS)
    ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
    
    -- Policy for users to view their own documents
    CREATE POLICY "Users can view their own KYC documents"
      ON kyc_documents
      FOR SELECT
      USING (auth.uid() = user_id);
    
    -- Policy for users to insert their own documents
    CREATE POLICY "Users can insert their own KYC documents"
      ON kyc_documents
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    
    -- Policy for admin users to view all documents
    CREATE POLICY "Admin users can view all KYC documents"
      ON kyc_documents
      FOR SELECT
      USING (
        auth.uid() IN (
          SELECT user_id FROM admin_users WHERE user_id = auth.uid()
        )
      );
    
    -- Policy for admin users to update documents
    CREATE POLICY "Admin users can update KYC documents"
      ON kyc_documents
      FOR UPDATE
      USING (
        auth.uid() IN (
          SELECT user_id FROM admin_users WHERE user_id = auth.uid()
        )
      );
  END IF;
END;
$$;
