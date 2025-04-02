-- Manual setup script for KYC system
-- Run this script in the Supabase SQL Editor to set up the KYC system

-- Create KYC documents table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  front_image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
BEGIN;
-- Users can view their own documents
DROP POLICY IF EXISTS "Users can view their own documents" ON kyc_documents;
CREATE POLICY "Users can view their own documents"
  ON kyc_documents FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own documents
DROP POLICY IF EXISTS "Users can insert their own documents" ON kyc_documents;
CREATE POLICY "Users can insert their own documents"
  ON kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: If you want to add admin policies later, you'll need to create a user_roles table first
-- or use a different approach to identify admins.
COMMIT;

-- Note: You need to create the storage bucket manually in the Supabase Dashboard:
-- 1. Go to Storage in the Supabase Dashboard
-- 2. Click "Create a new bucket"
-- 3. Name it "kyc-documents"
-- 4. Enable public access
-- 5. Set file size limit to 10MB
-- 6. Allow file types: image/png, image/jpeg, application/pdf
